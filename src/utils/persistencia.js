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

// Persistencia de trabajador

export function calcularTotalPedido(articulos = []) {
  if (!Array.isArray(articulos) || articulos.length === 0) return 0;
  return articulos.reduce((total, art) => total + (art.precio * (art.cantidad || 1)), 0);
}

export function avanzarEstadoPedido(estadoActual) {
  switch (estadoActual) {
    case 'Pendiente':
      return 'En preparacion';
    case 'En preparacion':
      return 'Listo / Despachado';
    case 'Listo / Despachado':
      return 'Completado';
    default:
      return estadoActual;
  }
}

export function esStockCritico(stock) {
  return Number(stock) < 3;
}

export function ajustarStock(stockActual, delta) {
  const resultado = Number(stockActual) + Number(delta);
  return resultado < 0 ? 0 : resultado;
}