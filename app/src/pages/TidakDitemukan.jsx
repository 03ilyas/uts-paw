import { Link } from 'react-router-dom'

export default function TidakDitemukan() {
  return (
    <div>
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <Link to="/">Kembali ke Beranda</Link>
    </div>
  )
}