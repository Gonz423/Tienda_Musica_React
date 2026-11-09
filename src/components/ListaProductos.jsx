import VistaProducto from './VistaProducto'

function ListaProductos({
  productos = [],
  onAgregarAlCarrito,
  obtenerImagen,
  onRestablecerFiltros
}) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-3 border my-4">
        <i className="bi bi-search fs-1 text-muted d-block mb-2"></i>
        <h5 className="fw-bold text-dark">No se encontraron productos</h5>
        <p className="text-muted mb-3">
          Intenta con otra palabra clave o selecciona otra categoria.
        </p>
        {onRestablecerFiltros && (
          <button
            type="button"
            className="btn btn-sm btn-sv-primary"
            onClick={onRestablecerFiltros}
          >
            Restablecer Filtros
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 g-md-4">
      {productos.map((producto) => (
        <VistaProducto
          key={producto.codigo || producto.id}
          producto={producto}
          onAgregarAlCarrito={onAgregarAlCarrito}
          obtenerImagen={obtenerImagen}
        />
      ))}
    </div>
  )
}

export default ListaProductos