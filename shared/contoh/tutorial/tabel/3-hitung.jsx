import useKoleksi from '../hooks/useKoleksi.js'

export default function Statistik() {
  const { items } = useKoleksi()
  const perKategori = items.reduce((hitung, { kategori }) => ({ ...hitung, [kategori]: (hitung[kategori] ?? 0) + 1 }), {})

  return (
    <section>
      <h1>Statistik</h1>
      <pre>{JSON.stringify(perKategori, null, 2)}</pre>
    </section>
  )
}
