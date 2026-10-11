// src/utils/persistencia.js
// Funciones de persistencia en localStorage para productos del catalogo
export function guardarProductoStorage(producto) {
  localStorage.setItem('productos_catalogo', JSON.stringify(producto))
}

export function cargarProductosStorage() {
  try {
    const data = localStorage.getItem('productos_catalogo')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
