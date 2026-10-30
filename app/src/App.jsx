import { NavLink, Route, Routes } from 'react-router-dom'
import { KoleksiProvider } from './context/KoleksiProvider.jsx'
import Beranda from './pages/Beranda.jsx'
import Koleksi from './pages/Koleksi.jsx'
import Detail from './pages/Detail.jsx'
import Tambah from './pages/Tambah.jsx'
import Statistik from './pages/Statistik.jsx'
import Tentang from './pages/Tentang.jsx'
import TidakDitemukan from './pages/TidakDitemukan.jsx'
import './components/Layout.css'

const MENU = [
  { ke: '/', label: 'Beranda' },
  { ke: '/koleksi', label: 'Koleksi' },
  { ke: '/tambah', label: 'Tambah' },
  { ke: '/statistik', label: 'Statistik' },
  { ke: '/tentang', label: 'Tentang' },
]

export default function App() {
  return (
    <KoleksiProvider>
      <div id="aplikasi-utama" className="kerangka">
        <header className="kepala">
          <strong>Jurnal Latihan Olahraga</strong>
          <nav id="navigasi-utama" className="menu">
            {MENU.map(({ ke, label }) => (
              <NavLink key={ke} to={ke} end={ke === '/'}>
                {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="isi">
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/koleksi" element={<Koleksi />} />
            <Route path="/koleksi/:id" element={<Detail />} />
            <Route path="/tambah" element={<Tambah />} />
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="*" element={<TidakDitemukan />} />
          </Routes>
        </main>

        <footer className="kaki">
          Ujian Tengah Semester Pengembangan Aplikasi Web
        </footer>
      </div>
    </KoleksiProvider>
  )
}