import { Link } from 'react-router-dom'
import { Alert, Anchor, Table } from 'antd'
import KepalaHalaman from '../components/KepalaHalaman.jsx'
import Kode from '../components/Kode.jsx'
import KetentuanAsisten from '../components/KetentuanAsisten.jsx'
import UTS, { KELAS, tanggalWib } from '../uts.js'

const BAGIAN = [
  { key: 'ketentuan', title: 'Ketentuan umum' },
  { key: 'tema', title: 'Tema per NIM' },
  { key: 'aplikasi', title: 'Spesifikasi aplikasi' },
  { key: 'kontrak', title: 'Kontrak penilaian' },
  { key: 'struktur', title: 'Struktur proyek' },
  { key: 'pengumpulan', title: 'Pengumpulan' },
].map((b) => ({ ...b, href: `#${b.key}` }))

const kolomTema = [
  { title: 'Digit', dataIndex: 'digit', width: 72, align: 'center' },
  { title: 'Tema', dataIndex: 'nama', render: (v) => <strong>{v}</strong> },
  {
    title: 'Field tema (selain id, judul, kategori)',
    dataIndex: 'field',
    render: (field) => field.map((f) => <code key={f.kunci} style={{ marginRight: 6 }}>{f.kunci}</code>),
  },
]

const HALAMAN = [
  { rute: '/', nama: 'Beranda', isi: 'Satu judul utama (h1), nama tema, dan ringkasan: jumlah item dan jumlah kategori.' },
  { rute: '/koleksi', nama: 'Daftar koleksi', isi: 'Semua item dalam bentuk kartu atau daftar, kolom pencarian berdasarkan judul, filter kategori, serta keadaan memuat dan gagal memuat.' },
  { rute: '/koleksi/:id', nama: 'Detail', isi: 'Semua field item, tombol Hapus, dan tautan kembali. Id yang tidak ada menampilkan pesan "tidak ditemukan".' },
  { rute: '/tambah', nama: 'Tambah item', isi: 'Form terkontrol dengan field judul, kategori, dan tiga field tema. Validasi dengan pesan error yang jelas.' },
  { rute: '/statistik', nama: 'Statistik', isi: 'Elemen <table> berisi jumlah item per kategori dan totalnya.' },
  { rute: '/tentang', nama: 'Tentang', isi: 'Nama, NIM, kelas, tema, dan tautan ke repo GitHub kamu.' },
  { rute: '*', nama: 'Halaman 404', isi: 'Teks "404" dan tautan kembali ke beranda.' },
]

const kolomHalaman = [
  { title: 'Rute', dataIndex: 'rute', width: 130, render: (v) => <code>{v}</code> },
  { title: 'Halaman', dataIndex: 'nama', width: 140 },
  { title: 'Isi minimal', dataIndex: 'isi' },
]

