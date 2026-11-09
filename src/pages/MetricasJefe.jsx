import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionMetricasJefe from '../components/SeccionMetricasJefe'

function MetricasJefe({ productos = [], pedidos = [] }) {
  const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString('es-CL')}`
  const totalVentas = pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
  const atendidos = pedidos.filter((p) => p.estado === 'Despachado').length
  const pendientes = pedidos.filter((p) => p.estado !== 'Despachado').length
  const stockCritico = productos.filter((p) => p.stock <= 3)

  return (
    <LayoutJefe>
      <EncabezadoJefe seccion="metricas" />
      <SeccionMetricasJefe
        totalVentas={totalVentas}
        atendidos={atendidos}
        pendientes={pendientes}
        stockCritico={stockCritico}
        pedidos={pedidos}
        formatoMoneda={formatoMoneda}
      />
    </LayoutJefe>
  )
}

export default MetricasJefe
