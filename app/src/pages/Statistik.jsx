import useKoleksi from '../hooks/useKoleksi.js'
import PesanStatus from '../components/PesanStatus.jsx'

export default function Statistik() {
  const { items, loading, error } = useKoleksi()

  const rekapKategori = items.reduce((rekap, item) => {
    rekap[item.kategori] = (rekap[item.kategori] || 0) + 1
    return rekap
  }, {})

  const totalItem = items.length

  return (
    <div>
      <h2>Statistik Latihan</h2>

      <PesanStatus loading={loading} error={error} />

      {!loading && !error && (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Kategori Olahraga</th>
              <th>Jumlah Sesi</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rekapKategori).map(([kategori, jumlah]) => (
              <tr key={kategori}>
                <td>{kategori}</td>
                <td>{jumlah}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{totalItem}</th>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}