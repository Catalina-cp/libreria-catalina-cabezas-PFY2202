import { Link } from 'react-router-dom'
import { getCategories } from '../services/api'
import { useApi } from '../hooks/useApi'
import DataBoundary from '../components/DataBoundary'
import CategoryCard from '../components/CategoryCard'

export default function Home() {
  // Misma clave ("categories") que la página de categorías:
  // al navegar entre ambas, los datos salen de la caché sin nueva petición.
  const state = useApi('categories', () => getCategories())

  return (
    <>
      <section className="hero">
        <h1>Encuentra tu próxima lectura</h1>
        <p>
          Explora nuestro catálogo por categorías: desde clásicos de la ficción hasta libros de
          tecnología.
        </p>
        <Link className="btn" to="/categorias">
          Explorar categorías
        </Link>
      </section>

      <section>
        <h2>Categorías destacadas</h2>
        <DataBoundary
          state={state}
          loadingMessage="Cargando categorías…"
          fallback={{ to: '/categorias', label: 'Ir al catálogo' }}
        >
          {(categories) => (
            <div className="grid">
              {categories.slice(0, 3).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </DataBoundary>
      </section>
    </>
  )
}
