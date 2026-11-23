function GaleriaProducto({ producto, imagenUrl }) {
  return (
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
          src={imagenUrl}
          alt={producto.nombre}
          className="img-fluid rounded"
          style={{
            maxHeight: '340px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 15px rgba(53, 27, 22, 0.1))'
          }}
        />
      </div>

      {/* Sellos de garantia y despacho */}
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
  )
}

export default GaleriaProducto
