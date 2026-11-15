const API_URL = 'http://localhost:8080/api';

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

export async function crearPedido(datosPedido) {
  const response = await fetch(`${API_URL}/pedidos`, {
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

export async function obtenerPedidos() {
  const response = await fetch(`${API_URL}/pedidos`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudieron cargar los pedidos.');
  }
  return data;
}

export async function actualizarEstadoPedido(id, estado) {
  const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
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

export async function obtenerKpis() {
  const response = await fetch(`${API_URL}/metricas/kpis`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensaje || 'No se pudieron cargar las métricas.');
  }
  return data;
}
