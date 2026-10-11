// Servicio asincrono para simulacion de carga de metricas y guardado remoto
export async function cargarMetricasAsincronas(servicio) {
  const metricas = await servicio.obtenerMetricas()
  return metricas
}

export async function guardarProductoRemoto(servicio, producto) {
  const respuesta = await servicio.guardar(producto)
  return respuesta
}
