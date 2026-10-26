import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { CheckOutlined, CopyOutlined } from '@ant-design/icons'

export default function Kode({ children, label }) {
  const [tersalin, setTersalin] = useState(false)
  const teks = String(children).trim()

  const salin = async () => {
    await navigator.clipboard.writeText(teks)
    setTersalin(true)
    setTimeout(() => setTersalin(false), 1500)
  }

  return (
    <div className="kode">
      {label && <div className="kode-label">{label}</div>}
      <pre>
        <code>{teks}</code>
      </pre>
      <Tooltip title={tersalin ? 'Tersalin' : 'Salin'}>
        <Button className="salin" type="text" size="small" aria-label="Salin kode" icon={tersalin ? <CheckOutlined /> : <CopyOutlined />} onClick={salin} />
      </Tooltip>
    </div>
  )
}
