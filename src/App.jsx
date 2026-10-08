import { useState } from 'react'
import Navbar from './components/Navbar'
import VistaCliente from './components/VistaCliente'
import Footer from './components/Footer'
import { productosIniciales } from './data/productos'

function App() {
  // Estado para el rol activo: 'cliente', 'trabajador', 'jefe'
  const [rolActual, setRolActual] = useState('cliente')

  // Estado para el inventario de productos
  const [productos, setProductos] = useState(productosIniciales)

  // Estado para el carrito de compras
  const [carrito, setCarrito] = useState([])

  // Agregar producto al carrito
  const handleAgregarAlCarrito = (producto) => {
    setCarrito(prev => [...prev, producto])
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Barra de navegacion con selector de rol y badge de carrito */}
      <Navbar
        rolActual={rolActual}
        setRolActual={setRolActual}
        cantidadCarrito={carrito.length}
      />

      {/* Contenido principal con renderizado condicional segun el rol */}
      <main className="flex-grow-1">
        {/* VISTA 1: CLIENTE (Gonzalo - Issue #7) */}
        {rolActual === 'cliente' && (
          <VistaCliente
            productos={productos}
            onAgregarAlCarrito={handleAgregarAlCarrito}
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
              <p className="text-muted">
                Modulo de recepcion de pedidos y control rapido de stock.
              </p>
              <div className="alert alert-info py-3 mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Esta seccion corresponde a la <strong>Issue #8 (Asignada a Itsa)</strong> para implementar la tabla de pedidos y cambio de estados con useState.
              </div>
            </div>
          </div>
        )}

        {/* VISTA 3: JEFE (Preparado para Damian - Issue #9) */}
        {rolActual === 'jefe' && (
          <div className="container py-5">
            <div className="p-4 bg-white rounded-3 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h2 className="fw-bold text-dark mb-0">
                  <i className="bi bi-shield-lock text-danger me-2"></i>
                  Panel de Administracion - Jefe de Tienda
                </h2>
                <span className="badge bg-danger">Rol: Administrador General</span>
              </div>
              <p className="text-muted">
                Modulo de metricas de rendimiento, total de ventas y gestion del catalogo.
              </p>
              <div className="alert alert-warning py-3 mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Esta seccion corresponde a la <strong>Issue #9 (Asignada a Damian)</strong> para implementar las tarjetas de KPIs y el formulario de gestion de productos.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pie de pagina institucional */}
      <Footer />
    </div>
  )
}

export default App
