import { Link } from 'react-router-dom';

function ProductCard({ producto, onAgregarAlCarrito }) {


  
  const { nombre, precio, imagen, categoria, stock, marca, modelo, descripcion } = producto;
  const idProducto = producto.id || producto.codigo;

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">

        <Link to={`/producto/${idProducto}`} className="text-decoration-none">
          <img 
            src={imagen} 
            className="card-img-top p-3" 
            alt={nombre} 
            style={{ height: '220px', objectFit: 'contain', cursor: 'pointer' }}
          />
        </Link>

        <div className="card-body d-flex flex-column text-center">
          <span 
            className="badge mb-2 align-self-center text-uppercase"
            style={{ backgroundColor: '#7a3e1d', fontSize: '0.75rem' }}
          >
            {categoria}
          </span>

          <h5 className="card-title fs-6 fw-bold">
            <Link 
              to={`/producto/${identificador}`} 
              className="text-dark text-decoration-none"
              style={{ cursor: 'pointer' }}
            >
              {nombre}
            </Link>
          </h5>

          <p className="text-muted small mb-1">
            <strong>{marca}</strong> | Modelo: {modelo}
          </p>
          <p className="text-muted small mb-2" style={{ fontSize: '0.8rem' }}>
            {descripcion}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-auto mb-3 px-2">
            <span className="fw-bold fs-5 text-dark">
              ${precio?.toLocaleString('es-CL')}
            </span>
            <span className={`badge ${stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
              Stock: {stock} un.
            </span>
          </div>

          <button 
            className="btn text-white w-100 fw-semibold"
            style={{ backgroundColor: '#b85d19' }}
            onClick={() => onAgregarAlCarrito && onAgregarAlCarrito(producto)}
            disabled={stock === 0}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;