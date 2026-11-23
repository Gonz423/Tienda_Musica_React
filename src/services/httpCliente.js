import { obtenerToken } from './authService'

// Error HTTP con el codigo de estado para que la UI pueda reaccionar
export class ErrorHttp extends Error {
  constructor(mensaje, status = 0, detalle = null) {
    super(mensaje)
    this.name = 'ErrorHttp'
    this.status = status
    this.detalle = detalle
  }
}

// Traduce el codigo HTTP a un mensaje entendible para el usuario
export function mensajePorEstado(status, detalle, servicio = 'el servidor') {
  switch (status) {
    case 0:
      return `No se pudo conectar con ${servicio}. Verifica que el servicio esté en ejecución.`
    case 400:
      return detalle || 'La solicitud no es válida. Revisa los datos ingresados.'
    case 401:
      return 'Tu sesión expiró o no estás autenticado. Inicia sesión nuevamente.'
    case 403:
      return 'No tienes permisos para realizar esta acción.'
    case 404:
      return detalle || 'El recurso solicitado no existe.'
    case 409:
      return detalle || 'Conflicto con el estado actual del recurso.'
    default:
      if (status >= 500) {
        return `Error interno en ${servicio}. Intenta nuevamente en unos minutos.`
      }
      return detalle || `Error inesperado (HTTP ${status}).`
  }
}

/**
 * Peticion fetch con JWT, parseo JSON y manejo uniforme de errores HTTP.
 */
export async function peticionApi(url, { method = 'GET', body, auth = true, servicio } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth ? obtenerToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch {
    throw new ErrorHttp(mensajePorEstado(0, null, servicio), 0)
  }

  const texto = await respuesta.text().catch(() => '')
  let data = null
  if (texto) {
    try {
      data = JSON.parse(texto)
    } catch {
      data = texto
    }
  }

  if (!respuesta.ok) {
    const detalle =
      data && typeof data === 'object' ? data.error || data.mensaje || data.message || null : null
    throw new ErrorHttp(mensajePorEstado(respuesta.status, detalle, servicio), respuesta.status, detalle)
  }

  return data
}
