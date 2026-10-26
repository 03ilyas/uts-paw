// Pemeriksaan integritas (butir I1-I8 di shared/uts.json). Hasilnya indikasi untuk
// ditindaklanjuti dosen, bukan pengurang nilai otomatis: deteksi AI tidak pernah
// pasti, jadi setiap indikasi perlu klarifikasi (demo atau penjelasan lisan).
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { UTS, namaCocok } from './lib.mjs'

const TINGKAT = Object.fromEntries(UTS.integritas.map((i) => [i.id, i.tingkat]))
const indikasi = (id, pesan) => ({ id, tingkat: TINGKAT[id], pesan })

const JEJAK_AI = [
  'CLAUDE.md', 'AGENTS.md', 'GEMINI.md', '.cursorrules', '.cursor', '.claude', '.windsurfrules', '.windsurf',
  '.github/copilot-instructions.md', '.aider.conf.yml', '.aider.chat.history.md', '.continue', '.codeium', '.clinerules', '.roo',
]

const ALAT_AI = /\b(claude|anthropic|copilot|cursor|chatgpt|openai|gpt-?\d|gemini|codeium|windsurf|aider|devin|cline|tabnine|codex)\b/i

// Frasa yang lazim muncul ketika jawaban AI ditempel apa adanya.
const FRASA_AI = [
  /\bas an ai\b/i,
  /\bsebagai (model )?ai\b/i,
  /\bgenerated (by|with) (ai|chatgpt|claude|copilot|gemini)/i,
  /\bberikut (adalah|ini) (kode|contoh kode|implementasi)\b/i,
  /\bhere(?:'s| is) (the|an?) (updated |complete |full )?(code|implementation|component)\b/i,
  /\bi hope this helps\b/i,
  /\bsemoga membantu\b/i,
  /\b(certainly|sure)! here\b/i,
  /🤖/,
]

function berkasTeks(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && /\.(jsx?|tsx?|css|md|html)$/.test(e.name))
    .map((e) => join(e.parentPath, e.name))
    .filter((p) => !p.includes('node_modules') && !p.includes('__rubrik__') && !p.includes('/dist/'))
}

export function cekBerkas(root) {
  const hasil = []
  const jejak = JEJAK_AI.filter((p) => existsSync(join(root, p)) || existsSync(join(root, 'app', p)))
  if (jejak.length) hasil.push(indikasi('I1', `ditemukan: ${jejak.join(', ')}`))

  const temuan = []
  for (const p of [...berkasTeks(join(root, 'app')), join(root, 'README.md')].filter(existsSync)) {
    const isi = readFileSync(p, 'utf8')
    const pola = FRASA_AI.find((re) => re.test(isi))
    if (pola) temuan.push(`${p.slice(root.length + 1)}: "${isi.match(pola)[0]}"`)
  }
  if (temuan.length) hasil.push(indikasi('I3', temuan.slice(0, 3).join('; ')))
  return hasil
}

// Analisis commit milik mahasiswa saja (commit yang tidak ada di repo induk).
export function cekRiwayat(dir, sha, induk = `https://github.com/${UTS.repoInduk}.git`) {
  const git = (...args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout ?? ''
  git('fetch', '--quiet', induk, 'main')
  const log = git('log', '--no-merges', '--numstat', '--format=@@%H%x1f%ae%x1f%an%x1f%cI%x1f%B%x1e', `FETCH_HEAD..${sha}`, '--', 'app')
  const commits = log.split('@@').filter(Boolean).map((blok) => {
    const [kepala, ...sisa] = blok.split('\x1e')
    const [hash, email, nama, waktu, pesan] = kepala.split('\x1f')
    const tambah = sisa.join('').split('\n')
      .map((l) => l.split('\t'))
      .filter(([a, , p]) => p && /^app\/src\/.*\.(jsx?|tsx?|css)$/.test(p) && /^\d+$/.test(a))
      .reduce((s, [a]) => s + Number(a), 0)
    return { hash, email: email.toLowerCase(), nama, waktu, pesan, tambah }
  })

  const hasil = []
  // Hanya trailer co-author dan tanda tangan generator; kata seperti "cursor" di pesan biasa tidak dihitung.
  const ai = commits.filter((c) =>
    c.pesan.split('\n').some((l) => /^co-authored-by:/i.test(l.trim()) && (ALAT_AI.test(l) || /\[bot\]/i.test(l))) ||
    /generated (with|by) .*(claude|copilot|chatgpt|gemini|cursor|ai\b)|claude\.com\/claude-code|🤖/i.test(c.pesan),
  )
  if (ai.length) hasil.push(indikasi('I2', `${ai.length} commit, misalnya ${ai[0].hash.slice(0, 7)}: "${ai[0].pesan.trim().split('\n')[0].slice(0, 80)}"`))

  const total = commits.reduce((s, c) => s + c.tambah, 0)
  const terbesar = commits.reduce((m, c) => (c.tambah > m.tambah ? c : m), { tambah: 0 })
  if (commits.length < 3) {
    hasil.push(indikasi('I4', `hanya ${commits.length} commit milik mahasiswa`))
  } else if (total >= 300 && terbesar.tambah / total > 0.7) {
    hasil.push(indikasi('I4', `${Math.round((terbesar.tambah / total) * 100)}% dari ${total} baris kode masuk di commit ${terbesar.hash.slice(0, 7)}`))
  }

  // Email noreply GitHub dan email biasa bisa milik orang yang sama; bandingkan nama juga.
  const penulis = new Map()
  for (const c of commits) {
    const kunci = c.email.replace(/^\d+\+/, '').replace(/@users\.noreply\.github\.com$/, '')
    if (![...penulis.values()].some((n) => namaCocok(n, c.nama))) penulis.set(kunci, c.nama)
  }
  if (penulis.size > 1) hasil.push(indikasi('I8', `penulis commit: ${[...penulis.values()].join(', ')}`))

  return { hasil, jumlahCommit: commits.length }
}

// konteks berasal dari langkah --target (data kelas mahasiswa ini saja, tanpa data kelas lengkap).
export function cekIdentitasDanWaktu(mahasiswa, konteks) {
  const hasil = []
  if (konteks.daftar === false) {
    hasil.push(indikasi('I6', `NIM ${mahasiswa.nim || '(kosong)'} tidak ada di data kelas`))
  } else if (konteks.daftar) {
    if (konteks.daftar.kelas !== mahasiswa.kelas) hasil.push(indikasi('I6', `kelas tertulis ${mahasiswa.kelas || '-'}, data kelas ${konteks.daftar.kelas}`))
    if (!namaCocok(konteks.daftar.nama, mahasiswa.nama)) hasil.push(indikasi('I6', `nama tidak sesuai data kelas untuk NIM ${mahasiswa.nim}`))
  }
  if (konteks.nim && mahasiswa.nim !== konteks.nim) {
    hasil.push(indikasi('I6', `NIM berubah: ${konteks.nim} di branch terkini, ${mahasiswa.nim || '(kosong)'} di commit yang dinilai`))
  }
  if (konteks.dibuka) {
    const dibuka = new Date(konteks.dibuka)
    if (konteks.forkDibuat && new Date(konteks.forkDibuat) < dibuka) hasil.push(indikasi('I5', `fork dibuat ${konteks.forkDibuat}, kelas ${konteks.kelas} dibuka ${konteks.dibuka}`))
    if (konteks.pushSebelumDibuka) hasil.push(indikasi('I5', `ada push sebelum kelas ${konteks.kelas} dibuka`))
  }
  return hasil
}
