import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import MisPedidos from './pages/MisPedidos'
import Footer from './components/Footer'
import CarritoModal from './components/CarritoModal'
import Login from './components/Login'
import LayoutApp from './components/LayoutApp'
import RutaProtegida from './components/RutaProtegida'
import AvisoGlobal from './components/AvisoGlobal'
import { productosIniciales } from './data/productos'
import { cargarCarritoStorage, guardarCarritoStorage } from './utils/persistencia'
import {
  cargarSesionUsuario,
  guardarSesionUsuario,
  cerrarSesionUsuario,
  refrescarToken
} from './services/authService'
import { EVENTO_SESION_EXPIRADA } from './services/apiCliente'
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  ajustarStockProducto
} from './services/productoService'
import { obtenerPedidos, actualizarEstadoPedido } from './services/pedidoService'
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  obtenerHistorialUsuario,
  agregarNotaUsuario,
  eliminarUsuario
} from './services/usuarioService'

// Roles del frontend: 'jefe' (ADMIN), 'trabajador' (VENDEDOR), 'cliente' (CLIENTE)
const ROLES_PERSONAL = ['trabajador', 'jefe']
const ROLES_ADMIN = ['jefe']
const ROLES_CLIENTE = ['cliente']

// Renueva el token 5 minutos antes de que expire
const MARGEN_RENOVACION_MS = 5 * 60 * 1000

const RUTA_INICIAL_POR_ROL = {
  jefe: '/admin/metricas',
  trabajador: '/vendedor/pedidos',
  cliente: '/'
}

