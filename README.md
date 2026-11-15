# Páginas & Letras — Tienda de libros con React + mock REST

Actividad formativa individual · Semana 4 · *Utilizando tecnologías de integración entre frontend y backend*.

Aplicación web de una tienda de libros donde el usuario explora **categorías** (Ficción, Ciencia Ficción, Fantasía, etc.) y sus libros. Los datos vienen de un **mock REST** (json-server) consumido desde React con `fetch`.

## Tecnologías

- HTML, CSS y JavaScript
- React 18 + Vite
- React Router v6 (navegación y rutas dinámicas)
- json-server 0.17 (mock REST sobre `db.json`)

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

```bash
npm install
npm start
```

`npm start` levanta en paralelo:

| Servicio | URL | Script |
| --- | --- | --- |
| Mock REST (json-server) | http://localhost:3001 | `npm run api` |
| Frontend (Vite) | http://localhost:5173 | `npm run dev` |

También puedes ejecutarlos por separado en dos terminales. El mock responde con un retraso de 600 ms a propósito, para que se aprecie el indicador de carga.

Para cambiar la URL de la API, copia `.env.example` como `.env` y edita `VITE_API_URL`.

## Rutas de la aplicación

| Ruta | Página |
| --- | --- |
| `/` | Inicio con categorías destacadas |
| `/categorias` | Listado de todas las categorías |
| `/categorias/:categoryId` | Libros de una categoría (con buscador) |
| `/libros/:bookId` | Detalle de un libro |
| `*` | Página 404 |

## Endpoints del mock REST

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/categories` | Lista de categorías |
| GET | `/categories/:id?_embed=books` | Una categoría con sus libros (1 sola petición) |
| GET | `/books/:id?_expand=category` | Un libro con su categoría (1 sola petición) |

## Estructura

```
├── db.json                  # Datos del mock REST
├── mock/middleware.cjs      # Permite simular errores 404 / 500
└── src/
    ├── services/api.js      # Acceso a la API y clasificación de errores
    ├── hooks/useApi.js      # Estado, caché, reintento y deduplicación
    ├── components/          # Navbar, Loader, ErrorMessage, DataBoundary, tarjetas…
    ├── pages/               # Home, Categories, CategoryBooks, BookDetail, NotFound
    └── utils/format.js
```

## Cómo se cumple cada criterio de la rúbrica

**1. Creación e integración de un mock REST**
`db.json` + json-server exponen las categorías y los libros. `services/api.js` los consume con `fetch` y la interfaz muestra los datos. Las respuestas 404 y 500 se detectan y se traducen a mensajes para el usuario.

**2. Manejo de errores en las peticiones**
`ApiError` clasifica cada fallo (`network`, `not_found`, `server`, `client`, `invalid`) y `ErrorMessage` muestra un mensaje específico para cada uno. Como solución alternativa se ofrece un botón **Reintentar**, un enlace para volver al catálogo y, si ya existían datos guardados, se siguen mostrando con un aviso de que no se pudieron actualizar.

**3. Control de carga y estado de las peticiones**
`useApi` entrega `loading`, `error` y `data`. `Loader` aparece en la primera carga y desaparece al recibir la respuesta (o el error). Si se está actualizando un dato viejo, se muestra el contenido junto con el texto "Actualizando datos…". Las páginas se cargan con `React.lazy` + `Suspense`, también con indicador.

**4. Optimización y eficiencia en la consulta de datos**
- Caché en memoria con vigencia de 60 s: volver a una página ya visitada no repite la petición.
- Inicio y Categorías comparten la clave `categories`, así que se consulta una sola vez.
- Peticiones idénticas simultáneas se unifican (también evita duplicados de React StrictMode).
- `_embed` y `_expand` traen datos relacionados en una sola petición.
- El buscador filtra en el cliente, sin consultar al servidor.
- Las páginas se descargan bajo demanda (`React.lazy`).

## Cómo probar el manejo de errores

1. **Error 404:** abre `http://localhost:5173/categorias/999` o `http://localhost:5173/libros/999`.
2. **Error 500:** abre `http://localhost:5173/categorias?simular=500`.
3. **Error 404 de la API:** abre `http://localhost:5173/categorias?simular=404`.
4. **Sin conexión con el servidor:** detén `npm run api` y entra a una categoría que no hayas visitado.
5. **Datos guardados + aviso:** carga `/categorias`, detén la API y pulsa **Actualizar**. Se mantienen las categorías en pantalla y aparece el aviso amarillo con el botón Reintentar.

## Entrega

Repositorio en GitHub con el nombre indicado por el docente (`hospital-nombre-apellido-siglaCurso`) y URL compartida con el docente.
