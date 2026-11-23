function TarjetaKPI({
  titulo,
  valor,
  descripcion,
  icono,
  colorValor = 'var(--color-primario)',
  colorIcono = 'var(--color-acento)',
  extraBadge = null,
  headingLevel = 3,
  layout = 'horizontal'
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  if (layout === 'vertical') {
    return (
      <div className="p-3 bg-white rounded-3 shadow-sm border h-100">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted small text-uppercase fw-bold">{titulo}</span>
          {icono && (
            <span style={{ color: colorIcono }}>
              <i className={`bi ${icono} fs-4`}></i>
            </span>
          )}
        </div>
        <Heading className="h3 fw-bold my-1" style={{ color: colorValor }}>
          {valor}
        </Heading>
        {descripcion && <small className="text-muted d-block">{descripcion}</small>}
        {extraBadge && <div className="mt-2">{extraBadge}</div>}
      </div>
    )
  }

  return (
    <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
      <div>
        <span className="text-muted small text-uppercase fw-bold">{titulo}</span>
        <Heading className="h3 fw-bold my-1" style={{ color: colorValor }}>
          {valor}
        </Heading>
        {descripcion && <small className="text-muted d-block">{descripcion}</small>}
        {extraBadge && <div className="mt-1">{extraBadge}</div>}
      </div>
      {icono && (
        <div style={{ color: colorIcono }}>
          <i className={`bi ${icono} fs-2`}></i>
        </div>
      )}
    </div>
  )
}

export default TarjetaKPI

