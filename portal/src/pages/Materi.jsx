import { Button, Space } from 'antd'
import { FilePdfOutlined, ExperimentOutlined } from '@ant-design/icons'
import KepalaHalaman from '../components/KepalaHalaman.jsx'
import UTS from '../uts.js'

const RUJUKAN = [
  { judul: 'Dokumentasi React', url: 'https://react.dev/learn' },
  { judul: 'React Router', url: 'https://reactrouter.com/home' },
  { judul: 'Vite', url: 'https://vite.dev/guide/' },
  { judul: 'Vitest', url: 'https://vitest.dev/guide/' },
  { judul: 'Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/' },
  { judul: 'MDN Web Docs', url: 'https://developer.mozilla.org/id/' },
]

function butirUntuk(kode) {
  const nomor = Number(kode.slice(1))
  return UTS.rubrik
    .filter((k) => {
      const [awal, akhir = awal] = k.materi.replace(/P/g, '').split('-').map(Number)
      return nomor >= awal && nomor <= akhir
    })
    .map((k) => k.kode)
}

export default function Materi() {
  return (
    <>
      <KepalaHalaman kicker="Materi" judul="Materi pertemuan 1 sampai 7">
        Seluruh materi yang diujikan. Slide dan modul praktikum dapat dibuka dengan akun Google ITERA.
      </KepalaHalaman>

      <div className="daftar-materi">
        {UTS.materi.map((m) => (
          <article key={m.kode} className="materi">
            <span className="materi-kode">{m.kode}</span>
            <div>
              <h3>{m.judul}</h3>
              <p>
                {m.ringkas} Dinilai pada kelompok rubrik {butirUntuk(m.kode).join(', ')}.
              </p>
            </div>
            <Space wrap>
              <Button href={m.slide} target="_blank" icon={<FilePdfOutlined />}>
                Slide
              </Button>
              {m.praktikum && (
                <Button href={m.praktikum} target="_blank" icon={<ExperimentOutlined />}>
                  Praktikum
                </Button>
              )}
            </Space>
          </article>
        ))}
      </div>

      <section className="prosa" style={{ marginTop: 48 }}>
        <h2>Rujukan resmi</h2>
        <ul>
          {RUJUKAN.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.judul}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
