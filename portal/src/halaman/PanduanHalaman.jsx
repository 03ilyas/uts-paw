import { useSearchParams } from 'react-router-dom'
import { Alert, Button, Descriptions, Grid, Menu, Select, Tag } from 'antd'
import Tutorial from '../components/Tutorial.jsx'
import Kode from '../components/Kode.jsx'
import { DemoForm, DemoTabel } from '../components/Demo.jsx'
import { LANGKAH_TAMBAH } from './langkahTambah.jsx'
import { LANGKAH_STATISTIK } from './langkahStatistik.jsx'
import { LANGKAH_404, LANGKAH_BERANDA, LANGKAH_DETAIL, LANGKAH_FONDASI, LANGKAH_KOLEKSI, LANGKAH_TENTANG } from './langkahLain.jsx'

const gambar = (nama, alt) => <img className="gambar-halaman" src={`${import.meta.env.BASE_URL}contoh/${nama}.png`} alt={alt} loading="lazy" />

export const HALAMAN = [
  {
    key: 'fondasi',
    menu: 'Fondasi (kerjakan dulu)',
    judul: 'Fondasi: data, Context, Layout, dan rute',
    alamat: '-',
    berkas: ['mahasiswa.json', 'public/data/koleksi.json', 'src/hooks/useLocalStorage.js', 'src/context/koleksiContext.js', 'src/context/KoleksiProvider.jsx', 'src/hooks/useKoleksi.js', 'src/components/Layout.jsx', 'src/App.jsx'],
    isi: ['Identitas dan data awal sesuai tema NIM', 'Provider yang mengambil data dengan fetch dan menyimpannya ke localStorage', 'Layout dengan header, nav, main, footer', 'Ketujuh rute di App.jsx'],
    butir: ['A1', 'C1', 'D1', 'D2', 'D3', 'D4', 'D5', 'E1', 'E2'],
    langkah: LANGKAH_FONDASI,
  },
  {
    key: 'beranda',
    menu: '1. Beranda  /',
    judul: 'Beranda',
    alamat: '/',
    berkas: ['src/pages/Beranda.jsx'],
    isi: ['Satu judul utama (h1)', 'Nama tema', 'Ringkasan: jumlah item dan jumlah kategori', 'Tautan ke halaman koleksi'],
    butir: ['C2'],
    hasil: gambar('beranda', 'Tampilan halaman Beranda'),
    langkah: LANGKAH_BERANDA,
  },
  {
    key: 'koleksi',
    menu: '2. Koleksi  /koleksi',
    judul: 'Daftar koleksi',
    alamat: '/koleksi',
    berkas: ['src/pages/Koleksi.jsx', 'src/components/KartuItem.jsx', 'src/components/KotakPencarian.jsx'],
    isi: ['Pesan saat memuat dan saat gagal memuat', 'Kolom pencarian <input type="search"> berdasarkan judul', 'Filter kategori', 'Semua item sebagai kartu yang menuju halaman detail'],
    butir: ['C3', 'C4', 'D6', 'E3'],
    hasil: gambar('koleksi', 'Tampilan halaman Koleksi'),
    langkah: LANGKAH_KOLEKSI,
  },
  {
    key: 'detail',
    menu: '3. Detail  /koleksi/:id',
    judul: 'Detail item',
    alamat: '/koleksi/:id',
    berkas: ['src/pages/Detail.jsx'],
    isi: ['Judul item sebagai h1', 'Semua field, termasuk tiga field tema dengan labelnya', 'Tombol Hapus dengan konfirmasi', 'Tautan kembali', 'Pesan "tidak ditemukan" untuk id yang tidak ada'],
    butir: ['C5', 'C6', 'C9', 'C13'],
    hasil: gambar('detail', 'Tampilan halaman Detail'),
    langkah: LANGKAH_DETAIL,
  },
  {
    key: 'tambah',
    menu: '4. Tambah  /tambah',
    judul: 'Tambah item',
    alamat: '/tambah',
    berkas: ['src/pages/Tambah.jsx', 'src/pages/Tambah.css'],
    isi: ['Form terkontrol: Judul, Kategori, dan tiga field tema berlabel', 'Pesan error role="alert" bila judul kosong', 'Tombol Simpan', 'Setelah tersimpan, pindah ke /koleksi'],
    butir: ['C7', 'C8', 'C14'],
    judulHasil: 'Tampilan jadinya (coba langsung di sini)',
    hasil: <DemoForm />,
    langkah: LANGKAH_TAMBAH,
  },
  {
    key: 'statistik',
    menu: '5. Statistik  /statistik',
    judul: 'Statistik',
    alamat: '/statistik',
    berkas: ['src/pages/Statistik.jsx', 'src/pages/Statistik.css'],
    isi: ['Tabel HTML: jumlah item per kategori', 'Baris total', 'Tetap rapi di layar kecil'],
    butir: ['C10', 'E2', 'E3'],
    judulHasil: 'Tampilan jadinya (coba tambah item)',
    hasil: <DemoTabel />,
    langkah: LANGKAH_STATISTIK,
  },
  {
    key: 'tentang',
    menu: '6. Tentang  /tentang',
    judul: 'Tentang',
    alamat: '/tentang',
    berkas: ['src/pages/Tentang.jsx'],
    isi: ['Nama, NIM, kelas, dan tema dari mahasiswa.json', 'Tautan ke repo GitHub-mu'],
    butir: ['C11'],
    hasil: gambar('tentang', 'Tampilan halaman Tentang'),
    langkah: LANGKAH_TENTANG,
  },
  {
    key: '404',
    menu: '7. Halaman 404  *',
    judul: 'Halaman 404',
    alamat: 'semua alamat lain (*)',
    berkas: ['src/pages/TidakDitemukan.jsx'],
    isi: ['Teks "404"', 'Tautan kembali ke Beranda'],
    butir: ['C12'],
    hasil: gambar('404', 'Tampilan halaman 404'),
    langkah: LANGKAH_404,
  },
]

