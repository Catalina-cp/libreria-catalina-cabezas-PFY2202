import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="brand">
          📚 Páginas &amp; Letras
        </Link>
        <nav aria-label="Principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
        </nav>
      </div>
    </header>
  )
}
