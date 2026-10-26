import { isi } from '../contoh.js'

const KERANGKA = `// Buat tujuh berkas ini di src/pages/ dengan isi sementara seperti ini.
// Isinya diganti satu per satu saat mengikuti panduan setiap halaman.
export default function Beranda() {
  return <h1>Beranda</h1>
}`

export const LANGKAH_FONDASI = [
  {
    judul: 'Isi identitas dan data awal',
    tujuan: 'Semua halaman membaca dua berkas ini. Isi dulu sebelum menulis komponen apa pun.',
    kode: [
      { label: 'app/mahasiswa.json', isi: isi('mahasiswa.json') },
      { label: 'app/public/data/koleksi.json (contoh tema Daftar Tugas)', isi: isi('public/data/koleksi.json') },
    ],
    penjelasan: [
      <>
        Pakai NIM, nama, dan kelas persis seperti di SIAKAD. Nama <code>tema</code> harus sama dengan tema untuk digit terakhir NIM-mu (cek di
        halaman Beranda portal).
      </>,
      <>
        Ganti isi <code>koleksi.json</code> dengan data temamu: minimal 10 item, setiap item punya <code>id</code>, <code>judul</code>,{' '}
        <code>kategori</code>, dan tiga field tema dengan nama persis seperti di tabel tema. Contoh di atas hanya ilustrasi bentuknya.
      </>,
      'Judul setiap item harus berbeda, dan tidak boleh menjadi bagian dari judul item lain.',
    ],
    cek: ['Jalankan npm run cek: butir A1 dan C1 LULUS.'],
  },
  {
    judul: 'Buat hook useLocalStorage',
    tujuan: 'Hook ini menyimpan state ke localStorage setiap kali berubah, sehingga data tidak hilang saat halaman di-refresh.',
    kode: [{ label: 'src/hooks/useLocalStorage.js', isi: isi('src/hooks/useLocalStorage.js') }],
    penjelasan: [
      <>
        <code>useState(() =&gt; ...)</code> membaca localStorage sekali saja, saat komponen pertama kali dibuat.
      </>,
      <>
        <code>useEffect</code> menulis ulang ke localStorage setiap kali <code>nilai</code> berubah.
      </>,
      'Nama berkas dan nama fungsi diawali "use" karena ini custom hook (butir D3).',
    ],
    cek: ['Belum ada yang terlihat di layar. Hook ini dipakai di langkah berikutnya.'],
  },
  {
    judul: 'Buat Context dan Provider',
    tujuan: 'Provider mengambil data awal dengan fetch, menyimpannya, dan membagikannya ke semua halaman.',
    kode: [
      { label: 'src/context/koleksiContext.js', isi: isi('src/context/koleksiContext.js') },
      { label: 'src/context/KoleksiProvider.jsx', isi: isi('src/context/KoleksiProvider.jsx') },
    ],
    penjelasan: [
      <>
        <code>createContext</code> ditaruh di berkas sendiri agar bisa diimpor oleh Provider dan oleh hook <code>useKoleksi</code>.
      </>,
      <>
        Data diambil dari <code>{'`${import.meta.env.BASE_URL}data/koleksi.json`'}</code> hanya bila localStorage masih kosong. Selama
        menunggu, <code>loading</code> bernilai true; bila gagal, pesannya disimpan di <code>error</code>.
      </>,
      <>
        <code>tambah</code> dan <code>hapus</code> mengubah daftar item. Karena daftar disimpan lewat <code>useLocalStorage</code>, perubahan
        ikut tersimpan.
      </>,
    ],
    cek: ['Belum terlihat di layar. Provider dipasang di App.jsx pada langkah 6.'],
  },
  {
    judul: 'Buat hook useKoleksi',
    tujuan: 'Supaya setiap halaman cukup menulis useKoleksi() untuk mendapatkan data dan fungsi tambah/hapus.',
    kode: [{ label: 'src/hooks/useKoleksi.js', isi: isi('src/hooks/useKoleksi.js') }],
    penjelasan: [
      <>
        <code>useContext</code> membaca nilai yang dibagikan Provider. Pesan error membantu bila hook dipakai di luar Provider.
      </>,
    ],
    cek: ['Belum terlihat di layar.'],
  },
  {
    judul: 'Buat Layout: header, nav, main, footer',
    tujuan: 'Kerangka yang tampil di semua halaman, dengan menu navigasi.',
    kode: [
      { label: 'src/components/Layout.jsx', isi: isi('src/components/Layout.jsx') },
      { label: 'src/components/Layout.css', isi: isi('src/components/Layout.css') },
    ],
    penjelasan: [
      <>
        Empat elemen semantik <code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code> wajib ada (butir E1).
      </>,
      <>
        <code>NavLink</code> otomatis diberi kelas <code>active</code> saat alamatnya sedang dibuka. <code>end</code> pada Beranda mencegah
        menu Beranda ikut aktif di semua halaman.
      </>,
      <>
        <code>&lt;Outlet /&gt;</code> adalah tempat isi halaman yang sedang dibuka ditampilkan.
      </>,
      <>
        CSS memakai flex dan grid, ditambah <code>@media</code> untuk layar kecil (butir E2).
      </>,
    ],
    cek: ['Belum terlihat sampai rutenya dipasang di langkah 6.'],
  },
  {
    judul: 'Pasang Provider dan semua rute di App.jsx',
    tujuan: 'Menghubungkan semuanya: Provider membungkus rute, Layout membungkus halaman, dan tujuh alamat terdaftar.',
    kode: [
      { label: 'src/pages/Beranda.jsx (kerangka sementara untuk ketujuh halaman)', isi: KERANGKA },
      { label: 'src/App.jsx', isi: isi('src/App.jsx') },
    ],
    penjelasan: [
      'Buat dulu ketujuh berkas halaman dengan kerangka sementara seperti di atas, supaya import di App.jsx tidak error.',
      <>
        Jangan menambahkan <code>BrowserRouter</code> di sini; Router sudah ada di <code>main.jsx</code> dari starter.
      </>,
      <>
        <code>path="*"</code> menangkap semua alamat yang tidak terdaftar, untuk halaman 404.
      </>,
    ],
    cek: [
      'Jalankan npm run dev: menu navigasi tampil, dan berpindah menu mengganti judul halaman.',
      'Buka alamat sembarang, misalnya /abc: kerangka halaman 404 yang tampil.',
    ],
  },
]

