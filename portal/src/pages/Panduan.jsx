import { Alert, Collapse, Steps } from 'antd'
import KepalaHalaman from '../components/KepalaHalaman.jsx'
import Kode from '../components/Kode.jsx'
import UTS, { URL_REPO } from '../uts.js'

const LANGKAH = [
  {
    title: 'Fork repo induk',
    content: (
      <>
        <p>
          Buka <a href={URL_REPO}>{URL_REPO}</a>, klik <strong>Fork</strong>. Biarkan nama repo tetap{' '}
          <code>uts-paw</code>, centang <em>Copy the main branch only</em>, lalu klik <strong>Create fork</strong>.
        </p>
        <p>Repo hasil fork harus publik agar GitHub Pages gratis dapat dipakai dan dosen dapat menilainya.</p>
      </>
    ),
  },
  {
    title: 'Aktifkan GitHub Actions',
    content: (
      <p>
        Di repo fork kamu, buka tab <strong>Actions</strong> lalu klik{' '}
        <strong>I understand my workflows, go ahead and enable them</strong>. Secara bawaan GitHub mematikan
        workflow pada repo hasil fork, sehingga tanpa langkah ini deploy tidak akan berjalan.
      </p>
    ),
  },
  {
    title: 'Atur sumber GitHub Pages',
    content: (
      <p>
        Buka <strong>Settings → Pages</strong>. Pada <em>Build and deployment</em>, ubah <strong>Source</strong> menjadi{' '}
        <strong>GitHub Actions</strong>. Tidak perlu memilih branch dan tidak perlu mengisi custom domain.
      </p>
    ),
  },
  {
    title: 'Clone dan jalankan di komputer',
    content: (
      <>
        <p>Pastikan Node.js 20 atau lebih baru dan Git sudah terpasang. Ganti <code>USERNAME</code> dengan username GitHub kamu.</p>
        <Kode label="Terminal">{`git clone https://github.com/USERNAME/uts-paw.git
cd uts-paw/app
npm install
npm run dev`}</Kode>
        <p>Buka alamat yang muncul di terminal, biasanya <code>http://localhost:5173</code>. Semua pekerjaan dilakukan di folder <code>app/</code>.</p>
      </>
    ),
  },
  {
    title: 'Isi identitas dan data',
    content: (
      <p>
        Isi <code>app/mahasiswa.json</code> (nama, NIM 9 digit, kelas RA atau RB, nama tema) dan ganti contoh di{' '}
        <code>app/public/data/koleksi.json</code> dengan minimal {UTS.minimalItem} item sesuai tema. Nama tema dan field
        dapat dicek di halaman Beranda.
      </p>
    ),
  },
  {
    title: 'Kerjakan dan cek mandiri',
    content: (
      <>
        <p>Kerjakan soal, lalu jalankan pemeriksa yang sama dengan yang dipakai dosen:</p>
        <Kode label="Terminal, di folder app/">{`npm run lint     # oxlint
npm test         # test buatan sendiri
npm run cek      # perkiraan skor seluruh rubrik`}</Kode>
        <p>
          <code>npm run cek</code> menampilkan setiap butir rubrik beserta alasan bila belum lulus. Butir A2 dan A3 baru
          lulus setelah aplikasimu ter-deploy.
        </p>
      </>
    ),
  },
  {
    title: 'Commit dan push',
    content: (
      <>
        <Kode label="Terminal">{`git add .
git commit -m "feat: halaman koleksi dan pencarian"
git push`}</Kode>
        <p>
          Commit sedikit demi sedikit dengan pesan yang jelas. Setiap push menjalankan workflow <strong>UTS</strong> di
          tab Actions: <em>build</em>, <em>deploy</em>, lalu <em>cek</em>. Buka run tersebut dan lihat bagian{' '}
          <strong>Summary</strong> untuk tabel skor.
        </p>
      </>
    ),
  },
  {
    title: 'Verifikasi deployment',
    content: (
      <p>
        Buka <code>https://USERNAME.github.io/uts-paw/</code>. Coba pindah halaman lalu tekan refresh di{' '}
        <code>/koleksi</code>; halaman harus tetap tampil. Tulis URL ini di README, lalu pastikan namamu muncul di halaman
        Pengumpulan.
      </p>
    ),
  },
]

