import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'

// Carga diferida de páginas: cada una se descarga solo cuando se visita.
const Home = lazy(() => import('./pages/Home'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoryBooks = lazy(() => import('./pages/CategoryBooks'))
const BookDetail = lazy(() => import('./pages/BookDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Suspense fallback={<Loader message="Cargando página…" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/categorias/:categoryId" element={<CategoryBooks />} />
            <Route path="/libros/:bookId" element={<BookDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="footer">
        <p>Páginas &amp; Letras · Proyecto académico con React, React Router y mock REST</p>
      </footer>
    </div>
  )
}
