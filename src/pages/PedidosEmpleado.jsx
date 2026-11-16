import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionPedidosEmpleado from '../components/SeccionPedidosEmpleado'

function PedidosEmpleado({ pedidos, productos = [], onActualizarEstadoPedido }) {
  const pedidosResueltos = pedidos || []
  const totalActivos = pedidosResueltos.filter((p) => p.estado !== 'Despachado').length

  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva="pedidos" totalActivos={totalActivos} />
      <SeccionPedidosEmpleado
        pedidos={pedidosResueltos}
        productos={productos}
        onActualizarEstadoPedido={onActualizarEstadoPedido}
      />
    </LayoutEmpleado>
  )
}

export default PedidosEmpleado
