export default function KepalaHalaman({ kicker, judul, children }) {
  return (
    <header className="kepala-halaman">
      <span className="kicker">{kicker}</span>
      <h1>{judul}</h1>
      {children && <p>{children}</p>}
    </header>
  )
}
