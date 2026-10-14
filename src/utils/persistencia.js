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

// Persistencia del carrito de compras (Perfil Cliente)
export function guardarCarritoStorage(carrito) {
  localStorage.setItem('carrito_compras', JSON.stringify(carrito))
}

export function cargarCarritoStorage() {
  try {
    const data = localStorage.getItem('carrito_compras')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

