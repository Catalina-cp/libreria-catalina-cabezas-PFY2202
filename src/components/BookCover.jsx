// Portada generada con CSS (no depende de imágenes externas).
export default function BookCover({ book, large = false }) {
  const hue = (book.id * 47) % 360

  return (
    <div className={`cover${large ? ' cover--large' : ''}`} style={{ '--hue': hue }} aria-hidden="true">
      <span className="cover__title">{book.titulo}</span>
      <span className="cover__author">{book.autor}</span>
    </div>
  )
}
