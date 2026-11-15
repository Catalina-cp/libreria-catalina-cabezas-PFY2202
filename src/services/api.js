// Capa de acceso al mock REST (json-server).
// Toda la comunicación frontend ↔ backend pasa por este archivo.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

/**
 * Error propio de la API. `type` permite que la interfaz muestre
 * un mensaje distinto según el problema:
 *  - network   → no hay conexión con el servidor
 *  - not_found → 404
 *  - server    → 5xx
 *  - client    → otros 4xx
 *  - invalid   → la respuesta no es JSON válido
 */
export class ApiError extends Error {
  constructor(message, { status = null, type = 'unknown' } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.type = type
  }
}

function classify(status) {
  if (status === 404) return 'not_found'
  if (status >= 500) return 'server'
  return 'client'
}

async function request(path) {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', { type: 'network' })
  }

  if (!response.ok) {
    throw new ApiError(`La API respondió con el estado ${response.status}`, {
      status: response.status,
      type: classify(response.status),
    })
  }

  try {
    return await response.json()
  } catch {
    throw new ApiError('La respuesta del servidor no tiene el formato esperado', {
      status: response.status,
      type: 'invalid',
    })
  }
}

// GET /categories  (con ?simular=500|404 se fuerza un error para probar la interfaz)
export const getCategories = (simular) =>
  request(`/categories${simular ? `?simular=${encodeURIComponent(simular)}` : ''}`)

// GET /categories/:id?_embed=books → la categoría y sus libros en UNA sola petición
export const getCategoryWithBooks = (id) =>
  request(`/categories/${encodeURIComponent(id)}?_embed=books`)

// GET /books/:id?_expand=category → el libro y su categoría en UNA sola petición
export const getBook = (id) =>
  request(`/books/${encodeURIComponent(id)}?_expand=category`)
