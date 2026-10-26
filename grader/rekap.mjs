#!/usr/bin/env node
// Menggabungkan hasil per fork menjadi nilai.csv dan laporan.md, lalu menambahkan
// indikasi yang hanya terlihat lintas fork (NIM ganda, kemiripan kode).
//   node grader/rekap.mjs <folder-hasil> [folder-keluaran]
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bacaPenanda, cekPenandaRepo } from './integritas.mjs'
import { UTS } from './lib.mjs'
import { sidikJari } from './periksa.mjs'

const [masuk = 'hasil', keluar = masuk] = process.argv.slice(2)
const AMBANG_KEMIRIPAN = 0.6
const URUTAN_TINGKAT = { tinggi: 0, sedang: 1, rendah: 2 }

const semua = readdirSync(masuk, { recursive: true })
  .filter((f) => String(f).endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(masuk, String(f)), 'utf8')))
  .filter((h) => h.repo)
  .map((h) => ({ ...h, integritas: [...(h.integritas ?? [])] }))
  .sort((a, b) => String(a.mahasiswa?.nim ?? '').localeCompare(String(b.mahasiswa?.nim ?? '')))

const label = (h) => `${h.mahasiswa?.nama || h.repo} (${h.mahasiswa?.nim || '-'})`

// I6: satu NIM dipakai lebih dari satu fork.
const perNim = Object.groupBy(semua.filter((h) => h.mahasiswa?.nim), (h) => h.mahasiswa.nim)
for (const [nim, grup] of Object.entries(perNim)) {
  if (grup.length < 2) continue
  for (const h of grup) h.integritas.push({ id: 'I6', tingkat: 'tinggi', pesan: `NIM ${nim} juga dipakai oleh ${grup.filter((x) => x !== h).map((x) => x.repo).join(', ')}` })
}

// I9: pola tambahan, diperiksa ulang dari GitHub pada commit yang dinilai.
const penanda = bacaPenanda()
if (penanda.length) {
  for (const h of semua.filter((x) => x.sha)) h.integritas.push(...cekPenandaRepo(h.repo, h.sha, penanda))
}

// I7: kemiripan Jaccard antar sidik jari, setelah token starter dan contoh resmi dibuang
// (mahasiswa memang dipersilakan mengikuti contoh, jadi bagian itu tidak dihitung).
const akar = fileURLToPath(new URL('..', import.meta.url))
const resmi = new Set([join(akar, 'app/src'), join(akar, 'shared/contoh')].filter(existsSync).flatMap((d) => sidikJari(d)))
const jari = semua.map((h) => new Set((h.sidikJari ?? []).filter((x) => !resmi.has(x))))
const mirip = []
for (let i = 0; i < semua.length; i++) {
  for (let j = i + 1; j < semua.length; j++) {
    const [a, b] = [jari[i], jari[j]]
    if (a.size < 50 || b.size < 50) continue
    let irisan = 0
    for (const x of a) if (b.has(x)) irisan++
    const skor = irisan / (a.size + b.size - irisan)
    if (skor < AMBANG_KEMIRIPAN) continue
    mirip.push({ a: semua[i], b: semua[j], skor })
    const persen = `${Math.round(skor * 100)}%`
    semua[i].integritas.push({ id: 'I7', tingkat: 'tinggi', pesan: `${persen} mirip dengan ${label(semua[j])}` })
    semua[j].integritas.push({ id: 'I7', tingkat: 'tinggi', pesan: `${persen} mirip dengan ${label(semua[i])}` })
  }
}
mirip.sort((x, y) => y.skor - x.skor)

const ids = UTS.rubrik.flatMap((k) => k.butir.map((b) => b.id))
const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
const ringkasIndikasi = (h) => h.integritas.map((i) => i.id).filter((v, k, arr) => arr.indexOf(v) === k).join(' ')
const header = ['nim', 'nama', 'kelas', 'terdaftar', 'tema', 'repo', 'url', 'commit', 'waktu_push', 'tenggat', 'bukti_waktu', 'total', ...ids, 'indikasi', 'catatan']
const rows = semua.map((h) => {
  const skor = Object.fromEntries((h.rincian ?? []).map((r) => [r.id, r.skor]))
  const catatan = [h.catatan, h.terlambat && 'ada push setelah tenggat (diabaikan)'].filter(Boolean).join('; ')
  const terdaftar = h.terdaftar === null || h.terdaftar === undefined ? '' : h.terdaftar ? 'ya' : 'tidak'
  return [h.mahasiswa?.nim, h.mahasiswa?.nama, h.kelas, terdaftar, h.tema, h.repo, h.url, h.sha?.slice(0, 7), h.waktu, h.tenggat, h.bukti, h.total, ...ids.map((id) => skor[id] ?? 0), ringkasIndikasi(h), catatan]
})

mkdirSync(keluar, { recursive: true })
writeFileSync(join(keluar, 'nilai.csv'), [header, ...rows].map((r) => r.map(csv).join(',')).join('\n') + '\n')

const berindikasi = semua
  .filter((h) => h.integritas.length)
  .sort((a, b) => Math.min(...a.integritas.map((i) => URUTAN_TINGKAT[i.tingkat])) - Math.min(...b.integritas.map((i) => URUTAN_TINGKAT[i.tingkat])))

