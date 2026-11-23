import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionStockEmpleado from '../components/SeccionStockEmpleado'
import ControlStockBodega from '../components/ControlStockBodega'
import { obtenerToken } from '../services/authService'

function StockEmpleado({ productos = [], onActualizarStock }) {
  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva="stock" />
      {/* Con sesión JWT se usa producto-service (8083); sin token se mantiene el modo local */}
      {obtenerToken() ? (
        <ControlStockBodega onActualizarStock={onActualizarStock} />
      ) : (
        <SeccionStockEmpleado
          productos={productos}
          onActualizarStock={onActualizarStock}
        />
      )}
    </LayoutEmpleado>
  )
}

export default StockEmpleado
