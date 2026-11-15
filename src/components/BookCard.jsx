import { Link } from 'react-router-dom'
import BookCover from './BookCover'
import { formatPrice } from '../utils/format'

export default function BookCard({ book }) {
  return (
    <Link to={`/libros/${book.id}`} className="book-card">
      <BookCover book={book} />
      <div className="book-card__info">
        <h3>{book.titulo}</h3>
        <p className="muted">{book.autor}</p>
        <p className="price">{formatPrice(book.precio)}</p>
      </div>
    </Link>
  )
}
