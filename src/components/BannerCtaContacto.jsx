import { Link } from 'react-router-dom'
import banerCelular2Img from '../assets/img/banercelular2.png'

function BannerCtaContacto() {
  return (
    <section
      className="banner-cta-contacto p-4 p-md-5 rounded-4 text-white text-center text-md-start mb-4 shadow-sm position-relative overflow-hidden"
      style={{
        '--cta-bg-mobile': `url(${banerCelular2Img})`,
      }}
    >
      <div className="row align-items-center gy-3">
        <div className="col-12 col-md-8">
          <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-2">
            Atención y Luthería
          </span>
          <h3 className="fw-bold mb-2 text-white">
            ¿Tienes un requerimiento especial o buscas un instrumento específico?
          </h3>
          <p className="text-white-50 mb-0 small">
            Comunícate con nuestro equipo en Viña del Mar. Ofrecemos cotizaciones a medida para músicos, colegios y bandas.
          </p>
        </div>
        <div className="col-12 col-md-4 text-md-end">
          <Link
            to="/contacto"
            className="btn btn-light px-4 py-2 fw-bold shadow"
            style={{ color: 'var(--color-primario)', borderRadius: '8px' }}
          >
            <i className="bi bi-envelope-check me-2"></i>
            Ir a Contáctanos
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BannerCtaContacto
