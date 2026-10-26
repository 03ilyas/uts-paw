import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Button, Drawer, Grid, Layout, Menu, Result } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import UTS from './uts.js'
import Beranda from './pages/Beranda.jsx'
import Soal from './pages/Soal.jsx'
import Contoh from './pages/Contoh.jsx'
import Ketentuan from './pages/Ketentuan.jsx'
import Panduan from './pages/Panduan.jsx'
import Rubrik from './pages/Rubrik.jsx'
import Materi from './pages/Materi.jsx'
import Pengumpulan from './pages/Pengumpulan.jsx'

const HALAMAN = [
  { key: '/', label: 'Beranda', judul: 'Beranda' },
  { key: '/soal', label: 'Soal', judul: 'Soal' },
  { key: '/contoh', label: 'Contoh Kode', judul: 'Contoh Kode' },
  { key: '/panduan', label: 'Panduan', judul: 'Panduan Fork dan Deploy' },
  { key: '/rubrik', label: 'Rubrik', judul: 'Rubrik Penilaian' },
  { key: '/ketentuan', label: 'Ketentuan', judul: 'Ketentuan dan Pelanggaran' },
  { key: '/materi', label: 'Materi', judul: 'Materi P1-P7' },
  { key: '/pengumpulan', label: 'Pengumpulan', judul: 'Daftar Pengumpulan' },
]
const MENU = HALAMAN.map(({ key, label }) => ({ key, label }))

function TidakDitemukan() {
  return (
    <Result
      status="404"
      title="Halaman tidak ada"
      extra={
        <Link to="/">
          <Button type="primary">Kembali ke beranda</Button>
        </Link>
      }
    />
  )
}

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const layar = Grid.useBreakpoint()
  const [laci, setLaci] = useState(false)
  const aktif = HALAMAN.find((h) => h.key !== '/' && pathname.startsWith(h.key))?.key ?? (pathname === '/' ? '/' : '')

  useEffect(() => {
    const judul = HALAMAN.find((h) => h.key === aktif)?.judul
    document.title = judul && aktif !== '/' ? `${judul} | Ujian Tengah Semester Pengembangan Aplikasi Web` : 'Ujian Tengah Semester Pengembangan Aplikasi Web'
    window.scrollTo(0, 0)
  }, [aktif])

  const pindah = ({ key }) => {
    navigate(key)
    setLaci(false)
  }

  return (
    <Layout className="kerangka">
      <Layout.Header className="kepala">
        <Link to="/" className="merek">
          <img src={`${import.meta.env.BASE_URL}itera-logo.png`} alt="ITERA" width="28" height="34" />
          <span>
            <strong>Ujian Tengah Semester</strong>
            <small>Pengembangan Aplikasi Web</small>
          </span>
        </Link>
        {layar.md ? (
          <Menu theme="dark" mode="horizontal" selectedKeys={[aktif]} items={MENU} onClick={pindah} className="menu-utama" />
        ) : (
          <>
            <Button type="text" aria-label="Buka menu" icon={<MenuOutlined />} onClick={() => setLaci(true)} className="tombol-menu" />
            <Drawer open={laci} onClose={() => setLaci(false)} placement="right" size={260} title="Menu">
              <Menu mode="vertical" selectedKeys={[aktif]} items={MENU} onClick={pindah} style={{ border: 0 }} />
            </Drawer>
          </>
        )}
      </Layout.Header>
      <Layout.Content className="isi">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/soal" element={<Soal />} />
          <Route path="/contoh" element={<Contoh />} />
          <Route path="/ketentuan" element={<Ketentuan />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/rubrik" element={<Rubrik />} />
          <Route path="/materi" element={<Materi />} />
          <Route path="/pengumpulan" element={<Pengumpulan />} />
          <Route path="*" element={<TidakDitemukan />} />
        </Routes>
      </Layout.Content>
      <Layout.Footer className="kaki">
        <span>{UTS.mataKuliah}</span>
        <span>Informatika, Institut Teknologi Sumatera</span>
        <span>Dosen: {UTS.dosen}</span>
      </Layout.Footer>
    </Layout>
  )
}
