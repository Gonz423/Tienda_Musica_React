const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Inicia sesión contra el backend de Spring Boot (POST /api/auth/login)
 * @param {Object} credenciales - { correo, password } o { email, password }
 * @returns {Promise<Object>} Datos del usuario autenticado y token JWT
 */
export async function login(credenciales) {
  const correo = credenciales.correo || credenciales.email;
  const password = credenciales.password;

  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correo, password })
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
    throw new Error('Error al conectar con el servidor de autenticación.');
  }

  const data = await respuesta.json();
  return data;
}

/**
 * Guarda la sesión del usuario en localStorage para persistencia ante F5
 * @param {Object} usuarioSesion - { token, correo, nombre, rol }
 */
export function guardarSesionUsuario(usuarioSesion) {
  if (!usuarioSesion) return;
  if (usuarioSesion.token) {
    localStorage.setItem('token', usuarioSesion.token);
  }
  localStorage.setItem('usuario_actual', JSON.stringify(usuarioSesion));
}

/**
 * Carga la sesión guardada en localStorage
 * @returns {Object|null}
 */
export function cargarSesionUsuario() {
  try {
    const raw = localStorage.getItem('usuario_actual');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Obtiene el token JWT actual
 * @returns {string|null}
 */
export function obtenerToken() {
  return localStorage.getItem('token');
}

/**
 * Cierra la sesión activa y limpia el almacenamiento
 */
export function cerrarSesionUsuario() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario_actual');
}