export default function Soal() {
  return (
    <>
      <KepalaHalaman kicker={`${UTS.judul} · ${UTS.mataKuliah}`} judul="Soal: Aplikasi Katalog Berbasis React">
        Bangun aplikasi web satu halaman (SPA) untuk mengelola koleksi data sesuai tema NIM kamu, lalu deploy ke
        GitHub Pages. Waktu pengerjaan tiga hari mengikuti jadwal kelasmu.
      </KepalaHalaman>

      <div className="dengan-navigasi">
        <article className="prosa">
          <h2 id="ketentuan">Ketentuan umum</h2>
          <ol>
            <li>
              UTS dikerjakan secara individu sebagai ujian take-home selama tiga hari sesuai jadwal kelas:
              <ul>
                {KELAS.map((k) => (
                  <li key={k.kode}>
                    Kelas {k.kode}: {tanggalWib(k.dibuka)} sampai <strong>{tanggalWib(k.tenggat)}</strong>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              Hanya mahasiswa yang terdaftar di data kelas yang dinilai. Kelas dan tenggat ditentukan dari data kelas, bukan dari isian{' '}
              <code>mahasiswa.json</code>.
            </li>
            <li>
              Pekerjaan dibuat di fork dari repo <a href={`https://github.com/${UTS.repoInduk}`}>{UTS.repoInduk}</a>.
              Ikuti <Link to="/panduan">panduan fork dan deploy</Link>.
            </li>
            <li>
              Yang dinilai adalah <strong>push terakhir sebelum tenggat</strong>. Waktu push dicatat oleh server GitHub
              Actions, bukan oleh tanggal commit di komputer kamu. Push setelah tenggat diabaikan.
            </li>
            <li>
              Kamu boleh membuka materi kuliah, <Link to="/contoh">contoh kode</Link>, dan dokumentasi resmi.{' '}
              <strong>AI generatif dilarang</strong>, begitu pula menyalin atau berbagi kode. Semua larangan, pemeriksaan integritas
              otomatis, dan sanksinya ada di halaman <Link to="/ketentuan">Ketentuan</Link>.
            </li>
            <li>
              Pustaka UI tambahan (misalnya Ant Design) boleh dipakai selama kontrak penilaian terpenuhi. Tetap tulis
              minimal satu berkas CSS sendiri dengan tata letak flex atau grid dan media query.
            </li>
          </ol>

          <h2 id="tema">Tema per NIM</h2>
          <p>
            Tema ditentukan oleh <strong>digit terakhir NIM</strong>. Setiap item data wajib memiliki field{' '}
            <code>id</code>, <code>judul</code>, <code>kategori</code>, ditambah tiga field tema berikut. Nama field
            harus sama persis (huruf besar-kecil berpengaruh).
          </p>
          <Table rowKey="digit" size="middle" pagination={false} columns={kolomTema} dataSource={UTS.tema} scroll={{ x: 560 }} />

          <h2 id="aplikasi">Spesifikasi aplikasi</h2>
          <p>Aplikasi minimal terdiri dari tujuh rute berikut, dengan navigasi yang tampil di semua halaman.</p>
          <Table rowKey="rute" size="middle" pagination={false} columns={kolomHalaman} dataSource={HALAMAN} scroll={{ x: 560 }} />

          <h3>Data dan penyimpanan</h3>
          <ul>
            <li>
              Data awal disimpan di <code>app/public/data/koleksi.json</code> berisi minimal {UTS.minimalItem} item
              dengan judul yang berbeda satu sama lain. Judul satu item tidak boleh menjadi bagian dari judul item lain
              atau disebut di deskripsi item lain, karena uji pencarian mencari judul di seluruh halaman.
            </li>
            <li>
              Data awal diambil dengan <code>fetch</code> dan <code>async/await</code>, bukan di-import. Tampilkan pesan
              saat memuat dan saat gagal memuat.
            </li>
            <li>
              Penambahan dan penghapusan item disimpan ke <code>localStorage</code>, sehingga tetap ada setelah halaman
              di-refresh.
            </li>
          </ul>

          <h3>Konsep yang wajib diterapkan</h3>
          <ul>
            <li>Komponen fungsional dengan props; minimal 5 komponen di <code>src/components/</code>.</li>
            <li><code>useState</code> dan <code>useEffect</code>.</li>
            <li>Context API untuk state koleksi: <code>createContext</code>, Provider, dan <code>useContext</code>.</li>
            <li>Minimal 2 custom hook di <code>src/hooks/</code>, misalnya <code>useLocalStorage</code>, dan keduanya dipakai.</li>
            <li>React Router: <code>NavLink</code> atau <code>Link</code>, <code>useParams</code>, dan <code>useNavigate</code>.</li>
            <li>Rendering daftar dengan <code>map</code> dan <code>key</code>, rendering bersyarat, form terkontrol.</li>
            <li>HTML semantik (<code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code>) dan CSS responsif.</li>
            <li>Minimal 5 test buatan sendiri dengan Vitest dan React Testing Library, semuanya lulus.</li>
          </ul>

          <h2 id="kontrak">Kontrak penilaian otomatis</h2>
          <Alert
            type="warning"
            showIcon
            title="Ikuti kontrak ini dengan tepat"
            description="Uji otomatis dosen berinteraksi dengan aplikasimu seperti pengguna. Aplikasi yang berfungsi tetapi melanggar kontrak bisa kehilangan poin."
            style={{ margin: '12px 0 16px' }}
          />
          <ol className="kontrak">
            <li>
              <code>BrowserRouter</code> hanya ada di <code>src/main.jsx</code> dengan{' '}
              <code>basename=&#123;import.meta.env.BASE_URL&#125;</code>. <code>src/App.jsx</code> mengekspor komponen{' '}
              <code>App</code> secara default, berisi Provider Context dan <code>&lt;Routes&gt;</code>, tanpa Router.
            </li>
            <li>
              Data awal diambil dari <code>{'`${import.meta.env.BASE_URL}data/koleksi.json`'}</code> dengan{' '}
              <code>await fetch(...)</code>. Nama state memuat dan gagal mengandung kata <code>loading</code> dan{' '}
              <code>error</code>, misalnya <code>const [loading, setLoading] = useState(true)</code>.
            </li>
            <li>Kolom pencarian di <code>/koleksi</code> memakai <code>&lt;input type="search"&gt;</code> dan menyaring berdasarkan judul.</li>
            <li>
              Form <code>/tambah</code>: input judul punya label bertuliskan <strong>Judul</strong> yang terhubung lewat{' '}
              <code>htmlFor</code> dan <code>id</code>; tombol kirim bertuliskan <strong>Simpan</strong>; pesan error
              memakai <code>role="alert"</code>. Tulis validasi sendiri di JavaScript; atribut <code>required</code>{' '}
              saja tidak cukup karena pesannya berupa popup browser. Hanya Judul yang wajib diisi, field lain boleh punya
              nilai bawaan. Setelah disimpan, arahkan ke <code>/koleksi</code>.
            </li>
            <li>
              Halaman detail punya tombol bertuliskan <strong>Hapus</strong>. Konfirmasi memakai{' '}
              <code>window.confirm</code>, lalu arahkan ke <code>/koleksi</code>. Untuk id yang tidak ada, tampilkan teks
              "tidak ditemukan" di halaman detail tanpa teks "404".
            </li>
            <li>Halaman 404 memuat teks <strong>404</strong>.</li>
            <li>Halaman <code>/statistik</code> memakai elemen <code>&lt;table&gt;</code>.</li>
            <li>Halaman <code>/tentang</code> menampilkan nama dan NIM persis seperti di <code>app/mahasiswa.json</code>.</li>
            <li>
              Custom hook berada di <code>src/hooks/useNamaHook.js</code> (nama berkas diawali <code>use</code>),
              komponen di <code>src/components/</code>, test di berkas <code>*.test.jsx</code>.
            </li>
            <li>
              Jangan mengubah <code>.github/workflows/</code>, <code>grader/</code>, dan <code>shared/</code>. Penilaian
              akhir selalu memakai versi repo induk.
            </li>
          </ol>

          <h2 id="struktur">Struktur proyek yang disarankan</h2>
          <Kode label="app/">{`app/
├── mahasiswa.json            identitas kamu
├── public/data/koleksi.json  data awal (minimal ${UTS.minimalItem} item)
└── src/
    ├── main.jsx              BrowserRouter (sudah disediakan)
    ├── App.jsx               Provider + Routes
    ├── components/           Layout, KartuItem, FormItem, ...
    ├── context/              KoleksiContext.jsx
    ├── hooks/                useLocalStorage.js, ...
    ├── pages/                Beranda, Koleksi, Detail, Tambah, ...
    └── *.test.jsx            test buatan sendiri`}</Kode>
          <p>Contoh isi <code>app/mahasiswa.json</code>:</p>
          <Kode label="app/mahasiswa.json">{`{
  "nama": "Nama Lengkap Kamu",
  "nim": "999999995",
  "kelas": "RA",
  "tema": "Destinasi Wisata Lampung"
}`}</Kode>
          <p>
            Contoh satu item untuk tema digit 5. Contoh untuk setiap kode yang diminta ada di halaman{' '}
            <Link to="/contoh">Contoh Kode</Link>.
          </p>
          <Kode label="app/public/data/koleksi.json">{`[
  {
    "id": "1",
    "judul": "Pantai Mutun",
    "kategori": "Pantai",
    "kabupaten": "Pesawaran",
    "hargaTiket": 15000,
    "jamBuka": "07.00-18.00"
  }
]`}</Kode>

          <KetentuanAsisten />

          <h2 id="pengumpulan">Pengumpulan</h2>
          <ol>
            <li>Isi <code>app/mahasiswa.json</code> dan data awal sesuai tema.</li>
            <li>
              Ganti isi <code>README.md</code> di akar repo dengan dokumentasimu: nama, NIM, URL deployment, bagian{' '}
              <strong>Fitur</strong>, cara menjalankan, dan minimal satu tangkapan layar (<code>![...](...)</code>).
            </li>
            <li>Push ke branch <code>main</code> fork kamu sebelum tenggat. Pastikan workflow di tab Actions berwarna hijau.</li>
            <li>
              Buka <code>https://&lt;username&gt;.github.io/uts-paw/</code> dan pastikan aplikasimu tampil. Namamu akan
              muncul di halaman <Link to="/pengumpulan">Pengumpulan</Link> dalam satu jam.
            </li>
          </ol>
          <p>
            Tidak ada pengumpulan lewat e-learning atau email. Fork yang tidak terdaftar di halaman Pengumpulan tidak
            dapat dinilai, jadi periksa namamu di sana.
          </p>
        </article>

        <aside className="navigasi-samping">
          <Anchor items={BAGIAN} offsetTop={96} />
        </aside>
      </div>
    </>
  )
}
