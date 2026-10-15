import { useParams, Link, useNavigate } from "react-router-dom";
import productosIniciales from "../data/productos";


const imagenesDisponibles = import.meta.glob("../assets/img/*", {
  eager: true,
  as: "url",
});

function DetalleProducto({ productos = productosIniciales, onAgregarAlCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();

const producto = productos.find(
    (p) =>
      String(p.codigo).toLowerCase() === String(id).toLowerCase() ||
      String(p.id) === String(id)
  );

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <div className="alert alert-danger shadow-sm py-4">
          <h2 className="h4 alert-heading">Producto no encontrado</h2>
          <p className="mb-0">
            El producto: <strong>#{id}</strong> no existe en el catálogo.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

const resolverImagen = () => {
    if (!producto.imagen && !producto.codigo) return "";
    if (producto.imagen?.startsWith("http") || producto.imagen?.startsWith("data:")) {
      return producto.imagen;
    }
 const nombreArchivo = (producto.imagen || producto.codigo).split("/").pop();
    const nombreBase = nombreArchivo.split(".")[0];
    for (const ruta in imagenesDisponibles) {
      if (ruta.includes(nombreBase)) {
        return imagenesDisponibles[ruta];
      }
    }

    return producto.imagen;
  };
  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-5 bg-white d-flex align-items-center justify-content-center p-4">
            <img
              src={resolverImagen()}
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: '380px', objectFit: 'contain' }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body p-4 p-lg-5">
              <span className="badge bg-secondary mb-2">{producto.categoria}</span>
              <h2 className="fw-bold mb-2">{producto.nombre}</h2>
              <p className="fs-3 fw-bold text-primary mb-3">
                ${producto.precio?.toLocaleString('es-CL')}
              </p>

              {producto.stock === 0 && (
                <div className="alert alert-danger py-2 mb-3">
                    Producto fuera de stock.
                </div>
              )}
              {producto.stock > 0 && producto.stock < 3 && (
                <div className="alert alert-warning py-2 mb-3">
                  Quedan: {producto.stock} unidades disponibles.
                </div>
              )}
              {producto.stock >= 3 && (
                <div className="alert alert-success py-2 mb-3">
                  Disponibles: {producto.stock} en stock.
                </div>
              )}

              <hr />

              <h5 className="fw-semibold mb-3">Ficha Técnica</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">Código:</span>
                  <span className="fw-semibold">{producto.codigo || `PROD-${producto.id}`}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">Marca:</span>
                  <span className="fw-semibold">{producto.marca || 'Genérica'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">Modelo:</span>
                  <span className="fw-semibold">{producto.modelo || 'Standard'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">Categoría:</span>
                  <span className="fw-semibold">{producto.categoria}</span>
                </li>
              </ul>

              <Link to="/" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-2"></i>Volver al Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;