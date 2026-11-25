import { useState } from 'react'
import TarjetaKPI from './TarjetaKPI'
import FiltrosUsuarios from './FiltrosUsuarios'
import TablaUsuarios from './TablaUsuarios'
import ModalUsuario from './ModalUsuario'
import ModalHistorialUsuario from './ModalHistorialUsuario'

const formUsuarioInicial = { nombre: '', email: '', password: '', rol: 'cliente', activo: true }

// Generadores de ids/fechas fuera del componente: el render se mantiene puro
const nuevoIdEvento = () => Date.now()
const nuevoIdUsuario = () => `USR-${Date.now().toString().slice(-4)}`
const hoyIso = () => new Date().toISOString().split('T')[0]

const ahoraStr = () =>
  `${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`

function SeccionUsuariosJefe({ usuarios = [], usuarioActual = null, onCrearUsuario, onActualizarUsuario, onAlternarEstadoUsuario, onAgregarHistorialUsuario, onCargarHistorial, onEliminarUsuario }) {
  const [busquedaUsuario, setBusquedaUsuario] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [usuarioHistorialModal, setUsuarioHistorialModal] = useState(null)
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [notaHistorial, setNotaHistorial] = useState('')
  const [mensajeUsuario, setMensajeUsuario] = useState('')
  const [mostrarPasswordUsuario, setMostrarPasswordUsuario] = useState(false)
  const [formUsuario, setFormUsuario] = useState(formUsuarioInicial)
  const [erroresUsuario, setErroresUsuario] = useState({})

  const totalUsuarios = usuarios.length
  const usuariosActivos = usuarios.filter((u) => u.activo !== false).length
  const usuariosInactivos = usuarios.filter((u) => u.activo === false).length

  const usuariosFiltrados = usuarios.filter((u) => {
    const term = busquedaUsuario.trim().toLowerCase()
    const coincideTexto = !term || u.nombre?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)
    const coincideRol = filtroRol === 'todos' || u.rol === filtroRol
    const coincideEstado = filtroEstado === 'todos' || (filtroEstado === 'activos' && u.activo !== false) || (filtroEstado === 'inactivos' && u.activo === false)
    return coincideTexto && coincideRol && coincideEstado
  })

  const handleAbrirCrearUsuario = () => {
    setUsuarioEditando(null)
    setFormUsuario(formUsuarioInicial)
    setErroresUsuario({})
    setMostrarPasswordUsuario(false)
    setModalUsuarioAbierto(true)
  }

  const handleAbrirEditarUsuario = (usr) => {
    setUsuarioEditando(usr)
    setFormUsuario({ nombre: usr.nombre || '', email: usr.email || '', password: '', rol: usr.rol || 'cliente', activo: usr.activo !== false })
    setErroresUsuario({})
    setMostrarPasswordUsuario(false)
    setModalUsuarioAbierto(true)
  }

  const handleGuardarUsuario = (e) => {
    e.preventDefault()
    const err = {}
    if (!formUsuario.nombre.trim()) err.nombre = 'El nombre completo es obligatorio'
    if (!formUsuario.email.trim()) err.email = 'El correo electrónico es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formUsuario.email.trim())) err.email = 'Ingresa un formato de correo válido'
    else if (usuarios.some((u) => u.email.toLowerCase() === formUsuario.email.trim().toLowerCase() && (!usuarioEditando || u.id !== usuarioEditando.id))) err.email = 'Ya existe una cuenta con este correo'
    if (!usuarioEditando) {
      if (!formUsuario.password.trim()) err.password = 'La contraseña es obligatoria'
      else if (formUsuario.password.trim().length < 6) err.password = 'La contraseña debe tener al menos 6 caracteres'
    } else if (formUsuario.password.trim() && formUsuario.password.trim().length < 6) {
      err.password = 'La nueva contraseña debe tener al menos 6 caracteres'
    }
    setErroresUsuario(err)
    if (Object.keys(err).length > 0) return

    const fecha = ahoraStr()
    if (usuarioEditando) {
      const cambios = []
      if (usuarioEditando.nombre !== formUsuario.nombre.trim()) cambios.push(`nombre a "${formUsuario.nombre.trim()}"`)
      if (usuarioEditando.email !== formUsuario.email.trim().toLowerCase()) cambios.push(`correo a "${formUsuario.email.trim().toLowerCase()}"`)
      if (usuarioEditando.rol !== formUsuario.rol) cambios.push(`rol a ${formUsuario.rol}`)
      if (usuarioEditando.activo !== formUsuario.activo) cambios.push(`estado a ${formUsuario.activo ? 'activo' : 'desactivado'}`)
      if (formUsuario.password.trim()) cambios.push('contraseña actualizada')
      const evento = { id: nuevoIdEvento(), fecha, accion: 'Modificación de perfil', detalle: cambios.length > 0 ? `Actualización: ${cambios.join(', ')}` : 'Edición de datos realizada' }
      // La contraseña nunca se guarda en el frontend: solo se envía al backend si el admin escribió una nueva
      const actualizado = { ...usuarioEditando, nombre: formUsuario.nombre.trim(), email: formUsuario.email.trim().toLowerCase(), passwordNueva: formUsuario.password.trim() || undefined, rol: formUsuario.rol, activo: formUsuario.activo, historial: [evento, ...(usuarioEditando.historial || [])] }
      delete actualizado.password
      cerrarConResultado(onActualizarUsuario?.(actualizado), `Usuario "${actualizado.nombre}" actualizado con éxito`)
      return
    } else {
      const nuevo = { id: nuevoIdUsuario(), nombre: formUsuario.nombre.trim(), email: formUsuario.email.trim().toLowerCase(), password: formUsuario.password.trim(), rol: formUsuario.rol, activo: formUsuario.activo, fechaCreacion: hoyIso(), historial: [{ id: nuevoIdEvento(), fecha, accion: 'Creación de cuenta', detalle: `Cuenta registrada con rol: ${formUsuario.rol}` }] }
      cerrarConResultado(onCrearUsuario?.(nuevo), `Usuario "${nuevo.nombre}" creado con éxito`)
    }
  }

  // Espera la respuesta de la API (App.jsx); si falla, el modal queda abierto para corregir
  const cerrarConResultado = (resultado, texto) => {
    Promise.resolve(resultado)
      .then(() => {
        setModalUsuarioAbierto(false)
        setUsuarioEditando(null)
        setMensajeUsuario(texto)
        setTimeout(() => setMensajeUsuario(''), 3500)
      })
      .catch(() => {})
  }

  // Abre el historial; si hay backend se carga la auditoría real del usuario
  const handleVerHistorial = (usr) => {
    setUsuarioHistorialModal(usr)
    if (onCargarHistorial) {
      Promise.resolve(onCargarHistorial(usr)).then((historial) => {
        if (Array.isArray(historial)) {
          setUsuarioHistorialModal((prev) => (prev && prev.id === usr.id ? { ...prev, historial } : prev))
        }
      })
    }
  }

  const handleAlternarEstado = (usr) => {
    if (usuarioActual?.email === usr.email && usr.activo) {
      alert('Por motivos de seguridad no puedes desactivar tu propia cuenta activa de administrador.')
      return
    }
    Promise.resolve(onAlternarEstadoUsuario?.(usr.id))
      .then(() => {
        setMensajeUsuario(`Estado de "${usr.nombre}" actualizado a ${usr.activo ? 'Desactivado' : 'Activo'}`)
        setTimeout(() => setMensajeUsuario(''), 3000)
      })
      .catch(() => {})
  }

  const handleAgregarNotaHistorial = (e) => {
    e.preventDefault()
    if (!notaHistorial.trim() || !usuarioHistorialModal) return
    const nuevoEv = { id: nuevoIdEvento(), fecha: ahoraStr(), accion: 'Nota Administrativa', detalle: notaHistorial.trim() }
    Promise.resolve(onAgregarHistorialUsuario?.(usuarioHistorialModal.id, { accion: 'Nota Administrativa', detalle: notaHistorial.trim() }))
      .then(() => {
        setUsuarioHistorialModal((prev) => ({ ...prev, historial: [nuevoEv, ...(prev.historial || [])] }))
        setNotaHistorial('')
      })
      .catch(() => {})
  }

  return (
    <div className="d-flex flex-column gap-4">
      {mensajeUsuario && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 shadow-sm border-0 mb-0" role="alert">
          <i className="bi bi-check-circle-fill flex-shrink-0"></i>
          <div>{mensajeUsuario}</div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <TarjetaKPI titulo="Total Usuarios" valor={totalUsuarios} descripcion="Cuentas registradas" icono="bi-people-fill" colorValor="var(--color-primario)" colorIcono="var(--color-acento)" />
        </div>
        <div className="col-12 col-md-4">
          <TarjetaKPI titulo="Usuarios Activos" valor={usuariosActivos} descripcion="Con acceso habilitado" icono="bi-person-check-fill" colorValor="#198754" colorIcono="#198754" />
        </div>
        <div className="col-12 col-md-4">
          <TarjetaKPI titulo="Usuarios Desactivados" valor={usuariosInactivos} descripcion="Acceso suspendido" icono="bi-person-x-fill" colorValor="#dc3545" colorIcono="#dc3545" />
        </div>
      </div>

      <FiltrosUsuarios busquedaUsuario={busquedaUsuario} setBusquedaUsuario={setBusquedaUsuario} filtroRol={filtroRol} setFiltroRol={setFiltroRol} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} onNuevoUsuario={handleAbrirCrearUsuario} />

      <TablaUsuarios usuariosFiltrados={usuariosFiltrados} onVerHistorial={handleVerHistorial} onEditarUsuario={handleAbrirEditarUsuario} onAlternarEstado={handleAlternarEstado} onEliminar={onEliminarUsuario} usuarioActual={usuarioActual} />

      <ModalUsuario abierto={modalUsuarioAbierto} onCerrar={() => setModalUsuarioAbierto(false)} usuarioEditando={usuarioEditando} formUsuario={formUsuario} setFormUsuario={setFormUsuario} erroresUsuario={erroresUsuario} mostrarPasswordUsuario={mostrarPasswordUsuario} setMostrarPasswordUsuario={setMostrarPasswordUsuario} onSubmit={handleGuardarUsuario} />

      <ModalHistorialUsuario usuario={usuarioHistorialModal} onCerrar={() => setUsuarioHistorialModal(null)} notaHistorial={notaHistorial} setNotaHistorial={setNotaHistorial} onAgregarNota={handleAgregarNotaHistorial} />
    </div>
  )
}

export default SeccionUsuariosJefe
