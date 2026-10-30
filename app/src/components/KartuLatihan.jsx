import { Link } from 'react-router-dom'

export default function KartuLatihan({ item }) {
  return (
    <div className="kartu">
      <h3>
        <Link to={`/koleksi/${item.id}`}>{item.judul}</Link>
      </h3>
      <p>Kategori: {item.kategori}</p>
      <p>Durasi: {item.durasi} menit</p>
    </div>
  )
}