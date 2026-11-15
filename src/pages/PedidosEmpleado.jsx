import { useEffect, useState } from 'react'
import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionPedidosEmpleado from '../components/SeccionPedidosEmpleado'
import SeccionStockEmpleado from '../components/SeccionStockEmpleado'
import { actualizarEstadoPedido, obtenerPedidos } from '../services/pedidoService'

function PedidosEmpleado({
  pedidos,
  productos = [],
  onActualizarEstadoPedido,
  seccionActiva = 'pedidos',
  ...restoProps
}) {
  const [listaPedidos, setListaPedidos] = useState(pedidos || [])
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  useEffect(() => {
    let activo = true
    obtenerPedidos()
      .then((data) => {
        if (activo && Array.isArray(data)) {
          setListaPedidos(data)
        }
      })
      .catch(() => {
        // Fallback a props locales si el backend no está disponible
      })
    return () => {
      activo = false
    }
  }, [])

  const handleActualizarEstado = async (id, nuevoEstado) => {
    try {
      const actualizado = await actualizarEstadoPedido(id, nuevoEstado)
      setListaPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: actualizado.estado || nuevoEstado } : p))
      )
    } catch {
      setListaPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      )
    }
    if (onActualizarEstadoPedido) {
      onActualizarEstadoPedido(id, nuevoEstado)
    }
  }

  const pedidosFiltrados =
    filtroEstado === 'TODOS'
      ? listaPedidos
      : listaPedidos.filter((p) => p.estado === filtroEstado)

  const totalActivos = listaPedidos.filter(
    (p) => p.estado !== 'ENTREGADO' && p.estado !== 'Despachado'
  ).length

  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva={seccionActiva} totalActivos={totalActivos} />
      {seccionActiva === 'stock' ? (
        <SeccionStockEmpleado productos={productos} {...restoProps} />
      ) : (
        <>
          <div className="container mt-3 d-flex gap-2 flex-wrap">
            <button
              type="button"
              className={`btn btn-sm ${filtroEstado === 'TODOS' ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => setFiltroEstado('TODOS')}
            >
              Ver todos
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filtroEstado === 'PENDIENTE' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFiltroEstado('PENDIENTE')}
            >
              Solo pendientes
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filtroEstado === 'ENVIADO' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFiltroEstado('ENVIADO')}
            >
              Solo enviados
            </button>
          </div>
          <SeccionPedidosEmpleado
            pedidos={pedidosFiltrados}
            productos={productos}
            onActualizarEstadoPedido={handleActualizarEstado}
          />
        </>
      )}
    </LayoutEmpleado>
  )
}

export default PedidosEmpleado
