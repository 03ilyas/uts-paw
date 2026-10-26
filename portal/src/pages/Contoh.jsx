import { Link } from 'react-router-dom'
import { Alert, Anchor, Tag } from 'antd'
import KepalaHalaman from '../components/KepalaHalaman.jsx'
import Kode from '../components/Kode.jsx'

// Berkas contoh dibaca langsung dari shared/contoh/, folder yang sama dengan yang
// diuji grader, sehingga kode di halaman ini selalu kode yang lulus uji.
const BERKAS = import.meta.glob('../../../shared/contoh/**/*.{js,jsx,css,json}', { query: '?raw', import: 'default', eager: true })
const isi = (path) => BERKAS[`../../../shared/contoh/${path}`]

const BAGIAN = [
  {
    key: 'router',
    judul: 'Router di main.jsx',
    butir: ['D4'],
    teks: (
      <>
        <code>BrowserRouter</code> hanya ada di sini, dengan <code>basename</code> dari <code>import.meta.env.BASE_URL</code> agar rute
        tetap benar di <code>USERNAME.github.io/uts-paw/</code>. Berkas ini sudah ada di starter; jangan dipindah ke App.jsx.
      </>
    ),
    berkas: ['src/main.jsx'],
  },
  {
    key: 'app',
    judul: 'App.jsx: Provider dan semua rute',
    butir: ['D4', 'C12'],
    teks: (
      <>
        App membungkus semua rute dengan Provider Context. Rute induk tanpa <code>path</code> memakai komponen Layout, sehingga header,
        nav, dan footer tampil di setiap halaman lewat <code>&lt;Outlet /&gt;</code>. Rute <code>*</code> menangkap alamat yang tidak dikenal.
      </>
    ),
    berkas: ['src/App.jsx'],
  },
  {
    key: 'context',
    judul: 'Context API dengan fetch, loading, dan error',
    butir: ['D1', 'D2', 'D5', 'C3'],
    teks: (
      <>
        Context dibuat di berkas terpisah, Provider mengambil data awal dengan <code>await fetch</code> hanya bila localStorage masih kosong.
        Perhatikan state bernama <code>loading</code> dan <code>error</code>, pemeriksaan <code>res.ok</code>, serta fungsi{' '}
        <code>tambah</code> dan <code>hapus</code> yang dibagikan ke seluruh aplikasi.
      </>
    ),
    berkas: ['src/context/koleksiContext.js', 'src/context/KoleksiProvider.jsx'],
  },
  {
    key: 'hook',
    judul: 'Custom hook',
    butir: ['D3', 'C8'],
    teks: (
      <>
        Dua hook di <code>src/hooks/</code>, nama berkas diawali <code>use</code>. <code>useLocalStorage</code> menyimpan state ke
        localStorage setiap kali berubah; <code>useKoleksi</code> membungkus <code>useContext</code> agar komponen cukup memanggil satu fungsi.
      </>
    ),
    berkas: ['src/hooks/useLocalStorage.js', 'src/hooks/useKoleksi.js'],
  },
  {
    key: 'layout',
    judul: 'Layout semantik dan CSS responsif',
    butir: ['E1', 'E2'],
    teks: (
      <>
        Elemen <code>header</code>, <code>nav</code>, <code>main</code>, dan <code>footer</code>, menu dengan <code>NavLink</code>, tata letak
        flex dan grid, serta <code>@media</code> yang menyusun ulang kartu menjadi satu kolom di layar kecil.
      </>
    ),
    berkas: ['src/components/Layout.jsx', 'src/components/Layout.css'],
  },
  {
    key: 'komponen',
    judul: 'Komponen dengan props',
    butir: ['D6', 'C4'],
    teks: (
      <>
        Komponen kecil yang menerima data lewat props. Kolom pencarian memakai <code>type="search"</code> dan dikendalikan oleh state
        induknya. Kamu perlu minimal lima komponen; contoh ini baru tiga bersama Layout.
      </>
    ),
    berkas: ['src/components/KotakPencarian.jsx', 'src/components/KartuItem.jsx'],
  },
  {
    key: 'koleksi',
    judul: 'Halaman koleksi: pencarian, filter, dan daftar',
    butir: ['C3', 'C4', 'E3'],
    teks: (
      <>
        Rendering bersyarat untuk keadaan memuat dan gagal, <code>filter</code> berdasarkan judul dan kategori, lalu <code>map</code> dengan{' '}
        <code>key</code> unik.
      </>
    ),
    berkas: ['src/pages/Koleksi.jsx'],
  },
  {
    key: 'detail',
    judul: 'Halaman detail: useParams, hapus, dan tidak ditemukan',
    butir: ['C5', 'C6', 'C9'],
    teks: (
      <>
        Semua hook dipanggil sebelum <code>return</code> pertama. Id yang tidak ada menampilkan "tidak ditemukan" tanpa teks 404. Hapus memakai{' '}
        <code>window.confirm</code> lalu <code>navigate('/koleksi')</code>.
      </>
    ),
    berkas: ['src/pages/Detail.jsx'],
  },
  {
    key: 'tambah',
    judul: 'Form tambah dengan validasi',
    butir: ['C7', 'C8'],
    teks: (
      <>
        Form terkontrol: satu state objek untuk semua field. Label <strong>Judul</strong> terhubung lewat <code>htmlFor</code> dan{' '}
        <code>id</code>, validasi ditulis sendiri dengan pesan <code>role="alert"</code>, <code>noValidate</code> mematikan popup bawaan
        browser, dan tombolnya bertuliskan <strong>Simpan</strong>. Tambahkan input untuk tiga field temamu.
      </>
    ),
    berkas: ['src/pages/Tambah.jsx'],
  },
  {
    key: 'statistik',
    judul: 'Statistik dengan tabel HTML',
    butir: ['C10', 'E3'],
    teks: (
      <>
        <code>reduce</code> menghitung jumlah item per kategori, lalu hasilnya ditampilkan dalam <code>&lt;table&gt;</code> lengkap dengan{' '}
        <code>thead</code>, <code>tbody</code>, dan <code>tfoot</code>.
      </>
    ),
    berkas: ['src/pages/Statistik.jsx'],
  },
  {
    key: 'halaman-lain',
    judul: 'Beranda, Tentang, dan 404',
    butir: ['C2', 'C11', 'C12'],
    teks: (
      <>
        Beranda punya satu <code>h1</code> dan ringkasan data. Tentang membaca <code>mahasiswa.json</code> agar nama dan NIM selalu sama
        dengan identitasmu. Halaman 404 memuat teks "404".
      </>
    ),
    berkas: ['src/pages/Beranda.jsx', 'src/pages/Tentang.jsx', 'src/pages/TidakDitemukan.jsx'],
  },
  {
    key: 'data',
    judul: 'Data awal',
    butir: ['C1'],
    teks: (
      <>
        Simpan di <code>app/public/data/koleksi.json</code>. Contoh ini hanya dua item dengan field tema Daftar Tugas; punyamu minimal 10
        item dengan <code>id</code>, <code>judul</code>, <code>kategori</code>, dan tiga field tema sesuai NIM.
      </>
    ),
    berkas: ['public/data/koleksi.json'],
  },
  {
    key: 'test',
    judul: 'Test dengan Vitest dan Testing Library',
    butir: ['F1', 'F2'],
    teks: (
      <>
        <code>fetch</code> diganti tiruan dengan <code>vi.stubGlobal</code> supaya test tidak bergantung jaringan, dan App dirender di dalam{' '}
        <code>MemoryRouter</code>. Contoh ini dua test; kamu perlu minimal lima yang semuanya lulus.
      </>
    ),
    berkas: ['src/Tambah.test.jsx'],
  },
]

