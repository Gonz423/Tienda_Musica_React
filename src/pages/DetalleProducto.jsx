import { useParams, Link } from "react-router-dom";
import catalogoInstrumentos from "../data/productos";

function DetalleProducto() {
  const { id } = useParams();

  const producto = catalogoInstrumentos.find(
    (item) => item.codigo === id || String(item.id) === String(id)
  );

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <div className="alert alert-danger shadow-sm py-4">
          <h2 className="h4 alert-heading">Producto no encontrado</h2>
          <p className="mb-3">
            El producto: <strong>#{id}</strong> no existe en el catálogo.
          </p>
          <Link to="/" className="btn btn-outline-danger">
            Volver a pedidos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <div className="mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Volver a pedidos
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">Ficha Técnica: {producto.nombre}</h1>
            <span className="badge bg-secondary fs-6">Código: {producto.codigo}</span>
          </div>
        </div>

        <div className="card-body p-4">
          {producto.stock === 0 && (
            <div className="alert alert-danger mb-4">
              <strong>Agotado:</strong> Sin unidades disponibles en stock.
            </div>
          )}
          {producto.stock > 0 && producto.stock < 3 && (
            <div className="alert alert-warning mb-4">
              <strong>Stock Crítico:</strong> Quedan solo {producto.stock} unidades disponibles.
            </div>
          )}
          {producto.stock >= 3 && (
            <div className="alert alert-success mb-4">
              <strong>Stock Normal:</strong> {producto.stock} unidades disponibles.
            </div>
          )}

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h2 className="h5 border-bottom pb-2 mb-3">Especificaciones Técnicas</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Código:</span>
                  <span className="fw-semibold">{producto.codigo}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Nombre:</span>
                  <span className="fw-semibold">{producto.nombre}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Marca:</span>
                  <span className="fw-semibold">{producto.marca}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Modelo:</span>
                  <span className="fw-semibold">{producto.modelo}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Categoría:</span>
                  <span className="badge bg-info text-dark">{producto.categoria}</span>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6">
              <h2 className="h5 border-bottom pb-2 mb-3">Disponibilidad</h2>
              <div className="p-3 bg-light rounded border mb-3">
                <span className="text-muted d-block small">Precio:</span>
                <span className="h3 text-primary fw-bold">
                  ${producto.precio.toLocaleString("es-CL")}
                </span>
                <span className="text-muted d-block small mt-2">Stock en bodega:</span>
                <span className="fw-bold fs-5">{producto.stock} unidades</span>
              </div>
              <p className="text-muted small mb-0">{producto.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetalleProducto;