import { Link, useNavigate, useParams } from 'react-router-dom'
import useKoleksi from '../hooks/useKoleksi.js'

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, hapus, loading, error } = useKoleksi()

  if (loading) return <p>Memuat detail...</p>
  if (error) return <p>Terjadi kesalahan: {error}</p>

  const item = items.find((latihan) => latihan.id === id)

  if (!item) {
    return (
      <div>
        <p>Item tidak ditemukan</p>
        <Link to="/koleksi">Kembali ke Koleksi</Link>
      </div>
    )
  }

  const handleHapus = () => {
    if (window.confirm('Yakin ingin menghapus sesi latihan ini?')) {
      hapus(item.id)
      navigate('/koleksi')
    }
  }

  return (
    <div>
      <h2>{item.judul}</h2>
      <dl>
        <dt>Kategori</dt>
        <dd>{item.kategori}</dd>

        <dt>Tanggal</dt>
        <dd>{item.tanggal}</dd>

        <dt>Durasi</dt>
        <dd>{item.durasi} menit</dd>

        <dt>Kalori Terbakar</dt>
        <dd>{item.kalori} kkal</dd>
      </dl>

      <div className="aksi">
        <button type="button" onClick={handleHapus}>
          Hapus
        </button>
        <Link to="/koleksi">Kembali ke Koleksi</Link>
      </div>
    </div>
  )
}