// Manifest bukti: satu baris per fork, berisi commit yang dinilai, waktu push menurut server
// GitHub, sidik jari arsip, dan indikasi. Sidik jari manifest dicetak di ringkasan Actions repo
// induk, yang tidak bisa diubah mahasiswa.
const manifest = {
  dibuat: new Date().toISOString(),
  repoInduk: UTS.repoInduk,
  fork: semua.map((h) => ({
    repo: h.repo,
    nim: h.mahasiswa?.nim ?? null,
    kelas: h.kelas ?? null,
    commit: h.sha ?? null,
    waktuPush: h.waktu ?? null,
    buktiWaktu: h.bukti ?? null,
    tenggat: h.tenggat ?? null,
    arsip: h.arsip ?? null,
    integritas: h.integritas,
  })),
}
const teksManifest = JSON.stringify(manifest, null, 2) + '\n'
writeFileSync(join(keluar, 'manifest-bukti.json'), teksManifest)
const sidikManifest = createHash('sha256').update(teksManifest).digest('hex')

// Laporan per mahasiswa: butir yang belum lulus beserta catatannya, dan tautan ke baris kode
// pada commit yang dinilai (permalink GitHub, tetap valid walau fork diubah setelahnya).
const tautan = (h, { berkas, baris }) =>
  `[${berkas}${baris ? `:${baris}` : ''}](https://github.com/${h.repo}/blob/${h.sha}/${berkas}${baris ? `#L${baris}` : ''})`
const daftarLokasi = (h, lokasi = []) => (h.sha && lokasi.length ? ` Lokasi: ${lokasi.map((l) => tautan(h, l)).join(', ')}` : '')
const namaBerkas = (h) => `${h.mahasiswa?.nim || 'tanpa-nim'}-${h.repo.split('/')[0]}.md`

mkdirSync(join(keluar, 'mahasiswa'), { recursive: true })
for (const h of semua) {
  const rincian = h.rincian ?? []
  const belum = rincian.filter((r) => !r.lulus)
  const teks = [
    `# Hasil ${UTS.judul} ${UTS.mataKuliah}`,
    '',
    `**${h.mahasiswa?.nama || '-'}** (${h.mahasiswa?.nim || '-'}), kelas ${h.kelas || '-'}, tema ${h.tema || '-'}`,
    '',
    `- Repo: https://github.com/${h.repo}`,
    h.sha ? `- Commit yang dinilai: [${h.sha.slice(0, 7)}](https://github.com/${h.repo}/commit/${h.sha}), push ${h.waktu ?? '-'} (${h.bukti ?? '-'})` : `- Commit yang dinilai: ${h.catatan ?? 'tidak ada'}`,
    h.url ? `- Situs: ${h.url}` : '',
    '',
    `## Nilai: ${h.total ?? 0}/100`,
    '',
    '| Butir | Kriteria | Skor |',
    '|---|---|---|',
    ...rincian.map((r) => `| ${r.id} | ${r.uraian} | ${r.skor}/${r.bobot} |`),
    '',
    '## Butir yang belum lulus',
    '',
    belum.length
      ? belum.map((r) => `- **${r.id}** (${r.skor}/${r.bobot}) ${r.uraian}. Catatan: ${(r.catatan || '-').replace(/\.$/, '')}.${daftarLokasi(h, r.lokasi)}`).join('\n')
      : 'Semua butir lulus.',
    '',
    '## Catatan integritas (untuk klarifikasi)',
    '',
    h.integritas.length
      ? h.integritas.map((i) => `- **${i.id}** (${i.tingkat}): ${i.pesan}${daftarLokasi(h, i.lokasi)}`).join('\n')
      : 'Tidak ada indikasi.',
    '',
  ]
  writeFileSync(join(keluar, 'mahasiswa', namaBerkas(h)), teks.filter((b) => b !== null).join('\n'))
}

const jadwal = Object.entries(UTS.kelas).map(([k, j]) => `${k} ${j.dibuka} s.d. ${j.tenggat}`).join('; ')
const md = [
  `# Rekap Nilai ${UTS.judul} ${UTS.mataKuliah}`,
  '',
  `Jadwal: ${jadwal}. Jumlah fork dinilai: ${semua.length}.`,
  '',
  '| NIM | Nama | Kelas | Terdaftar | Total | Indikasi | Laporan | Catatan |',
  '|---|---|---|---|---|---|---|---|',
  ...rows.map((r, i) => `| ${r[0] ?? '-'} | ${r[1] ?? '-'} | ${r[2] ?? '-'} | ${r[3] || '-'} | ${r[11]} | ${r.at(-2) || '-'} | [${namaBerkas(semua[i])}](mahasiswa/${namaBerkas(semua[i])}) | ${r.at(-1)} |`),
  '',
  '## Indikasi integritas',
  '',
  berindikasi.length
    ? berindikasi.map((h) => `### ${label(h)}, ${h.repo}\n\n${h.integritas.map((i) => `- **${i.id}** (${i.tingkat}): ${i.pesan}`).join('\n')}`).join('\n\n')
    : 'Tidak ada.',
  '',
  '## Arsip bukti',
  '',
  `Kode setiap fork pada commit yang dinilai diarsipkan sebagai git bundle (artifact \`arsip-bukti\`). Sidik jari SHA-256 manifest: \`${sidikManifest}\`.`,
  '',
  'Indikasi bukan bukti. Sesuai kontrak kuliah, nilai 0 hanya diberikan bila mencontek atau kerja sama terbukti; mintalah demo atau penjelasan lisan sebelum memutuskan.',
].join('\n')
writeFileSync(join(keluar, 'laporan.md'), md + '\n')
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md)
console.log(`Rekap ${semua.length} fork (${berindikasi.length} dengan indikasi) ditulis ke ${keluar}/nilai.csv dan ${keluar}/laporan.md`)
