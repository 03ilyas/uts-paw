import { NavLink } from 'react-router-dom'

const MENU = [
  { ke: '/', label: 'Beranda' },
  { ke: '/koleksi', label: 'Koleksi' },
  { ke: '/tambah', label: 'Tambah' },
  { ke: '/statistik', label: 'Statistik' },
  { ke: '/tentang', label: 'Tentang' },
]

export default function Header() {
  return (
    <header className="kepala">
      <strong>Jurnal Latihan Olahraga</strong>
      <nav className="menu">
        {MENU.map(({ ke, label }) => (
          <NavLink key={ke} to={ke} end={ke === '/'}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}