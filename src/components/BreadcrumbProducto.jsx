import { Link } from 'react-router-dom'

function BreadcrumbProducto({ categoria, nombre }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb small">
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none fw-semibold" style={{ color: 'var(--color-primario)' }}>
            <i className="bi bi-house-door me-1"></i>Inicio
          </Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/" className="text-decoration-none text-muted">
            {categoria}
          </Link>
        </li>
        <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
          {nombre}
        </li>
      </ol>
    </nav>
  )
}

export default BreadcrumbProducto
