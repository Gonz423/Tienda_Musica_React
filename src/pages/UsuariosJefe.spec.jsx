import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UsuariosJefe from './UsuariosJefe'

describe('UsuariosJefe - Pruebas Unitarias', () => {
  const usuariosPrueba = [
    {
      id: 'USR-001',
      nombre: 'Administrador General',
      email: 'admin@sonidovivo.cl',
      password: 'password123',
      rol: 'jefe',
      activo: true,
      fechaCreacion: '2026-01-01',
      historial: [
        { id: 1, fecha: '2026-01-01 10:00', accion: 'Creación de cuenta', detalle: 'Cuenta registrada' }
      ]
    },
    {
      id: 'USR-002',
      nombre: 'Carlos Trabajador',
      email: 'carlos@sonidovivo.cl',
      password: 'password123',
      rol: 'trabajador',
      activo: false,
      fechaCreacion: '2026-02-01',
      historial: []
    }
  ]

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('1. Renderiza la sección de Gestión de Usuarios, directorio y KPIs de usuarios', () => {
    render(<UsuariosJefe usuarios={usuariosPrueba} />)

    expect(screen.getByText(/Directorio de Usuarios/i)).toBeInTheDocument()
    expect(screen.getByText('Total Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Usuarios Activos')).toBeInTheDocument()
    expect(screen.getByText('Usuarios Desactivados')).toBeInTheDocument()
    expect(screen.getByText('Administrador General')).toBeInTheDocument()
    expect(screen.getByText('Carlos Trabajador')).toBeInTheDocument()
  })

  it('2. Permite alternar el estado (activar / desactivar) de un usuario', async () => {
    const usuario = userEvent.setup()
    const onAlternarMock = vi.fn()

    render(
      <UsuariosJefe
        usuarios={usuariosPrueba}
        usuarioActual={{ email: 'otro@sonidovivo.cl' }}
        onAlternarEstadoUsuario={onAlternarMock}
      />
    )

    const botonesAlternar = screen.getAllByTitle(/Desactivar usuario|Activar usuario/i)
    await usuario.click(botonesAlternar[0])

    expect(onAlternarMock).toHaveBeenCalledWith('USR-001')
  })

  it('3. Abre el modal de historial y muestra los eventos registrados', async () => {
    const usuario = userEvent.setup()
    render(<UsuariosJefe usuarios={usuariosPrueba} />)

    const botonesHistorial = screen.getAllByTitle(/Ver historial de actividad/i)
    await usuario.click(botonesHistorial[0])

    expect(screen.getByText(/Historial de Auditoría/i)).toBeInTheDocument()
    expect(screen.getByText('Creación de cuenta')).toBeInTheDocument()
  })

  it('4. Abre el modal de nuevo usuario y permite su creación', async () => {
    const usuario = userEvent.setup()
    const onCrearMock = vi.fn()

    render(<UsuariosJefe usuarios={usuariosPrueba} onCrearUsuario={onCrearMock} />)

    await usuario.click(screen.getByRole('button', { name: /Nuevo Usuario/i }))

    expect(screen.getByText('Crear Nuevo Usuario')).toBeInTheDocument()

    await usuario.type(screen.getByLabelText(/Nombre Completo/i), 'Nuevo Cliente')
    await usuario.type(screen.getByLabelText(/Correo Electrónico/i), 'nuevo@cliente.cl')
    await usuario.type(screen.getByLabelText(/^Contraseña/i), 'secreto123')

    await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))

    expect(onCrearMock).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Nuevo Cliente',
        email: 'nuevo@cliente.cl',
        rol: 'cliente',
        activo: true
      })
    )
  })

  it('5. Filtra la lista de usuarios por término de búsqueda, rol y estado', async () => {
    const usuario = userEvent.setup()
    render(<UsuariosJefe usuarios={usuariosPrueba} />)

    const inputBuscar = screen.getByPlaceholderText(/Buscar por nombre o correo/i)
    await usuario.type(inputBuscar, 'carlos')

    expect(screen.getByText('Carlos Trabajador')).toBeInTheDocument()
    expect(screen.queryByText('Administrador General')).not.toBeInTheDocument()

    await usuario.clear(inputBuscar)

    const selectRol = screen.getByLabelText(/Filtrar por rol/i)
    await usuario.selectOptions(selectRol, 'jefe')
    expect(screen.getByText('Administrador General')).toBeInTheDocument()
    expect(screen.queryByText('Carlos Trabajador')).not.toBeInTheDocument()
  })

  it('6. Permite editar un usuario existente, alternar visibilidad de contraseña y actualizarlo', async () => {
    const usuario = userEvent.setup()
    const onActualizarMock = vi.fn()

    render(<UsuariosJefe usuarios={usuariosPrueba} onActualizarUsuario={onActualizarMock} />)

    const botonesEditar = screen.getAllByTitle(/Editar datos del usuario/i)
    await usuario.click(botonesEditar[0])

    expect(screen.getByText(/Editar Usuario:/i)).toBeInTheDocument()

    const botonTogglePass = screen.getByRole('button', { name: /Mostrar|Ocultar/i })
    await usuario.click(botonTogglePass)

    const inputNombre = screen.getByLabelText(/Nombre Completo/i)
    await usuario.clear(inputNombre)
    await usuario.type(inputNombre, 'Admin Modificado')

    await usuario.click(screen.getByRole('button', { name: /Actualizar Usuario/i }))

    expect(onActualizarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'USR-001',
        nombre: 'Admin Modificado'
      })
    )
  })

  it('7. Muestra validaciones en el formulario de usuario ante campos vacíos, correo inválido o duplicado', async () => {
    const usuario = userEvent.setup()
    render(<UsuariosJefe usuarios={usuariosPrueba} />)

    await usuario.click(screen.getByRole('button', { name: /Nuevo Usuario/i }))

    await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))
    expect(screen.getByText('El nombre completo es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El correo electrónico es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()

    await usuario.type(screen.getByLabelText(/Correo Electrónico/i), 'invalido')
    await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))
    expect(screen.getByText('Ingresa un formato de correo válido')).toBeInTheDocument()

    await usuario.clear(screen.getByLabelText(/Correo Electrónico/i))
    await usuario.type(screen.getByLabelText(/Correo Electrónico/i), 'admin@sonidovivo.cl')
    await usuario.click(screen.getByRole('button', { name: /Crear Usuario/i }))
    expect(screen.getByText('Ya existe una cuenta con este correo')).toBeInTheDocument()
  })

  it('8. Agrega notas administrativas en el modal de historial y valida nota vacía', async () => {
    const usuario = userEvent.setup()
    const onAgregarNotaMock = vi.fn()

    render(<UsuariosJefe usuarios={usuariosPrueba} onAgregarHistorialUsuario={onAgregarNotaMock} />)

    const botonesHistorial = screen.getAllByTitle(/Ver historial de actividad/i)
    await usuario.click(botonesHistorial[0])

    const botonAgregarNota = screen.getByRole('button', { name: /Añadir Nota/i })
    expect(botonAgregarNota).toBeDisabled()

    const inputNota = screen.getByPlaceholderText(/Se validó identidad telefónicamente/i)
    await usuario.type(inputNota, 'Nota de auditoría aprobada')
    expect(botonAgregarNota).not.toBeDisabled()
    await usuario.click(botonAgregarNota)

    expect(onAgregarNotaMock).toHaveBeenCalledWith(
      'USR-001',
      expect.objectContaining({
        accion: 'Nota Administrativa',
        detalle: 'Nota de auditoría aprobada'
      })
    )
  })

  it('9. Impide que el administrador actual desactive su propia cuenta activa', async () => {
    const usuario = userEvent.setup()
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <UsuariosJefe
        usuarios={usuariosPrueba}
        usuarioActual={{ email: 'admin@sonidovivo.cl' }}
      />
    )

    const botonesAlternar = screen.getAllByTitle(/Desactivar usuario|Activar usuario/i)
    await usuario.click(botonesAlternar[0])

    expect(alertMock).toHaveBeenCalledWith(
      expect.stringContaining('no puedes desactivar tu propia cuenta activa')
    )

    alertMock.mockRestore()
  })

  it('10. Renderiza correctamente con propiedades por defecto', () => {
    render(<UsuariosJefe />)
    expect(screen.getByText(/Directorio de Usuarios/i)).toBeInTheDocument()
  })
})
