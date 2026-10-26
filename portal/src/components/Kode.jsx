import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'

// sorot: nomor baris (mulai 1) yang diberi latar emas, dipakai tutorial untuk
// menandai baris yang baru ditambahkan pada sebuah langkah.
export default function Kode({ children, label, sorot = [] }) {
  const [tersalin, setTersalin] = useState(false)
  const teks = String(children).trim()
  const disorot = new Set(sorot)

  const salin = async () => {
    await navigator.clipboard.writeText(teks)
    setTersalin(true)
    setTimeout(() => setTersalin(false), 1500)
  }

  return (
    <div className="kode">
      {label && <div className="kode-label">{label}</div>}
      <pre>
        <code>
          {disorot.size
            ? teks.split('\n').map((baris, i) => (
                <span key={i} className={disorot.has(i + 1) ? 'baris sorot' : 'baris'}>
                  {baris}
                  {'\n'}
                </span>
              ))
            : teks}
        </code>
      </pre>
      <Tooltip title={tersalin ? 'Tersalin' : 'Salin'}>
        <Button className="salin" type="text" size="small" aria-label="Salin kode" icon={tersalin ? <CheckOutlined /> : <CopyOutlined />} onClick={salin} />
      </Tooltip>
    </div>
  )
}
