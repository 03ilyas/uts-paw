import { useState } from 'react'

const AWAL = { judul: '', kategori: 'Kuliah' }

export default function Tambah() {
  const [form, setForm] = useState(AWAL)

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const simpan = (e) => {
    e.preventDefault()
    console.log('Data yang akan disimpan:', form)
  }

  return (
    <form onSubmit={simpan} noValidate>
      <h1>Tambah Tugas</h1>

      <label htmlFor="judul">Judul</label>
      <input id="judul" name="judul" value={form.judul} onChange={ubah} />

      <label htmlFor="kategori">Kategori</label>
      <select id="kategori" name="kategori" value={form.kategori} onChange={ubah}>
        <option>Kuliah</option>
        <option>Organisasi</option>
      </select>

      <button type="submit">Simpan</button>
    </form>
  )
}
