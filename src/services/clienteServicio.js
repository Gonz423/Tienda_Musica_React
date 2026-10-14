// src/services/clienteServicio.js
// Servicio asincrono para simulacion de operaciones de la vista del cliente

export async function consultarDisponibilidadStock(servicio, codigo) {
  const respuesta = await servicio.consultarStock(codigo)
  return respuesta
}

export async function procesarCheckoutCliente(servicio, datosPedido) {
  const respuesta = await servicio.crearPedido(datosPedido)
  return respuesta
}
