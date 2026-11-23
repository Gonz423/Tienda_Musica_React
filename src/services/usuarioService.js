import { peticionApi } from './httpCliente'

// usuario-service (puerto 8082) - endpoints exclusivos para rol ADMIN
const API_URL = import.meta.env.VITE_USUARIOS_API_URL || 'http://localhost:8082/api'
const SERVICIO = 'el servicio de usuarios (puerto 8082)'

// GET /api/usuarios
export function listarUsuarios() {
  return peticionApi(`${API_URL}/usuarios`, { servicio: SERVICIO })
}

// PUT /api/usuarios/{id} - el backend exige nombre, correo y rol
export function cambiarRolUsuario(usuario, nuevoRol) {
  return peticionApi(`${API_URL}/usuarios/${usuario.id}`, {
    method: 'PUT',
    servicio: SERVICIO,
    body: {
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: nuevoRol,
      rut: usuario.rut ?? null,
      telefono: usuario.telefono ?? null,
      direccion: usuario.direccion ?? null
    }
  })
}

// PATCH /api/usuarios/{id}/estado
export function cambiarEstadoUsuario(id, activo, motivo) {
  return peticionApi(`${API_URL}/usuarios/${id}/estado`, {
    method: 'PATCH',
    servicio: SERVICIO,
    body: { activo, motivo: motivo || null }
  })
}

// GET /api/usuarios/{id}/historial
export function obtenerHistorialUsuario(id) {
  return peticionApi(`${API_URL}/usuarios/${id}/historial`, { servicio: SERVICIO })
}

// POST /api/usuarios/{id}/historial
export function registrarNotaAuditoria(id, nota) {
  return peticionApi(`${API_URL}/usuarios/${id}/historial`, {
    method: 'POST',
    servicio: SERVICIO,
    body: { nota }
  })
}
