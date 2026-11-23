const PEDIDOS_API_URL = import.meta.env.VITE_PEDIDOS_API_URL || 'http://localhost:8084/api';
const METRICAS_API_URL = import.meta.env.VITE_METRICAS_API_URL || 'http://localhost:8085/api';

function getAuthHeaders() {
  try {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

/**
 * Realizar checkout y crear nuevo pedido (pedido-service :8084)
 */
export async function crearPedido(datosPedido) {
  const response = await fetch(`${PEDIDOS_API_URL}/pedidos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(datosPedido),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || 'No pudimos procesar tu pedido. Intenta nuevamente.');
  }
  return data;
}

/**
 * Listar todos los pedidos para bandeja de empleado (pedido-service :8084)
 */
export async function obtenerPedidos() {
  const response = await fetch(`${PEDIDOS_API_URL}/pedidos`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudieron cargar los pedidos.');
  }
  return data;
}

/**
 * Actualizar estado de un pedido (pedido-service :8084)
 */
export async function actualizarEstadoPedido(id, estado) {
  const response = await fetch(`${PEDIDOS_API_URL}/pedidos/${id}/estado`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ estado }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudo actualizar el estado del pedido.');
  }
  return data;
}

/**
 * Obtener KPIs de negocio (metrica-service :8085)
 */
export async function obtenerKpis() {
  const response = await fetch(`${METRICAS_API_URL}/metricas/kpis`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudieron cargar las métricas.');
  }
  return data;
}
