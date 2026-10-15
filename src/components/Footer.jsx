import React from 'react'

function Footer() {
  const handleScrollTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id="nosotros" className="footer-sonido-vivo mt-auto text-light pt-5 pb-3">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Identidad */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-soundwave fs-2" style={{ color: 'var(--color-acento)' }}></i>
              <span className="fs-4 fw-bold text-white tracking-wide">Sonido Vivo</span>
            </div>
            <p className="text-white-50 small mb-3" style={{ lineHeight: '1.6' }}>
              Tu tienda de musica y equipamiento de audio profesional en Viña del Mar. Calidad garantizada, asesoría técnica experta y las mejores marcas para músicos y creadores.
            </p>
            {/* Redes */}
            <div className="d-flex gap-2 mb-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn-footer-social"
                aria-label="Instagram de Sonido Vivo"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn-footer-social"
                aria-label="Facebook de Sonido Vivo"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="btn-footer-social"
                aria-label="YouTube de Sonido Vivo"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="https://wa.me/56984521198"
                target="_blank"
                rel="noreferrer"
                className="btn-footer-social"
                aria-label="WhatsApp de Sonido Vivo"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
            {/* Garantía */}
            <div className="d-flex flex-wrap gap-1 mt-2">
              <span className="badge bg-dark border border-secondary text-white-50 small">
                <i className="bi bi-truck me-1 text-warning"></i> Envíos a todo Chile
              </span>
              <span className="badge bg-dark border border-secondary text-white-50 small">
                <i className="bi bi-shield-check me-1 text-success"></i> Garantía 12 Meses
              </span>
            </div>
          </div>

          {/* Navegación */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="text-uppercase fw-bold mb-3 pb-1 border-bottom border-secondary text-white" style={{ letterSpacing: '1px' }}>
              Navegación
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <a href="#inicio" onClick={handleScrollTop} className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-muted"></i> Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-muted"></i> Catálogo Completo
                </a>
              </li>
              <li>
                <a href="#guitarras" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-muted"></i> Guitarras y Bajos
                </a>
              </li>
              <li>
                <a href="#baterias" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-muted"></i> Baterías y Percusión
                </a>
              </li>
              <li>
                <a href="#audio" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-muted"></i> Audio y Grabación
                </a>
              </li>
              <li>
                <a href="#teclados" className="footer-link">
                  <i className="bi bi-chevron-right me-1 text-muted"></i> Teclados y Pianos
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="text-uppercase fw-bold mb-3 pb-1 border-bottom border-secondary text-white" style={{ letterSpacing: '1px' }}>
              Sucursal y Contacto
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-white-50">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-danger fs-6 mt-1 flex-shrink-0"></i>
                <div>
                  <strong className="text-light">Dirección:</strong>
                  <br />
                  Av. Libertad 1045, Local 4
                  <br />
                  Viña del Mar, Región de Valparaíso
                </div>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-warning flex-shrink-0"></i>
                <div>
                  <a href="tel:+56322684590" className="footer-link text-white-50 text-decoration-none">
                    +56 32 268 4590
                  </a>
                </div>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-whatsapp text-success flex-shrink-0"></i>
                <div>
                  <a
                    href="https://wa.me/56984521198"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link text-white-50 text-decoration-none"
                  >
                    +56 9 8452 1198
                  </a>
                </div>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-info flex-shrink-0"></i>
                <div>
                  <a href="mailto:contacto@sonidovivo.cl" className="footer-link text-white-50 text-decoration-none">
                    contacto@sonidovivo.cl
                  </a>
                </div>
              </li>
              <li className="d-flex align-items-start gap-2 pt-1 border-top border-secondary">
                <i className="bi bi-clock-fill text-primary mt-1 flex-shrink-0"></i>
                <div>
                  <strong className="text-light">Horario de Atención:</strong>
                  <br />
                  Lun a Vie: 10:00 - 19:30 hrs
                  <br />
                  Sábados: 10:30 - 14:30 hrs
                </div>
              </li>
            </ul>
          </div>

          {/* Mapa */}
          <div className="col-12 col-md-12 col-lg-4">
            <h6 className="text-uppercase fw-bold mb-3 pb-1 border-bottom border-secondary text-white d-flex justify-content-between align-items-center" style={{ letterSpacing: '1px' }}>
              <span>Ubicación en Viña del Mar</span>
              <span className="badge bg-danger text-white fs-7 py-1">En Vivo</span>
            </h6>
            <div className="mapa-contenedor shadow-sm">
              <iframe
                title="Ubicación de Tienda Sonido Vivo en Viña del Mar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13377.291702957134!2d-71.5544254!3d-33.0153177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689de0f78df3111%3A0x6b0939c09532551a!2sAv.%20Libertad%2C%20Vi%C3%B1a%20del%20Mar%2C%20Valpara%C3%ADso!5e0!3m2!1ses!2scl!4v1710000000000!5m2!1ses!2scl"
                width="100%"
                height="175"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="mt-2 text-end">
              <a
                href="https://maps.google.com/?q=Av.+Libertad+1045,+Viña+del+Mar"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-light py-1 px-2"
                style={{ fontSize: '0.78rem' }}
              >
                <i className="bi bi-box-arrow-up-right me-1"></i> Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-50 my-3" />

        <div className="row align-items-center gy-2">
          {/* Copyright */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <p className="text-white-50 small mb-0">
              © {new Date().getFullYear()} <strong>Sonido Vivo SpA</strong>. Todos los derechos reservados. Viña del Mar, Chile.
            </p>
          </div>

          {/* Pagos */}
          <div className="col-12 col-md-6 text-center text-md-end d-flex justify-content-center justify-content-md-end align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 text-white-50 small">
              <span>Medios de Pago:</span>
              <span className="badge bg-light text-dark fw-bold">Webpay Plus</span>
              <span className="badge bg-light text-dark fw-bold">Transbank</span>
              <span className="badge bg-light text-dark fw-bold">Transferencia</span>
            </div>

            <button
              onClick={handleScrollTop}
              className="btn btn-sm btn-outline-secondary text-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: '32px', height: '32px' }}
              title="Volver arriba"
              aria-label="Volver arriba"
            >
              <i className="bi bi-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
