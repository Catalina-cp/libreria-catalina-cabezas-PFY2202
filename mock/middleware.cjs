// Middleware del mock REST (json-server).
// Permite simular errores del servidor agregando ?simular=500 o ?simular=404
// a cualquier petición. Ejemplo: http://localhost:3001/categories?simular=500
module.exports = (req, res, next) => {
  const simular = req.query.simular

  if (simular === '500') {
    return res.status(500).json({ message: 'Error interno simulado del servidor' })
  }

  if (simular === '404') {
    return res.status(404).json({ message: 'Recurso simulado no encontrado' })
  }

  next()
}
