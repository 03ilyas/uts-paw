# Jurnal Latihan Olahraga

- **Nama**: Ilyas Ramadhan
- **NIM**: 123140016
- **Kelas**: RB
- **Tema**: Jurnal Latihan Olahraga
- **Deployment**: https://03ilyas.github.io/uts-paw/

![Tangkapan layar beranda](./docs/beranda.png)

## Fitur

- **Koleksi Data**: Menampilkan daftar sesi latihan olahraga yang dimuat menggunakan fetch API.
- **Pencarian & Penyaringan**: Kolom pencarian berdasarkan judul dan filter kategori latihan.
- **Detail Item**: Halaman detail yang menampilkan data lengkap (Tanggal, Durasi, Kalori Terbakar) beserta tombol hapus.
- **Tambah Item**: Formulir penambahan aktivitas latihan baru dengan validasi input.
- **Statistik**: Tabel rekapitulasi jumlah sesi per kategori olahraga beserta totalnya.
- **Tentang**: Informasi identitas pembuat aplikasi dan repositori tugas.
- **Halaman 404**: Penanganan rute yang tidak dikenal.
- **Penyimpanan Lokal**: Sinkronisasi data dinamis secara otomatis menggunakan localStorage.

## Menjalankan secara lokal

```bash
cd app
npm install
npm run dev