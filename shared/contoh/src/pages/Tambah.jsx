import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useKoleksi from '../hooks/useKoleksi.js'

const AWAL = { judul: '', kategori: 'Kuliah', tenggat: '', prioritas: 'sedang' }

export default function Tambah() {
  const { tambah } = useKoleksi()
  const navigate = useNavigate()
  const [form, setForm] = useState(AWAL)
  const [galat, setGalat] = useState('')

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const simpan = (e) => {
    e.preventDefault()
    if (form.judul.trim().length < 3) {
      setGalat('Judul wajib diisi, minimal 3 karakter.')
      return
    }
    tambah({ ...form, judul: form.judul.trim() })
    navigate('/koleksi')
  }

  return (
    <form onSubmit={simpan} noValidate>
      <h1>Tambah Tugas</h1>
      <label htmlFor="judul">Judul</label>
      <input id="judul" name="judul" value={form.judul} onChange={ubah} />
      {galat && <p role="alert">{galat}</p>}

      <label htmlFor="kategori">Kategori</label>
      <select id="kategori" name="kategori" value={form.kategori} onChange={ubah}>
        <option>Kuliah</option>
        <option>Organisasi</option>
      </select>

      <label htmlFor="tenggat">Tenggat</label>
      <input id="tenggat" name="tenggat" type="date" value={form.tenggat} onChange={ubah} />

      <button type="submit">Simpan</button>
    </form>
  )
}
