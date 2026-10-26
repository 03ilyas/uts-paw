import mahasiswa from '../../mahasiswa.json'

export default function Tentang() {
  const { nama, nim, kelas, tema } = mahasiswa
  return (
    <section>
      <h1>Tentang</h1>
      <p>
        Dibuat oleh {nama} ({nim}), kelas {kelas}, tema {tema}.
      </p>
    </section>
  )
}
