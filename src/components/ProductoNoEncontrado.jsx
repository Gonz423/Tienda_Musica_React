import { Link } from 'react-router-dom'

function ProductoNoEncontrado({ id }) {
  return (
    <main className="container my-5 text-center">
      <div
        className="p-5 rounded-4 shadow-sm text-center mx-auto bg-white border"
        style={{ maxWidth: '520px', borderColor: 'rgba(75, 46, 43, 0.15)' }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: '64px', height: '64px', backgroundColor: '#fef2f2', color: '#dc2626' }}
        >
          <i className="bi bi-exclamation-triangle fs-2"></i>
        </div>
        <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--color-texto)' }}>
          Producto no encontrado
        </h2>
        <p className="text-muted small mb-4">
          El codigo o identificador <strong>#{id}</strong> no existe en nuestro catalogo musical.
        </p>
        <Link to="/" className="btn btn-sv-primary px-4 py-2 fw-semibold">
          <i className="bi bi-arrow-left me-2"></i>
          Volver a la tienda
        </Link>
      </div>
    </main>
  )
}

export default ProductoNoEncontrado
