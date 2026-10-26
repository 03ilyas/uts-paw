import { Route, Routes } from 'react-router-dom'
import mahasiswa from '../mahasiswa.json'

// Titik awal ujian. Baca soal lengkap di https://uts-paw.mhabibalgifari.web.id/soal
// dan contoh setiap kode yang diminta di https://uts-paw.mhabibalgifari.web.id/contoh
// Rute wajib: /, /koleksi, /koleksi/:id, /tambah, /statistik, /tentang, dan *.
// Provider Context diletakkan di dalam komponen App ini.

function Beranda() {
  return (
    <main>
      <h1>Ujian Tengah Semester Pengembangan Aplikasi Web</h1>
      <p>
        {mahasiswa.nama || 'Nama belum diisi'} ({mahasiswa.nim || 'NIM belum diisi'})
      </p>
    </main>
  )
}

function TidakDitemukan() {
  return (
    <main>
      <h1>404</h1>
      <p>Halaman tidak ditemukan.</p>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="*" element={<TidakDitemukan />} />
    </Routes>
  )
}
