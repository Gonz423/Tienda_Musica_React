import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionUsuariosJefe from '../components/SeccionUsuariosJefe'

function UsuariosJefe({
  usuarios = [],
  usuarioActual = null,
  onCrearUsuario,
  onActualizarUsuario,
  onAlternarEstadoUsuario,
  onAgregarHistorialUsuario,
  onCargarHistorial,
  onEliminarUsuario
}) {
  return (
    <LayoutJefe>
      <EncabezadoJefe seccion="usuarios" />
      <SeccionUsuariosJefe
        usuarios={usuarios}
        usuarioActual={usuarioActual}
        onCrearUsuario={onCrearUsuario}
        onActualizarUsuario={onActualizarUsuario}
        onAlternarEstadoUsuario={onAlternarEstadoUsuario}
        onAgregarHistorialUsuario={onAgregarHistorialUsuario}
        onCargarHistorial={onCargarHistorial}
        onEliminarUsuario={onEliminarUsuario}
      />
    </LayoutJefe>
  )
}

export default UsuariosJefe
