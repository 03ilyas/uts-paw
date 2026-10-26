// @vitest-environment jsdom
// Uji otomatis dosen. Berkas ini disalin ke app/src/__rubrik__/ saat penilaian
// dan selalu memakai versi dari repo induk, jadi mengubahnya di fork tidak berpengaruh.
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import App from '../App.jsx'
import koleksi from '../../public/data/koleksi.json'
import mahasiswa from '../../mahasiswa.json'
import TEMA from './tema.json'

const TUNGGU = { timeout: 3000 }
const JUDUL_BARU = 'Item Uji Otomatis 7319'

const escape = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Label field tema sesuai digit terakhir NIM. "Harga Tiket (Rp)" cukup ditulis "Harga Tiket",
// dan "Kabupaten/Kota" boleh ditulis salah satunya.
const tema = TEMA.find((t) => String(t.digit) === String(mahasiswa.nim ?? '').trim().slice(-1))
const polaLabel = (label) => new RegExp(label.split('(')[0].trim().split('/').map((b) => escape(b.trim())).join('|'), 'i')
const teks = (s) => new RegExp(escape(s), 'i')

// Item yang judulnya tidak menjadi bagian dari judul item lain, supaya
// pencarian teks tidak salah cocok.
function itemUnik(kecuali) {
  return koleksi.find(
    (item) =>
      item.id !== kecuali?.id &&
      !koleksi.some((lain) => lain !== item && lain.judul.toLowerCase().includes(item.judul.toLowerCase())),
  )
}

// Validasi bawaan browser (atribut required) menahan submit di jsdom sehingga
// onSubmit tidak terpanggil. Dimatikan agar yang diuji adalah validasi buatan sendiri.
function matikanValidasiBawaan() {
  document.querySelectorAll('form').forEach((form) => {
    form.noValidate = true
  })
}

