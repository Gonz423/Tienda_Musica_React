import { obtenerToken, refrescarToken, cerrarSesionUsuario } from './authService';

export const EVENTO_SESION_EXPIRADA = 'sesion-expirada';

let refrescoEnCurso = null;

/**
 * fetch con autenticación para todos los microservicios:
 * 1. Agrega "Authorization: Bearer <token>".
 * 2. Si el backend responde 401, intenta renovar el token UNA vez (POST /auth/refresh)
 *    y repite la petición.
 * 3. Si sigue en 401, cierra la sesión y avisa a la app con el evento "sesion-expirada".
 */
export async function fetchConAuth(url, opciones = {}) {
  const ejecutar = () => {
    const token = obtenerToken();
    const headers = {
      ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
      ...opciones.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    return fetch(url, { ...opciones, headers });
  };

  let respuesta;
  try {
    respuesta = await ejecutar();
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que los microservicios estén levantados.');
  }

  if (respuesta.status === 401 && obtenerToken()) {
    try {
      if (!refrescoEnCurso) {
        refrescoEnCurso = refrescarToken().finally(() => {
          refrescoEnCurso = null;
        });
      }
      await refrescoEnCurso;
      respuesta = await ejecutar();
    } catch {
      // la renovación falló: se trata como sesión expirada
    }
    if (respuesta.status === 401) {
      cerrarSesionUsuario();
      window.dispatchEvent(new CustomEvent(EVENTO_SESION_EXPIRADA));
    }
  }

  return respuesta;
}

// Convierte una respuesta de error del backend en un Error con mensaje legible
export async function errorDeRespuesta(respuesta, porDefecto) {
  if (respuesta.status === 401) return new Error('Tu sesión expiró. Inicia sesión nuevamente.');
  if (respuesta.status === 403) return new Error('No tienes permisos para realizar esta acción.');
  const data = await respuesta.json().catch(() => ({}));
  return new Error(data.mensaje || data.error || porDefecto);
}
