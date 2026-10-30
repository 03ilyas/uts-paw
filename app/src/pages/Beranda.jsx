import useKoleksi from '../hooks/useKoleksi.js'

export default function Beranda() {
  const { items, loading, error } = useKoleksi()

  const daftarKategori = [...new Set(items.map((item) => item.kategori))]

  return (
    <div>
      <h1>Jurnal Latihan Olahraga</h1>
      <p>Selamat datang di aplikasi pencatatan dan jurnal aktivitas olahraga.</p>
      
      {loading && <p>Memuat data ringkasan...</p>}
      {error && <p>Gagal memuat: {error}</p>}

      {!loading && !error && (
        <section className="ringkasan">
          <h2>Ringkasan Koleksi</h2>
          <p>Total Sesi Latihan: <strong>{items.length}</strong> item</p>
          <p>Total Kategori Olahraga: <strong>{daftarKategori.length}</strong> kategori</p>
        </section>
      )}
    </div>
  )
}