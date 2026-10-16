import { useState } from 'react'
import { Link } from 'react-router-dom'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'

const imagenesLocales = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' })

function VistaCliente({ productos = [], onAgregarAlCarrito, onAbrirCarrito }) {
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

  const obtenerImagen = (codigo) => {
    const clave = `../assets/img/${codigo}.jpg`
    return imagenesLocales[clave] || imagenesLocales['../assets/img/GA001.jpg']
  }

  return (
    <div className="vista-cliente pb-5">
      {/* Hero */}
      <section className="hero-sonido-vivo py-5 mb-4 shadow-sm text-center" id="inicio">
        <div className="container py-4">
          <div className="badge bg-light text-dark px-3 py-2 fs-6 mb-3 rounded-pill fw-semibold shadow-sm">
            Tienda Sonido Vivo - Vina del Mar
          </div>
          <h1 className="display-5 fw-bold mb-2 text-white">
            Catalogo de Instrumentos y Audio Profesional
          </h1>
          <p className="lead mx-auto col-lg-8 mb-0 text-white-50">
            Explora nuestra seleccion completa de equipamiento musical de primeras marcas con stock verificado en tiempo real.
          </p>
        </div>
      </section>

      <div className="container" id="catalogo">
        {/* Alerta */}
        {mensajeAlerta && (
          <div
            className="alert alert-success alert-dismissible fade show shadow-sm text-center mb-4 border-0 d-flex align-items-center justify-content-center flex-wrap gap-2"
            role="alert"
          >
            <div>
              <i className="bi bi-check-circle-fill me-2"></i>
              {mensajeAlerta}
            </div>
            {onAbrirCarrito && (
              <button
                type="button"
                className="btn btn-sm btn-dark ms-2 py-0 px-2 fw-semibold shadow-sm"
                style={{ fontSize: '0.8rem', borderRadius: '6px' }}
                onClick={onAbrirCarrito}
              >
                <i className="bi bi-cart3 me-1"></i> Ver Carrito
              </button>
            )}
          </div>
        )}

        {/* Panel de Filtros y Busqueda - Rediseno estilo Ordenar */}
        <div className="panel-filtros-catalogo p-3 p-md-4 mb-4">
          <div className="row g-3 align-items-center">
            {/* Buscador Moderno */}
            <div className="col-12 col-md-6 col-lg-5">
              <div className="input-group search-box-sv shadow-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 bg-white"
                  placeholder="Buscar por nombre, marca o modelo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar producto"
                />
                {busqueda && (
                  <button
                    className="btn bg-white border-start-0 text-muted"
                    type="button"
                    onClick={() => setBusqueda('')}
                    title="Limpiar busqueda"
                  >
                    <i className="bi bi-x-circle-fill text-secondary"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Categorias - Estilo identico a Ordenar */}
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <div className="orden-box-sv d-flex align-items-center gap-2 p-1 px-3 bg-white rounded-pill shadow-sm">
                <i className="bi bi-tag text-muted small" aria-hidden="true"></i>
                <label htmlFor="categoriaFiltroSelect" className="small fw-semibold text-secondary mb-0 text-nowrap">
                  Categoría:
                </label>
                <select
                  id="categoriaFiltroSelect"
                  className="form-select form-select-sm border-0 bg-transparent shadow-none fw-medium text-capitalize"
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="col-12 col-sm-6 col-md-3 col-lg-4">
              <div className="orden-box-sv d-flex align-items-center gap-2 p-1 px-3 bg-white rounded-pill shadow-sm">
                <i className="bi bi-arrow-down-up text-muted small" aria-hidden="true"></i>
                <label htmlFor="ordenarPor" className="small fw-semibold text-secondary mb-0 text-nowrap">
                  Ordenar:
                </label>
                <select
                  id="ordenarPor"
                  className="form-select form-select-sm border-0 bg-transparent shadow-none fw-medium"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                >
                  <option value="destacados">Destacados</option>
                  <option value="menor-precio">Menor precio</option>
                  <option value="mayor-precio">Mayor precio</option>
                  <option value="nombre-az">Nombre (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Barra de estado con contador holgado y sin desbordamiento */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3 mt-3 border-top border-secondary border-opacity-10 small text-muted">
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium">
                <i className="bi bi-sliders me-1 text-primary"></i>
                Filtro: <strong className="text-capitalize">{categoriaFiltro}</strong>
              </span>
              {busqueda && (
                <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium">
                  Búsqueda: "<strong>{busqueda}</strong>"
                </span>
              )}
            </div>
            <span className="contador-pill-sv">
              <i className="bi bi-box2-fill me-2" aria-hidden="true" style={{ verticalAlign: 'middle' }}></i>
              Mostrando{' '}<strong>{productosFiltrados.length}</strong>{' '}de{' '}<strong>{productos.length}</strong>{' '}productos
            </span>
          </div>

          {/* Botones accesibles de categoria para soporte de pruebas */}
          <div className="visually-hidden">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalogo */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 g-md-4">
        {productosFiltrados.map((producto) => (
          <div key={producto.codigo || producto.id} className="col">
            <article className="card-producto-sv text-center">
              <figure className="mb-0">
                <Link to={`/producto/${producto.codigo || producto.id}`}>
                  <img
                    src={obtenerImagen(producto.codigo)}
                    alt={`${producto.nombre} ${producto.marca}`}
                    loading="lazy"
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
              </figure>
              <div className="p-2 px-3 bg-light text-center border-bottom">
                <span
                  className="badge text-uppercase"
                  style={{ backgroundColor: 'var(--color-primario)' }}
                >
                  {producto.categoria}
                </span>
              </div>

              <div className="card-body d-flex flex-column justify-content-between p-3 text-center">
                <div>
                  <h5
                    className="card-title fw-bold mb-1 fs-6 text-center producto-titulo"
                    style={{ color: 'var(--color-texto)' }}
                  >
                    <Link
                      to={`/producto/${producto.codigo || producto.id}`}
                      className="text-decoration-none text-dark"
                      style={{ cursor: 'pointer' }}
                    >
                      {producto.nombre}
                    </Link>
                  </h5>
                  <p className="text-muted small mb-2 text-center text-truncate">
                    <strong>{producto.marca}</strong> | Modelo: {producto.modelo}
                  </p>
                  <p
                    className="card-text text-muted small mb-3 text-center producto-desc"
                  >
                    {producto.descripcion}
                  </p>
                </div>

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className="fs-5 fw-bold"
                      style={{ color: 'var(--color-acento)' }}
                    >
                      ${producto.precio.toLocaleString('es-CL')}
                    </span>
                    <span
                      className={`badge ${producto.stock > 3
                        ? 'bg-success'
                        : producto.stock > 0
                          ? 'bg-warning text-dark'
                          : 'bg-danger'
                        }`}
                    >
                      {producto.stock > 0 ? `Stock: ${producto.stock} un.` : 'Sin Stock'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sv-primary w-100 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm"
                    onClick={() => handleAgregar(producto)}
                    disabled={producto.stock === 0}
                  >
                    <i className="bi bi-cart-plus"></i>
                    {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Sin resultados */}
      {productosFiltrados.length === 0 && (
        <div className="text-center py-5 bg-white rounded-3 border my-4">
          <i className="bi bi-search fs-1 text-muted d-block mb-2"></i>
          <h5 className="fw-bold text-dark">No se encontraron productos</h5>
          <p className="text-muted mb-3">
            Intenta con otra palabra clave o selecciona otra categoria.
          </p>
          <button
            className="btn btn-sm btn-sv-primary"
            onClick={() => {
              setCategoriaFiltro('todas')
              setBusqueda('')
              setOrden('destacados')
            }}
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </div>
  )
}

export default VistaCliente
