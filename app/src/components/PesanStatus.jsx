export default function PesanStatus({ loading, error }) {
  if (loading) return <p>Memuat data...</p>
  if (error) return <p>Terjadi kesalahan: {error}</p>
  return null
}