function App() {
  const navigate = useNavigate()

  // Sesión: se reconstruye desde el JWT guardado (sobrevive a F5 mientras el token esté vigente)
  const [sesion, setSesion] = useState(() => cargarSesionUsuario())
  const rolActual = sesion?.rol || 'cliente'

  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [mensajeLogin, setMensajeLogin] = useState('')
  const [aviso, setAviso] = useState(null)

  const [productos, setProductos] = useState(productosIniciales)
  const [pedidos, setPedidos] = useState([])
  const [usuarios, setUsuarios] = useState([])

  const [carrito, setCarrito] = useState(() => cargarCarritoStorage())
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false)

  const mostrarAviso = useCallback((tipo, texto) => setAviso({ tipo, texto }), [])
  const mostrarError = useCallback((err) => mostrarAviso('error', err.message || String(err)), [mostrarAviso])

  useEffect(() => {
    if (!aviso) return undefined
    const t = setTimeout(() => setAviso(null), aviso.tipo === 'error' ? 6000 : 3500)
    return () => clearTimeout(t)
  }, [aviso])

  // ---------- Sesión ----------
  const expirarSesion = useCallback((mensaje) => {
    cerrarSesionUsuario()
    setSesion(null)
    setPedidos([])
    setUsuarios([])
    setMensajeLogin(mensaje)
    setMostrarLogin(true)
    navigate('/')
  }, [navigate])

  // Un 401 que no se pudo renovar en cualquier servicio dispara este evento (apiCliente.js)
  useEffect(() => {
    const alExpirar = () => expirarSesion('Tu sesión expiró o fue revocada. Inicia sesión nuevamente.')
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
  }, [expirarSesion])

  // Si se cierra sesión en otra pestaña, esta también se cierra
  useEffect(() => {
    const alCambiarStorage = (e) => {
      if (e.key === 'token' || e.key === null) setSesion(cargarSesionUsuario())
    }
    window.addEventListener('storage', alCambiarStorage)
    return () => window.removeEventListener('storage', alCambiarStorage)
  }, [])

  // Renovación automática del JWT antes de que expire (POST /api/v1/auth/refresh)
  useEffect(() => {
    if (!sesion?.expira) return undefined
    const espera = Math.max(5000, sesion.expira - Date.now() - MARGEN_RENOVACION_MS)
    const t = setTimeout(() => {
      refrescarToken()
        .then((nueva) => setSesion(nueva))
        .catch(() => expirarSesion('Tu sesión expiró. Inicia sesión nuevamente.'))
    }, espera)
    return () => clearTimeout(t)
  }, [sesion, expirarSesion])

  const handleIniciarSesion = (nuevaSesion) => {
    guardarSesionUsuario(nuevaSesion)
    setSesion(nuevaSesion)
    setMostrarLogin(false)
    setMensajeLogin('')
    navigate(RUTA_INICIAL_POR_ROL[nuevaSesion.rol] || '/')
  }

  const handleCerrarSesion = () => {
    cerrarSesionUsuario()
    setSesion(null)
    setPedidos([])
    setUsuarios([])
    navigate('/')
  }

  const abrirLogin = () => {
    setMensajeLogin('')
    setMostrarLogin(true)
  }

  // ---------- Carga de datos desde los microservicios ----------
  const recargarProductos = useCallback(() => {
    return listarProductos()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProductos(data)
      })
      .catch(() => {
        // Sin backend se muestra el catálogo local de solo lectura
      })
  }, [])

  useEffect(() => {
    recargarProductos()
  }, [recargarProductos])

  useEffect(() => {
    if (!ROLES_PERSONAL.includes(rolActual)) return
    obtenerPedidos().then(setPedidos).catch(mostrarError)
  }, [rolActual, mostrarError])

  useEffect(() => {
    if (!ROLES_ADMIN.includes(rolActual)) return
    listarUsuarios().then(setUsuarios).catch(mostrarError)
  }, [rolActual, mostrarError])

  // ---------- Carrito ----------
  const actualizarCarrito = (fn) => {
    setCarrito((prev) => {
      const nuevo = fn(prev)
      guardarCarritoStorage(nuevo)
      return nuevo
    })
  }

  const handleAgregarAlCarrito = (producto) => actualizarCarrito((prev) => [...prev, producto])

  const handleRestarUno = (codigo) =>
    actualizarCarrito((prev) => {
      const index = prev.findIndex((p) => p.codigo === codigo)
      if (index === -1) return prev
      const nuevo = [...prev]
      nuevo.splice(index, 1)
      return nuevo
    })

  const handleEliminarDelCarrito = (codigo) => actualizarCarrito((prev) => prev.filter((p) => p.codigo !== codigo))

  const handleVaciarCarrito = () => actualizarCarrito(() => [])

  // El backend ya descontó el stock: se recarga el catálogo para reflejarlo
  const handleFinalizarCompra = () => {
    recargarProductos()
  }

  // ---------- Pedidos (VENDEDOR ve, ADMIN cambia estado) ----------
  const handleActualizarEstadoPedido = (id, nuevoEstado) =>
    actualizarEstadoPedido(id, nuevoEstado)
      .then((actualizado) => {
        setPedidos((prev) => prev.map((p) => (p.id === id ? actualizado : p)))
        if (actualizado.estado === 'Cancelado') recargarProductos()
        mostrarAviso('exito', `Pedido #${id}: ${actualizado.estado}`)
      })
      .catch(mostrarError)

  // ---------- Productos (ADMIN) ----------
  const buscarIdProducto = (codigo) => {
    const p = productos.find((x) => x.codigo === codigo)
    if (!p?.id) throw new Error('El producto no existe en el backend. Verifica que producto-service esté levantado.')
    return p.id
  }

  const aPayloadProducto = (p) => ({
    codigo: p.codigo,
    nombre: p.nombre,
    marca: p.marca,
    modelo: p.modelo,
    categoria: p.categoria,
    precio: Number(p.precio),
    stock: Number(p.stock),
    descripcion: p.descripcion,
    imagenUrl: p.imagenUrl
  })

  const handleAgregarProducto = async (nuevo) => {
    try {
      const creado = await crearProducto(aPayloadProducto(nuevo))
      setProductos((prev) => [creado, ...prev])
    } catch (err) {
      mostrarError(err)
      throw err
    }
  }

  const handleActualizarProducto = async (datos) => {
    try {
      const id = buscarIdProducto(datos.codigoOriginal || datos.codigo)
      const actualizado = await actualizarProducto(id, aPayloadProducto(datos))
      setProductos((prev) => prev.map((p) => (p.id === id ? actualizado : p)))
    } catch (err) {
      mostrarError(err)
      throw err
    }
  }

  const handleEliminarProducto = async (codigo) => {
    if (!window.confirm(`¿Eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) return
    try {
      const id = buscarIdProducto(codigo)
      await eliminarProducto(id)
      setProductos((prev) => prev.filter((p) => p.id !== id))
      mostrarAviso('exito', `Producto ${codigo} eliminado`)
    } catch (err) {
      mostrarError(err)
    }
  }

  // Stock (solo ADMIN): PATCH /api/v1/productos/{id}/stock con el delta
  const handleActualizarStock = async (codigo, nuevoStock) => {
    try {
      const actual = productos.find((p) => p.codigo === codigo)
      const delta = Number(nuevoStock) - Number(actual?.stock || 0)
      if (delta === 0) return
      const actualizado = await ajustarStockProducto(buscarIdProducto(codigo), delta)
      setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)))
    } catch (err) {
      mostrarError(err)
    }
  }

  // ---------- Usuarios (ADMIN) ----------
  const reemplazarUsuario = (u) => setUsuarios((prev) => prev.map((x) => (x.id === u.id ? u : x)))

  const handleCrearUsuario = async (nuevo) => {
    try {
      const creado = await crearUsuario(nuevo)
      setUsuarios((prev) => [creado, ...prev])
    } catch (err) {
      mostrarError(err)
      throw err
    }
  }

  const handleActualizarUsuario = async (usuario) => {
    try {
      reemplazarUsuario(await actualizarUsuario(usuario))
    } catch (err) {
      mostrarError(err)
      throw err
    }
  }

  const handleAlternarEstadoUsuario = async (id) => {
    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) return
    try {
      reemplazarUsuario(await cambiarEstadoUsuario(id, !usuario.activo))
    } catch (err) {
      mostrarError(err)
      throw err
    }
  }

  const handleAgregarHistorialUsuario = async (id, { detalle }) => {
    try {
      await agregarNotaUsuario(id, detalle)
    } catch (err) {
      mostrarError(err)
      throw err
    }
  }

  const handleCargarHistorial = (usuario) =>
    obtenerHistorialUsuario(usuario.id).catch((err) => {
      mostrarError(err)
      return []
    })

  const handleEliminarUsuario = async (usuario) => {
    if (!window.confirm(`¿Eliminar la cuenta de ${usuario.email}?`)) return
    try {
      await eliminarUsuario(usuario.id)
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id))
      mostrarAviso('exito', `Cuenta ${usuario.email} eliminada`)
    } catch (err) {
      mostrarError(err)
    }
  }

  // El VENDEDOR solo visualiza productos y pedidos; cambiar estados o stock es exclusivo del ADMIN
  const esAdmin = ROLES_ADMIN.includes(rolActual)

  const propsTienda = {
    productos,
    onAgregarAlCarrito: handleAgregarAlCarrito,
    onAbrirCarrito: () => setModalCarritoAbierto(true)
  }

  const protegida = (roles, elemento, mensajeSinSesion) => (
    <RutaProtegida
      sesion={sesion}
      rolesPermitidos={roles}
      onAbrirLogin={abrirLogin}
      mensajeSinSesion={mensajeSinSesion}
    >
      {elemento}
    </RutaProtegida>
  )

  return (
    <LayoutApp
      navbar={
        <Navbar
          rolActual={rolActual}
          cantidadCarrito={carrito.length}
          onAbrirCarrito={() => setModalCarritoAbierto(true)}
          sesionAbierta={Boolean(sesion)}
          usuarioActual={sesion}
          onAbrirLogin={abrirLogin}
          onCerrarSesion={handleCerrarSesion}
        />
      }
      footer={<Footer />}
      modales={
        <>
          <AvisoGlobal aviso={aviso} onCerrar={() => setAviso(null)} />
          <CarritoModal
            abierto={modalCarritoAbierto}
            onCerrar={() => setModalCarritoAbierto(false)}
            carrito={carrito}
            usuarioActual={sesion}
            onRequiereLogin={() => {
              setModalCarritoAbierto(false)
              setMensajeLogin('Inicia sesión o crea una cuenta para finalizar tu compra.')
              setMostrarLogin(true)
            }}
            onAgregarUno={handleAgregarAlCarrito}
            onRestarUno={handleRestarUno}
            onEliminarProducto={handleEliminarDelCarrito}
            onVaciarCarrito={handleVaciarCarrito}
            onFinalizarCompra={handleFinalizarCompra}
            onVerMisPedidos={() => {
              setModalCarritoAbierto(false)
              navigate('/mis-pedidos')
            }}
          />
          {mostrarLogin && (
            <Login
              key={mensajeLogin}
              mensajeInicial={mensajeLogin}
              onIniciarSesion={handleIniciarSesion}
              onCerrar={() => setMostrarLogin(false)}
            />
          )}
        </>
      }
    >
      <Routes>
        {/* Tienda pública. El personal entra directo a su panel. */}
        <Route
          path="/"
          element={
            rolActual === 'cliente'
              ? <Inicio {...propsTienda} />
              : <Navigate to={RUTA_INICIAL_POR_ROL[rolActual]} replace />
          }
        />
        <Route path="/catalogo" element={<Catalogo {...propsTienda} />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/producto/:id" element={<DetalleProducto {...propsTienda} />} />

        {/* CLIENTE: historial de sus propias compras (GET /pedidos/mis-pedidos) */}
        <Route
          path="/mis-pedidos"
          element={protegida(
            ROLES_CLIENTE,
            <MisPedidos key={sesion?.email} />,
            'Inicia sesión con tu cuenta de cliente para ver tus pedidos.'
          )}
        />

        {/* VENDEDOR (solo lectura) y ADMIN (puede gestionar) */}
        <Route
          path="/vendedor/pedidos"
          element={protegida(ROLES_PERSONAL,
            <PedidosEmpleado
              pedidos={pedidos}
              productos={productos}
              soloLectura={!esAdmin}
              onActualizarEstadoPedido={esAdmin ? handleActualizarEstadoPedido : undefined}
            />
          )}
        />
        <Route
          path="/vendedor/stock"
          element={protegida(ROLES_PERSONAL,
            <StockEmpleado
              productos={productos}
              soloLectura={!esAdmin}
              onActualizarStock={esAdmin ? handleActualizarStock : undefined}
            />
          )}
        />

        {/* Solo ADMIN */}
        <Route
          path="/admin/metricas"
          element={protegida(ROLES_ADMIN, <MetricasJefe productos={productos} pedidos={pedidos} />)}
        />
        <Route
          path="/admin/productos"
          element={protegida(ROLES_ADMIN,
            <ProductosJefe
              productos={productos}
              onAgregarProducto={handleAgregarProducto}
              onActualizarProducto={handleActualizarProducto}
              onEliminarProducto={handleEliminarProducto}
            />
          )}
        />
        <Route
          path="/admin/usuarios"
          element={protegida(ROLES_ADMIN,
            <UsuariosJefe
              usuarios={usuarios}
              usuarioActual={sesion}
              onCrearUsuario={handleCrearUsuario}
              onActualizarUsuario={handleActualizarUsuario}
              onAlternarEstadoUsuario={handleAlternarEstadoUsuario}
              onAgregarHistorialUsuario={handleAgregarHistorialUsuario}
              onCargarHistorial={handleCargarHistorial}
              onEliminarUsuario={handleEliminarUsuario}
            />
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LayoutApp>
  )
}

export default App
