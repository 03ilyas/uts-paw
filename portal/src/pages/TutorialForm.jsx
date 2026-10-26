import { Alert } from 'antd'
import Tutorial from '../components/Tutorial.jsx'
import Kode from '../components/Kode.jsx'
import { DemoForm } from '../components/Demo.jsx'
import { isi } from '../contoh.js'

const LOKASI = 'src/pages/Tambah.jsx'
const l = (n) => isi(`tutorial/form/${n}`)

const RUTE = `import Tambah from './pages/Tambah.jsx'

// di dalam <Routes> pada App.jsx:
<Route path="/tambah" element={<Tambah />} />`

const LANGKAH = [
  {
    judul: 'Buat halaman kosong dan daftarkan rutenya',
    tujuan: 'Pastikan alamat /tambah sudah menampilkan halamanmu sebelum mulai membuat form.',
    kode: [
      { label: LOKASI, isi: l('1-kerangka.jsx') },
      { label: 'src/App.jsx (tambahkan dua baris ini)', isi: RUTE, sorotOtomatis: false },
    ],
    penjelasan: ['Satu berkas = satu komponen halaman. Nama fungsi diawali huruf besar (Tambah), sama dengan nama berkasnya.'],
    cek: ['Jalankan npm run dev, buka http://localhost:5173/tambah.', 'Tulisan "Tambah Tugas" tampil.'],
  },
  {
    judul: 'Tulis form dengan HTML biasa',
    tujuan: 'Susun elemen form-nya dulu, belum ada React apa pun selain JSX.',
    kode: [{ label: LOKASI, isi: l('2-form-statis.jsx'), sebelum: l('1-kerangka.jsx') }],
    penjelasan: [
      <>
        <code>htmlFor</code> pada label harus sama persis dengan <code>id</code> pada input. Itu yang menghubungkan label dengan kotaknya,
        dan uji dosen mencari kotak Judul lewat label bertuliskan <strong>Judul</strong>.
      </>,
      <>
        Di JSX ditulis <code>htmlFor</code>, bukan <code>for</code>, karena <code>for</code> adalah kata kunci JavaScript.
      </>,
      <>
        Atribut <code>name</code> belum dipakai sekarang; di langkah 3 ia menjadi nama field di state.
      </>,
    ],
    cek: [
      'Klik tulisan "Judul": kursor pindah ke kotak input di bawahnya.',
      'Klik Simpan: halaman berkedip/refresh. Itu normal, diperbaiki di langkah 4.',
    ],
  },
  {
    judul: 'Jadikan form terkontrol dengan useState',
    tujuan: 'Simpan isi setiap kotak di state React, sehingga data form selalu bisa dibaca dari variabel form.',
    kode: [{ label: LOKASI, isi: l('3-terkontrol.jsx'), sebelum: l('2-form-statis.jsx') }],
    penjelasan: [
      <>
        Semua field disimpan dalam <strong>satu objek</strong> <code>form</code>. Nilai awalnya ada di konstanta <code>AWAL</code>.
      </>,
      <>
        <code>value</code> mengambil isi dari state, <code>onChange</code> memperbarui state. Tanpa <code>onChange</code>, kotaknya tidak bisa
        diketik.
      </>,
      <>
        <code>[e.target.name]</code> memakai atribut <code>name</code> sebagai nama field, jadi satu fungsi <code>ubah</code> cukup untuk semua
        input. <code>...form</code> menyalin field lain agar tidak hilang.
      </>,
      'Baris "Isi state saat ini" hanya alat bantu melihat state. Hapus di langkah berikutnya.',
    ],
    cek: ['Ketik di kotak Judul: teks "Isi state saat ini" ikut berubah setiap huruf.', 'Ganti Kategori: nilai kategori di teks itu ikut berubah.'],
  },
  {
    judul: 'Tangani tombol Simpan',
    tujuan: 'Cegah halaman refresh saat form dikirim, dan pastikan data form sampai ke fungsi simpan.',
    kode: [{ label: LOKASI, isi: l('4-submit.jsx'), sebelum: l('3-terkontrol.jsx') }],
    penjelasan: [
      <>
        <code>onSubmit</code> dipasang di <code>&lt;form&gt;</code>, bukan <code>onClick</code> di tombol, agar menekan Enter juga
        menyimpan.
      </>,
      <>
        <code>e.preventDefault()</code> mencegah browser me-refresh halaman. <code>noValidate</code> mematikan popup validasi bawaan browser
        karena kita menulis validasi sendiri di langkah 5.
      </>,
    ],
    cek: ['Tekan F12, buka tab Console.', 'Klik Simpan: muncul "Data yang akan disimpan: {...}" dan halaman tidak refresh.'],
  },
  {
    judul: 'Tambahkan validasi dan pesan error',
    tujuan: 'Tolak judul kosong atau terlalu pendek dan beri tahu pengguna alasannya.',
    kode: [{ label: LOKASI, isi: l('5-validasi.jsx'), sebelum: l('4-submit.jsx') }],
    penjelasan: [
      <>
        State <code>galat</code> menyimpan pesan error. <code>{'{galat && <p ...>}'}</code> artinya pesan hanya tampil bila
        <code> galat</code> tidak kosong.
      </>,
      <>
        <code>role="alert"</code> wajib: pembaca layar membacakannya, dan uji dosen mencari pesan error lewat atribut ini.
      </>,
      <>
        <code>return</code> di dalam <code>if</code> menghentikan fungsi, jadi data tidak disimpan saat judul salah.
      </>,
    ],
    cek: ['Klik Simpan dengan Judul kosong: muncul pesan "Judul wajib diisi, minimal 3 karakter."', 'Ketik minimal 3 huruf lalu Simpan: pesan hilang dan data muncul di Console.'],
  },
  {
    judul: 'Simpan ke Context, pindah halaman, dan rapikan tampilan',
    tujuan: 'Langkah terakhir: data benar-benar disimpan, pengguna diarahkan ke /koleksi, field tema ditambahkan, dan form diberi CSS.',
    kode: [
      { label: LOKASI, isi: isi('src/pages/Tambah.jsx'), sebelum: l('5-validasi.jsx') },
      { label: 'src/pages/Tambah.css', isi: isi('src/pages/Tambah.css'), sorotOtomatis: false },
    ],
    penjelasan: [
      <>
        <code>tambah</code> dari <code>useKoleksi()</code> menambah item ke Context; Provider yang menyimpannya ke localStorage. Lihat tab{' '}
        <strong>Semua contoh kode</strong> bagian 3 dan 4 bila Provider-mu belum ada.
      </>,
      <>
        <code>navigate('/koleksi')</code> dari <code>useNavigate</code> memindahkan pengguna setelah data tersimpan.
      </>,
      <>
        Field tema ditambahkan dengan pola yang sama: <code>label htmlFor</code> + input dengan <code>id</code>, <code>name</code>,{' '}
        <code>value</code>, <code>onChange</code>, ditambah nilai awalnya di <code>AWAL</code>. Contoh ini memakai tenggat dan prioritas;
        ganti dengan tiga field temamu.
      </>,
      <>
        CSS memakai <code>display: flex</code> dengan <code>flex-direction: column</code> agar label dan input bersusun ke bawah, plus satu{' '}
        <code>@media</code> untuk layar kecil (butir rubrik E2).
      </>,
    ],
    cek: [
      'Isi Judul lalu Simpan: kamu pindah ke /koleksi dan item baru ada di daftar.',
      'Refresh halaman: item baru tetap ada (tersimpan di localStorage).',
      'Perkecil jendela browser: tombol Simpan melebar penuh.',
    ],
  },
]

export default function TutorialForm() {
  return (
    <Tutorial
      pengantar={
        <p>
          Kita membangun halaman <code>/tambah</code> dalam enam langkah kecil. Setiap langkah bisa dijalankan dan dicek di browser sebelum
          lanjut. Baris yang <span className="tanda-sorot">disorot emas</span> adalah baris yang baru ditambahkan di langkah itu. Contoh memakai
          tema Daftar Tugas; field-nya kamu ganti dengan field temamu.
        </p>
      }
      hasil={<DemoForm />}
      langkah={LANGKAH}
      penutup={
        <Alert
          type="info"
          showIcon
          title="Terakhir: cek dengan pemeriksa"
          description={
            <>
              Jalankan perintah ini di folder <code>app/</code>. Butir <strong>C7</strong> (validasi) dan <strong>C8</strong> (simpan) harus
              LULUS.
              <Kode label="Terminal, di folder app/">npm run cek</Kode>
            </>
          }
        />
      }
    />
  )
}
