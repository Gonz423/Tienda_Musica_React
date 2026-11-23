import { useEffect, useState } from 'react'
import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionMetricasJefe from '../components/SeccionMetricasJefe'
import { obtenerKpis } from '../services/pedidoService'

function MetricasJefe({ productos = [], pedidos = [] }) {
  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let activo = true
    obtenerKpis()
      .then((data) => {
        if (activo && data && data.cantidadTotalPedidos !== undefined) {
          setKpis(data)
        }
      })
      .catch(() => {
        // Fallback a calculos locales con props
      })
    return () => {
      activo = false
    }
  }, [])

  const formatoMoneda = (val) => `$${Number(val || 0).toLocaleString('es-CL')}`
  const totalVentas =
    kpis?.totalIngresos ?? pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
  const atendidos =
    kpis != null
      ? Math.max(0, (kpis.cantidadTotalPedidos || 0) - (kpis.pedidosPendientes || 0))
      : pedidos.filter((p) => p.estado === 'Despachado' || p.estado === 'ENTREGADO').length
  const pendientes =
    kpis?.pedidosPendientes ??
    pedidos.filter((p) => p.estado !== 'Despachado' && p.estado !== 'ENTREGADO').length
  const stockCritico = productos.filter((p) => (Number(p.stock) || 0) <= 3)
  const pedidosRecientes = kpis?.ultimosPedidos || pedidos

  return (
    <LayoutJefe>
      <EncabezadoJefe seccion="metricas" />
      <SeccionMetricasJefe
        totalVentas={totalVentas}
        atendidos={atendidos}
        pendientes={pendientes}
        stockCritico={stockCritico}
        pedidos={pedidosRecientes}
        formatoMoneda={formatoMoneda}
      />
    </LayoutJefe>
  )
}

export default MetricasJefe
