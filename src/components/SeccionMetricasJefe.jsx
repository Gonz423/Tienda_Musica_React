import TarjetaKPI from './TarjetaKPI'
import TablaStockCritico from './TablaStockCritico'
import TablaUltimosPedidos from './TablaUltimosPedidos'

function SeccionMetricasJefe({ totalVentas, atendidos, pendientes, stockCritico, pedidos, formatoMoneda }) {
  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <TarjetaKPI
            titulo="Total Ventas Acumuladas"
            valor={formatoMoneda(totalVentas)}
            icono="bi-cash-coin"
            colorValor="var(--color-acento)"
            colorIcono="var(--color-acento)"
            headingLevel={2}
            layout="vertical"
            extraBadge={
              <span className="badge bg-light text-muted border align-self-start">
                <i className="bi bi-receipt me-1"></i> {pedidos.length} pedidos totales
              </span>
            }
          />
        </div>
        <div className="col-12 col-md-4">
          <TarjetaKPI
            titulo="Flujo de Pedidos"
            valor={
              <>
                {atendidos} <small className="text-muted fs-6">vs</small> {pendientes}
              </>
            }
            icono="bi-arrow-repeat"
            colorValor="var(--color-secundario)"
            colorIcono="var(--color-primario)"
            headingLevel={2}
            layout="vertical"
            extraBadge={
              <div className="d-flex gap-2">
                <span className="badge btn-sv-secondary">{atendidos} atendidos</span>
                <span className="badge bg-warning text-dark border">{pendientes} pendientes</span>
              </div>
            }
          />
        </div>
        <div className="col-12 col-md-4">
          <TarjetaKPI
            titulo="Productos Stock Crítico"
            valor={stockCritico.length}
            icono="bi-exclamation-triangle-fill"
            colorValor="#dc3545"
            colorIcono="#dc3545"
            headingLevel={2}
            layout="vertical"
            extraBadge={
              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle align-self-start">
                Stock ≤ 3 unidades
              </span>
            }
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <TablaStockCritico stockCritico={stockCritico} formatoMoneda={formatoMoneda} />
        </div>
        <div className="col-12 col-lg-6">
          <TablaUltimosPedidos pedidos={pedidos} formatoMoneda={formatoMoneda} />
        </div>
      </div>
    </>
  )
}

export default SeccionMetricasJefe

