import { useState } from 'react'
import useKoleksi from '../hooks/useKoleksi.js'
import KartuLatihan from '../components/KartuLatihan.jsx'
import PesanStatus from '../components/PesanStatus.jsx'

export default function Koleksi() {
  const { items, loading, error } = useKoleksi()
  const [kataKunci, setKataKunci] = useState('')
  const [pilihanKategori, setPilihanKategori] = useState('')

  const daftarKategori = [...new Set(items.map((item) => item.kategori))]

  const hasilFilter = items.filter((item) => {
    const cocokJudul = item.judul.toLowerCase().includes(kataKunci.toLowerCase())
    const cocokKategori = pilihanKategori ? item.kategori === pilihanKategori : true
    return cocokJudul && cocokKategori
  })

  return (
    <div>
      <h2>Daftar Koleksi Latihan</h2>

      <PesanStatus loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="alat-koleksi">
            <input
              type="search"
              placeholder="Cari berdasarkan judul..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
            />

            <select
              value={pilihanKategori}
              onChange={(e) => setPilihanKategori(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {daftarKategori.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>

          {hasilFilter.length === 0 ? (
            <p>Tidak ada sesi latihan yang cocok.</p>
          ) : (
            <div className="daftar-kartu">
              {hasilFilter.map((item) => (
                <KartuLatihan key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}