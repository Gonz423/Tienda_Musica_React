import { useState } from 'react'
import TablaStockEmpleado from './TablaStockEmpleado'

function SeccionStockEmpleado({ productos: productosProp = [], onActualizarStock, soloLectura = false }) {
  const [productosLocales, setProductosLocales] = useState(productosProp)
  const productos = onActualizarStock || soloLectura ? productosProp : productosLocales

  const handleAjustarStock = (codigo, nuevoStock) => {
    if (onActualizarStock) {
      onActualizarStock(codigo, nuevoStock)
    } else {
      setProductosLocales((prev) =>
        prev.map((p) => (p.codigo === codigo ? { ...p, stock: nuevoStock } : p))
      )
    }
  }

  const stockBajoCount = productos.filter((p) => p.stock < 3).length

  return (
    <TablaStockEmpleado
      productos={productos}
      stockBajoCount={stockBajoCount}
      handleAjustarStock={handleAjustarStock}
      soloLectura={soloLectura}
    />
  )
}

export default SeccionStockEmpleado
