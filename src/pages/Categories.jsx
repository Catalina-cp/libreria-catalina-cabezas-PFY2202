import { useSearchParams } from 'react-router-dom'
import { getCategories } from '../services/api'
import { useApi } from '../hooks/useApi'
import DataBoundary from '../components/DataBoundary'
import CategoryCard from '../components/CategoryCard'

export default function Categories() {
  // Para probar el manejo de errores: /categorias?simular=500  o  /categorias?simular=404
  const [params] = useSearchParams()
  const simular = params.get('simular')

  const state = useApi(`categories${simular ? `?simular=${simular}` : ''}`, () =>
    getCategories(simular),
  )

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Categorías</h1>
          <p className="muted">Elige una categoría para ver sus libros.</p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={state.reload} disabled={state.loading}>
          {state.loading ? 'Cargando…' : 'Actualizar'}
        </button>
      </div>

      <DataBoundary
        state={state}
        loadingMessage="Cargando categorías…"
        fallback={{ to: '/', label: 'Volver al inicio' }}
      >
        {(categories) =>
          categories.length === 0 ? (
            <p className="muted">Aún no hay categorías disponibles.</p>
          ) : (
            <div className="grid">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )
        }
      </DataBoundary>
    </section>
  )
}
