import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

/**
 * Resuelve en un solo lugar los cuatro estados de una petición:
 *  1. Cargando por primera vez   → indicador de carga
 *  2. Error sin datos            → mensaje de error + reintentar + enlace alternativo
 *  3. Error pero con datos viejos → aviso + datos guardados
 *  4. Éxito                      → render de los datos (con aviso si se está actualizando)
 *
 * `children` es una función que recibe los datos.
 */
export default function DataBoundary({ state, loadingMessage, fallback, children }) {
  const { data, error, loading, reload } = state

  if (!data && loading) return <Loader message={loadingMessage} />
  if (!data && error) return <ErrorMessage error={error} onRetry={reload} fallback={fallback} />
  if (!data) return null

  return (
    <>
      {error && <ErrorMessage compact error={error} onRetry={reload} />}
      {loading && (
        <p className="refreshing" role="status">
          Actualizando datos…
        </p>
      )}
      {children(data)}
    </>
  )
}
