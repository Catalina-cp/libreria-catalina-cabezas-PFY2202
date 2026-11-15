import { Link, useParams } from 'react-router-dom'
import { getBook } from '../services/api'
import { useApi } from '../hooks/useApi'
import DataBoundary from '../components/DataBoundary'
import BookCover from '../components/BookCover'
import { formatPrice } from '../utils/format'

export default function BookDetail() {
  const { bookId } = useParams()

  // Una sola petición trae el libro y su categoría (_expand=category).
  const state = useApi(`book:${bookId}`, () => getBook(bookId))

  return (
    <section>
      <DataBoundary
        state={state}
        loadingMessage="Cargando libro…"
        fallback={{ to: '/categorias', label: 'Ver categorías' }}
      >
        {(book) => (
          <article>
            <Link className="back" to={`/categorias/${book.categoryId}`}>
              ← Volver a {book.category?.nombre ?? 'la categoría'}
            </Link>
            <div className="book-detail">
              <BookCover book={book} large />
              <div>
                <h1>{book.titulo}</h1>
                <p className="muted">
                  {book.autor} · {book.anio}
                </p>
                <p>{book.descripcion}</p>
                <p className="price price--large">{formatPrice(book.precio)}</p>
                <span className={`badge ${book.disponible ? 'badge--ok' : 'badge--off'}`}>
                  {book.disponible ? 'Disponible' : 'Agotado'}
                </span>
              </div>
            </div>
          </article>
        )}
      </DataBoundary>
    </section>
  )
}
