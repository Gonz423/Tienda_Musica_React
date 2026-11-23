import { Link } from 'react-router-dom'

function PanelCompraProducto({
  producto,
  cantidad,
  onIncrementar,
  onDecrementar,
  onAgregar
}) {
  return (
    <div className="col-12 col-md-7">
      <div className="card-body p-4 p-lg-5 d-flex flex-column h-100 justify-content-between">
        <div>
          <h2 className="fw-bold mb-3 fs-3" style={{ color: 'var(--color-texto)' }}>
            {producto.nombre}
          </h2>

          <div className="d-flex align-items-baseline gap-3 mb-3">
            <span
              className="fs-2 fw-bold"
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
              } px-2 py-1`}
            >
              {producto.stock > 0 ? `Stock: ${producto.stock} un.` : 'Sin Stock'}
            </span>
          </div>

          <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>
            {producto.descripcion}
          </p>

          {/* Controles de Compra */}
          <div className="d-flex align-items-center gap-3 flex-wrap mb-4 pb-3 border-bottom">
            {producto.stock > 0 && (
              <div className="d-flex align-items-center border rounded bg-light p-1">
                <button
                  type="button"
                  className="btn btn-sm btn-light border-0 fw-bold px-3"
                  onClick={onDecrementar}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="px-3 fw-bold">{cantidad}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-light border-0 fw-bold px-3"
                  onClick={onIncrementar}
                  disabled={cantidad >= producto.stock}
                >
                  +
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn btn-sv-primary px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm flex-grow-1"
              onClick={onAgregar}
              disabled={producto.stock === 0}
            >
              <i className="bi bi-cart-plus fs-5"></i>
              <span>{producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}</span>
            </button>
          </div>

          {/* Ficha Tecnica */}
          <h5 className="fw-bold fs-6 mb-3" style={{ color: 'var(--color-secundario)' }}>
            <i className="bi bi-info-circle me-2"></i>Especificaciones
          </h5>
          <ul className="list-group list-group-flush small mb-4">
            <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
              <span className="text-muted">Código de Producto:</span>
              <span className="fw-semibold">{producto.codigo || `PROD-${producto.id}`}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
              <span className="text-muted">Marca:</span>
              <span className="fw-semibold">{producto.marca || 'Genérica'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
              <span className="text-muted">Modelo:</span>
              <span className="fw-semibold">{producto.modelo || 'Standard'}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
              <span className="text-muted">Categoría:</span>
              <span className="fw-semibold">{producto.categoria}</span>
            </li>
          </ul>
        </div>

        {/* Boton Volver */}
        <div>
          <Link
            to="/"
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 small"
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-arrow-left"></i>
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PanelCompraProducto