export const LANGKAH_BERANDA = [
  {
    judul: 'Tampilkan judul dan tema',
    tujuan: 'Halaman pertama yang dilihat pengunjung: satu judul utama dan nama temamu.',
    kode: [{ label: 'src/pages/Beranda.jsx', isi: isi('tutorial/beranda/1-judul.jsx') }],
    penjelasan: [
      <>
        Berkas JSON bisa diimpor langsung. <code>mahasiswa.tema</code> diambil dari <code>app/mahasiswa.json</code>.
      </>,
      <>
        Cukup <strong>satu</strong> <code>h1</code> per halaman (butir C2).
      </>,
    ],
    cek: ['Buka http://localhost:5173/: judul dan nama tema tampil.'],
  },
  {
    judul: 'Tambahkan ringkasan dari data',
    tujuan: 'Tampilkan jumlah item dan jumlah kategori, dihitung dari data yang sama dengan halaman koleksi.',
    kode: [{ label: 'src/pages/Beranda.jsx', isi: isi('src/pages/Beranda.jsx'), sebelum: isi('tutorial/beranda/1-judul.jsx') }],
    penjelasan: [
      <>
        <code>new Set(...)</code> membuang nilai yang sama, jadi <code>.size</code> adalah jumlah kategori yang berbeda.
      </>,
      <>
        Selama <code>loading</code>, tampilkan pesan memuat, bukan angka 0.
      </>,
      <>
        <code>Link</code> (bukan <code>&lt;a href&gt;</code>) berpindah halaman tanpa memuat ulang aplikasi.
      </>,
    ],
    cek: ['Angka jumlah item sama dengan jumlah item di koleksi.json.', 'Klik "Lihat semua tugas": pindah ke /koleksi.'],
  },
]

