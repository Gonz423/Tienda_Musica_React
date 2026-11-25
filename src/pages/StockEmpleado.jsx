import LayoutEmpleado from '../components/LayoutEmpleado'
import EncabezadoEmpleado from '../components/EncabezadoEmpleado'
import SeccionStockEmpleado from '../components/SeccionStockEmpleado'

function StockEmpleado({ productos = [], onActualizarStock, soloLectura = false }) {
  return (
    <LayoutEmpleado>
      <EncabezadoEmpleado seccionActiva="stock" soloLectura={soloLectura} />
      <SeccionStockEmpleado
        productos={productos}
        onActualizarStock={onActualizarStock}
        soloLectura={soloLectura}
      />
    </LayoutEmpleado>
  )
}

export default StockEmpleado
