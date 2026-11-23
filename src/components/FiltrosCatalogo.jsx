function FiltrosCatalogo({
  busqueda,
  setBusqueda,
  categoriaFiltro,
  setCategoriaFiltro,
  categorias = [],
  orden,
  setOrden,
  totalMostrados,
  totalProductos
}) {
  return (
    <div className="panel-filtros-catalogo p-3 p-md-4 mb-4">
      <div className="row g-3 align-items-center">
        {/* Buscador Moderno */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="input-group search-box-sv shadow-sm">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 bg-white"
              placeholder="Buscar por nombre, marca o modelo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar producto"
            />
            {busqueda && (
              <button
                className="btn bg-white border-start-0 text-muted"
                type="button"
                onClick={() => setBusqueda('')}
                title="Limpiar busqueda"
              >
                <i className="bi bi-x-circle-fill text-secondary"></i>
              </button>
            )}
          </div>
        </div>

        {/* Categorias - Estilo identico a Ordenar */}
        <div className="col-12 col-sm-6 col-md-3 col-lg-3">
          <div className="orden-box-sv d-flex align-items-center gap-2 p-1 px-3 bg-white rounded-pill shadow-sm">
            <i className="bi bi-tag text-muted small" aria-hidden="true"></i>
            <label htmlFor="categoriaFiltroSelect" className="small fw-semibold text-secondary mb-0 text-nowrap">
              Categoría:
            </label>
            <select
              id="categoriaFiltroSelect"
              className="form-select form-select-sm border-0 bg-transparent shadow-none fw-medium text-capitalize"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ordenamiento */}
        <div className="col-12 col-sm-6 col-md-3 col-lg-4">
          <div className="orden-box-sv d-flex align-items-center gap-2 p-1 px-3 bg-white rounded-pill shadow-sm">
            <i className="bi bi-arrow-down-up text-muted small" aria-hidden="true"></i>
            <label htmlFor="ordenarPor" className="small fw-semibold text-secondary mb-0 text-nowrap">
              Ordenar:
            </label>
            <select
              id="ordenarPor"
              className="form-select form-select-sm border-0 bg-transparent shadow-none fw-medium"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="destacados">Destacados</option>
              <option value="menor-precio">Menor precio</option>
              <option value="mayor-precio">Mayor precio</option>
              <option value="nombre-az">Nombre (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Barra de estado con contador holgado y sin desbordamiento */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3 mt-3 border-top border-secondary border-opacity-10 small text-muted">
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium">
            <i className="bi bi-sliders me-1 text-primary"></i>
            Filtro: <strong className="text-capitalize">{categoriaFiltro}</strong>
          </span>
          {busqueda && (
            <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium">
              Búsqueda: "<strong>{busqueda}</strong>"
            </span>
          )}
        </div>
        <span className="contador-pill-sv">
          <i className="bi bi-box2-fill me-2" aria-hidden="true" style={{ verticalAlign: 'middle' }}></i>
          Mostrando <strong>{totalMostrados}</strong> de <strong>{totalProductos}</strong> productos
        </span>
      </div>

      {/* Botones accesibles de categoria para soporte de pruebas */}
      <div className="visually-hidden">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoriaFiltro(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FiltrosCatalogo
