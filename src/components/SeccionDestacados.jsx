import { Link } from 'react-router-dom'
import VistaProducto from './VistaProducto'

function SeccionDestacados({
  productosDestacados = [],
  totalProductos = 0,
  onAgregarAlCarrito,
  obtenerImagen
}) {
  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="badge btn-sv-primary px-3 py-1 rounded-pill mb-1">
            Catálogo Selección
          </span>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--color-texto)' }}>
            Instrumentos Destacados
          </h2>
        </div>
        <Link
          to="/catalogo"
          className="btn btn-outline-secondary fw-semibold d-inline-flex align-items-center gap-2"
          style={{ borderRadius: '8px' }}
        >
          <span>Ver todo el Catálogo</span>
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-3 g-md-4">
        {productosDestacados.map((producto) => (
          <VistaProducto
            key={producto.codigo || producto.id}
            producto={producto}
            onAgregarAlCarrito={onAgregarAlCarrito}
            obtenerImagen={obtenerImagen}
          />
        ))}
      </div>

      <div className="text-center mt-4 pt-2">
        <Link
          to="/catalogo"
          className="btn btn-sv-primary px-5 py-2 fw-semibold shadow-sm"
          style={{ fontSize: '1rem' }}
        >
          <i className="bi bi-grid-3x3-gap me-2"></i>
          Ir a la pantalla del Catálogo Completo ({totalProductos} productos)
        </Link>
      </div>
    </section>
  )
}

export default SeccionDestacados
