import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import VistaCliente from './components/VistaCliente'
import VistaEmpleado from './components/VistaEmpleado'
import VistaJefe from './components/VistaJefe'
import DetalleProducto from './pages/DetalleProducto'
import Inicio from './pages/Inicio'
import Contacto from './pages/Contacto'
import Footer from './components/Footer'
import CarritoModal from './components/CarritoModal'
import Login from './components/Login'
import { productosIniciales } from './data/productos'
import { pedidosIniciales } from './data/pedidos'
import { cargarCarritoStorage, guardarCarritoStorage } from './utils/persistencia'

function App() {
  const navigate = useNavigate()

  // Rol activo: 'cliente' | 'trabajador' | 'jefe'
  const [rolActual, setRolActual] = useState('cliente')

  // Sesión
  const [sesionAbierta, setSesionAbierta] = useState(false)
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [mostrarLogin, setMostrarLogin] = useState(false)

  const [seccionTrabajador, setSeccionTrabajador] = useState('pedidos')
  const [seccionJefe, setSeccionJefe] = useState('metricas')

  // Productos y pedidos
  const [productos, setProductos] = useState(productosIniciales)
  const [pedidos, setPedidos] = useState(pedidosIniciales)

  // Carrito
  const [carrito, setCarrito] = useState(() => cargarCarritoStorage())
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false)

  const handleIniciarSesion = (usuario) => {
    setUsuarioActual(usuario)
    setSesionAbierta(true)
    setMostrarLogin(false)
    if (usuario.rol) {
      setRolActual(usuario.rol)
      if (usuario.rol === 'trabajador') {
        setSeccionTrabajador('pedidos')
      } else if (usuario.rol === 'jefe') {
        setSeccionJefe('metricas')
      }
    }
    navigate('/')
  }

  const handleCerrarSesion = () => {
    setUsuarioActual(null)
    setSesionAbierta(false)
    setRolActual('cliente')
    navigate('/')
  }

  const handleAgregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const nuevo = [...prev, producto]
      guardarCarritoStorage(nuevo)
      return nuevo
    })
  }

  // Disminuir cantidad
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

  // Quitar producto
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

  // Finalizar compra y descontar stock
  const handleFinalizarCompra = (nuevaOrden) => {
    setPedidos((prev) => [nuevaOrden, ...prev])

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
      <Navbar
        rolActual={rolActual}
        setRolActual={setRolActual}
        cantidadCarrito={carrito.length}
        onAbrirCarrito={() => setModalCarritoAbierto(true)}
        seccionJefe={seccionJefe}
        setSeccionJefe={setSeccionJefe}
        seccionTrabajador={seccionTrabajador}
        setSeccionTrabajador={setSeccionTrabajador}
        sesionAbierta={sesionAbierta}
        usuarioActual={usuarioActual}
        onAbrirLogin={() => setMostrarLogin(true)}
        onCerrarSesion={handleCerrarSesion}
      />

      <main className="flex-grow-1">
        {/* Vista Cliente */}
        {rolActual === 'cliente' && (
          <Routes>
            <Route
              path="/"
              element={
                <Inicio
                  productos={productos}
                  onAgregarAlCarrito={handleAgregarAlCarrito}
                  onAbrirCarrito={() => setModalCarritoAbierto(true)}
                />
              }
            />
            <Route
              path="/catalogo"
              element={
                <VistaCliente
                  productos={productos}
                  onAgregarAlCarrito={handleAgregarAlCarrito}
                  onAbrirCarrito={() => setModalCarritoAbierto(true)}
                />
              }
            />
            <Route path="/contacto" element={<Contacto />} />
            <Route
              path="/producto/:id"
              element={
                <DetalleProducto
                  productos={productos}
                  onAgregarAlCarrito={handleAgregarAlCarrito}
                  onAbrirCarrito={() => setModalCarritoAbierto(true)}
                />
              }
            />
          </Routes>
        )}

        {/* Vista Trabajador */}
        {rolActual === 'trabajador' && (
          <Routes>
            <Route
              path="/"
              element={
                <VistaEmpleado
                  productos={productos}
                  pedidos={pedidos}
                  seccionActiva={seccionTrabajador}
                  onCambiarSeccion={setSeccionTrabajador}
                  onActualizarStock={handleActualizarStock}
                  onActualizarEstadoPedido={handleActualizarEstadoPedido}
                />
              }
            />
            <Route path="/producto/:id" element={<DetalleProducto productos={productos} />} />
            <Route
              path="*"
              element={
                <VistaEmpleado
                  productos={productos}
                  pedidos={pedidos}
                  seccionActiva={seccionTrabajador}
                  onCambiarSeccion={setSeccionTrabajador}
                  onActualizarStock={handleActualizarStock}
                  onActualizarEstadoPedido={handleActualizarEstadoPedido}
                />
              }
            />
          </Routes>
        )}

        {/* Vista Jefe */}
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
            onCambinarSeccion={setSeccionJefe}
          />
        )}
      </main>

      {/* Carrito */}
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

      {/* Login */}
      {mostrarLogin && (
        <Login
          onIniciarSesion={handleIniciarSesion}
          onCerrar={() => setMostrarLogin(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
