function TarjetaDetalleProducto({ children }) {
  return (
    <div
      className="card shadow-sm border-0 overflow-hidden bg-white"
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(75, 46, 43, 0.15)'
      }}
    >
      <div className="row g-0">
        {children}
      </div>
    </div>
  )
}

export default TarjetaDetalleProducto

