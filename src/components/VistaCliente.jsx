import { useState } from 'react'
import { guardarCarritoStorage, cargarCarritoStorage } from '../utils/persistencia'

// Carga dinamica y robusta de imagenes locales desde src/assets/img mediante Vite
const imagenesLocales = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' })

function VistaCliente({ productos = [], onAgregarAlCarrito }) {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('destacados')
  const [mensajeAlerta, setMensajeAlerta] = useState('')

  // Manejar agregar al carrito y persistencia local
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


  // Lista de categorias unicas presentes en los datos
  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))]

  // Filtrado reactivo de productos
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

  // Ordenamiento interactivo
  if (orden === 'menor-precio') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => a.precio - b.precio)
  } else if (orden === 'mayor-precio') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => b.precio - a.precio)
  } else if (orden === 'nombre-az') {
    productosFiltrados = [...productosFiltrados].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }

  // Obtener ruta de imagen local empaquetada
  const obtenerImagen = (codigo) => {
    const clave = `../assets/img/${codigo}.jpg`
    return imagenesLocales[clave] || imagenesLocales['../assets/img/GA001.jpg']
  }

  return (
    <div className="vista-cliente pb-5">
      {/* Encabezado Superior del Catalogo */}
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
        {/* Mensaje de alerta reactiva al agregar producto */}
        {mensajeAlerta && (
          <div
            className="alert alert-success alert-dismissible fade show shadow-sm text-center mb-4 border-0"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {mensajeAlerta}
          </div>
        )}

        {/* Barra de Filtros, Buscador y Ordenamiento */}
        <div className="bg-white p-3 p-md-4 rounded-3 shadow-sm border mb-4">
          <div className="row g-3 align-items-center">
            {/* Buscador de Productos */}
            <div className="col-12 col-md-5 col-lg-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar por nombre, marca o modelo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar producto"
                />
                {busqueda && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setBusqueda('')}
                    title="Limpiar busqueda"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Selector de Orden */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="ordenarPor" className="small text-muted mb-0 text-nowrap">
                  Ordenar:
                </label>
                <select
                  id="ordenarPor"
                  className="form-select form-select-sm"
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

            {/* Contador de Productos */}
            <div className="col-12 col-sm-6 col-md-3 col-lg-5 text-sm-end text-muted small">
              Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{productos.length}</strong> productos
            </div>

            {/* Botones de Categorias con scroll horizontal en mobile */}
            <div className="col-12 pt-2 border-top">
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold me-1 text-nowrap d-none d-sm-inline" style={{ color: 'var(--color-secundario)' }}>
                  Categorías:
                </span>
                <div className="categorias-scroll-bar d-flex gap-2 align-items-center flex-nowrap flex-sm-wrap w-100">
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`btn btn-sm btn-categoria-chip text-capitalize ${
                        categoriaFiltro.toLowerCase() === cat.toLowerCase()
                          ? 'btn-sv-primary shadow-sm active'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => setCategoriaFiltro(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grilla Responsiva de Productos */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 g-md-4">
          {productosFiltrados.map((producto) => (
            <div key={producto.codigo || producto.id} className="col">
              <article className="card-producto-sv text-center">
                {/* Imagen del producto cargada desde assets locales */}
                <figure>
                  <img
                    src={obtenerImagen(producto.codigo)}
                    alt={`${producto.nombre} - ${producto.marca}`}
                    loading="lazy"
                  />
                </figure>

                {/* Categoria */}
                <div className="p-2 px-3 bg-light text-center border-bottom">
                  <span
                    className="badge text-uppercase"
                    style={{ backgroundColor: 'var(--color-primario)' }}
                  >
                    {producto.categoria}
                  </span>
                </div>

                {/* Cuerpo de la Tarjeta con nombre y textos centrados */}
                <div className="card-body d-flex flex-column justify-content-between p-3 text-center">
                  <div>
                    <h5
                      className="card-title fw-bold mb-1 fs-6 text-center producto-titulo"
                      style={{ color: 'var(--color-texto)' }}
                    >
                      {producto.nombre}
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
                        className={`badge ${
                          producto.stock > 3
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

        {/* Estado cuando no hay productos coincidentes */}
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
    </div>
  )
}

export default VistaCliente
