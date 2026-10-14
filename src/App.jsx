import { useState } from 'react'
import Navbar from './components/Navbar'
import VistaCliente from './components/VistaCliente'
import VistaJefe from './components/VistaJefe'
import Footer from './components/Footer'
import CarritoModal from './components/CarritoModal'
import { productosIniciales } from './data/productos'
import { pedidosIniciales } from './data/pedidos'
import { cargarCarritoStorage, guardarCarritoStorage } from './utils/persistencia'

function App() {
  // Estado para el rol activo: 'cliente', 'trabajador', 'jefe'
  const [rolActual, setRolActual] = useState('cliente')

  // Estado para el inventario de productos y pedidos
  const [productos, setProductos] = useState(productosIniciales)
  const [pedidos, setPedidos] = useState(pedidosIniciales)
  const [seccionJefe, setSeccionJefe] = useState('metricas')

  // Estado para el carrito de compras y visibilidad del modal/sidebar
  const [carrito, setCarrito] = useState(() => cargarCarritoStorage())
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false)

  // Agregar producto al carrito
  const handleAgregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const nuevo = [...prev, producto]
      guardarCarritoStorage(nuevo)
      return nuevo
    })
  }

  // Restar una unidad de un producto del carrito
  const handleRestarUno = (codigo) => {
    setCarrito((prev) => {
      const index = prev.findIndex((p) => p.codigo === codigo)
      if (index === -1) return prev
      const nuevo = [...prev]
      nuevo.splice(index, 1)
      guardarCarritoStorage(nuevo)
      return nuevo
    })
  }

  // Eliminar todas las unidades de un producto
  const handleEliminarDelCarrito = (codigo) => {
    setCarrito((prev) => {
      const nuevo = prev.filter((p) => p.codigo !== codigo)
      guardarCarritoStorage(nuevo)
      return nuevo
    })
  }

  // Vaciar carrito
  const handleVaciarCarrito = () => {
    setCarrito([])
    guardarCarritoStorage([])
  }

  // Finalizar compra: agrega pedido a la lista global y descuenta stock
  const handleFinalizarCompra = (nuevaOrden) => {
    // 1. Agregar pedido a la lista global para que Jefe y Trabajador lo visualicen
    setPedidos((prev) => [nuevaOrden, ...prev])

    // 2. Descontar stock de los productos comprados
    if (nuevaOrden.productos && nuevaOrden.productos.length > 0) {
      nuevaOrden.productos.forEach((itemComprado) => {
        setProductos((prev) =>
          prev.map((p) => {
            if (p.codigo === itemComprado.codigo) {
              const stockActual = Number(p.stock) || 0
              const nuevoStock = Math.max(0, stockActual - itemComprado.cantidad)
              return { ...p, stock: nuevoStock }
            }
            return p
          })
        )
      })
    }

    // 3. Vaciar carrito en estado y almacenamiento local
    handleVaciarCarrito()
  }

  const handleActualizarEstadoPedido = (id, nuevoEstado) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    )
  }

  const handleAgregarProducto = (nuevoProducto) => {
    setProductos((prev) => [nuevoProducto, ...prev])
  }

  const handleEliminarProducto = (codigo) => {
    setProductos((prev) => prev.filter((p) => p.codigo !== codigo))
  }

  const handleActualizarStock = (codigo, nuevoStock) => {
    setProductos((prev) =>
      prev.map((p) => (p.codigo === codigo ? { ...p, stock: Number(nuevoStock) } : p))
    )
  }

  const handleActualizarProducto = (productoActualizado) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.codigo === productoActualizado.codigo ? { ...p, ...productoActualizado } : p
      )
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Barra de navegacion con selector de rol y badge de carrito */}
      <Navbar
        rolActual={rolActual}
        setRolActual={setRolActual}
        cantidadCarrito={carrito.length}
        onAbrirCarrito={() => setModalCarritoAbierto(true)}
        seccionJefe={seccionJefe}
        setSeccionJefe={setSeccionJefe}
      />

      {/* Contenido principal con renderizado condicional segun el rol */}
      <main className="flex-grow-1">
        {/* VISTA 1: CLIENTE (Gonzalo - Issue #7) */}
        {rolActual === 'cliente' && (
          <VistaCliente
            productos={productos}
            onAgregarAlCarrito={handleAgregarAlCarrito}
            onAbrirCarrito={() => setModalCarritoAbierto(true)}
          />
        )}

        {/* VISTA 2: TRABAJADOR (Preparado para Itsa - Issue #8) */}
        {rolActual === 'trabajador' && (
          <div className="container py-5">
            <div className="p-4 bg-white rounded-3 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h2 className="fw-bold text-dark mb-0">
                  <i className="bi bi-briefcase text-info me-2"></i>
                  Panel de Operacion - Trabajadores de Tienda
                </h2>
                <span className="badge bg-info text-dark">Rol: Personal de Bodega y Ventas</span>
              </div>
              <p className="text-muted mb-0">
                Modulo de recepcion de pedidos y control rapido de stock.
              </p>
            </div>
          </div>
        )}

        {/* VISTA 3: JEFE (Preparado para Damian - Issue #9) */}
        {rolActual === 'jefe' && (
          <VistaJefe
            productos={productos}
            pedidos={pedidos}
            onAgregarProducto={handleAgregarProducto}
            onActualizarProducto={handleActualizarProducto}
            onEliminarProducto={handleEliminarProducto}
            onActualizarStock={handleActualizarStock}
            onActualizarEstadoPedido={handleActualizarEstadoPedido}
            seccionActiva={seccionJefe}
            onCambiarSeccion={setSeccionJefe}
          />
        )}
      </main>

      {/* Modal interactivo del Carrito de Compras */}
      <CarritoModal
        abierto={modalCarritoAbierto}
        onCerrar={() => setModalCarritoAbierto(false)}
        carrito={carrito}
        onAgregarUno={handleAgregarAlCarrito}
        onRestarUno={handleRestarUno}
        onEliminarProducto={handleEliminarDelCarrito}
        onVaciarCarrito={handleVaciarCarrito}
        onFinalizarCompra={handleFinalizarCompra}
      />

      {/* Pie de pagina institucional */}
      <Footer />
    </div>
  )
}

export default App