function buka(path) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  return user
}

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) =>
      String(url).includes('koleksi.json')
        ? new Response(JSON.stringify(koleksi), { status: 200, headers: { 'Content-Type': 'application/json' } })
        : new Response('Not found', { status: 404 }),
    ),
  )
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    })
  }
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('rubrik', () => {
  test('C2 beranda menampilkan h1', async () => {
    buka('/')
    expect((await screen.findAllByRole('heading', { level: 1 }, TUNGGU)).length).toBeGreaterThan(0)
  })

  test('C3 koleksi menampilkan semua item dari fetch', async () => {
    buka('/koleksi')
    for (const item of koleksi) {
      expect((await screen.findAllByText(teks(item.judul), {}, TUNGGU)).length).toBeGreaterThan(0)
    }
    expect(fetch).toHaveBeenCalled()
  })

  test('C4 pencarian menyaring daftar', async () => {
    const target = itemUnik()
    const lain = itemUnik(target)
    const user = buka('/koleksi')
    await screen.findAllByText(teks(lain.judul), {}, TUNGGU)
    await user.type(screen.getByRole('searchbox'), target.judul)
    await waitFor(() => {
      expect(screen.queryAllByText(teks(lain.judul))).toHaveLength(0)
      expect(screen.getAllByText(teks(target.judul)).length).toBeGreaterThan(0)
    }, TUNGGU)
  })

  test('C5 detail menampilkan item', async () => {
    const target = itemUnik()
    buka(`/koleksi/${target.id}`)
    expect((await screen.findAllByText(teks(target.judul), {}, TUNGGU)).length).toBeGreaterThan(0)
  })

  test('C6 id tidak ada menampilkan pesan tidak ditemukan', async () => {
    buka('/koleksi/id-yang-tidak-pernah-ada')
    expect((await screen.findAllByText(/tidak ditemukan/i, {}, TUNGGU)).length).toBeGreaterThan(0)
    expect(screen.queryAllByText(/\b404\b/)).toHaveLength(0)
  })

  test('C7 form menolak judul kosong', async () => {
    const user = buka('/tambah')
    const simpan = await screen.findByRole('button', { name: /simpan/i }, TUNGGU)
    matikanValidasiBawaan()
    await user.click(simpan)
    expect((await screen.findAllByRole('alert', {}, TUNGGU)).length).toBeGreaterThan(0)
  })

  test('C8 form menyimpan ke localStorage dan tampil di koleksi', async () => {
    const user = buka('/tambah')
    const [inputJudul] = await screen.findAllByLabelText(/judul/i, {}, TUNGGU)
    await user.type(inputJudul, JUDUL_BARU)
    matikanValidasiBawaan()
    await user.click(screen.getByRole('button', { name: /simpan/i }))
    await waitFor(() => {
      const isi = Object.keys(localStorage).map((k) => localStorage.getItem(k)).join('\n')
      expect(isi).toContain(JUDUL_BARU)
    }, TUNGGU)
    cleanup()
    buka('/koleksi')
    expect((await screen.findAllByText(teks(JUDUL_BARU), {}, TUNGGU)).length).toBeGreaterThan(0)
  })

  test('C9 hapus dari detail lalu kembali ke koleksi', async () => {
    const target = itemUnik()
    const user = buka(`/koleksi/${target.id}`)
    await screen.findAllByText(teks(target.judul), {}, TUNGGU)
    const [tombol] = screen.getAllByRole('button', { name: /hapus/i })
    await user.click(tombol)
    await screen.findByRole('searchbox', {}, TUNGGU)
    await waitFor(() => expect(screen.queryAllByText(teks(target.judul))).toHaveLength(0), TUNGGU)
  })

  test('C10 statistik menampilkan tabel per kategori', async () => {
    buka('/statistik')
    const tabel = await screen.findByRole('table', {}, TUNGGU)
    expect((await within(tabel).findAllByText(teks(koleksi[0].kategori), {}, TUNGGU)).length).toBeGreaterThan(0)
  })

  test('C11 tentang menampilkan nama dan NIM', async () => {
    expect(mahasiswa.nim).toMatch(/\d/)
    buka('/tentang')
    expect((await screen.findAllByText(teks(mahasiswa.nim), {}, TUNGGU)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(teks(mahasiswa.nama)).length).toBeGreaterThan(0)
  })

  test('C12 rute tidak dikenal menampilkan 404', async () => {
    buka('/halaman-yang-tidak-ada-xyz')
    expect((await screen.findAllByText(/404/, {}, TUNGGU)).length).toBeGreaterThan(0)
  })

  test('C13 detail menampilkan tiga field tema', async () => {
    expect(tema, `NIM "${mahasiswa.nim}" di mahasiswa.json belum valid`).toBeTruthy()
    const target = itemUnik()
    buka(`/koleksi/${target.id}`)
    await screen.findAllByText(teks(target.judul), {}, TUNGGU)
    for (const f of tema.field) {
      expect(screen.queryAllByText(polaLabel(f.label)).length, `label "${f.label}" tidak tampil di halaman detail`).toBeGreaterThan(0)
    }
  })

  test('C14 form punya input berlabel untuk tiga field tema', async () => {
    expect(tema, `NIM "${mahasiswa.nim}" di mahasiswa.json belum valid`).toBeTruthy()
    buka('/tambah')
    await screen.findByRole('button', { name: /simpan/i }, TUNGGU)
    for (const f of tema.field) {
      expect(screen.queryAllByLabelText(polaLabel(f.label)).length, `tidak ada input berlabel "${f.label}" di form`).toBeGreaterThan(0)
    }
  })

  test('E1 tata letak memakai header, nav, main, footer', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    await screen.findAllByRole('heading', { level: 1 }, TUNGGU)
    for (const tag of ['header', 'nav', 'main', 'footer']) {
      expect(container.querySelector(tag), `<${tag}> tidak ditemukan`).not.toBeNull()
    }
  })
})
