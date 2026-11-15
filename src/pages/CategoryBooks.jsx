import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCategoryWithBooks } from '../services/api'
import { useApi } from '../hooks/useApi'
import DataBoundary from '../components/DataBoundary'
import BookCard from '../components/BookCard'

function BookList({ category }) {
  const [query, setQuery] = useState('')

  // Filtro en el cliente: no genera peticiones nuevas al servidor.
  const books = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return category.books
    return category.books.filter(
      (book) =>
        book.titulo.toLowerCase().includes(text) || book.autor.toLowerCase().includes(text),
    )
  }, [category.books, query])

  return (
    <>
      <header className="page-head">
        <div>
          <h1>
            <span aria-hidden="true">{category.icono}</span> {category.nombre}
          </h1>
          <p className="muted">{category.descripcion}</p>
        </div>
      </header>

      <input
        className="search"
        type="search"
        placeholder="Buscar por título o autor…"
        aria-label="Buscar libros en esta categoría"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {books.length === 0 ? (
        <p className="muted">
          {category.books.length === 0
            ? 'Esta categoría aún no tiene libros.'
            : 'No hay libros que coincidan con tu búsqueda.'}
        </p>
      ) : (
        <div className="grid grid--books">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  )
}

export default function CategoryBooks() {
  const { categoryId } = useParams()

  // Una sola petición trae la categoría y todos sus libros (_embed=books).
  const state = useApi(`category:${categoryId}`, () => getCategoryWithBooks(categoryId))

  return (
    <section>
      <Link className="back" to="/categorias">
        ← Todas las categorías
      </Link>
      <DataBoundary
        state={state}
        loadingMessage="Cargando libros…"
        fallback={{ to: '/categorias', label: 'Ver categorías' }}
      >
        {(category) => <BookList key={category.id} category={category} />}
      </DataBoundary>
    </section>
  )
}
