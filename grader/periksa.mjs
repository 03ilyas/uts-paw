#!/usr/bin/env node
// Pemeriksa otomatis Ujian Tengah Semester Pengembangan Aplikasi Web.
//
//   node grader/periksa.mjs --lokal app            cek mandiri di komputer sendiri
//   node grader/periksa.mjs --repo user/uts-paw    nilai satu fork
//   node grader/periksa.mjs --daftar               cetak daftar fork dalam JSON
//   node grader/periksa.mjs --target user/uts-paw  cetak commit yang dinilai dalam JSON
//
// Opsi: --url <url-pages> (paksa URL deployment), --out <folder> (simpan hasil JSON),
// --target-file <berkas> (pakai hasil --target, sehingga --repo berjalan tanpa token GitHub;
// dipakai workflow nilai.yml agar kode mahasiswa tidak pernah dijalankan bersama token),
// --daftar-kelas <berkas> (data kelas; di CI dibaca dari secret DAFTAR_KELAS).
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cekBerkas, cekIdentitasDanWaktu, cekRiwayat } from './integritas.mjs'
import { TENGGAT_TERAKHIR, UTS, api, bacaDaftarKelas, bacaMahasiswaFork, daftarFork, jadwalKelas, situsMemuatApp, temaUntukNim, urlPages } from './lib.mjs'

const GRADER = dirname(fileURLToPath(import.meta.url))

function arg(nama) {
  const i = process.argv.indexOf(`--${nama}`)
  if (i === -1) return undefined
  const nilai = process.argv[i + 1]
  return nilai && !nilai.startsWith('--') ? nilai : true
}

function jalankan(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32', maxBuffer: 64 * 1024 * 1024 })
  return { ok: r.status === 0, keluaran: `${r.stdout ?? ''}${r.stderr ?? ''}` }
}

function bacaJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

function semuaBerkas(dir, cocok) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && cocok(e.name))
    .map((e) => join(e.parentPath, e.name))
    .filter((p) => !p.includes('__rubrik__') && !p.includes('node_modules'))
}

const isTest = (p) => /\.(test|spec)\.[jt]sx?$/.test(p)

// ---------- pemeriksaan per kelompok rubrik ----------

// konteks.daftar: null = data kelas tidak tersedia (cek mandiri), false = NIM tidak
// terdaftar, objek = entri data kelas untuk NIM ini.
function cekIdentitas(appDir, konteks) {
  const m = bacaJson(join(appDir, 'mahasiswa.json')) ?? {}
  const tema = temaUntukNim(m.nim ?? '')
  const lengkap = m.nama?.trim() && /^\d{9}$/.test(m.nim ?? '') && UTS.kelas[m.kelas]
  const temaCocok = tema && m.tema?.trim().toLowerCase() === tema.nama.toLowerCase()
  const terdaftar = konteks.daftar === null || (konteks.daftar && konteks.daftar.kelas === m.kelas)
  const alasan = !lengkap
    ? `nama, NIM 9 digit, atau kelas (${Object.keys(UTS.kelas).join('/')}) belum valid`
    : !temaCocok
      ? `tema seharusnya "${tema?.nama}"`
      : !terdaftar
        ? konteks.daftar === false ? 'NIM tidak terdaftar di data kelas' : `kelas di data kelas adalah ${konteks.daftar.kelas}`
        : ''
  return { mahasiswa: m, tema, A1: [!alasan, alasan] }
}

function cekReadme(root, m) {
  const isi = existsSync(join(root, 'README.md')) ? readFileSync(join(root, 'README.md'), 'utf8') : ''
  const kurang = [
    [m.nim && isi.includes(m.nim), 'NIM'],
    [m.nama && isi.toLowerCase().includes(m.nama.toLowerCase()), 'nama'],
    [/https?:\/\/\S+/.test(isi) && /github\.io|mhabibalgifari/.test(isi), 'URL deployment'],
    [/!\[[^\]]*\]\([^)]+\)/.test(isi), 'tangkapan layar'],
    [/^#+.*fitur/im.test(isi), 'bagian Fitur'],
  ].filter(([ok]) => !ok).map(([, n]) => n)
  return [kurang.length === 0, kurang.length ? `kurang: ${kurang.join(', ')}` : '']
}

