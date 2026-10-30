import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useKoleksi from '../hooks/useKoleksi.js'

export default function Tambah() {
  const navigate = useNavigate()
  const { tambah } = useKoleksi()

  const [judul, setJudul] = useState('')
  const [kategori, setKategori] = useState('Kardio')
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10))
  const [durasi, setDurasi] = useState(30)
  const [kalori, setKalori] = useState(150)
  const [pesanError, setPesanError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!judul.trim()) {
      setPesanError('Judul wajib diisi!')
      return
    }

    tambah({
      judul: judul.trim(),
      kategori,
      tanggal,
      durasi: Number(durasi),
      kalori: Number(kalori),
    })

    navigate('/koleksi')
  }

  return (
    <div>
      <h2>Tambah Sesi Latihan Baru</h2>

      {pesanError && <p role="alert" style={{ color: 'red' }}>{pesanError}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label htmlFor="judul">Judul</label>
          <br />
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => {
              setJudul(e.target.value)
              if (pesanError) setPesanError('')
            }}
          />
        </div>

        <div>
          <label htmlFor="kategori">Kategori</label>
          <br />
          <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="Kardio">Kardio</option>
            <option value="Kekuatan">Kekuatan</option>
            <option value="Kelenturan">Kelenturan</option>
            <option value="Permainan">Permainan</option>
          </select>
        </div>

        <div>
          <label htmlFor="tanggal">Tanggal</label>
          <br />
          <input
            id="tanggal"
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="durasi">Durasi</label>
          <br />
          <input
            id="durasi"
            type="number"
            min="1"
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="kalori">Kalori Terbakar</label>
          <br />
          <input
            id="kalori"
            type="number"
            min="0"
            value={kalori}
            onChange={(e) => setKalori(e.target.value)}
          />
        </div>

        <button type="submit">Simpan</button>
      </form>
    </div>
  )
}