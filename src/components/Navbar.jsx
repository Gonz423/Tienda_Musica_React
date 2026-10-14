import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({
  rolActual = 'cliente',
  setRolActual,
  cantidadCarrito = 0,
  seccionJefe: seccionJefeProp,
  setSeccionJefe: setSeccionJefeProp,
  seccionTrabajador: seccionTrabajadorProp,
  setSeccionTrabajador: setSeccionTrabajadorProp,
}) {
  const navigate = useNavigate()
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)
  const [seccionCliente, setSeccionCliente] = useState('inicio')

  const [seccionTrabajadorLocal, setSeccionTrabajadorLocal] = useState('pedidos')
  const [seccionJefeLocal, setSeccionJefeLocal] = useState('metricas')

  const seccionTrabajador =
    seccionTrabajadorProp !== undefined ? seccionTrabajadorProp : seccionTrabajadorLocal
  const setSeccionTrabajador = setSeccionTrabajadorProp || setSeccionTrabajadorLocal

  const seccionJefe = seccionJefeProp !== undefined ? seccionJefeProp : seccionJefeLocal
  const setSeccionJefe = setSeccionJefeProp || setSeccionJefeLocal

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

  const handleLinkClick = () => {
    setIsNavCollapsed(true)
  }


  const irASeccionCliente = (seccionId) => {
    setSeccionCliente(seccionId)
    handleLinkClick()
    navigate('/')
    setTimeout(() => {
      const el = document.getElementById(seccionId)
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark header-sonido-vivo sticky-top shadow w-100">
      <div className="container">
        {/* Marca / Logo */}
        <a
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4 text-decoration-none me-3"
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            if (setRolActual) setRolActual('cliente')
            irASeccionCliente('inicio')
          }}
        >
          <i className="bi bi-soundwave fs-3"></i>
          <span>Sonido Vivo</span>
        </a>

        {/* Boton Hamburguesa */}
        <button
          className="navbar-toggler border-0 p-2 shadow-sm"
          type="button"
          aria-controls="menuPrincipal"
          aria-expanded={!isNavCollapsed}
          aria-label="Alternar navegacion"
          onClick={handleNavCollapse}
          style={{ backgroundColor: 'rgba(236, 230, 223, 0.25)', borderRadius: '8px' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Colapsable */}
        <div
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}
          id="menuPrincipal"
        >
          <ul className="navbar-nav me-auto mb-3 mb-lg-0 align-items-lg-center gap-2 pt-2 pt-lg-0">
            {/* ROL CLIENTE */}
            {rolActual === 'cliente' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <a
                    className={`nav-link nav-btn-link ${seccionCliente === 'inicio' ? 'active' : ''}`}
                    aria-current={seccionCliente === 'inicio' ? 'page' : undefined}
                    href="#inicio"
                    onClick={(e) => {
                      e.preventDefault()
                      irASeccionCliente('inicio')
                    }}
                  >
                    <i className="bi bi-house-door me-2 d-lg-none"></i>
                    Inicio
                  </a>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <a
                    className={`nav-link nav-btn-link ${seccionCliente === 'catalogo' ? 'active' : ''}`}
                    aria-current={seccionCliente === 'catalogo' ? 'page' : undefined}
                    href="#catalogo"
                    onClick={(e) => {
                      e.preventDefault()
                      irASeccionCliente('catalogo')
                    }}
                  >
                    <i className="bi bi-grid-3x3-gap me-2 d-lg-none"></i>
                    Catalogo
                  </a>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <a
                    className={`nav-link nav-btn-link ${seccionCliente === 'nosotros' ? 'active' : ''}`}
                    aria-current={seccionCliente === 'nosotros' ? 'page' : undefined}
                    href="#nosotros"
                    onClick={(e) => {
                      e.preventDefault()
                      irASeccionCliente('nosotros')
                    }}
                  >
                    <i className="bi bi-people me-2 d-lg-none"></i>
                    Nosotros
                  </a>
                </li>
              </>
            )}

            {/* ROL TRABAJADOR*/}
            {rolActual === 'trabajador' && (
              <li className="nav-item d-flex gap-2 ms-lg-3 my-2 my-lg-0">
                <button
                  type="button"
                  className={`nav-link nav-btn-link w-100 border-0 ${seccionTrabajador === 'pedidos' ? 'active' : ''}`}
                  onClick={() => {
                    setSeccionTrabajador('pedidos')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  Recepción de Pedidos
                </button>
                <button
                  type="button"
                  className={`nav-link nav-btn-link w-100 border-0 ${seccionTrabajador === 'stock' ? 'active' : ''}`}
                  onClick={() => {
                    setSeccionTrabajador('stock')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  Control de Stock
                </button>
              </li>
            )}

            {/* ROL JEFE */}
            {rolActual === 'jefe' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link w-100 border-0 ${seccionJefe === 'metricas' ? 'active' : ''}`}
                    onClick={() => {
                      setSeccionJefe('metricas')
                      navigate('/')
                      handleLinkClick()
                    }}
                  >
                    <i className="bi bi-graph-up-arrow me-2"></i> Metricas y Ventas
                  </button>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <button
                    type="button"
                    className={`nav-link nav-btn-link w-100 border-0 ${seccionJefe === 'productos' ? 'active' : ''}`}
                    onClick={() => {
                      setSeccionJefe('productos')
                      navigate('/')
                      handleLinkClick()
                    }}
                  >
                    <i className="bi bi-gear me-2"></i> Administracion de Productos
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Selector de Roles y Carrito */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-top-lg-0">
            <div className="contenedor-roles-mobile">
              <div className="grupo-roles-grid d-flex gap-2" role="group" aria-label="Selector de rol de usuario">
                <button
                  type="button"
                  className={`btn btn-rol-sv ${rolActual === 'cliente' ? 'active' : ''}`}
                  onClick={() => {
                    if (setRolActual) setRolActual('cliente')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  <i className="bi bi-person me-1"></i>
                  <span>Cliente</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-rol-sv ${rolActual === 'trabajador' ? 'active' : ''}`}
                  onClick={() => {
                    if (setRolActual) setRolActual('trabajador')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  <i className="bi bi-briefcase me-1"></i>
                  <span>Trabajador</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-rol-sv ${rolActual === 'jefe' ? 'active' : ''}`}
                  onClick={() => {
                    if (setRolActual) setRolActual('jefe')
                    navigate('/')
                    handleLinkClick()
                  }}
                >
                  <i className="bi bi-shield-lock me-1"></i>
                  <span>Jefe</span>
                </button>
              </div>
            </div>

            {rolActual === 'cliente' && (
              <button
                type="button"
                className="btn btn-sv-primary btn-carrito-mobile position-relative d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ height: '38px' }}
                aria-label="Ver carrito de compras"
              >
                <i className="bi bi-cart3 fs-6"></i>
                <span>Carrito</span>
                {cantidadCarrito > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1">
                    {cantidadCarrito}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar