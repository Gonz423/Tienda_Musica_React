import { fetchConAuth, errorDeRespuesta } from './apiCliente';

const PEDIDOS_API_URL = import.meta.env.VITE_PEDIDOS_API_URL || 'http://localhost:8084/api/v1';
const METRICAS_API_URL = import.meta.env.VITE_METRICAS_API_URL || 'http://localhost:8085/api/v1';

// Estados del backend <-> etiquetas que muestra la interfaz
const ESTADO_A_ETIQUETA = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENVIADO: 'Despachado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
};

const ETIQUETA_A_ESTADO = Object.fromEntries(
  Object.entries(ESTADO_A_ETIQUETA).map(([api, etiqueta]) => [etiqueta, api])
);

export function estadoApi(etiqueta) {
  return ETIQUETA_A_ESTADO[etiqueta] || (etiqueta || '').toUpperCase();
}

// Pedido del backend -> forma que usan las tablas del frontend
export function adaptarPedido(p) {
  return {
    id: p.id,
    codigoPedido: p.codigoPedido,
    fecha: (p.fecha || '').toString().slice(0, 10),
    cliente: p.clienteId,
    email: p.clienteId,
    direccion: p.direccionEnvio,
    tipoEntrega: 'Envío a domicilio',
    total: Number(p.total) || 0,
    estado: ESTADO_A_ETIQUETA[p.estado] || p.estado,
    productos: (p.detalles || []).map((d) => ({
      id: d.productoId,
      productoId: d.productoId,
      nombre: d.nombreProducto,
      cantidad: d.cantidad,
      precio: Number(d.precioUnitario) || 0
    }))
  };
}

/**
 * Checkout (pedido-service :8084). Solo se envía QUÉ y CUÁNTO:
 * el cliente sale del token y el precio lo pone el backend desde el catálogo.
 */
export async function crearPedido({ direccionEnvio, items }) {
  const respuesta = await fetchConAuth(`${PEDIDOS_API_URL}/pedidos`, {
    method: 'POST',
    body: JSON.stringify({ direccionEnvio, items })
  });
  if (!respuesta.ok) {
    throw await errorDeRespuesta(respuesta, 'No pudimos procesar tu pedido. Intenta nuevamente.');
  }
  return adaptarPedido(await respuesta.json());
}

// Bandeja de pedidos para ADMIN / VENDEDOR
export async function obtenerPedidos() {
  const respuesta = await fetchConAuth(`${PEDIDOS_API_URL}/pedidos`);
  if (!respuesta.ok) {
    throw await errorDeRespuesta(respuesta, 'No se pudieron cargar los pedidos.');
  }
  const data = await respuesta.json();
  return Array.isArray(data) ? data.map(adaptarPedido) : [];
}

// Pedidos del cliente autenticado
export async function obtenerMisPedidos() {
  const respuesta = await fetchConAuth(`${PEDIDOS_API_URL}/pedidos/mis-pedidos`);
  if (!respuesta.ok) {
    throw await errorDeRespuesta(respuesta, 'No se pudieron cargar tus pedidos.');
  }
  const data = await respuesta.json();
  return Array.isArray(data) ? data.map(adaptarPedido) : [];
}

// Cambia el estado (recibe la etiqueta de la interfaz, ej. "En preparación")
export async function actualizarEstadoPedido(id, estado) {
  const respuesta = await fetchConAuth(`${PEDIDOS_API_URL}/pedidos/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado: estadoApi(estado) })
  });
  if (!respuesta.ok) {
    throw await errorDeRespuesta(respuesta, 'No se pudo actualizar el estado del pedido.');
  }
  return adaptarPedido(await respuesta.json());
}

// KPIs de negocio (metrica-service :8085, solo ADMIN)
export async function obtenerKpis() {
  const respuesta = await fetchConAuth(`${METRICAS_API_URL}/metricas/kpis`);
  if (!respuesta.ok) {
    throw await errorDeRespuesta(respuesta, 'No se pudieron cargar las métricas.');
  }
  return respuesta.json();
}
