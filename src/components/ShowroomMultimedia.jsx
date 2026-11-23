import { Link } from 'react-router-dom'
import audioDemo from '../assets/video/audio.mp3'
import videoDemo from '../assets/video/video.mp4'

function ShowroomMultimedia() {
  return (
    <section className="mb-5">
      <div className="text-center mb-4">
        <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
          <i className="bi bi-soundwave me-1"></i> Experiencia Multimedia
        </span>
        <h2 className="fw-bold mb-2" style={{ color: 'var(--color-texto)' }}>
          Demostración de Audio y Video en Vivo
        </h2>
        <p className="text-muted mx-auto col-lg-7 small">
          Conoce nuestro taller de instrumentos y escucha la calidad sonora de los equipos disponibles en nuestra tienda de Viña del Mar.
        </p>
      </div>

      <div className="row g-4">
        {/* Demostracion de Video */}
        <div className="col-12 col-lg-7">
          <div className="media-card-sv h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-danger text-white px-2 py-1 small">
                  <i className="bi bi-camera-video me-1"></i> Video HD
                </span>
                <span className="small text-muted">
                  <i className="bi bi-eye me-1"></i> Taller y Showroom
                </span>
              </div>

              <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm mb-3 bg-black">
                <video
                  controls
                  preload="metadata"
                  src={videoDemo}
                  className="w-100 h-100 object-fit-cover"
                >
                  Tu navegador no soporta reproducción de video.
                </video>
              </div>

              <h5 className="fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
                Presentación de Tienda y Pruebas de Instrumentos
              </h5>
              <p className="text-muted small mb-0">
                Descubre nuestro showroom, los procesos de inspección acústica y la calibración profesional realizada antes de cada despacho.
              </p>
            </div>

            <div className="pt-3 mt-3 border-top d-flex align-items-center justify-content-between small text-muted">
              <span>
                <i className="bi bi-check-circle-fill text-success me-1"></i> Calibración gratuita incluida
              </span>
              <Link to="/catalogo" className="text-decoration-none fw-semibold" style={{ color: 'var(--color-acento)' }}>
                Ver instrumentos <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Demostracion de Audio */}
        <div className="col-12 col-lg-5">
          <div className="media-card-sv h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-warning text-dark px-2 py-1 small fw-bold">
                  <i className="bi bi-music-note me-1"></i> Prueba Sonora
                </span>
                <span className="small text-muted">
                  <i className="bi bi-mic me-1"></i> Grabación de Estudio
                </span>
              </div>

              <div
                className="p-4 rounded-3 text-center mb-3 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #2b1814 0%, #160c0a 100%)',
                  color: '#ffffff'
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-acento)',
                    color: '#ffffff'
                  }}
                >
                  <i className="bi bi-volume-up fs-2"></i>
                </div>

                <h6 className="fw-bold mb-1 text-white">Muestra Acústica y Fidelidad Tonal</h6>
                <p className="text-white-50 small mb-3" style={{ fontSize: '0.8rem' }}>
                  Grabación capturada con interfaces y micrófonos profesionales de tienda.
                </p>

                <audio controls className="w-100 shadow-sm rounded-pill" src={audioDemo}>
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>

              <h5 className="fw-bold mb-1 fs-6" style={{ color: 'var(--color-secundario)' }}>
                Respuesta Dinámica y Rango Tonal
              </h5>
              <p className="text-muted small mb-0">
                Comprueba la claridad en frecuencias medias y bajas. Puedes agendar una prueba personalizada en nuestra tienda antes de comprar.
              </p>
            </div>

            <div className="pt-3 mt-3 border-top">
              <Link
                to="/contacto"
                className="btn btn-outline-secondary btn-sm w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-calendar2-check"></i>
                Solicitar Asesoría o Prueba
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShowroomMultimedia
