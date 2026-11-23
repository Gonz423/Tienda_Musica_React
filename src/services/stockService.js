import { peticionApi } from './httpCliente'

// producto-service (puerto 8083) - control de stock en bodega
const API_URL = import.meta.env.VITE_PRODUCTOS_API_URL || 'http://localhost:8083/api'
const SERVICIO = 'el servicio de productos (puerto 8083)'

// GET /api/productos (publico)
export function listarProductosBodega() {
  return peticionApi(`${API_URL}/productos`, { auth: false, servicio: SERVICIO })
}

// PATCH /api/productos/{id}/stock - cantidad positiva suma, negativa resta (ADMIN / VENDEDOR)
export function ajustarStockProducto(id, cantidad, motivo) {
  return peticionApi(`${API_URL}/productos/${id}/stock`, {
    method: 'PATCH',
    servicio: SERVICIO,
    body: { cantidad, motivo: motivo || null }
  })
}