export default function Contoh() {
  return (
    <>
      <KepalaHalaman kicker="Contoh Kode" judul="Contoh untuk setiap kode yang diminta">
        Contoh aplikasi Daftar Tugas yang memenuhi kontrak penilaian. Setiap bagian menyebut butir rubrik yang dipenuhinya. Seluruh contoh
        sudah dijalankan dengan uji otomatis dosen dan lulus.
      </KepalaHalaman>

      <Alert
        type="warning"
        showIcon
        title="Pelajari polanya, lalu tulis versimu sendiri"
        description={
          <>
            Temamu berbeda, jadi nama komponen, field, teks, dan tampilan harus kamu sesuaikan. Bagian yang sama persis dengan contoh tidak
            dihitung sebagai kemiripan antar-mahasiswa, tetapi kamu tetap wajib bisa menjelaskan setiap barisnya saat klarifikasi. Lihat{' '}
            <Link to="/ketentuan">ketentuan</Link>.
          </>
        }
        style={{ marginBottom: 32, maxWidth: 820 }}
      />

      <div className="dengan-navigasi">
        <article className="prosa">
          {BAGIAN.map((b, i) => (
            <section key={b.key}>
              <h2 id={b.key}>
                {i + 1}. {b.judul}
              </h2>
              <p>
                {b.butir.map((id) => (
                  <Tag key={id} variant="filled" color="gold">
                    {id}
                  </Tag>
                ))}
              </p>
              <p>{b.teks}</p>
              {b.berkas.map((path) => (
                <Kode key={path} label={path}>
                  {isi(path)}
                </Kode>
              ))}
            </section>
          ))}
        </article>
        <aside className="navigasi-samping">
          <Anchor offsetTop={96} items={BAGIAN.map((b) => ({ key: b.key, href: `#${b.key}`, title: b.judul }))} />
        </aside>
      </div>
    </>
  )
}
