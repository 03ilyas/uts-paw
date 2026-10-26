import { useState } from 'react'

// Versi hidup dari kode tutorial, supaya mahasiswa melihat hasil akhirnya sebelum menulis.
// Bedanya hanya satu: data disimpan di state lokal, bukan di Context dan localStorage.

const AWAL = { judul: '', kategori: 'Kuliah', tenggat: '', prioritas: 'sedang' }

export function DemoForm() {
  const [form, setForm] = useState(AWAL)
  const [galat, setGalat] = useState('')
  const [tersimpan, setTersimpan] = useState([])

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const simpan = (e) => {
    e.preventDefault()
    if (form.judul.trim().length < 3) {
      setGalat('Judul wajib diisi, minimal 3 karakter.')
      return
    }
    setGalat('')
    setTersimpan([...tersimpan, { ...form, judul: form.judul.trim() }])
    setForm(AWAL)
  }

  return (
    <div className="demo">
      <form className="demo-formulir" onSubmit={simpan} noValidate>
        <label htmlFor="demo-judul">Judul</label>
        <input id="demo-judul" name="judul" value={form.judul} onChange={ubah} placeholder="Coba klik Simpan saat kosong" />
        {galat && <p role="alert">{galat}</p>}

        <label htmlFor="demo-kategori">Kategori</label>
        <select id="demo-kategori" name="kategori" value={form.kategori} onChange={ubah}>
          <option>Kuliah</option>
          <option>Organisasi</option>
        </select>

        <label htmlFor="demo-tenggat">Tenggat</label>
        <input id="demo-tenggat" name="tenggat" type="date" value={form.tenggat} onChange={ubah} />

        <label htmlFor="demo-prioritas">Prioritas</label>
        <select id="demo-prioritas" name="prioritas" value={form.prioritas} onChange={ubah}>
          <option value="rendah">Rendah</option>
          <option value="sedang">Sedang</option>
          <option value="tinggi">Tinggi</option>
        </select>

        <button type="submit">Simpan</button>
      </form>

      <div className="demo-keluaran">
        <strong>Isi state form saat ini</strong>
        <pre>{JSON.stringify(form, null, 2)}</pre>
        <strong>Item tersimpan ({tersimpan.length})</strong>
        {tersimpan.length ? (
          <ul>
            {tersimpan.map((t, i) => (
              <li key={i}>
                {t.judul} · {t.kategori}
                {t.tenggat && ` · ${t.tenggat}`} · {t.prioritas}
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada. Di aplikasimu, setelah Simpan kamu dipindahkan ke /koleksi.</p>
        )}
      </div>
    </div>
  )
}

const DATA_AWAL = [
  { judul: 'Laporan praktikum CSS', kategori: 'Kuliah' },
  { judul: 'Kuis JavaScript', kategori: 'Kuliah' },
  { judul: 'Rapat himpunan', kategori: 'Organisasi' },
]

export function DemoTabel() {
  const [items, setItems] = useState(DATA_AWAL)
  const [kategori, setKategori] = useState('Kuliah')
  const perKategori = items.reduce((hitung, { kategori: k }) => ({ ...hitung, [k]: (hitung[k] ?? 0) + 1 }), {})

  return (
    <div className="demo">
      <div className="demo-keluaran">
        <strong>Data (items)</strong>
        <ul>
          {items.map((t, i) => (
            <li key={i}>
              {t.judul} · <em>{t.kategori}</em>
            </li>
          ))}
        </ul>
        <div className="demo-tambah-item">
          <select aria-label="Kategori item baru" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            <option>Kuliah</option>
            <option>Organisasi</option>
            <option>Lomba</option>
          </select>
          <button type="button" onClick={() => setItems([...items, { judul: `Item baru ${items.length + 1}`, kategori }])}>
            Tambah item
          </button>
        </div>
      </div>

      <div className="demo-tabel-gulir">
        <table className="demo-tabel">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(perKategori).map(([k, jumlah]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{jumlah}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <td>{items.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
