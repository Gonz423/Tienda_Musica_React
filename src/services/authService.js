const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Petición de login a Spring Boot
export async function login(credenciales) {
  const correo = credenciales.correo || credenciales.email;
  const password = credenciales.password;

  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });

  if (!respuesta.ok) {
    if (respuesta.status === 401 || respuesta.status === 403) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
    throw new Error('Error al conectar con el servidor.');
  }

  return respuesta.json();
}

// Guarda token y datos de usuario en localStorage
export function guardarSesionUsuario(usuarioSesion) {
  if (!usuarioSesion) return;
  if (usuarioSesion.token) {
    localStorage.setItem('token', usuarioSesion.token);
  }
  localStorage.setItem('usuario_actual', JSON.stringify(usuarioSesion));
}

// Lee la sesión guardada
export function cargarSesionUsuario() {
  try {
    const raw = localStorage.getItem('usuario_actual');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Obtiene el token JWT actual
export function obtenerToken() {
  return localStorage.getItem('token');
}

// Limpia el almacenamiento de sesión
export function cerrarSesionUsuario() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario_actual');
}
