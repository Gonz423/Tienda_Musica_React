import Modal from './Modal'

function ModalUsuario({
  abierto,
  onCerrar,
  usuarioEditando,
  formUsuario,
  setFormUsuario,
  erroresUsuario = {},
  mostrarPasswordUsuario,
  setMostrarPasswordUsuario,
  onSubmit
}) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={
        usuarioEditando
          ? `Editar Usuario: ${usuarioEditando.nombre}`
          : 'Crear Nuevo Usuario'
      }
      icono={usuarioEditando ? 'bi-pencil-square' : 'bi-person-plus-fill'}
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCerrar}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-usuario-modal"
            className="btn btn-sv-primary shadow-sm"
          >
            <i className="bi bi-save me-1"></i>
            {usuarioEditando ? 'Actualizar Usuario' : 'Crear Usuario'}
          </button>
        </>
      }
    >
      <form id="form-usuario-modal" onSubmit={onSubmit} noValidate>
        <div className="modal-body px-4 py-3">
          <div className="mb-3">
            <label
              htmlFor="usr-nombre"
              className="form-label small fw-bold text-secondary"
            >
              Nombre Completo
            </label>
            <input
              id="usr-nombre"
              type="text"
              className={`form-control ${
                erroresUsuario.nombre ? 'is-invalid' : ''
              }`}
              placeholder="Ej: Marcelo Ríos"
              value={formUsuario.nombre}
              onChange={(e) =>
                setFormUsuario({ ...formUsuario, nombre: e.target.value })
              }
            />
            {erroresUsuario.nombre && (
              <div className="invalid-feedback">{erroresUsuario.nombre}</div>
            )}
          </div>
          <div className="mb-3">
            <label
              htmlFor="usr-email"
              className="form-label small fw-bold text-secondary"
            >
              Correo Electrónico
            </label>
            <input
              id="usr-email"
              type="email"
              className={`form-control ${
                erroresUsuario.email ? 'is-invalid' : ''
              }`}
              placeholder="ejemplo@sonidovivo.cl"
              value={formUsuario.email}
              onChange={(e) =>
                setFormUsuario({ ...formUsuario, email: e.target.value })
              }
            />
            {erroresUsuario.email && (
              <div className="invalid-feedback">{erroresUsuario.email}</div>
            )}
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label
                htmlFor="usr-password"
                className="form-label small fw-bold text-secondary mb-0"
              >
                {usuarioEditando
                  ? 'Nueva Contraseña (en blanco para mantener actual)'
                  : 'Contraseña'}
              </label>
              <button
                type="button"
                className="btn btn-link p-0 text-muted small text-decoration-none"
                onClick={() =>
                  setMostrarPasswordUsuario(!mostrarPasswordUsuario)
                }
                style={{ fontSize: '0.8rem' }}
              >
                <i
                  className={`bi ${
                    mostrarPasswordUsuario ? 'bi-eye-slash' : 'bi-eye'
                  } me-1`}
                ></i>
                {mostrarPasswordUsuario ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              id="usr-password"
              type={mostrarPasswordUsuario ? 'text' : 'password'}
              className={`form-control ${
                erroresUsuario.password ? 'is-invalid' : ''
              }`}
              placeholder={usuarioEditando ? '••••••••' : 'Mínimo 4 caracteres'}
              value={formUsuario.password}
              onChange={(e) =>
                setFormUsuario({ ...formUsuario, password: e.target.value })
              }
            />
            {erroresUsuario.password && (
              <div className="invalid-feedback">{erroresUsuario.password}</div>
            )}
          </div>
          <div className="row g-2 mb-2">
            <div className="col-6">
              <label
                htmlFor="usr-rol"
                className="form-label small fw-bold text-secondary"
              >
                Rol Asignado
              </label>
              <select
                id="usr-rol"
                className="form-select"
                value={formUsuario.rol}
                onChange={(e) =>
                  setFormUsuario({ ...formUsuario, rol: e.target.value })
                }
              >
                <option value="cliente">Cliente</option>
                <option value="trabajador">Trabajador</option>
                <option value="jefe">Jefe / Administrador</option>
              </select>
            </div>
            <div className="col-6">
              <label
                htmlFor="usr-activo"
                className="form-label small fw-bold text-secondary"
              >
                Estado de la Cuenta
              </label>
              <select
                id="usr-activo"
                className="form-select"
                value={formUsuario.activo ? 'activo' : 'inactivo'}
                onChange={(e) =>
                  setFormUsuario({
                    ...formUsuario,
                    activo: e.target.value === 'activo'
                  })
                }
              >
                <option value="activo">Habilitado (Activo)</option>
                <option value="inactivo">Desactivado</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default ModalUsuario