export const LANGKAH_KOLEKSI = [
  {
    judul: 'Tampilkan semua item sebagai daftar',
    tujuan: 'Ambil data dari Context, tangani keadaan memuat dan gagal, lalu tampilkan setiap judul.',
    kode: [{ label: 'src/pages/Koleksi.jsx', isi: isi('tutorial/koleksi/1-daftar.jsx') }],
    penjelasan: [
      <>
        Dua <code>return</code> lebih awal menangani keadaan memuat dan gagal sebelum daftar ditampilkan (rendering bersyarat).
      </>,
      <>
        <code>map</code> membuat satu <code>&lt;li&gt;</code> per item. <code>key</code> wajib unik; pakai <code>id</code>.
      </>,
    ],
    cek: ['Buka /koleksi: semua judul dari koleksi.json tampil.'],
  },
  {
    judul: 'Pindahkan tampilan item ke komponen KartuItem',
    tujuan: 'Setiap item ditampilkan sebagai kartu yang bisa diklik menuju halaman detail.',
    kode: [
      { label: 'src/components/KartuItem.jsx', isi: isi('src/components/KartuItem.jsx') },
      { label: 'src/pages/Koleksi.jsx', isi: isi('tutorial/koleksi/2-kartu.jsx'), sebelum: isi('tutorial/koleksi/1-daftar.jsx') },
    ],
    penjelasan: [
      <>
        Data dikirim lewat props: <code>&lt;KartuItem item={'{item}'} /&gt;</code>, lalu dibongkar dengan destructuring di dalam komponen.
      </>,
      <>
        Tautan <code>{'`/koleksi/${id}`'}</code> membawa id item ke halaman detail.
      </>,
      'Setiap komponen di src/components/ dihitung untuk butir D6 (minimal 5 komponen).',
    ],
    cek: ['Item tampil sebagai kartu dalam grid.', 'Klik judul kartu: alamat berubah menjadi /koleksi/1 dan seterusnya.'],
  },
  {
    judul: 'Tambahkan pencarian berdasarkan judul',
    tujuan: 'Kolom pencarian menyaring kartu yang ditampilkan saat pengguna mengetik.',
    kode: [
      { label: 'src/components/KotakPencarian.jsx', isi: isi('src/components/KotakPencarian.jsx') },
      { label: 'src/pages/Koleksi.jsx', isi: isi('tutorial/koleksi/3-pencarian.jsx'), sebelum: isi('tutorial/koleksi/2-kartu.jsx') },
    ],
    penjelasan: [
      <>
        Input wajib bertipe <code>type="search"</code> (dipakai uji C4).
      </>,
      <>
        State <code>cari</code> ada di halaman Koleksi; KotakPencarian hanya menerima nilai dan fungsi pengubahnya lewat props.
      </>,
      <>
        <code>filter</code> + <code>toLowerCase</code> membuat pencarian tidak membedakan huruf besar dan kecil.
      </>,
    ],
    cek: ['Ketik sebagian judul: hanya kartu yang cocok yang tersisa.', 'Ketik kata yang tidak ada: muncul "Tidak ada item yang cocok."'],
  },
  {
    judul: 'Tambahkan filter kategori',
    tujuan: 'Dropdown untuk menampilkan item dari satu kategori saja.',
    kode: [{ label: 'src/pages/Koleksi.jsx', isi: isi('src/pages/Koleksi.jsx'), sebelum: isi('tutorial/koleksi/3-pencarian.jsx') }],
    penjelasan: [
      <>
        Daftar kategori dibuat dari data: <code>new Set</code> membuang duplikat, lalu ditambah pilihan "Semua".
      </>,
      'Satu filter memeriksa dua syarat sekaligus: judul cocok DAN kategori cocok.',
    ],
    cek: ['Pilih satu kategori: hanya item kategori itu yang tampil.', 'Pencarian dan filter bisa dipakai bersamaan.'],
  },
]

