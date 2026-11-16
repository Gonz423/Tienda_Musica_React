import { useEffect, useState } from 'react'
import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionPedidosEmpleado from '../components/SeccionPedidosEmpleado'
import { actualizarEstadoPedido, obtenerPedidos } from '../services/pedidoService'

function PedidosEmpleado({ pedidos = [], productos = [], onActualizarEstadoPedido }) {
  const [listaPedidos, setListaPedidos] = useState(pedidos || [])
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  // Si cambian las props de pedidos, sincronizar estado
  useEffect(() => {
    if (pedidos && pedidos.length > 0) {
      setListaPedidos(pedidos)
    }
  }, [pedidos])

  useEffect(() => {
    let activo = true
    obtenerPedidos()
      .then((data) => {
        if (activo && Array.isArray(data) && data.length > 0) {
          setListaPedidos(data)
        }
      })
      .catch(() => {
        // Fallback a props locales si el backend no esta disponible
      })
    return () => {
      activo = false
    }
  }, [])

  const handleActualizarEstado = (id, nuevoEstado) => {
    // Actualizacion optimista inmediata
    if (onActualizarEstadoPedido) {
      onActualizarEstadoPedido(id, nuevoEstado)
    }
    setListaPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    )
    // Sincronizacion asincrona con backend
    actualizarEstadoPedido(id, nuevoEstado).catch(() => {
      // Ignorar error en entorno offline o de pruebas
    })
  }

  const pedidosFiltrados =
    filtroEstado === 'TODOS'
      ? listaPedidos
      : listaPedidos.filter((p) => (p.estado || '').toUpperCase() === filtroEstado.toUpperCase())

  const totalActivos = listaPedidos.filter(
    (p) => p.estado !== 'ENTREGADO' && p.estado !== 'Despachado'
  ).length

  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva="pedidos" totalActivos={totalActivos} />
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
    </LayoutEmpleado>
  )
}

export default PedidosEmpleado
