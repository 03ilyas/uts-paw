import { Table } from 'antd'
import { isi } from '../contoh.js'

const LOKASI = 'src/pages/Statistik.jsx'
const l = (n) => isi(`tutorial/tabel/${n}`)

const RUTE = `import Statistik from './pages/Statistik.jsx'

// di dalam <Routes> pada App.jsx:
<Route path="/statistik" element={<Statistik />} />`

const ELEMEN = [
  { tag: '<table>', arti: 'Pembungkus seluruh tabel.' },
  { tag: '<thead>', arti: 'Bagian kepala tabel, berisi judul kolom.' },
  { tag: '<tbody>', arti: 'Bagian isi, berisi baris data.' },
  { tag: '<tfoot>', arti: 'Bagian kaki, misalnya baris total (dipakai di langkah 5).' },
  { tag: '<tr>', arti: 'Satu baris (table row).' },
  { tag: '<th>', arti: 'Sel judul (table header), teksnya tebal.' },
  { tag: '<td>', arti: 'Sel data biasa (table data).' },
]

const JEJAK = [
  { putaran: 'Awal', kategori: '-', hasil: '{}' },
  { putaran: '1', kategori: 'Kuliah', hasil: '{ Kuliah: 1 }' },
  { putaran: '2', kategori: 'Kuliah', hasil: '{ Kuliah: 2 }' },
  { putaran: '3', kategori: 'Organisasi', hasil: '{ Kuliah: 2, Organisasi: 1 }' },
]

const tabelKecil = (kolom, data) => (
  <Table size="small" pagination={false} rowKey={(r) => Object.values(r)[0]} columns={kolom} dataSource={data} style={{ margin: '12px 0 20px', maxWidth: 640 }} />
)

export const LANGKAH_STATISTIK = [
  {
    judul: 'Buat halaman kosong dan pastikan rutenya terdaftar',
    tujuan: 'Pastikan alamat /statistik sudah menampilkan halamanmu.',
    kode: [
      { label: LOKASI, isi: l('1-kerangka.jsx') },
      { label: 'src/App.jsx (sudah ada bila mengikuti Fondasi langkah 6; pastikan dua baris ini ada)', isi: RUTE, sorotOtomatis: false },
    ],
    cek: ['Buka http://localhost:5173/statistik.', 'Tulisan "Statistik" tampil.'],
  },
  {
    judul: 'Tulis tabel HTML dengan angka tetap',
    tujuan: 'Kenali struktur tabel dulu dengan isi yang diketik langsung. Angkanya belum dihitung dari data.',
    kode: [{ label: LOKASI, isi: l('2-tabel-statis.jsx'), sebelum: l('1-kerangka.jsx') }],
    tambahan: tabelKecil(
      [
        { title: 'Elemen', dataIndex: 'tag', width: 120, render: (v) => <code>{v}</code> },
        { title: 'Artinya', dataIndex: 'arti' },
      ],
      ELEMEN,
    ),
    cek: ['Tabel dengan dua baris (Kuliah 2, Organisasi 1) tampil.', 'Belum ada garis dan warna; itu dirapikan di langkah 5.'],
  },
  {
    judul: 'Hitung jumlah item per kategori',
    tujuan: 'Ubah daftar item menjadi satu objek berisi jumlah per kategori, lalu tampilkan sementara agar terlihat hasilnya.',
    kode: [{ label: LOKASI, isi: l('3-hitung.jsx'), sebelum: l('2-tabel-statis.jsx') }],
    penjelasan: [
      <>
        <code>items</code> diambil dari <code>useKoleksi()</code>, yaitu data yang sama dengan halaman koleksi.
      </>,
      <>
        <code>reduce</code> berjalan satu putaran per item. <code>hitung</code> adalah hasil sementara, dimulai dari objek kosong{' '}
        <code>{'{}'}</code> (argumen terakhir).
      </>,
      <>
        <code>hitung[kategori] ?? 0</code> bernilai 0 bila kategori itu belum pernah muncul, lalu ditambah 1.
      </>,
      <>
        <code>&lt;pre&gt;</code> dengan <code>JSON.stringify</code> hanya untuk melihat hasilnya; diganti tabel di langkah 4.
      </>,
    ],
    tambahan: (
      <>
        <p>Contoh jalannya untuk tiga item (Kuliah, Kuliah, Organisasi):</p>
        {tabelKecil(
          [
            { title: 'Putaran', dataIndex: 'putaran', width: 90 },
            { title: 'Kategori item', dataIndex: 'kategori', width: 140 },
            { title: 'Isi hitung sesudahnya', dataIndex: 'hasil', render: (v) => <code>{v}</code> },
          ],
          JEJAK,
        )}
      </>
    ),
    cek: ['Halaman menampilkan objek seperti {"Kuliah": 2, "Organisasi": 1}, sesuai datamu.', 'Jumlah semua angka sama dengan jumlah item di halaman koleksi.'],
  },
  {
    judul: 'Buat baris tabel dari hasil hitungan',
    tujuan: 'Ganti angka yang diketik manual di langkah 2 dengan baris yang dibuat otomatis dari objek hitungan.',
    kode: [{ label: LOKASI, isi: l('4-baris-dinamis.jsx'), sebelum: l('3-hitung.jsx') }],
    penjelasan: [
      <>
        <code>Object.entries(perKategori)</code> mengubah <code>{'{ Kuliah: 2, Organisasi: 1 }'}</code> menjadi{' '}
        <code>{'[["Kuliah", 2], ["Organisasi", 1]]'}</code>.
      </>,
      <>
        <code>map</code> membuat satu <code>&lt;tr&gt;</code> untuk setiap pasangan. <code>key={'{kategori}'}</code> wajib dan harus unik; nama
        kategori sudah pasti unik.
      </>,
      <>
        <code>([kategori, jumlah])</code> adalah destructuring: mengambil isi pertama dan kedua dari setiap pasangan.
      </>,
    ],
    cek: ['Tabel menampilkan semua kategori dari datamu, bukan lagi angka ketikan.', 'Tambah item dengan kategori baru lewat /tambah: baris baru muncul di /statistik.'],
  },
  {
    judul: 'Tambah baris total dan rapikan dengan CSS',
    tujuan: 'Lengkapi tabel dengan total, lalu beri garis, warna selang-seling, dan dukungan layar kecil.',
    kode: [
      { label: LOKASI, isi: isi('src/pages/Statistik.jsx'), sebelum: l('4-baris-dinamis.jsx') },
      { label: 'src/pages/Statistik.css', isi: isi('src/pages/Statistik.css'), sorotOtomatis: false },
    ],
    penjelasan: [
      <>
        <code>&lt;tfoot&gt;</code> berisi baris total; jumlah semua item cukup <code>items.length</code>.
      </>,
      <>
        <code>border-collapse: collapse</code> menyatukan garis antarsel. <code>nth-child(even)</code> mewarnai baris genap.
      </>,
      <>
        Pembungkus <code>.tabel-gulir</code> dengan <code>overflow-x: auto</code> membuat tabel bisa digeser di layar sempit, tidak merusak
        tata letak.
      </>,
    ],
    cek: ['Tabel bergaris, baris genap berwarna, angka rata kanan, dan baris Total tebal.', 'Perkecil jendela browser: tabel tetap rapi atau bisa digeser.'],
  },
]

