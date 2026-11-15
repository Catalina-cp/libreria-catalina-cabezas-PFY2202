import { Link } from 'react-router-dom'

// Mensajes claros y específicos según el tipo de error.
const COPY = {
  network: {
    title: 'Sin conexión con el servidor',
    hint: 'No pudimos comunicarnos con la API. Verifica que el mock REST esté encendido (npm run api) y que tengas conexión.',
  },
  not_found: {
    title: 'No encontramos lo que buscas',
    hint: 'El recurso solicitado no existe o fue eliminado. Puedes volver al catálogo y elegir otra opción.',
  },
  server: {
    title: 'El servidor tuvo un problema',
    hint: 'Ocurrió un error interno en el servidor. Espera unos segundos e inténtalo nuevamente.',
  },
  client: {
    title: 'No pudimos procesar la solicitud',
    hint: 'El servidor no aceptó la petición. Intenta nuevamente o vuelve al catálogo.',
  },
  invalid: {
    title: 'Respuesta inesperada',
    hint: 'El servidor respondió con datos que no pudimos leer. Intenta nuevamente.',
  },
  unknown: {
    title: 'Ocurrió un error inesperado',
    hint: 'Intenta nuevamente en unos instantes.',
  },
}

/**
 * Muestra un error de petición.
 *  - Modo completo: título, explicación, botón "Reintentar" y enlace alternativo.
 *  - Modo `compact`: aviso breve cuando falló la actualización pero se siguen
 *    mostrando los últimos datos guardados (solución alternativa).
 */
export default function ErrorMessage({ error, onRetry, fallback, compact = false }) {
  const copy = COPY[error?.type] ?? COPY.unknown
  const status = error?.status ? ` (código ${error.status})` : ''

  if (compact) {
    return (
      <div className="alert alert--warn" role="alert">
        <span>
          No pudimos actualizar la información{status}. Estás viendo los últimos datos guardados.
        </span>
        {onRetry && (
          <button type="button" className="btn btn--small" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="alert alert--error" role="alert">
      <h2>
        {copy.title}
        {status}
      </h2>
      <p>{copy.hint}</p>
      <div className="alert__actions">
        {error?.type !== 'not_found' && onRetry && (
          <button type="button" className="btn" onClick={onRetry}>
            Reintentar
          </button>
        )}
        {fallback && (
          <Link className="btn btn--ghost" to={fallback.to}>
            {fallback.label}
          </Link>
        )}
      </div>
    </div>
  )
}
