import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Beranda from './pages/Beranda.jsx'
import Tentang from './pages/Tentang.jsx'
import TidakDitemukan from './pages/TidakDitemukan.jsx'
import KartuLatihan from './components/KartuLatihan.jsx'
import PesanStatus from './components/PesanStatus.jsx'
import { KoleksiContext } from './context/koleksiContext.js'

describe('Pengujian Aplikasi Jurnal Latihan Olahraga', () => {
  it('1. Halaman Beranda merender judul h1 tema', () => {
    const nilaiDummy = { items: [], loading: false, error: null }
    render(
      <KoleksiContext.Provider value={nilaiDummy}>
        <Beranda />
      </KoleksiContext.Provider>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Jurnal Latihan Olahraga/i)
  })

  it('2. Halaman Tentang menampilkan identitas mahasiswa', () => {
    render(<Tentang />)
    expect(screen.getByText(/Ilyas Ramadhan/i)).toBeInTheDocument()
    expect(screen.getByText(/123140016/i)).toBeInTheDocument()
  })

  it('3. Halaman 404 merender pesan error 404', () => {
    render(
      <MemoryRouter>
        <TidakDitemukan />
      </MemoryRouter>
    )
    expect(screen.getByText(/404/i)).toBeInTheDocument()
  })

  it('4. Komponen PesanStatus menampilkan teks loading saat aktif', () => {
    render(<PesanStatus loading={true} error={null} />)
    expect(screen.getByText(/Memuat data.../i)).toBeInTheDocument()
  })

  it('5. Komponen KartuLatihan merender judul dan link latihan', () => {
    const dataLatihan = {
      id: '101',
      judul: 'Lari Pagi Santai',
      kategori: 'Kardio',
      durasi: 20
    }
    render(
      <MemoryRouter>
        <KartuLatihan item={dataLatihan} />
      </MemoryRouter>
    )
    expect(screen.getByText('Lari Pagi Santai')).toBeInTheDocument()
    expect(screen.getByText(/Kardio/i)).toBeInTheDocument()
  })
})