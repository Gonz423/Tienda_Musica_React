// Roles definidos en el backend (usuario-service / auth-service)
export const ROLES_BACKEND = ['ADMIN', 'VENDEDOR', 'CLIENTE']

export const ETIQUETAS_ROL = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente'
}

export const CLASES_BADGE_ROL = {
  ADMIN: 'bg-danger',
  VENDEDOR: 'bg-primary',
  CLIENTE: 'bg-success'
}

// Umbral de stock critico (igual a ProductoService.UMBRAL_STOCK_CRITICO del backend)
export const UMBRAL_STOCK_CRITICO = 3

// Normaliza el rol del usuario en sesion al formato del backend
export function obtenerRolBackend(usuario) {
  if (!usuario) return null
  const rol = (usuario.rolOriginal || usuario.rol || '').toString().trim().toUpperCase()
  if (rol === 'ADMIN' || rol === 'JEFE') return 'ADMIN'
  if (rol === 'VENDEDOR' || rol === 'TRABAJADOR' || rol === 'EMPLEADO') return 'VENDEDOR'
  if (rol === 'CLIENTE') return 'CLIENTE'
  return null
}

// Empleados = cuentas internas de la tienda
export function esEmpleado(rol) {
  const r = (rol || '').toString().toUpperCase()
  return r === 'ADMIN' || r === 'VENDEDOR'
}

export function esStockCritico(producto) {
  const stock = Number(producto?.stock ?? 0)
  return stock <= UMBRAL_STOCK_CRITICO
}
