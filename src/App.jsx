import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import VistaCliente from './components/VistaCliente'
import VistaEmpleado from './components/VistaEmpleado'
import VistaJefe from './components/VistaJefe'
import DetalleProducto from './pages/DetalleProducto'
import Footer from './components/Footer'
import { productosIniciales } from './data/productos'
import { pedidosIniciales } from './data/pedidos'

function App() {
  // Estado para el rol activo: 'cliente', 'trabajador', 'jefe'
  const [rolActual, setRolActual] = useState('cliente')


  const [seccionTrabajador, setSeccionTrabajador] = useState('pedidos')
  const [seccionJefe, setSeccionJefe] = useState('metricas')

  const [productos, setProductos] = useState(productosIniciales)
  const [pedidos, setPedidos] = useState(pedidosIniciales)
  const [carrito, setCarrito] = useState([])

  const handleAgregarAlCarrito = (producto) => {
    setCarrito((prev) => [...prev, producto])
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
        seccionJefe={seccionJefe}
        setSeccionJefe={setSeccionJefe}
        seccionTrabajador={seccionTrabajador}
        setSeccionTrabajador={setSeccionTrabajador}
      />

      <main className="flex-grow-1">
        {/* VISTA 1: CLIENTE */}
        {rolActual === 'cliente' && (
          <Routes>
            <Route
              path="/"
              element={
                <VistaCliente
                  productos={productos}
                  onAgregarAlCarrito={handleAgregarAlCarrito}
                />
              }
            />
            <Route 
              path="/producto/:id" 
              element={<DetalleProducto productos={productos} />} 
            />
          </Routes>
        )}

        {/* VISTA 2: TRABAJADOR*/}
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
          </Routes>
        )}

        {/* VISTA 3: JEFE */}
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

      <Footer />
    </div>
  )
}

export default App