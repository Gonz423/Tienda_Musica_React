import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import productosIniciales from '../data/productos'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'
import { obtenerProductoPorId } from '../services/productoService'
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
  const [productoRemoto, setProductoRemoto] = useState(null)

  // Consulta asíncrona hacia el backend si no está disponible o para datos actualizados
  useEffect(() => {
    let activo = true
    if (id) {
      obtenerProductoPorId(id)
        .then((data) => {
          if (activo && data) {
            setProductoRemoto(data)
          }
        })
        .catch(() => {
          // Si falla o no hay red, se mantiene el catálogo local
        })
    }
    return () => {
      activo = false
    }
  }, [id])

  const producto =
    productoRemoto ||
    productos.find(
      (p) =>
        String(p.codigo).toLowerCase() === String(id).toLowerCase() ||
        String(p.id) === String(id)
    )

  if (!producto) return <ProductoNoEncontrado id={id} />

  const resolverImagen = () => {
    if (!producto.imagen && !producto.imagenUrl && !producto.codigo) return ''
    const imgSource = producto.imagenUrl || producto.imagen
    if (imgSource?.startsWith('http') || imgSource?.startsWith('data:')) return imgSource
    const nombreArchivo = (imgSource || producto.codigo).split('/').pop()
    const nombreBase = nombreArchivo.split('.')[0]
    for (const ruta in imagenesDisponibles) {
      if (ruta.includes(nombreBase)) {
        return imagenesDisponibles[ruta]
      }
    }
    return imagenesDisponibles['../assets/img/GA001.jpg'] || imgSource
  }

  const handleAgregar = () => {
    if (producto.stock === 0) return

    for (let i = 0; i < cantidad; i++) {
      if (onAgregarAlCarrito) {
        onAgregarAlCarrito(producto)
      }
    }
    const actual = cargarCarritoStorage()
    const nuevosItems = Array(cantidad).fill(producto)
    guardarCarritoStorage([...actual, ...nuevosItems])

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
