import { useState } from 'react'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'
import LayoutCatalogo from '../components/LayoutCatalogo'
import ContenedorCatalogo from '../components/ContenedorCatalogo'
import HeroCatalogo from '../components/HeroCatalogo'
import AlertaOperacion from '../components/AlertaOperacion'
import FiltrosCatalogo from '../components/FiltrosCatalogo'
import ListaProductos from '../components/ListaProductos'

function Catalogo({ productos = [], onAgregarAlCarrito, onAbrirCarrito }) {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('destacados')
  const [mensajeAlerta, setMensajeAlerta] = useState('')

  // Agregar al carrito
  const handleAgregar = (producto) => {
    if (onAgregarAlCarrito) {
      onAgregarAlCarrito(producto)
    }
    const carritoActual = cargarCarritoStorage()
    guardarCarritoStorage([...carritoActual, producto])
    setMensajeAlerta(`Agregaste "${producto.nombre}" al carrito de compras.`)
    setTimeout(() => {
      setMensajeAlerta('')
    }, 2500)
  }

  // Categorias
  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))]

  // Filtros
  let productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaFiltro === 'todas' ||
      producto.categoria.toLowerCase() === categoriaFiltro.toLowerCase()

    const termino = busqueda.toLowerCase().trim()
    const coincideBusqueda =
      termino === '' ||
      producto.nombre.toLowerCase().includes(termino) ||
      producto.marca.toLowerCase().includes(termino) ||
      producto.modelo.toLowerCase().includes(termino)

    return coincideCategoria && coincideBusqueda
  })

  // Ordenamiento
  if (orden === 'menor-precio') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio)
  } else if (orden === 'mayor-precio') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio)
  } else if (orden === 'nombre-az') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  const handleRestablecerFiltros = () => {
    setCategoriaFiltro('todas')
    setBusqueda('')
    setOrden('destacados')
  }

  return (
    <LayoutCatalogo>
      <HeroCatalogo />

      <ContenedorCatalogo>
        <AlertaOperacion
          mensaje={mensajeAlerta}
          onAccion={onAbrirCarrito}
          textoAccion="Ver Carrito"
        />

        <FiltrosCatalogo
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          categoriaFiltro={categoriaFiltro}
          setCategoriaFiltro={setCategoriaFiltro}
          categorias={categorias}
          orden={orden}
          setOrden={setOrden}
          totalMostrados={productosFiltrados.length}
          totalProductos={productos.length}
        />

        <div className="pb-5 mt-4">
          <ListaProductos
            productos={productosFiltrados}
            onAgregarAlCarrito={handleAgregar}
            onRestablecerFiltros={handleRestablecerFiltros}
          />
        </div>
      </ContenedorCatalogo>
    </LayoutCatalogo>
  )
}

export default Catalogo
