#!/usr/bin/env node
// Menggabungkan hasil per fork menjadi nilai.csv dan laporan.md, lalu menambahkan
// indikasi yang hanya terlihat lintas fork (NIM ganda, kemiripan kode).
//   node grader/rekap.mjs <folder-hasil> [folder-keluaran]
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
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

const jadwal = Object.entries(UTS.kelas).map(([k, j]) => `${k} ${j.dibuka} s.d. ${j.tenggat}`).join('; ')
const md = [
  `# Rekap Nilai ${UTS.judul} ${UTS.mataKuliah}`,
  '',
  `Jadwal: ${jadwal}. Jumlah fork dinilai: ${semua.length}.`,
  '',
  '| NIM | Nama | Kelas | Terdaftar | Total | Indikasi | Repo | Catatan |',
  '|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r[0] ?? '-'} | ${r[1] ?? '-'} | ${r[2] ?? '-'} | ${r[3] || '-'} | ${r[11]} | ${r.at(-2) || '-'} | ${r[5]} | ${r.at(-1)} |`),
  '',
  '## Indikasi integritas',
  '',
  berindikasi.length
    ? berindikasi.map((h) => `### ${label(h)}, ${h.repo}\n\n${h.integritas.map((i) => `- **${i.id}** (${i.tingkat}): ${i.pesan}`).join('\n')}`).join('\n\n')
    : 'Tidak ada.',
  '',
  'Indikasi bukan bukti. Sesuai kontrak kuliah, nilai 0 hanya diberikan bila mencontek atau kerja sama terbukti; mintalah demo atau penjelasan lisan sebelum memutuskan.',
].join('\n')
writeFileSync(join(keluar, 'laporan.md'), md + '\n')
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md)
console.log(`Rekap ${semua.length} fork (${berindikasi.length} dengan indikasi) ditulis ke ${keluar}/nilai.csv dan ${keluar}/laporan.md`)
