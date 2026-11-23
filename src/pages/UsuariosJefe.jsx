import LayoutJefe from '../components/LayoutJefe'
import EncabezadoJefe from '../components/EncabezadoJefe'
import SeccionUsuariosJefe from '../components/SeccionUsuariosJefe'
import GestionUsuariosApi from '../components/GestionUsuariosApi'
import { obtenerToken } from '../services/authService'

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
      {/* Con sesión JWT se usa usuario-service (8082); sin token se mantiene el modo local */}
      {usuarioActual?.token || obtenerToken() ? (
        <GestionUsuariosApi usuarioActual={usuarioActual} />
      ) : (
        <SeccionUsuariosJefe
          usuarios={usuarios}
          usuarioActual={usuarioActual}
          onCrearUsuario={onCrearUsuario}
          onActualizarUsuario={onActualizarUsuario}
          onAlternarEstadoUsuario={onAlternarEstadoUsuario}
          onAgregarHistorialUsuario={onAgregarHistorialUsuario}
        />
      )}
    </LayoutJefe>
  )
}

export default UsuariosJefe
