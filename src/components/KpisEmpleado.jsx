import TarjetaKPI from './TarjetaKPI'

function KpisEmpleado({ totalPendientes, totalPreparacion, totalDespachados }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <TarjetaKPI
          titulo="Por Preparar"
          valor={totalPendientes}
          descripcion="Estado pendiente"
          icono="bi-hourglass-split"
          colorValor="#ffc107"
          colorIcono="#d97706"
        />
      </div>
      <div className="col-12 col-md-4">
        <TarjetaKPI
          titulo="En Preparación"
          valor={totalPreparacion}
          descripcion="Listos para empaque"
          icono="bi-box-seam"
          colorValor="var(--color-acento)"
          colorIcono="var(--color-acento)"
        />
      </div>
      <div className="col-12 col-md-4">
        <TarjetaKPI
          titulo="Despachados"
          valor={totalDespachados}
          descripcion="Entregados con éxito"
          icono="bi-check2-circle"
          colorValor="#198754"
          colorIcono="#16a34a"
        />
      </div>
    </div>
  )
}

export default KpisEmpleado

