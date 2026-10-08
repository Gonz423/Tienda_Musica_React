import { useState } from 'react'

function Navbar({ rolActual = 'cliente', setRolActual, cantidadCarrito = 0 }) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

  const handleLinkClick = () => {
    // Cerrar menu automaticamente en pantallas moviles tras hacer clic
    setIsNavCollapsed(true)
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
            window.scrollTo({ top: 0, behavior: 'smooth' })
            handleLinkClick()
          }}
        >
          <i className="bi bi-soundwave fs-3"></i>
          <span>Sonido Vivo</span>
        </a>

        {/* Boton Hamburguesa para moviles con diseno accesible */}
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

        {/* Menu Colapsable con diseno optimizado para moviles */}
        <div
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}
          id="menuPrincipal"
        >
          {/* Enlaces con borde: Inicio, Catalogo, Nosotros */}
          <ul className="navbar-nav me-auto mb-3 mb-lg-0 align-items-lg-center gap-2 pt-2 pt-lg-0">
            {rolActual === 'cliente' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <a
                    className="nav-link nav-btn-link active"
                    aria-current="page"
                    href="#inicio"
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-house-door me-2 d-lg-none"></i>
                    Inicio
                  </a>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <a
                    className="nav-link nav-btn-link"
                    href="#catalogo"
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-grid-3x3-gap me-2 d-lg-none"></i>
                    Catalogo
                  </a>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <a
                    className="nav-link nav-btn-link"
                    href="#nosotros"
                    onClick={handleLinkClick}
                  >
                    <i className="bi bi-people me-2 d-lg-none"></i>
                    Nosotros
                  </a>
                </li>
              </>
            )}

            {rolActual === 'trabajador' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <span className="nav-link nav-btn-link active fw-bold">
                    <i className="bi bi-box-seam me-2"></i> Recepcion de Pedidos
                  </span>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <span className="nav-link nav-btn-link text-white-50">
                    <i className="bi bi-clipboard-check me-2"></i> Control de Stock
                  </span>
                </li>
              </>
            )}

            {rolActual === 'jefe' && (
              <>
                <li className="nav-item w-100 w-lg-auto">
                  <span className="nav-link nav-btn-link active fw-bold">
                    <i className="bi bi-graph-up-arrow me-2"></i> Metricas y Ventas
                  </span>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <span className="nav-link nav-btn-link text-white-50">
                    <i className="bi bi-gear me-2"></i> Administracion de Productos
                  </span>
                </li>
              </>
            )}
          </ul>

          {/* Acciones de la derecha: Selector de Roles + Carrito */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 pt-2 pt-lg-0 border-top border-secondary border-opacity-25 border-top-lg-0">
            {/* Contenedor adaptado para selector de roles */}
            <div className="contenedor-roles-mobile">
              <div className="d-flex align-items-center justify-content-between mb-2 d-lg-none">
                <span className="text-white-50 small fw-semibold">
                  <i className="bi bi-person-badge me-1"></i> Rol del Sistema:
                </span>
                <span className="badge bg-light text-dark text-capitalize">
                  {rolActual}
                </span>
              </div>
              <div className="grupo-roles-grid d-flex gap-2" role="group" aria-label="Selector de rol de usuario">
                <button
                  type="button"
                  className={`btn btn-rol-sv ${rolActual === 'cliente' ? 'active' : ''}`}
                  onClick={() => {
                    if (setRolActual) setRolActual('cliente')
                    handleLinkClick()
                  }}
                  title="Vista publica para compradores"
                >
                  <i className="bi bi-person"></i>
                  <span>Cliente</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-rol-sv ${rolActual === 'trabajador' ? 'active' : ''}`}
                  onClick={() => {
                    if (setRolActual) setRolActual('trabajador')
                    handleLinkClick()
                  }}
                  title="Vista operativa para trabajadores"
                >
                  <i className="bi bi-briefcase"></i>
                  <span>Trabajador</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-rol-sv ${rolActual === 'jefe' ? 'active' : ''}`}
                  onClick={() => {
                    if (setRolActual) setRolActual('jefe')
                    handleLinkClick()
                  }}
                  title="Vista de administracion y metricas"
                >
                  <i className="bi bi-shield-lock"></i>
                  <span>Jefe</span>
                </button>
              </div>
            </div>

            {/* Carrito de Compras visible para Cliente */}
            {rolActual === 'cliente' && (
              <button
                type="button"
                className="btn btn-sv-primary btn-carrito-mobile position-relative d-flex align-items-center justify-content-center gap-2 shadow-sm"
                aria-label="Ver carrito de compras"
              >
                <i className="bi bi-cart3 fs-5"></i>
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
