import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/categorias/${category.id}`} className="category-card">
      <span className="category-card__icon" aria-hidden="true">
        {category.icono}
      </span>
      <h3>{category.nombre}</h3>
      <p className="muted">{category.descripcion}</p>
    </Link>
  )
}
