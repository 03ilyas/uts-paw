import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App as AntApp, ConfigProvider } from 'antd'
import idID from 'antd/locale/id_ID'
import './index.css'
import App from './App.jsx'

// Palet mengikuti ITERA Slides: emas untuk aksen, tinta gelap untuk teks,
// kanvas krem untuk latar. Emas tua (#7A5F10) dipakai sebagai warna primer
// karena kontrasnya cukup untuk teks dan tombol di atas latar terang.
const tema = {
  token: {
    colorPrimary: '#7A5F10',
    colorLink: '#7A5F10',
    colorText: '#1A1710',
    colorTextSecondary: '#5C564A',
    colorBorder: '#D9D1BB',
    colorBorderSecondary: '#E8E1CD',
    colorBgLayout: '#FAF7F0',
    colorSuccess: '#2F6B1C',
    colorError: '#B42318',
    borderRadius: 8,
    fontFamily: "'Open Sans', system-ui, sans-serif",
    fontSize: 15,
  },
  components: {
    Layout: { headerBg: '#14120D', footerBg: '#14120D', headerPadding: '0 24px', headerHeight: 64 },
    Menu: { darkItemBg: '#14120D', darkItemSelectedBg: 'transparent', darkItemSelectedColor: '#E6CF85', darkItemColor: '#CFC8B6', darkItemHoverColor: '#FFFFFF' },
    Table: { headerBg: '#F1EDE1' },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={tema} locale={idID}>
      <AntApp>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
)
