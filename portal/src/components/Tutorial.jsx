import { Alert, Card } from 'antd'
import Kode from './Kode.jsx'

// Baris yang isinya belum ada di langkah sebelumnya dianggap baru.
function barisBaru(sebelum, sesudah) {
  if (!sebelum) return []
  const lama = new Set(sebelum.split('\n').map((b) => b.trim()))
  return sesudah
    .trim()
    .split('\n')
    .flatMap((b, i) => (b.trim() && !lama.has(b.trim()) ? [i + 1] : []))
}

export default function Tutorial({ pengantar, hasil, judulHasil = 'Tampilan jadinya', langkah, penutup }) {
  return (
    <div className="tutorial">
      {pengantar && <div className="tutorial-pengantar">{pengantar}</div>}

      {hasil && (
        <Card title={judulHasil} variant="outlined" className="kartu-hasil">
          {hasil}
        </Card>
      )}

      {langkah.map((l, i) => (
        <section key={l.judul} className="langkah-tutorial">
          <span className="kicker">
            Langkah {i + 1} dari {langkah.length}
          </span>
          <h2 id={`langkah-${i + 1}`}>{l.judul}</h2>
          <p>{l.tujuan}</p>
          {l.kode.map((k) => (
            <Kode key={k.label} label={k.label} sorot={k.sorotOtomatis === false ? [] : barisBaru(k.sebelum, k.isi)}>
              {k.isi}
            </Kode>
          ))}
          {l.penjelasan && (
            <ul className="penjelasan">
              {l.penjelasan.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          )}
          {l.tambahan}
          <Alert
            className="kotak-cek"
            type="success"
            showIcon
            title="Cek hasilnya sebelum lanjut"
            description={
              <ol className="cek-langkah">
                {l.cek.map((c, j) => (
                  <li key={j}>{c}</li>
                ))}
              </ol>
            }
          />
        </section>
      ))}

      {penutup}
    </div>
  )
}
