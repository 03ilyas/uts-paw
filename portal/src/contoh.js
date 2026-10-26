// Berkas contoh dibaca langsung dari shared/contoh/, folder yang sama dengan yang
// diuji grader, sehingga kode di portal selalu kode yang lulus uji.
const BERKAS = import.meta.glob('../../shared/contoh/**/*.{js,jsx,css,json}', { query: '?raw', import: 'default', eager: true })

export const isi = (path) => BERKAS[`../../shared/contoh/${path}`]
