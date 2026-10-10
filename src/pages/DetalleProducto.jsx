import { useParams, Link } from "react-router-dom";

// Lista de productos simulada
const productos = [
  {
    id: 1,
    codigo: "PROD-001",
    nombre: "Guitarra Fender Stratocaster",
    marca: "Fender",
    modelo: "Player Series",
    categoria: "Guitarras",
    precio: 799990,
    stock: 2,
    descripcion: "Guitarra eléctrica con pastillas single-coil y mástil de arce."
  },
  {
    id: 2,
    codigo: "PROD-002",
    nombre: "Bajo Gibson Thunderbird",
    marca: "Gibson",
    modelo: "IV",
    categoria: "Bajos",
    precio: 950000,
    stock: 1,
    descripcion: "Bajo de 4 cuerdas de sonido contundente y cuerpo neck-through."
  },
  {
    id: 3,
    codigo: "PROD-003",
    nombre: "Batería Yamaha Stage Custom",
    marca: "Yamaha",
    modelo: "Birch",
    categoria: "Baterías",
    precio: 950000,
    stock: 5,
    descripcion: "Batería acústica de abedul ideal para grabaciones y directos."
  },
  {
    id: 4,
    codigo: "PROD-004",
    nombre: "Teclado Roland XPS-30",
    marca: "Roland",
    modelo: "XPS-30",
    categoria: "Teclados",
    precio: 969990,
    stock: 0,
    descripcion: "Sintetizador con amplias librerías de sonidos acústicos e instrumentos étnicos."
  },
  {
    id: 5,
    codigo: "PROD-005",
    nombre: "Micrófono Shure SM7B",
    marca: "Shure",
    modelo: "SM7B",
    categoria: "Audio",
    precio: 420000,
    stock: 8,
    descripcion: "Micrófono dinámico cardioide para estudio y locución."
  }
];

function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find((item) => item.id === Number(id));

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <div className="alert alert-danger shadow-sm py-4">
          <h2 className="h4 alert-heading">Producto no encontrado</h2>
          <p className="mb-3">
            El instrumento con ID #{id} no existe en el catálogo.
          </p>
          <Link to="/" className="btn btn-outline-danger">
            ← Volver al panel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <div className="mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Volver al panel de pedidos
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
          {/* Alertas condicionales de stock */}
          {producto.stock === 0 && (
            <div className="alert alert-danger mb-4">
              <strong>⚠️ Agotado:</strong> Sin unidades disponibles en bodega.
            </div>
          )}
          {producto.stock > 0 && producto.stock < 3 && (
            <div className="alert alert-warning mb-4">
              <strong>⚡ Stock Crítico:</strong> ¡Solo quedan {producto.stock} unidades disponibles!
            </div>
          )}
          {producto.stock >= 3 && (
            <div className="alert alert-success mb-4">
              <strong>✓ Stock Normal:</strong> {producto.stock} unidades disponibles.
            </div>
          )}

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h2 className="h5 border-bottom pb-2 mb-3">Especificaciones</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">ID Sistema:</span>
                  <span className="fw-semibold">#{producto.id}</span>
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
              <p className="text-muted small">{producto.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetalleProducto;