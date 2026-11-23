import { useState } from 'react'
import TarjetaKPI from './TarjetaKPI'
import FiltrosUsuarios from './FiltrosUsuarios'
import TablaUsuarios from './TablaUsuarios'
import ModalUsuario from './ModalUsuario'
import ModalHistorialUsuario from './ModalHistorialUsuario'

const formUsuarioInicial = { nombre: '', email: '', password: '', rol: 'cliente', activo: true }

const ahoraStr = () =>
  `${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`

function SeccionUsuariosJefe({ usuarios = [], usuarioActual = null, onCrearUsuario, onActualizarUsuario, onAlternarEstadoUsuario, onAgregarHistorialUsuario }) {
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
      else if (formUsuario.password.trim().length < 4) err.password = 'La contraseña debe tener al menos 4 caracteres'
    } else if (formUsuario.password.trim() && formUsuario.password.trim().length < 4) {
      err.password = 'La nueva contraseña debe tener al menos 4 caracteres'
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
      const evento = { id: Date.now(), fecha, accion: 'Modificación de perfil', detalle: cambios.length > 0 ? `Actualización: ${cambios.join(', ')}` : 'Edición de datos realizada' }
      const actualizado = { ...usuarioEditando, nombre: formUsuario.nombre.trim(), email: formUsuario.email.trim().toLowerCase(), password: formUsuario.password.trim() || usuarioEditando.password, rol: formUsuario.rol, activo: formUsuario.activo, historial: [evento, ...(usuarioEditando.historial || [])] }
      if (onActualizarUsuario) onActualizarUsuario(actualizado)
      setMensajeUsuario(`Usuario "${actualizado.nombre}" actualizado con éxito`)
    } else {
      const nuevo = { id: `USR-${Date.now().toString().slice(-4)}`, nombre: formUsuario.nombre.trim(), email: formUsuario.email.trim().toLowerCase(), password: formUsuario.password.trim(), rol: formUsuario.rol, activo: formUsuario.activo, fechaCreacion: new Date().toISOString().split('T')[0], historial: [{ id: Date.now(), fecha, accion: 'Creación de cuenta', detalle: `Cuenta registrada con rol: ${formUsuario.rol}` }] }
      if (onCrearUsuario) onCrearUsuario(nuevo)
      setMensajeUsuario(`Usuario "${nuevo.nombre}" creado con éxito`)
    }
    setModalUsuarioAbierto(false)
    setUsuarioEditando(null)
    setTimeout(() => setMensajeUsuario(''), 3500)
  }

  const handleAlternarEstado = (usr) => {
    if (usuarioActual?.email === usr.email && usr.activo) {
      alert('Por motivos de seguridad no puedes desactivar tu propia cuenta activa de administrador.')
      return
    }
    if (onAlternarEstadoUsuario) onAlternarEstadoUsuario(usr.id)
    setMensajeUsuario(`Estado de "${usr.nombre}" actualizado a ${usr.activo ? 'Desactivado' : 'Activo'}`)
    setTimeout(() => setMensajeUsuario(''), 3000)
  }

  const handleAgregarNotaHistorial = (e) => {
    e.preventDefault()
    if (!notaHistorial.trim() || !usuarioHistorialModal) return
    if (onAgregarHistorialUsuario) onAgregarHistorialUsuario(usuarioHistorialModal.id, { accion: 'Nota Administrativa', detalle: notaHistorial.trim() })
    const nuevoEv = { id: Date.now(), fecha: ahoraStr(), accion: 'Nota Administrativa', detalle: notaHistorial.trim() }
    setUsuarioHistorialModal((prev) => ({ ...prev, historial: [nuevoEv, ...(prev.historial || [])] }))
    setNotaHistorial('')
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

      <TablaUsuarios usuariosFiltrados={usuariosFiltrados} onVerHistorial={setUsuarioHistorialModal} onEditarUsuario={handleAbrirEditarUsuario} onAlternarEstado={handleAlternarEstado} />

      <ModalUsuario abierto={modalUsuarioAbierto} onCerrar={() => setModalUsuarioAbierto(false)} usuarioEditando={usuarioEditando} formUsuario={formUsuario} setFormUsuario={setFormUsuario} erroresUsuario={erroresUsuario} mostrarPasswordUsuario={mostrarPasswordUsuario} setMostrarPasswordUsuario={setMostrarPasswordUsuario} onSubmit={handleGuardarUsuario} />

      <ModalHistorialUsuario usuario={usuarioHistorialModal} onCerrar={() => setUsuarioHistorialModal(null)} notaHistorial={notaHistorial} setNotaHistorial={setNotaHistorial} onAgregarNota={handleAgregarNotaHistorial} />
    </div>
  )
}

export default SeccionUsuariosJefe
