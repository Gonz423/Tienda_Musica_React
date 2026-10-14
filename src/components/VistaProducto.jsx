import { Link } from 'react-router-dom';

function ProductCard({ producto, onAgregarAlCarrito }) {
  const stockCritico = producto.stock > 0 && producto.stock < 3;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={producto.imagen}
          className="card-img-top p-3"
          alt={producto.nombre}
          style={{ height: '220px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary mb-2 align-self-start">
            {producto.categoria}
          </span>
          <h5 className="card-title text-dark">{producto.nombre}</h5>
          <p className="card-text fw-bold text-primary fs-5 mb-1">
            ${producto.precio?.toLocaleString('es-CL')}
          </p>
          <p className="card-text text-muted small mb-3">
            Stock disponible: {producto.stock}
            {stockCritico && (
              <span className="badge bg-danger ms-2">Pocas unidades disponibles</span>
            )}
            {producto.stock === 0 && (
              <span className="badge bg-secondary ms-2">Agotado</span>
            )}
          </p>

          <div className="mt-auto d-flex gap-2">
            <Link
              to={`/producto/${producto.id}`}
              className="btn btn-outline-secondary btn-sm flex-grow-1"
            >
              Ver Detalle
            </Link>
            {onAgregarAlCarrito && (
              <button
                className="btn btn-primary btn-sm flex-grow-1"
                onClick={() => onAgregarAlCarrito(producto)}
                disabled={producto.stock === 0}
              >
                Agregar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;