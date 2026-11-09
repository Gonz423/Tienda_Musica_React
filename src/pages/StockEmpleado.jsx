import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionStockEmpleado from '../components/SeccionStockEmpleado'

function StockEmpleado({ productos = [], onActualizarStock }) {
  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva="stock" />
      <SeccionStockEmpleado
        productos={productos}
        onActualizarStock={onActualizarStock}
      />
    </LayoutEmpleado>
  )
}

export default StockEmpleado
