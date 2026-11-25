import { useState } from 'react'
import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionPedidosEmpleado from '../components/SeccionPedidosEmpleado'

/**
 * Bandeja de pedidos: el ADMIN gestiona estados, el VENDEDOR solo visualiza (soloLectura).
 * Los pedidos llegan desde pedido-service vía App.jsx y cada cambio de estado
 * se envía al backend con onActualizarEstadoPedido (PATCH /api/v1/pedidos/{id}/estado).
 */
function PedidosEmpleado({ pedidos = [], productos = [], onActualizarEstadoPedido, soloLectura = false }) {
  // Solo se usa sin callback (modo aislado / pruebas): cambios de estado locales por ID
  const [estadosLocales, setEstadosLocales] = useState({})
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  const listaPedidos = (pedidos || []).map((p) =>
    estadosLocales[p.id] ? { ...p, estado: estadosLocales[p.id] } : p
  )

  const handleActualizarEstado = (id, nuevoEstado) => {
    if (onActualizarEstadoPedido) {
      onActualizarEstadoPedido(id, nuevoEstado)
    } else {
      setEstadosLocales((prev) => ({ ...prev, [id]: nuevoEstado }))
    }
  }

  const pedidosFiltrados =
    filtroEstado === 'TODOS' ? listaPedidos : listaPedidos.filter((p) => p.estado === filtroEstado)

  const totalActivos = listaPedidos.filter(
    (p) => !['Entregado', 'Cancelado', 'Despachado'].includes(p.estado)
  ).length

  const filtros = [
    ['TODOS', 'Ver todos', 'dark'],
    ['Pendiente', 'Solo pendientes', 'warning'],
    ['Despachado', 'Solo enviados', 'info'],
    ['Entregado', 'Entregados', 'success']
  ]

  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva="pedidos" totalActivos={totalActivos} soloLectura={soloLectura} />
      <div className="container mt-3 d-flex gap-2 flex-wrap">
        {filtros.map(([valor, texto, color]) => (
          <button
            key={valor}
            type="button"
            className={`btn btn-sm ${filtroEstado === valor ? `btn-${color}` : `btn-outline-${color}`}`}
            onClick={() => setFiltroEstado(valor)}
          >
            {texto}
          </button>
        ))}
      </div>
      <SeccionPedidosEmpleado
        pedidos={pedidosFiltrados}
        productos={productos}
        onActualizarEstadoPedido={handleActualizarEstado}
        soloLectura={soloLectura}
      />
    </LayoutEmpleado>
  )
}

export default PedidosEmpleado