export const LANGKAH_DETAIL = [
  {
    judul: 'Ambil id dari alamat dan cari itemnya',
    tujuan: 'Halaman detail membaca id dari alamat /koleksi/:id lalu mencari item yang cocok.',
    kode: [{ label: 'src/pages/Detail.jsx', isi: isi('tutorial/detail/1-params.jsx') }],
    penjelasan: [
      <>
        <code>useParams()</code> mengembalikan bagian alamat yang ditandai <code>:id</code> di App.jsx, selalu berupa teks.
      </>,
      <>
        <code>String(i.id) === id</code> menyamakan tipe, karena id di data bisa berupa angka.
      </>,
    ],
    cek: [
      'Buka /koleksi/1: judul item pertama tampil.',
      'Buka /koleksi/999: layar kosong dan ada error di Console. Itu sengaja; diperbaiki di langkah 2.',
    ],
  },
  {
    judul: 'Tampilkan semua field dan tangani id yang tidak ada',
    tujuan: 'Lengkapi detail item, termasuk ketiga field tema, dan beri pesan bila id tidak ditemukan.',
    kode: [{ label: 'src/pages/Detail.jsx', isi: isi('tutorial/detail/2-tidak-ditemukan.jsx'), sebelum: isi('tutorial/detail/1-params.jsx') }],
    penjelasan: [
      <>
        Bila <code>item</code> tidak ditemukan, tampilkan "tidak ditemukan" dan tautan kembali. Jangan menulis "404" di sini (butir C6).
      </>,
      <>
        <code>&lt;dl&gt;</code>, <code>&lt;dt&gt;</code>, <code>&lt;dd&gt;</code> adalah daftar label dan nilai. Label ketiga field tema harus
        sesuai kolom <em>Label yang ditampilkan</em> di tabel tema (butir C13). Contoh ini memakai Kategori, Tenggat, dan Prioritas.
      </>,
    ],
    cek: ['Buka /koleksi/999: muncul "Item tidak ditemukan".', 'Buka /koleksi/1: semua field tampil dengan labelnya.'],
  },
  {
    judul: 'Tambahkan tombol Hapus',
    tujuan: 'Pengguna bisa menghapus item, dengan konfirmasi dulu, lalu kembali ke daftar.',
    kode: [{ label: 'src/pages/Detail.jsx', isi: isi('src/pages/Detail.jsx'), sebelum: isi('tutorial/detail/2-tidak-ditemukan.jsx') }],
    penjelasan: [
      <>
        Semua hook (<code>useParams</code>, <code>useNavigate</code>, <code>useKoleksi</code>) dipanggil di bagian paling atas, sebelum{' '}
        <code>return</code> mana pun. Hook tidak boleh dipanggil setelah <code>if</code> yang bisa berhenti lebih awal.
      </>,
      <>
        <code>window.confirm</code> menampilkan dialog OK/Batal. Bila OK, item dihapus lewat <code>hapus</code> dari Context, lalu{' '}
        <code>navigate('/koleksi')</code> (butir C9).
      </>,
    ],
    cek: ['Klik Hapus lalu OK: kembali ke /koleksi dan item itu hilang.', 'Refresh: item tetap terhapus.'],
  },
]

export const LANGKAH_TENTANG = [
  {
    judul: 'Tampilkan identitas dari mahasiswa.json',
    tujuan: 'Halaman Tentang menampilkan nama, NIM, kelas, tema, dan tautan ke repo GitHub-mu.',
    kode: [{ label: 'src/pages/Tentang.jsx', isi: isi('src/pages/Tentang.jsx') }],
    penjelasan: [
      <>
        Identitas diimpor dari <code>mahasiswa.json</code>, bukan diketik ulang, supaya nama dan NIM pasti sama persis (butir C11).
      </>,
      <>
        Ganti <code>USERNAME</code> pada <code>REPO</code> dengan username GitHub-mu.
      </>,
    ],
    cek: ['Buka /tentang: nama, NIM, kelas, dan tema tampil sesuai mahasiswa.json.', 'Klik tautan repo: membuka fork-mu di GitHub.'],
  },
]

export const LANGKAH_404 = [
  {
    judul: 'Buat halaman 404',
    tujuan: 'Ditampilkan untuk alamat yang tidak terdaftar. Rutenya (path="*") sudah dipasang di Fondasi langkah 6.',
    kode: [{ label: 'src/pages/TidakDitemukan.jsx', isi: isi('src/pages/TidakDitemukan.jsx') }],
    penjelasan: [
      <>
        Halaman ini wajib memuat teks <strong>404</strong> (butir C12) dan tautan kembali ke Beranda.
      </>,
      'Halaman ini tetap memakai Layout, jadi menu navigasi tetap tampil.',
    ],
    cek: ['Buka /abc: tampil 404 beserta menu navigasi.', 'Klik "Kembali ke beranda": pindah ke /.'],
  },
]