function cekData(appDir, tema) {
  const data = bacaJson(join(appDir, 'public/data/koleksi.json'))
  if (!Array.isArray(data)) return [false, 'public/data/koleksi.json tidak ada atau bukan array JSON']
  if (data.length < UTS.minimalItem) return [false, `baru ${data.length} item, minimal ${UTS.minimalItem}`]
  const ids = data.map((d) => String(d.id ?? ''))
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) return [false, 'id kosong atau duplikat']
  const wajib = ['judul', 'kategori', ...(tema?.field.map((f) => f.kunci) ?? [])]
  const kosong = (v) => v === undefined || v === null || String(v).trim() === ''
  const salah = data.findIndex((d) => wajib.some((k) => kosong(d[k])))
  if (!tema) return [false, 'tema tidak diketahui karena NIM belum valid']
  if (salah !== -1) return [false, `item ke-${salah + 1} belum punya semua field: ${wajib.join(', ')}`]
  return [true, '']
}

function cekStatis(appDir) {
  const src = join(appDir, 'src')
  const kodeFiles = semuaBerkas(src, (n) => /\.[jt]sx?$/.test(n)).filter((p) => !isTest(p) && !p.endsWith('setupTests.js'))
  const kode = kodeFiles.map((p) => readFileSync(p, 'utf8')).join('\n')
  const css = semuaBerkas(src, (n) => n.endsWith('.css')).map((p) => readFileSync(p, 'utf8')).join('\n')
  const ada = (re) => re.test(kode)

  const namaContext = [...kode.matchAll(/(?:const|let)\s+(\w+)\s*=\s*(?:React\.)?createContext\s*\(/g)].map((m) => m[1])
  const providerDipakai = namaContext.some((n) => new RegExp(`<${n}(\\.Provider)?[\\s>]`).test(kode))

  const hookFiles = semuaBerkas(join(src, 'hooks'), (n) => /^use[A-Z]\w*\.[jt]sx?$/.test(n)).filter((p) => !isTest(p))
  const hookDipakai = hookFiles.filter((p) => {
    const nama = basename(p).replace(/\.[jt]sx?$/, '')
    return kodeFiles.some((f) => f !== p && new RegExp(`\\b${nama}\\s*\\(`).test(readFileSync(f, 'utf8')))
  })

  const jumlahRoute = (kode.match(/<Route\b/g) ?? []).length
  const komponen = semuaBerkas(join(src, 'components'), (n) => /\.[jt]sx$/.test(n)).filter((p) => !isTest(p))

  const hasil = {
    D1: [ada(/\buseState\s*\(/) && ada(/\buseEffect\s*\(/), 'useState dan useEffect'],
    D2: [namaContext.length > 0 && providerDipakai && ada(/\buse(Context)?\s*\(\s*\w*Context\b/), 'createContext + Provider + useContext'],
    D3: [hookDipakai.length >= 2, `${hookDipakai.length} custom hook terpakai di src/hooks`],
    D4: [jumlahRoute >= 7 && ada(/\buseParams\s*\(/) && ada(/\buseNavigate\s*\(/) && ada(/<(Nav)?Link\b/), `${jumlahRoute} <Route>, useParams, useNavigate, Link/NavLink`],
    D5: [
      ada(/await\s+fetch\s*\(/) && ada(/\[\s*\w*(loading|memuat)\w*\s*,/i) && ada(/\[\s*\w*(error|galat|gagal)\w*\s*,/i),
      'await fetch(...) + state loading dan error',
    ],
    D6: [komponen.length >= 5, `${komponen.length} komponen di src/components`],
    E2: [/@media\b/.test(css) && /display\s*:\s*(inline-)?(flex|grid)\b/.test(css), '@media + flex/grid di berkas .css'],
    E3: [
      ada(/(const|let)\s*[{[]|\(\s*\{\s*\w+/) && ada(/\.\.\.\w/) && ada(/`[^`]*\$\{/) && ada(/\.map\s*\(/) && ada(/\.(filter|reduce)\s*\(/),
      'destructuring, spread, template literal, map, filter/reduce',
    ],
  }
  return Object.fromEntries(Object.entries(hasil).map(([k, [ok, ket]]) => [k, [ok, ok ? '' : `belum terpenuhi: ${ket}`]]))
}

function hasilVitest(path) {
  const json = bacaJson(path)
  return (json?.testResults ?? []).flatMap((f) => f.assertionResults ?? [])
}

function cekTestSendiri(appDir, kerja) {
  const out = join(kerja, 'vitest-mahasiswa.json')
  rmSync(join(appDir, 'src/__rubrik__'), { recursive: true, force: true })
  jalankan('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${out}`], appDir)
  const tests = hasilVitest(out)
  const gagal = tests.filter((t) => t.status !== 'passed')
  return {
    F1: [tests.length >= 5, tests.length >= 5 ? '' : `baru ${tests.length} test`],
    F2: [tests.length >= 5 && gagal.length === 0, gagal.length ? `${gagal.length} test gagal: ${gagal[0].title}` : tests.length >= 5 ? '' : 'butuh minimal 5 test yang lulus'],
  }
}

function cekUjiDosen(appDir, kerja) {
  const tujuan = join(appDir, 'src/__rubrik__')
  rmSync(tujuan, { recursive: true, force: true })
  mkdirSync(tujuan, { recursive: true })
  cpSync(join(GRADER, 'uji/rubrik.test.jsx'), join(tujuan, 'rubrik.test.jsx'))
  writeFileSync(join(tujuan, 'tema.json'), JSON.stringify(UTS.tema))
  const out = join(kerja, 'vitest-rubrik.json')
  const r = jalankan('npx', ['vitest', 'run', 'src/__rubrik__/rubrik.test.jsx', '--reporter=json', `--outputFile=${out}`], appDir)
  rmSync(tujuan, { recursive: true, force: true })
  const tests = hasilVitest(out)
  const ids = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'E1']
  return Object.fromEntries(
    ids.map((id) => {
      const t = tests.find((x) => x.title.startsWith(`${id} `))
      if (!t) return [id, [false, tests.length ? 'test tidak berjalan' : `uji dosen gagal dimuat: ${r.keluaran.split('\n').find((l) => /error/i.test(l))?.trim() ?? ''}`]]
      const pesan = (t.failureMessages?.[0] ?? '').split('\n')[0].slice(0, 160)
      return [id, [t.status === 'passed', t.status === 'passed' ? '' : pesan]]
    }),
  )
}

// ---------- penilaian ----------

export async function periksa({ appDir, url, pasang = false, konteks = { daftar: null } }) {
  const root = resolve(appDir, '..')
  const kerja = mkdtempSync(join(tmpdir(), 'uts-paw-'))
  const butir = {}
  const catat = (obj) => Object.assign(butir, obj)

  const { mahasiswa, tema, A1 } = cekIdentitas(appDir, konteks)
  const integritas = [...cekBerkas(root), ...cekIdentitasDanWaktu(mahasiswa, konteks)]
  let jumlahCommit
  if (konteks.sha) {
    const riwayat = cekRiwayat(root, konteks.sha)
    integritas.push(...riwayat.hasil)
    jumlahCommit = riwayat.jumlahCommit
  }
  catat({ A1, A4: cekReadme(root, mahasiswa), C1: cekData(appDir, tema) })

  if (url) {
    const utama = await situsMemuatApp(url)
    const dalam = await situsMemuatApp(new URL('koleksi', url).href)
    catat({
      A2: [utama.ok, utama.ok ? '' : `${url} tidak memuat aplikasi (status ${utama.status})`],
      A3: [dalam.ok, dalam.ok ? '' : 'refresh /koleksi tidak memuat aplikasi, cek salinan 404.html'],
    })
  } else {
    catat({ A2: [false, 'URL Pages tidak diketahui'], A3: [false, 'URL Pages tidak diketahui'] })
  }

  if (pasang) {
    const install = jalankan('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], appDir)
    if (!install.ok) jalankan('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], appDir)
  }
  const build = jalankan('npm', ['run', 'build'], appDir)
  // Berkas disebut satu per satu: bila folder yang diberikan, oxlint ikut membaca .gitignore
  // di folder induk dan bisa melewatkan seluruh src.
  const berkasLint = semuaBerkas(join(appDir, 'src'), (n) => /\.[jt]sx?$/.test(n)).map((p) => relative(appDir, p))
  const lint = berkasLint.length
    ? jalankan('npx', ['oxlint', '-c', join(GRADER, 'oxlintrc.json'), ...berkasLint], appDir)
    : { ok: false, keluaran: 'tidak ada berkas kode di src' }
  catat({
    B1: [build.ok, build.ok ? '' : build.keluaran.trim().split('\n').slice(-3).join(' ')],
    B2: [lint.ok, lint.ok ? '' : (lint.keluaran.match(/Found .*/)?.[0] ?? 'oxlint melaporkan error')],
  })

  catat(cekStatis(appDir))
  catat(cekTestSendiri(appDir, kerja))
  catat(cekUjiDosen(appDir, kerja))
  rmSync(kerja, { recursive: true, force: true })

  const rincian = UTS.rubrik.flatMap((k) =>
    k.butir.map((b) => {
      const [lulus, catatan] = butir[b.id] ?? [false, 'tidak diperiksa']
      return { id: b.id, kelompok: k.kode, uraian: b.uraian, bobot: b.bobot, lulus, skor: lulus ? b.bobot : 0, catatan }
    }),
  )
  return {
    mahasiswa,
    kelas: konteks.daftar?.kelas ?? mahasiswa.kelas ?? null,
    terdaftar: konteks.daftar === null ? null : Boolean(konteks.daftar),
    tema: tema?.nama ?? null,
    url: url ?? null,
    total: rincian.reduce((s, r) => s + r.skor, 0),
    rincian,
    integritas,
    jumlahCommit,
    sidikJari: sidikJari(join(appDir, 'src')),
  }
}

// Sidik jari kode untuk deteksi kemiripan antar-fork: hash 8-gram token dari
// folder kode, tanpa berkas test. Dibandingkan oleh rekap.mjs.
export function sidikJari(dir) {
  const kode = semuaBerkas(dir, (n) => /\.(jsx?|tsx?|css)$/.test(n))
    .filter((p) => !isTest(p))
    .map((p) => readFileSync(p, 'utf8'))
    .join('\n')
    .replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '')
  const token = kode.match(/[A-Za-z_$][\w$]*|\d+|\S/g) ?? []
  const set = new Set()
  for (let i = 0; i + 8 <= token.length; i++) {
    let h = 0
    for (const ch of token.slice(i, i + 8).join(' ')) h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0
    set.add(h)
  }
  return [...set]
}

function laporanMarkdown(hasil) {
  const baris = hasil.rincian.map(
    (r) => `| ${r.id} | ${r.uraian} | ${r.skor}/${r.bobot} | ${r.lulus ? 'lulus' : 'belum'} | ${r.catatan.replace(/\|/g, '/')} |`,
  )
  return [
    `## Hasil pemeriksaan Ujian Tengah Semester Pengembangan Aplikasi Web: ${hasil.total}/100`,
    '',
    `Mahasiswa: ${hasil.mahasiswa.nama || '-'} (${hasil.mahasiswa.nim || '-'}), tema: ${hasil.tema ?? '-'}`,
    hasil.url ? `Deployment: ${hasil.url}` : '',
    '',
    '| Butir | Kriteria | Skor | Status | Catatan |',
    '|---|---|---|---|---|',
    ...baris,
    '',
    '### Pemeriksaan integritas',
    '',
    hasil.integritas.length
      ? hasil.integritas.map((i) => `- **${i.id}** (${i.tingkat}): ${i.pesan}`).join('\n')
      : 'Tidak ada indikasi dari pemeriksaan yang bisa dijalankan di sini. Riwayat commit dan kemiripan diperiksa saat penilaian dosen.',
    '',
    'Nilai akhir ditetapkan dosen dari commit terakhir sebelum tenggat kelasmu, memakai uji versi repo induk.',
  ].join('\n')
}

function cetakTerminal(hasil) {
  for (const r of hasil.rincian) {
    const tanda = r.lulus ? 'LULUS' : 'BELUM'
    console.log(`${r.id.padEnd(4)} ${tanda}  ${String(r.skor).padStart(2)}/${String(r.bobot).padEnd(2)} ${r.uraian}${r.catatan ? `\n                ${r.catatan}` : ''}`)
  }
  console.log(`\nTotal: ${hasil.total}/100`)
  if (hasil.integritas.length) {
    console.log('\nIndikasi integritas (ditindaklanjuti dosen, lihat halaman Ketentuan):')
    for (const i of hasil.integritas) console.log(`  ${i.id} [${i.tingkat}] ${i.pesan}`)
  }
}

// Commit yang dinilai = push terakhir sebelum tenggat menurut waktu server
// GitHub Actions (tidak bisa dipalsukan dari tanggal commit lokal).
const aman = (path, cadangan) => api(path).catch(() => cadangan)

async function commitSebelumTenggat(repo, branch, runs, tenggat) {
  const tepat = runs.filter((r) => new Date(r.created_at) <= tenggat).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const terlambat = runs.some((r) => new Date(r.created_at) > tenggat)
  if (tepat.length) return { sha: tepat[0].head_sha, waktu: tepat[0].created_at, bukti: 'actions', terlambat }
  // Repo kosong menghasilkan 409; anggap belum ada commit.
  const commits = await aman(`/repos/${repo}/commits?sha=${branch}&until=${tenggat.toISOString()}&per_page=1`, [])
  if (!commits.length) return null
  return { sha: commits[0].sha, waktu: commits[0].commit.committer.date, bukti: 'tanggal commit', terlambat }
}

// Kelas (dan tenggatnya) diambil dari data kelas bila ada, bukan dari isian mahasiswa,
// supaya mahasiswa RA tidak bisa mengaku RB untuk mendapat waktu lebih.
// Keluaran hanya memuat entri data kelas untuk NIM ini, tidak pernah seluruh daftar.
async function targetPenilaian(repo, daftarKelas) {
  const info = await api(`/repos/${repo}`)
  const m = await bacaMahasiswaFork(repo, info.default_branch)
  const entri = daftarKelas ? (daftarKelas[m.nim] ?? false) : null
  const kelas = entri ? entri.kelas : UTS.kelas[m.kelas] ? m.kelas : null
  const jadwal = jadwalKelas(kelas)
  const tenggat = jadwal?.tenggat ?? TENGGAT_TERAKHIR
  const runs = (await aman(`/repos/${repo}/actions/runs?event=push&branch=${info.default_branch}&per_page=100`, {})).workflow_runs ?? []
  return {
    repo,
    pushTerakhir: info.pushed_at,
    forkDibuat: info.created_at,
    nim: m.nim ?? null,
    kelas,
    daftar: entri,
    dibuka: jadwal?.dibuka.toISOString() ?? null,
    tenggat: tenggat.toISOString(),
    pushSebelumDibuka: Boolean(jadwal && runs.some((r) => new Date(r.created_at) < jadwal.dibuka)),
    target: await commitSebelumTenggat(repo, info.default_branch, runs, tenggat),
  }
}

// Arsip bukti: seluruh riwayat fork sampai commit yang dinilai, dalam satu berkas git bundle,
// beserta SHA-256-nya. Dibuat sebelum kode mahasiswa dijalankan, jadi isinya tidak bisa
// diubah oleh skrip di repo mahasiswa, dan perubahan apa pun setelahnya mengubah sidik jarinya.
export function buatArsip(dir, repo, sha, folder) {
  mkdirSync(folder, { recursive: true })
  const berkas = `${repo.replace('/', '__')}.bundle`
  jalankan('git', ['branch', '-f', 'dinilai', sha], dir)
  const r = jalankan('git', ['bundle', 'create', join(folder, berkas), 'dinilai'], dir)
  if (!r.ok) return { galat: r.keluaran.trim().split('\n').at(-1) }
  const isi = readFileSync(join(folder, berkas))
  return { berkas, sha256: createHash('sha256').update(isi).digest('hex'), ukuran: isi.length }
}

async function periksaRepo(repo, outDir, targetFile, daftarKelas) {
  const { target, ...konteks } = targetFile ? JSON.parse(readFileSync(targetFile, 'utf8')) : await targetPenilaian(repo, daftarKelas)
  const dasar = { repo, pushTerakhir: konteks.pushTerakhir, tenggat: konteks.tenggat }
  let hasil
  if (!target) {
    hasil = { ...dasar, total: 0, rincian: [], integritas: [], mahasiswa: { nim: konteks.nim }, kelas: konteks.kelas, catatan: 'tidak ada commit sebelum tenggat' }
  } else {
    const dir = mkdtempSync(join(tmpdir(), 'uts-fork-'))
    jalankan('git', ['clone', '--quiet', `https://github.com/${repo}.git`, dir])
    jalankan('git', ['checkout', '--quiet', target.sha], dir)
    const arsip = outDir ? buatArsip(dir, repo, target.sha, join(outDir, 'arsip')) : undefined
    hasil = { ...dasar, ...target, arsip, ...(await periksa({ appDir: join(dir, 'app'), url: urlPages(repo), pasang: true, konteks: { ...konteks, sha: target.sha } })) }
    rmSync(dir, { recursive: true, force: true })
  }
  if (outDir) {
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, `${repo.replace('/', '__')}.json`), JSON.stringify(hasil, null, 2))
  }
  return hasil
}

function urlDariGit(appDir) {
  if (process.env.GITHUB_REPOSITORY) return urlPages(process.env.GITHUB_REPOSITORY)
  const r = jalankan('git', ['remote', 'get-url', 'origin'], appDir)
  const m = r.keluaran.match(/github\.com[/:]([^/]+\/[^/.\s]+)/)
  return m ? urlPages(m[1]) : undefined
}

async function main() {
  if (arg('daftar')) {
    const forks = await daftarFork()
    console.log(JSON.stringify(forks.map((f) => f.full_name)))
    return
  }
  const opsi = (nama) => (typeof arg(nama) === 'string' ? arg(nama) : undefined)
  const daftarKelas = bacaDaftarKelas(opsi('daftar-kelas'))
  if (opsi('target')) {
    console.log(JSON.stringify(await targetPenilaian(opsi('target'), daftarKelas)))
    return
  }
  let hasil
  if (opsi('repo')) {
    hasil = await periksaRepo(opsi('repo'), opsi('out'), opsi('target-file'), daftarKelas)
  } else {
    const appDir = resolve(opsi('lokal') ?? 'app')
    const url = opsi('url') ?? urlDariGit(appDir)
    const nim = bacaJson(join(appDir, 'mahasiswa.json'))?.nim
    const konteks = { daftar: daftarKelas ? (daftarKelas[nim] ?? false) : null }
    console.log(`Memeriksa ${relative(process.cwd(), appDir) || '.'}${url ? `, deployment ${url}` : ''}\n`)
    hasil = await periksa({ appDir, url, konteks })
  }
  if (hasil.rincian?.length) cetakTerminal(hasil)
  if (process.env.GITHUB_STEP_SUMMARY && hasil.rincian?.length) appendFileSync(process.env.GITHUB_STEP_SUMMARY, laporanMarkdown(hasil))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
