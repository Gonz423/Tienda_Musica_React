const API_URL = import.meta.env.VITE_AUTH_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario_actual';

// Roles del backend (ADMIN / VENDEDOR / CLIENTE) -> vistas del frontend
export function normalizarRol(rol) {
  const r = (rol || '').toString().toUpperCase();
  if (r === 'ADMIN') return 'jefe';
  if (r === 'VENDEDOR') return 'trabajador';
  return 'cliente';
}

// Lee el payload del JWT (no verifica la firma: eso lo hace siempre el backend)
export function decodificarToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const relleno = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(relleno), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

// true si el token existe y no ha expirado (con margen opcional en ms)
export function tokenVigente(token, margenMs = 0) {
  const payload = token ? decodificarToken(token) : null;
  return Boolean(payload?.exp && payload.exp * 1000 > Date.now() + margenMs);
}

// El rol de la sesión SIEMPRE sale del token firmado, no de datos editables del navegador
function construirSesion(token, datos = {}) {
  const payload = decodificarToken(token);
  if (!payload) return null;
  return {
    correo: payload.sub,
    email: payload.sub,
    nombre: datos.nombre || payload.sub?.split('@')[0],
    rol: normalizarRol(payload.rol),
    rolOriginal: payload.rol,
    token,
    expira: payload.exp * 1000
  };
}

async function leerMensajeError(respuesta, porDefecto) {
  const data = await respuesta.json().catch(() => ({}));
  return data.error || data.mensaje || porDefecto;
}

async function postAuth(ruta, cuerpo, headers = {}) {
  try {
    return await fetch(`${API_URL}/auth/${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor de autenticación. Intenta más tarde.');
  }
}

// POST /api/v1/auth/login -> sesión con token JWT
export async function login(credenciales) {
  const correo = credenciales.correo || credenciales.email;
  const respuesta = await postAuth('login', { correo, password: credenciales.password });

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error(await leerMensajeError(respuesta, 'Credenciales inválidas. Verifica tu correo y contraseña.'));
    }
    throw new Error(await leerMensajeError(respuesta, 'Error al iniciar sesión.'));
  }

  const data = await respuesta.json();
  return construirSesion(data.token, data);
}

// POST /api/v1/auth/register -> crea cuenta CLIENTE y devuelve sesión
export async function registrar(datos) {
  const respuesta = await postAuth('register', datos);
  if (!respuesta.ok) {
    throw new Error(await leerMensajeError(respuesta, 'No se pudo crear la cuenta.'));
  }
  const data = await respuesta.json();
  return construirSesion(data.token, data);
}

// POST /api/v1/auth/refresh -> nuevo token (el backend revisa que la cuenta siga activa)
export async function refrescarToken() {
  const token = obtenerToken();
  if (!token) throw new Error('No hay sesión activa');

  const respuesta = await postAuth('refresh', null, { Authorization: `Bearer ${token}` });
  if (!respuesta.ok) {
    throw new Error(await leerMensajeError(respuesta, 'La sesión expiró.'));
  }
  const data = await respuesta.json();
  const sesion = construirSesion(data.token, data);
  guardarSesionUsuario(sesion);
  return sesion;
}

// Guarda el token y solo datos de presentación (el rol NO se guarda aparte)
export function guardarSesionUsuario(sesion) {
  if (!sesion?.token) return;
  localStorage.setItem(CLAVE_TOKEN, sesion.token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify({ nombre: sesion.nombre }));
}

// Recupera la sesión tras recargar (F5). Si el token expiró o está corrupto, se descarta.
export function cargarSesionUsuario() {
  try {
    const token = localStorage.getItem(CLAVE_TOKEN);
    if (!tokenVigente(token)) {
      cerrarSesionUsuario();
      return null;
    }
    const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIO) || '{}');
    return construirSesion(token, datos);
  } catch {
    return null;
  }
}

export function obtenerToken() {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

export function cerrarSesionUsuario() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}
