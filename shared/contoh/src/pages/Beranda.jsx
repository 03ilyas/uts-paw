import useKoleksi from '../hooks/useKoleksi.js'

export default function Beranda() {
  const { items } = useKoleksi()
  const jumlahKategori = new Set(items.map((item) => item.kategori)).size

  return (
    <section>
      <h1>Daftar Tugas</h1>
      <p>
        Ada {items.length} tugas dalam {jumlahKategori} kategori.
      </p>
    </section>
  )
}
