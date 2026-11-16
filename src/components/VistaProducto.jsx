import { Link, useInRouterContext } from 'react-router-dom'

const imagenesLocales = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' })

function VistaProducto({ producto, onAgregarAlCarrito, obtenerImagen }) {
  const inRouter = useInRouterContext()

  const resolverImagen = (codigo) => {
    if (obtenerImagen) return obtenerImagen(codigo)
    const imgRemota = producto.imagenUrl || producto.imagen
    if (imgRemota && (imgRemota.startsWith('http://') || imgRemota.startsWith('https://'))) {
      return imgRemota
    }
    const clave = `../assets/img/${codigo}.jpg`
    return imagenesLocales[clave] || imagenesLocales['../assets/img/GA001.jpg']
  }

  const idProducto = producto.codigo || producto.id

  const renderEnlace = (children, className, style) => {
    if (inRouter) {
      return (
        <Link to={`/producto/${idProducto}`} className={className} style={style}>
          {children}
        </Link>
      )
    }
    return (
      <a href={`/producto/${idProducto}`} className={className} style={style}>
        {children}
      </a>
    )
  }

  return (
    <div className="col">
      <article className="card-producto-sv text-center h-100 d-flex flex-column justify-content-between">
        <figure className="mb-0">
          {renderEnlace(
            <img
              src={resolverImagen(producto.codigo)}
              alt={`${producto.nombre} ${producto.marca || ''}`.trim()}
              loading="lazy"
              style={{ cursor: 'pointer' }}
            />
          )}
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
              {renderEnlace(
                producto.nombre,
                'text-decoration-none text-dark',
                { cursor: 'pointer' }
              )}
            </h5>
            <p className="text-muted small mb-2 text-center text-truncate">
              <strong>{producto.marca}</strong> | Modelo: {producto.modelo}
            </p>
            <p className="card-text text-muted small mb-3 text-center producto-desc">
              {producto.descripcion}
            </p>
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span
                className="fs-5 fw-bold"
                style={{ color: 'var(--color-acento)' }}
              >
                ${producto.precio?.toLocaleString('es-CL')}
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
              onClick={() => onAgregarAlCarrito && onAgregarAlCarrito(producto)}
              disabled={producto.stock === 0}
            >
              <i className="bi bi-cart-plus"></i>
              {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export default VistaProducto