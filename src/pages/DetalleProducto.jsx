import { useState } from 'react'
import { useParams } from 'react-router-dom'
import productosIniciales from '../data/productos'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'
import ProductoNoEncontrado from '../components/ProductoNoEncontrado'
import BreadcrumbProducto from '../components/BreadcrumbProducto'
import GaleriaProducto from '../components/GaleriaProducto'
import PanelCompraProducto from '../components/PanelCompraProducto'
import AlertaOperacion from '../components/AlertaOperacion'
import LayoutDetalleProducto from '../components/LayoutDetalleProducto'
import TarjetaDetalleProducto from '../components/TarjetaDetalleProducto'

const imagenesDisponibles = import.meta.glob('../assets/img/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

function DetalleProducto({ productos = productosIniciales, onAgregarAlCarrito, onAbrirCarrito }) {
  const { id } = useParams()
  const [cantidad, setCantidad] = useState(1)
  const [mensajeAlerta, setMensajeAlerta] = useState('')

  const producto = productos.find(
    (p) =>
      String(p.codigo).toLowerCase() === String(id).toLowerCase() ||
      String(p.id) === String(id)
  )

  if (!producto) return <ProductoNoEncontrado id={id} />

  const resolverImagen = () => {
    if (!producto.imagen && !producto.codigo) return ''
    if (producto.imagen?.startsWith('http') || producto.imagen?.startsWith('data:')) return producto.imagen
    const nombreArchivo = (producto.imagen || producto.codigo).split('/').pop()
    const nombreBase = nombreArchivo.split('.')[0]
    for (const ruta in imagenesDisponibles) {
      if (ruta.includes(nombreBase)) return imagenesDisponibles[ruta]
    }
    return imagenesDisponibles['../assets/img/GA001.jpg']
  }

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      if (onAgregarAlCarrito) onAgregarAlCarrito(producto)
    }
    const actual = cargarCarritoStorage()
    guardarCarritoStorage([...actual, ...Array(cantidad).fill(producto)])
    setMensajeAlerta(`Agregaste ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de "${producto.nombre}" al carrito.`)
    setTimeout(() => setMensajeAlerta(''), 3000)
  }

  return (
    <LayoutDetalleProducto>
      <BreadcrumbProducto categoria={producto.categoria} nombre={producto.nombre} />
      <AlertaOperacion mensaje={mensajeAlerta} onAccion={onAbrirCarrito} textoAccion="Ver Carrito" />
      <TarjetaDetalleProducto>
        <GaleriaProducto producto={producto} imagenUrl={resolverImagen()} />
        <PanelCompraProducto
          producto={producto}
          cantidad={cantidad}
          onIncrementar={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
          onDecrementar={() => setCantidad(Math.max(1, cantidad - 1))}
          onAgregar={handleAgregar}
        />
      </TarjetaDetalleProducto>
    </LayoutDetalleProducto>
  )
}

export default DetalleProducto