function Ringkasan({ h }) {
  return (
    <Descriptions
      bordered
      size="small"
      column={1}
      className="ringkasan-halaman"
      items={[
        { key: 'alamat', label: 'Alamat', children: <code>{h.alamat}</code> },
        { key: 'berkas', label: 'Berkas yang dibuat', children: h.berkas.map((b) => <code key={b} className="berkas">{b}</code>) },
        { key: 'isi', label: 'Isi wajib', children: <ul>{h.isi.map((i) => <li key={i}>{i}</li>)}</ul> },
        { key: 'butir', label: 'Butir rubrik', children: h.butir.map((b) => <Tag key={b} color="gold" variant="filled">{b}</Tag>) },
      ]}
    />
  )
}

export default function PanduanHalaman() {
  const [params, setParams] = useSearchParams()
  const layar = Grid.useBreakpoint()
  const kunci = params.get('halaman') ?? { form: 'tambah', tabel: 'statistik' }[params.get('tab')]
  const h = HALAMAN.find((x) => x.key === kunci) ?? HALAMAN[0]
  const urutan = HALAMAN.indexOf(h)
  const pilih = (key) => {
    setParams({ halaman: key })
    window.scrollTo(0, 0)
  }

  return (
    <div className="panduan-halaman">
      <nav className="menu-halaman" aria-label="Pilih halaman">
        {layar.lg ? (
          <Menu mode="inline" selectedKeys={[h.key]} items={HALAMAN.map((x) => ({ key: x.key, label: x.menu }))} onClick={({ key }) => pilih(key)} />
        ) : (
          <Select
            size="large"
            value={h.key}
            onChange={pilih}
            options={HALAMAN.map((x) => ({ value: x.key, label: x.menu }))}
            style={{ width: '100%' }}
            aria-label="Pilih halaman"
          />
        )}
      </nav>

      <div className="isi-halaman">
        <span className="kicker">{urutan === 0 ? 'Kerjakan sebelum halaman lain' : `Halaman ${urutan} dari 7`}</span>
        <h2 className="judul-halaman">{h.judul}</h2>
        <Ringkasan h={h} />

        <Tutorial
          judulHasil={h.judulHasil}
          hasil={h.hasil}
          langkah={h.langkah}
          penutup={
            <Alert
              type="info"
              showIcon
              title="Terakhir: cek dengan pemeriksa"
              description={
                <>
                  Jalankan perintah ini di folder <code>app/</code>. Butir {h.butir.join(', ')} harus LULUS.
                  <Kode label="Terminal, di folder app/">npm run cek</Kode>
                </>
              }
            />
          }
        />

        <div className="navigasi-halaman">
          {urutan > 0 && (
            <Button size="large" onClick={() => pilih(HALAMAN[urutan - 1].key)}>
              ← {HALAMAN[urutan - 1].judul}
            </Button>
          )}
          {urutan < HALAMAN.length - 1 && (
            <Button type="primary" size="large" onClick={() => pilih(HALAMAN[urutan + 1].key)}>
              Lanjut: {HALAMAN[urutan + 1].judul} →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
