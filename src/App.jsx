import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Catalogo from './pages/Catalogo'
import PedidosEmpleado from './pages/PedidosEmpleado'
import StockEmpleado from './pages/StockEmpleado'
import MetricasJefe from './pages/MetricasJefe'
import ProductosJefe from './pages/ProductosJefe'
import UsuariosJefe from './pages/UsuariosJefe'
import DetalleProducto from './pages/DetalleProducto'
import Inicio from './pages/Inicio'
import Contacto from './pages/Contacto'
import Footer from './components/Footer'
import CarritoModal from './components/CarritoModal'
import Login from './components/Login'
import LayoutApp from './components/LayoutApp'
import { productosIniciales } from './data/productos'
import { pedidosIniciales } from './data/pedidos'
import { usuariosIniciales } from './data/usuarios'
import {
  cargarCarritoStorage,
  guardarCarritoStorage,
  cargarUsuariosStorage,
  guardarUsuariosStorage
} from './utils/persistencia'
import {
  cargarSesionUsuario,
  guardarSesionUsuario,
  cerrarSesionUsuario
} from './services/authService'
import { listarProductos } from './services/productoService'

function App() {
  const navigate = useNavigate()

  // Sesión inicial desde localStorage
  const sesionGuardada = cargarSesionUsuario()

  // Rol activo: 'cliente' | 'trabajador' | 'jefe'
  const [rolActual, setRolActual] = useState(() => sesionGuardada?.rol || 'cliente')

  // Estado de sesión
  const [sesionAbierta, setSesionAbierta] = useState(() => Boolean(sesionGuardada))
  const [usuarioActual, setUsuarioActual] = useState(() => sesionGuardada || null)
  const [mostrarLogin, setMostrarLogin] = useState(false)

  const [seccionTrabajador, setSeccionTrabajador] = useState('pedidos')
  const [seccionJefe, setSeccionJefe] = useState('metricas')

  // Productos cargados desde backend con fallback a locales
  const [productos, setProductos] = useState(productosIniciales)
  const [pedidos, setPedidos] = useState(pedidosIniciales)
  const [usuarios, setUsuarios] = useState(() => cargarUsuariosStorage(usuariosIniciales))

  // Carga asíncrona de catálogo desde la API REST
  useEffect(() => {
    listarProductos()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductos(data)
        }
      })
      .catch(() => {
        // En modo offline o pruebas se mantienen los iniciales
      })
  }, [])

  // Carrito
  const [carrito, setCarrito] = useState(() => cargarCarritoStorage())
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false)

  const handleIniciarSesion = (usuario) => {
    setUsuarioActual(usuario)
    setSesionAbierta(true)
    setMostrarLogin(false)

    // Persistencia en localStorage
    guardarSesionUsuario(usuario)

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
    cerrarSesionUsuario()
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

  // Handlers de gestion de usuarios
  const handleCrearUsuario = (nuevoUsuario) => {
    setUsuarios((prev) => {
      const nuevo = [nuevoUsuario, ...prev]
      guardarUsuariosStorage(nuevo)
      return nuevo
    })
  }

  const handleActualizarUsuario = (usuarioActualizado) => {
    setUsuarios((prev) => {
      const nuevo = prev.map((u) => (u.id === usuarioActualizado.id ? { ...u, ...usuarioActualizado } : u))
      guardarUsuariosStorage(nuevo)
      return nuevo
    })
  }

  const handleAlternarEstadoUsuario = (id) => {
    setUsuarios((prev) => {
      const nuevo = prev.map((u) => {
        if (u.id === id) {
          return { ...u, activo: !u.activo }
        }
        return u
      })
      guardarUsuariosStorage(nuevo)
      return nuevo
    })
  }

  const handleAgregarHistorialUsuario = (id, accion, detalle) => {
    const ahora = new Date()
    const fechaStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(
      ahora.getDate()
    ).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`

    setUsuarios((prev) => {
      const nuevo = prev.map((u) => {
        if (u.id === id) {
          const evento = {
            id: Date.now(),
            fecha: fechaStr,
            accion,
            detalle
          }
          return {
            ...u,
            historial: [evento, ...(u.historial || [])]
          }
        }
        return u
      })
      guardarUsuariosStorage(nuevo)
      return nuevo
    })
  }

  return (
    <LayoutApp
      navbar={
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
      }
      footer={<Footer />}
      modales={
        <>
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
          {mostrarLogin && (
            <Login
              usuarios={usuarios}
              onIniciarSesion={handleIniciarSesion}
              onCerrar={() => setMostrarLogin(false)}
            />
          )}
        </>
      }
    >
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
              <Catalogo
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
              seccionTrabajador === 'pedidos' ? (
                <PedidosEmpleado
                  pedidos={pedidos}
                  productos={productos}
                  onActualizarEstadoPedido={handleActualizarEstadoPedido}
                />
              ) : (
                <StockEmpleado
                  productos={productos}
                  onActualizarStock={handleActualizarStock}
                />
              )
            }
          />
          <Route path="/producto/:id" element={<DetalleProducto productos={productos} />} />
          <Route
            path="*"
            element={
              seccionTrabajador === 'pedidos' ? (
                <PedidosEmpleado
                  pedidos={pedidos}
                  productos={productos}
                  onActualizarEstadoPedido={handleActualizarEstadoPedido}
                />
              ) : (
                <StockEmpleado
                  productos={productos}
                  onActualizarStock={handleActualizarStock}
                />
              )
            }
          />
        </Routes>
      )}

      {/* Vista Jefe */}
      {rolActual === 'jefe' && (
        <>
          {seccionJefe === 'metricas' && (
            <MetricasJefe productos={productos} pedidos={pedidos} />
          )}
          {seccionJefe === 'productos' && (
            <ProductosJefe
              productos={productos}
              onAgregarProducto={handleAgregarProducto}
              onActualizarProducto={handleActualizarProducto}
              onEliminarProducto={handleEliminarProducto}
            />
          )}
          {seccionJefe === 'usuarios' && (
            <UsuariosJefe
              usuarios={usuarios}
              usuarioActual={usuarioActual}
              onCrearUsuario={handleCrearUsuario}
              onActualizarUsuario={handleActualizarUsuario}
              onAlternarEstadoUsuario={handleAlternarEstadoUsuario}
              onAgregarHistorialUsuario={handleAgregarHistorialUsuario}
            />
          )}
        </>
      )}
    </LayoutApp>
  )
}

export default App
