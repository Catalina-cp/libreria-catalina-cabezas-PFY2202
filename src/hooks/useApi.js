import { useCallback, useEffect, useRef, useState } from 'react'

// Caché en memoria compartida por toda la aplicación.
//  - cache:    key → { data, timestamp }
//  - inflight: key → Promise de una petición en curso (evita peticiones duplicadas)
const cache = new Map()
const inflight = new Map()

const DEFAULT_TTL = 60_000 // 1 minuto: mientras los datos sean "frescos" no se vuelve a consultar

/**
 * Hook para consultar la API con control de estado, caché y reintento.
 *
 * @param {string}   key      Identificador único del recurso (ej. "categories", "book:3")
 * @param {Function} fetcher  Función que devuelve una Promise con los datos
 * @param {object}   options  { ttl } tiempo de vida de la caché en milisegundos
 *
 * @returns {{ data, error, loading, reload }}
 *  - data:    último dato disponible (puede venir de la caché)
 *  - error:   ApiError si la última petición falló
 *  - loading: true mientras hay una petición en curso
 *  - reload:  fuerza una nueva petición ignorando la caché (botón "Reintentar")
 */
export function useApi(key, fetcher, { ttl = DEFAULT_TTL } = {}) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [reloadCount, setReloadCount] = useState(0)
  const fetcherRef = useRef(fetcher)
  const forceRef = useRef(false)

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    let cancelled = false
    const entry = cache.get(key)
    const force = forceRef.current
    forceRef.current = false

    // 1) Dato fresco en caché → se usa directamente, sin pedirlo al servidor.
    if (entry && !force && Date.now() - entry.timestamp < ttl) {
      setState({ data: entry.data, error: null, loading: false })
      return undefined
    }

    // 2) Hay que consultar. Si existía un dato viejo se muestra mientras tanto.
    setState({ data: entry?.data ?? null, error: null, loading: true })

    // 3) Si ya hay una petición idéntica en curso, nos "colgamos" de ella.
    let promise = inflight.get(key)
    if (!promise) {
      promise = fetcherRef
        .current()
        .then((data) => {
          cache.set(key, { data, timestamp: Date.now() })
          return data
        })
        .finally(() => inflight.delete(key))
      inflight.set(key, promise)
    }

    promise
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false })
      })
      .catch((error) => {
        // Si falla pero había datos guardados, se conservan como alternativa.
        if (!cancelled) setState({ data: entry?.data ?? null, error, loading: false })
      })

    return () => {
      cancelled = true
    }
  }, [key, ttl, reloadCount])

  const reload = useCallback(() => {
    forceRef.current = true
    setReloadCount((count) => count + 1)
  }, [])

  return { ...state, reload }
}
