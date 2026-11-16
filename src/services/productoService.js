const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Consulta el catalogo de productos con filtros opcionales
export async function listarProductos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.categoria && filtros.categoria !== 'todas') {
    params.append('categoria', filtros.categoria);
  }
  if (filtros.busqueda) {
    params.append('busqueda', filtros.busqueda);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const respuesta = await fetch(`${API_URL}/productos${queryString}`);

  if (!respuesta.ok) {
    throw new Error('Error al obtener el catálogo de productos');
  }

  return respuesta.json();
}

// Obtiene un producto por su ID o codigo
export async function obtenerProductoPorId(id) {
  const respuesta = await fetch(`${API_URL}/productos/${id}`);

  if (!respuesta.ok) {
    if (respuesta.status === 404) {
      // Intentar buscar por codigo alternativo si el id es alfanumerico
      const respuestaCodigo = await fetch(`${API_URL}/productos/codigo/${id}`);
      if (respuestaCodigo.ok) {
        return respuestaCodigo.json();
      }
      throw new Error('Producto no encontrado');
    }
    throw new Error('Error al obtener el detalle del producto');
  }

  return respuesta.json();
}

// Obtiene un producto por su codigo unico
export async function obtenerProductoPorCodigo(codigo) {
  const respuesta = await fetch(`${API_URL}/productos/codigo/${codigo}`);

  if (!respuesta.ok) {
    throw new Error('Producto no encontrado');
  }

  return respuesta.json();
}
