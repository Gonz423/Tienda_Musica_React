import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import productosIniciales from "../data/productos";
import { guardarCarritoStorage, cargarCarritoStorage } from "../utils/persistencia";

const imagenesDisponibles = import.meta.glob("../assets/img/*", {
  eager: true,
  query: '?url',
  import: 'default',
});

function DetalleProducto({ productos = productosIniciales, onAgregarAlCarrito, onAbrirCarrito }) {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const producto = productos.find(
    (p) =>
      String(p.codigo).toLowerCase() === String(id).toLowerCase() ||
      String(p.id) === String(id)
  );

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <div
          className="p-5 rounded-4 shadow-sm text-center mx-auto bg-white border"
          style={{ maxWidth: '520px', borderColor: 'rgba(75, 46, 43, 0.15)' }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
            style={{ width: '64px', height: '64px', backgroundColor: '#fef2f2', color: '#dc2626' }}
          >
            <i className="bi bi-exclamation-triangle fs-2"></i>
          </div>
          <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--color-texto)' }}>
            Producto no encontrado
          </h2>
          <p className="text-muted small mb-4">
            El código o identificador <strong>#{id}</strong> no existe en nuestro catálogo musical.
          </p>
          <Link to="/" className="btn btn-sv-primary px-4 py-2 fw-semibold">
            <i className="bi bi-arrow-left me-2"></i>
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
    return imagenesDisponibles["../assets/img/GA001.jpg"] || producto.imagen;
  };

  const handleAgregar = () => {
    if (producto.stock === 0) return;
    
    // Agregar la cantidad seleccionada
    for (let i = 0; i < cantidad; i++) {
      if (onAgregarAlCarrito) {
        onAgregarAlCarrito(producto);
      }
    }
    const actual = cargarCarritoStorage();
    const nuevosItems = Array(cantidad).fill(producto);
    guardarCarritoStorage([...actual, ...nuevosItems]);

    setMensajeAlerta(`Agregaste ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de "${producto.nombre}" al carrito.`);
    setTimeout(() => setMensajeAlerta(""), 3000);
  };

  return (
    <div className="container py-4 py-md-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none fw-semibold" style={{ color: 'var(--color-primario)' }}>
              <i className="bi bi-house-door me-1"></i>Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">
              {producto.categoria}
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      {/* Alerta de agregado */}
      {mensajeAlerta && (
        <div
          className="alert alert-success alert-dismissible fade show shadow-sm text-center mb-4 border-0 d-flex align-items-center justify-content-center flex-wrap gap-2"
          role="alert"
        >
          <div>
            <i className="bi bi-check-circle-fill me-2"></i>
            {mensajeAlerta}
          </div>
          {onAbrirCarrito && (
            <button
              type="button"
              className="btn btn-sm btn-dark ms-2 py-0 px-2 fw-semibold shadow-sm"
              style={{ fontSize: '0.8rem', borderRadius: '6px' }}
              onClick={onAbrirCarrito}
            >
              <i className="bi bi-cart3 me-1"></i> Ver Carrito
            </button>
          )}
        </div>
      )}

      {/* Ficha Principal de Producto */}
      <div
        className="card shadow-sm border-0 overflow-hidden bg-white"
        style={{
          borderRadius: '16px',
          border: '1px solid rgba(75, 46, 43, 0.15)'
        }}
      >
        <div className="row g-0">
          {/* Columna Izquierda: Imagen y Garantías */}
          <div
            className="col-12 col-md-5 d-flex flex-column align-items-center justify-content-center p-4 p-lg-5"
            style={{
              backgroundColor: '#fbf9f7',
              borderRight: '1px solid rgba(218, 198, 179, 0.4)'
            }}
          >
            <div className="w-100 text-start mb-2">
              <span
                className="badge text-uppercase px-3 py-2 shadow-sm"
                style={{ backgroundColor: 'var(--color-primario)', letterSpacing: '0.5px' }}
              >
                {producto.categoria}
              </span>
            </div>

            <div
              className="d-flex align-items-center justify-content-center w-100 my-3"
              style={{ minHeight: '300px' }}
            >
              <img
                src={resolverImagen()}
                alt={producto.nombre}
                className="img-fluid rounded"
                style={{
                  maxHeight: '340px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 15px rgba(53, 27, 22, 0.1))'
                }}
              />
            </div>

            {/* Sellos de garantía y despacho */}
            <div className="w-100 pt-3 border-top d-flex justify-content-around text-center small text-muted">
              <div>
                <i className="bi bi-truck text-warning fs-5 d-block mb-1"></i>
                <span>Envíos a todo Chile</span>
              </div>
              <div>
                <i className="bi bi-shield-check text-success fs-5 d-block mb-1"></i>
                <span>Garantía Oficial</span>
              </div>
              <div>
                <i className="bi bi-shop text-primary fs-5 d-block mb-1"></i>
                <span>Retiro en Viña</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información y Compra */}
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
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        disabled={cantidad <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 fw-bold">{cantidad}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-light border-0 fw-bold px-3"
                        onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                        disabled={cantidad >= producto.stock}
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-sv-primary px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm flex-grow-1"
                    onClick={handleAgregar}
                    disabled={producto.stock === 0}
                  >
                    <i className="bi bi-cart-plus fs-5"></i>
                    <span>{producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}</span>
                  </button>
                </div>

                {/* Ficha Técnica */}
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

              {/* Botón Volver */}
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
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;