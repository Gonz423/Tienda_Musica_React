import { useEffect, useState } from 'react'
import TarjetaKPI from './TarjetaKPI'
import EstadoCarga from './EstadoCarga'
import AlertaErrorHttp from './AlertaErrorHttp'
import TablaUsuariosApi from './TablaUsuariosApi'
import ModalCambioRol from './ModalCambioRol'
import ModalAuditoriaUsuario from './ModalAuditoriaUsuario'
import { listarUsuarios, cambiarRolUsuario, cambiarEstadoUsuario } from '../services/usuarioService'
import { ROLES_BACKEND, ETIQUETAS_ROL, esEmpleado } from '../utils/roles'

// Gestión de usuarios conectada a usuario-service (puerto 8082)
function GestionUsuariosApi({ usuarioActual = null }) {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)

  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('TODOS')

  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState(null)
  const [procesandoId, setProcesandoId] = useState(null)

  const [usuarioRol, setUsuarioRol] = useState(null)
  const [errorRol, setErrorRol] = useState(null)
  const [usuarioAuditoria, setUsuarioAuditoria] = useState(null)

  const correoActual = (usuarioActual?.correo || usuarioActual?.email || '').toLowerCase()

  useEffect(() => {
    let activo = true
    listarUsuarios()
      .then((data) => {
        if (!activo) return
        setUsuarios(Array.isArray(data) ? data : [])
        setError(null)
      })
      .catch((err) => {
        if (activo) setError(err)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [recarga])

  const recargar = () => {
    setCargando(true)
    setError(null)
    setRecarga((r) => r + 1)
  }

  const reemplazarUsuario = (actualizado) => {
    if (!actualizado) return
    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? { ...u, ...actualizado } : u)))
  }

  const handleAbrirCambioRol = (usr) => {
    setErrorRol(null)
    setUsuarioRol(usr)
  }

  const handleConfirmarRol = async (nuevoRol) => {
    const usr = usuarioRol
    if (!usr) return
    setProcesandoId(usr.id)
    setErrorRol(null)
    setMensaje('')
    try {
      const actualizado = await cambiarRolUsuario(usr, nuevoRol)
      reemplazarUsuario(actualizado)
      setMensaje(`Rol de "${usr.nombre}" actualizado a ${ETIQUETAS_ROL[nuevoRol] || nuevoRol}.`)
      setUsuarioRol(null)
    } catch (err) {
      setErrorRol(err)
    } finally {
      setProcesandoId(null)
    }
  }

  const handleAlternarEstado = async (usr) => {
    if ((usr.correo || '').toLowerCase() === correoActual) {
      setErrorAccion('Por seguridad no puedes desactivar tu propia cuenta de administrador.')
      return
    }
    const nuevoEstado = usr.activo === false
    setProcesandoId(usr.id)
    setErrorAccion(null)
    setMensaje('')
    try {
      const actualizado = await cambiarEstadoUsuario(usr.id, nuevoEstado)
      reemplazarUsuario(actualizado)
      setMensaje(`Cuenta de "${usr.nombre}" ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`)
    } catch (err) {
      setErrorAccion(err)
    } finally {
      setProcesandoId(null)
    }
  }

  const termino = busqueda.trim().toLowerCase()
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideTexto =
      !termino ||
      u.nombre?.toLowerCase().includes(termino) ||
      u.correo?.toLowerCase().includes(termino) ||
      u.rut?.toLowerCase().includes(termino)
    const coincideRol = filtroRol === 'TODOS' || (u.rol || '').toUpperCase() === filtroRol
    return coincideTexto && coincideRol
  })

  const totalEmpleados = usuarios.filter((u) => esEmpleado(u.rol)).length
  const empleadosInactivos = usuarios.filter((u) => esEmpleado(u.rol) && u.activo === false).length

  return (
    <div className="d-flex flex-column gap-4">
      {mensaje && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm border-0 mb-0" role="status">
          <i className="bi bi-check-circle-fill flex-shrink-0"></i>
          <div className="flex-grow-1">{mensaje}</div>
          <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={() => setMensaje('')} />
        </div>
      )}

      {errorAccion && <AlertaErrorHttp error={errorAccion} onCerrar={() => setErrorAccion(null)} />}

      {cargando ? (
        <div className="bg-white rounded-3 shadow-sm border">
          <EstadoCarga mensaje="Cargando usuarios registrados..." />
        </div>
      ) : error ? (
        <AlertaErrorHttp error={error} onReintentar={recargar} />
      ) : (
        <>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <TarjetaKPI titulo="Total Usuarios" valor={usuarios.length} descripcion="Cuentas registradas" icono="bi-people-fill" />
            </div>
            <div className="col-12 col-md-4">
              <TarjetaKPI titulo="Empleados" valor={totalEmpleados} descripcion="Administradores y vendedores" icono="bi-person-badge-fill" colorValor="#0d6efd" colorIcono="#0d6efd" />
            </div>
            <div className="col-12 col-md-4">
              <TarjetaKPI titulo="Empleados Inactivos" valor={empleadosInactivos} descripcion="Acceso suspendido" icono="bi-person-x-fill" colorValor="#dc3545" colorIcono="#dc3545" />
            </div>
          </div>

          <div className="p-3 bg-white rounded-3 shadow-sm border">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar por nombre, correo o RUT..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-8 col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                  aria-label="Filtrar por rol"
                >
                  <option value="TODOS">Todos los roles</option>
                  {ROLES_BACKEND.map((rol) => (
                    <option key={rol} value={rol}>
                      {ETIQUETAS_ROL[rol]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-4 col-md-2">
                <button type="button" className="btn btn-outline-secondary btn-sm w-100" onClick={recargar}>
                  <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
                </button>
              </div>
            </div>
          </div>

          <TablaUsuariosApi
            usuarios={usuariosFiltrados}
            correoActual={correoActual}
            procesandoId={procesandoId}
            onCambiarRol={handleAbrirCambioRol}
            onAlternarEstado={handleAlternarEstado}
            onVerHistorial={setUsuarioAuditoria}
          />
        </>
      )}

      {usuarioRol && (
        <ModalCambioRol
          key={usuarioRol.id}
          usuario={usuarioRol}
          procesando={procesandoId === usuarioRol.id}
          error={errorRol}
          onConfirmar={handleConfirmarRol}
          onCerrar={() => setUsuarioRol(null)}
        />
      )}

      {usuarioAuditoria && (
        <ModalAuditoriaUsuario
          key={usuarioAuditoria.id}
          usuario={usuarioAuditoria}
          onCerrar={() => setUsuarioAuditoria(null)}
        />
      )}
    </div>
  )
}

export default GestionUsuariosApi
