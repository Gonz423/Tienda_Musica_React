import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionProductosJefe from '../components/SeccionProductosJefe'

function ProductosJefe({ productos = [], onAgregarProducto, onActualizarProducto, onEliminarProducto }) {
  return (
    <LayoutJefe>
      <EncabezadoJefe seccion="productos" />
      <SeccionProductosJefe
        productos={productos}
        onAgregarProducto={onAgregarProducto}
        onActualizarProducto={onActualizarProducto}
        onEliminarProducto={onEliminarProducto}
      />
    </LayoutJefe>
  )
}

export default ProductosJefe
