#!/usr/bin/env node
// Menyusun daftar pengumpulan untuk halaman /pengumpulan di portal.
// Hanya status (identitas dari mahasiswa.json, terdaftar atau tidak, URL, situs aktif,
// waktu push); nilai dan isi data kelas tidak pernah ditulis ke berkas publik ini.
//   node grader/kumpulkan.mjs [--daftar-kelas berkas.json] > portal/public/pengumpulan.json
import { bacaDaftarKelas, bacaMahasiswaFork, daftarFork, namaCocok, situsMemuatApp, temaUntukNim, urlPages } from './lib.mjs'

const i = process.argv.indexOf('--daftar-kelas')
const daftarKelas = bacaDaftarKelas(i > -1 ? process.argv[i + 1] : undefined)

const forks = await daftarFork()
const data = await Promise.all(
  forks.map(async (fork) => {
    const mhs = await bacaMahasiswaFork(fork.full_name, fork.default_branch)
    const entri = daftarKelas?.[mhs.nim]
    const url = urlPages(fork.full_name)
    return {
      repo: fork.full_name,
      nama: mhs.nama || '',
      nim: mhs.nim || '',
      kelas: entri?.kelas ?? mhs.kelas ?? '',
      // null bila data kelas tidak tersedia, sehingga portal tidak menampilkan status palsu.
      terdaftar: daftarKelas ? Boolean(entri && entri.kelas === mhs.kelas && namaCocok(entri.nama, mhs.nama)) : null,
      tema: temaUntukNim(mhs.nim ?? '')?.nama ?? '',
      url,
      aktif: (await situsMemuatApp(url)).ok,
      pushTerakhir: fork.pushed_at,
    }
  }),
)

console.log(JSON.stringify({ diperbarui: new Date().toISOString(), data }, null, 2))
