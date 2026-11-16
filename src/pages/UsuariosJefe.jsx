import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionUsuariosJefe from '../components/SeccionUsuariosJefe'

function UsuariosJefe({
  usuarios = [],
  usuarioActual = null,
  onCrearUsuario,
  onActualizarUsuario,
  onAlternarEstadoUsuario,
  onAgregarHistorialUsuario
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
      />
    </LayoutJefe>
  )
}

export default UsuariosJefe
