import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="alert alert--error">
      <h1>Página no encontrada (404)</h1>
      <p>La dirección que ingresaste no existe en esta librería.</p>
      <div className="alert__actions">
        <Link className="btn" to="/">
          Volver al inicio
        </Link>
        <Link className="btn btn--ghost" to="/categorias">
          Ver categorías
        </Link>
      </div>
    </section>
  )
}
