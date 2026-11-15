import { useEffect, useState } from 'react'
import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionMetricasJefe from '../components/SeccionMetricasJefe'
import SeccionProductosJefe from '../components/SeccionProductosJefe'
import SeccionUsuariosJefe from '../components/SeccionUsuariosJefe'
import { obtenerKpis } from '../services/pedidoService'

function MetricasJefe({
  productos = [],
  pedidos = [],
  seccionActiva = 'metricas',
  ...restoProps
}) {
  const [kpis, setKpis] = useState(null)

  useEffect(() => {
    let activo = true
    obtenerKpis()
      .then((data) => {
        if (activo && data) {
          setKpis(data)
        }
      })
      .catch(() => {
        // Fallback a datos locales si el backend no está disponible
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
  const stockCritico = productos.filter((p) => p.stock <= 3)
  const pedidosRecientes = kpis?.ultimosPedidos || pedidos

  return (
    <LayoutJefe>
      <EncabezadoJefe seccion={seccionActiva} />
      {seccionActiva === 'productos' ? (
        <SeccionProductosJefe productos={productos} {...restoProps} />
      ) : seccionActiva === 'usuarios' ? (
        <SeccionUsuariosJefe {...restoProps} />
      ) : (
        <SeccionMetricasJefe
          totalVentas={totalVentas}
          atendidos={atendidos}
          pendientes={pendientes}
          stockCritico={stockCritico}
          pedidos={pedidosRecientes}
          formatoMoneda={formatoMoneda}
        />
      )}
    </LayoutJefe>
  )
}

export default MetricasJefe