const MASALAH = [
  {
    key: 'blank',
    label: 'Halaman deploy kosong atau berkas JS/CSS 404',
    children: (
      <p>
        Jangan mengubah <code>base</code> di <code>vite.config.js</code>; nilainya diisi otomatis oleh workflow. Untuk
        berkas di folder <code>public/</code>, selalu awali dengan <code>import.meta.env.BASE_URL</code>, misalnya{' '}
        <code>{'fetch(`${import.meta.env.BASE_URL}data/koleksi.json`)'}</code>, bukan <code>fetch('/data/koleksi.json')</code>.
      </p>
    ),
  },
  {
    key: 'refresh',
    label: 'Refresh di /koleksi menampilkan 404 GitHub',
    children: (
      <p>
        Workflow menyalin <code>index.html</code> menjadi <code>404.html</code> agar React Router bisa menangani semua
        rute. Pastikan Source di Settings → Pages adalah GitHub Actions, bukan <em>Deploy from a branch</em>.
      </p>
    ),
  },
  {
    key: 'actions',
    label: 'Tidak ada workflow yang berjalan setelah push',
    children: <p>Actions belum diaktifkan di fork. Ulangi langkah 2, lalu push ulang atau klik Run workflow pada workflow UTS.</p>,
  },
  {
    key: 'pages',
    label: 'Job deploy gagal dengan pesan "Get Pages site failed" atau "Not Found"',
    children: <p>Source GitHub Pages belum diatur ke GitHub Actions. Ulangi langkah 3, lalu buka run yang gagal dan klik Re-run jobs.</p>,
  },
  {
    key: 'router',
    label: 'Error "You cannot render a <Router> inside another <Router>"',
    children: (
      <p>
        Kamu menambahkan <code>BrowserRouter</code> di <code>App.jsx</code>. Router cukup ada di <code>main.jsx</code>;
        hapus yang di App.
      </p>
    ),
  },
  {
    key: 'sync',
    label: 'Repo induk diperbarui, bagaimana mengambil perubahannya?',
    children: (
      <p>
        Di halaman repo fork, klik <strong>Sync fork → Update branch</strong>, lalu jalankan <code>git pull</code> di
        komputer. Perubahan repo induk hanya menyentuh workflow, grader, dan portal, sehingga tidak bentrok dengan
        folder <code>app/</code> milikmu.
      </p>
    ),
  },
  {
    key: 'privat',
    label: 'Bolehkah repo dibuat privat?',
    children: <p>Tidak. Fork dari repo publik selalu publik, dan dosen membutuhkan akses baca untuk menilai.</p>,
  },
]

export default function Panduan() {
  return (
    <>
      <KepalaHalaman kicker="Panduan" judul="Fork, kerjakan, dan deploy ke GitHub Pages">
        Delapan langkah dari fork sampai aplikasimu tayang. Langkah 1 sampai 3 cukup dilakukan sekali di awal.
      </KepalaHalaman>

      <Alert
        type="info"
        showIcon
        title="Satu repo untuk dua tujuan"
        description={
          <>
            Repo induk menayangkan portal ini di {UTS.domain}. Ketika di-fork, workflow yang sama otomatis membangun
            folder <code>app/</code> milikmu dan menayangkannya di <code>USERNAME.github.io/uts-paw</code>. Kamu tidak
            perlu mengubah konfigurasi apa pun.
          </>
        }
        style={{ marginBottom: 32, maxWidth: 760 }}
      />

      <div className="prosa" style={{ maxWidth: 820 }}>
        <Steps
          orientation="vertical"
          current={-1}
          items={LANGKAH.map((l) => ({ title: l.title, content: <div className="langkah-isi">{l.content}</div>, status: 'process' }))}
        />

        <h2>Kendala yang sering terjadi</h2>
        <Collapse items={MASALAH} />
      </div>
    </>
  )
}
