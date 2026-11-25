import { fetchConAuth, errorDeRespuesta } from './apiCliente';
import { normalizarRol } from './authService';

const API_URL = import.meta.env.VITE_USUARIOS_API_URL || 'http://localhost:8082/api/v1';

const ROL_API = { jefe: 'ADMIN', trabajador: 'VENDEDOR', cliente: 'CLIENTE' };

const ACCIONES = {
  CREACION_CUENTA: 'Creación de cuenta',
  CAMBIO_ROL: 'Cambio de rol',
  CAMBIO_ESTADO: 'Cambio de estado',
  ACTUALIZACION_DATOS: 'Modificación de perfil',
  NOTA_AUDITORIA: 'Nota Administrativa',
  ELIMINACION_CUENTA: 'Eliminación de cuenta'
};

export function rolApi(rolUi) {
  return ROL_API[rolUi] || 'CLIENTE';
}

// UsuarioResponse del backend -> forma que usa la tabla de usuarios
export function adaptarUsuario(u) {
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.correo,
    correo: u.correo,
    rol: normalizarRol(u.rol),
    activo: u.activo !== false,
    rut: u.rut,
    telefono: u.telefono,
    direccion: u.direccion,
    historial: u.historial || []
  };
}

export function adaptarEvento(h) {
  const fecha = h.fechaHora ? h.fechaHora.replace('T', ' ').slice(0, 16) : '';
  return {
    id: h.id,
    fecha,
    accion: ACCIONES[h.accion] || h.accion,
    detalle: h.realizadoPor ? `${h.detalle} (por ${h.realizadoPor})` : h.detalle
  };
}

async function pedir(ruta, opciones, mensajeError) {
  const respuesta = await fetchConAuth(`${API_URL}/usuarios${ruta}`, opciones);
  if (!respuesta.ok) throw await errorDeRespuesta(respuesta, mensajeError);
  return respuesta.status === 204 ? null : respuesta.json();
}

export async function listarUsuarios() {
  const data = await pedir('', {}, 'No se pudieron cargar los usuarios.');
  return (data || []).map(adaptarUsuario);
}

export async function crearUsuario(usuario) {
  const data = await pedir('', {
    method: 'POST',
    body: JSON.stringify({
      nombre: usuario.nombre,
      correo: usuario.email,
      password: usuario.password,
      rol: rolApi(usuario.rol),
      activo: usuario.activo
    })
  }, 'No se pudo crear el usuario.');
  return adaptarUsuario(data);
}

export async function actualizarUsuario(usuario) {
  const data = await pedir(`/${usuario.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: usuario.nombre,
      correo: usuario.email,
      rol: rolApi(usuario.rol),
      activo: usuario.activo,
      // solo se envía si el admin escribió una nueva
      password: usuario.passwordNueva || undefined
    })
  }, 'No se pudo actualizar el usuario.');
  return adaptarUsuario(data);
}

export async function cambiarEstadoUsuario(id, activo, motivo) {
  const data = await pedir(`/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ activo, motivo })
  }, 'No se pudo cambiar el estado del usuario.');
  return adaptarUsuario(data);
}

export async function obtenerHistorialUsuario(id) {
  const data = await pedir(`/${id}/historial`, {}, 'No se pudo cargar el historial.');
  return (data || []).map(adaptarEvento);
}

export async function agregarNotaUsuario(id, nota) {
  const data = await pedir(`/${id}/historial`, {
    method: 'POST',
    body: JSON.stringify({ nota })
  }, 'No se pudo registrar la nota.');
  return adaptarEvento(data);
}

export async function eliminarUsuario(id) {
  await pedir(`/${id}`, { method: 'DELETE' }, 'No se pudo eliminar el usuario.');
}
