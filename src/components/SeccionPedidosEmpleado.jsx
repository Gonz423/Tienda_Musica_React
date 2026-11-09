import { useState } from 'react'
import KpisEmpleado from './KpisEmpleado'
import TablaPedidosEmpleado from './TablaPedidosEmpleado'

function SeccionPedidosEmpleado({ pedidos: pedidosProp, productos, onActualizarEstadoPedido }) {
  const [pedidosLocales, setPedidosLocales] = useState(pedidosProp || [])
  const pedidos = pedidosProp || pedidosLocales

  const obtenerStockReal = (codigo) => {
    const item = (productos || []).find((p) => String(p.codigo).toLowerCase() === String(codigo).toLowerCase())
    return item ? item.stock : 0
  }

  const agruparProductos = (listaProductos = []) => {
    const contador = {}
    listaProductos.forEach((prod, index) => {
      const clave = prod.codigo || prod.id || `${prod.nombre}-${index}`
      if (!contador[clave]) {
        contador[clave] = { ...prod, id: prod.id || prod.codigo || clave, cantidad: Number(prod.cantidad || prod.cant || 1), stock: obtenerStockReal(prod.codigo) }
      } else {
        contador[clave].cantidad += Number(prod.cantidad || prod.cant || 1)
      }
    })
    return Object.values(contador)
  }

  const avanzarEstado = (id) => {
    const pedidoActual = pedidos.find((p) => p.id === id)
    let nuevoEstado = pedidoActual.estado
    if (pedidoActual.estado === 'Pendiente') nuevoEstado = 'En preparación'
    else if (pedidoActual.estado?.toLowerCase().includes('prepara')) nuevoEstado = 'Despachado'

    if (onActualizarEstadoPedido) {
      onActualizarEstadoPedido(id, nuevoEstado)
    } else {
      setPedidosLocales((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)))
    }
  }

  const obtenerColorBadge = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-warning text-dark'
      case 'En preparación': return 'btn-sv-primary'
      case 'Despachado': return 'bg-success'
      default: return 'bg-secondary'
    }
  }

  const totalPendientes = pedidos.filter((p) => p.estado === 'Pendiente').length
  const totalPreparacion = pedidos.filter((p) => p.estado === 'En preparación').length
  const totalDespachados = pedidos.filter((p) => p.estado === 'Despachado').length

  return (
    <>
      <KpisEmpleado totalPendientes={totalPendientes} totalPreparacion={totalPreparacion} totalDespachados={totalDespachados} />
      <TablaPedidosEmpleado pedidos={pedidos} agruparProductos={agruparProductos} obtenerColorBadge={obtenerColorBadge} avanzarEstado={avanzarEstado} />
    </>
  )
}

export default SeccionPedidosEmpleado

