import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GestionUsuariosApi from './GestionUsuariosApi'

const usuariosApi = [
  { id: 1, nombre: 'Administrador', correo: 'admin@tiendamusica.cl', rol: 'ADMIN', rut: '11.111.111-1', activo: true },
  { id: 2, nombre: 'Vendedor Bodega', correo: 'empleado@tiendamusica.cl', rol: 'VENDEDOR', rut: '22.222.222-2', activo: true },
  { id: 3, nombre: 'Cliente Prueba', correo: 'cliente@tiendamusica.cl', rol: 'CLIENTE', rut: '33.333.333-3', activo: true }
]

function respuesta(status, body) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body))
  })
}

const admin = { correo: 'admin@tiendamusica.cl', rol: 'jefe', rolOriginal: 'ADMIN', token: 'jwt-test' }

describe('GestionUsuariosApi - usuario-service', () => {
  let fetchMock

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'jwt-test')
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra spinner y luego lista los usuarios con el token JWT', async () => {
    fetchMock.mockReturnValueOnce(respuesta(200, usuariosApi))
    render(<GestionUsuariosApi usuarioActual={admin} />)

    expect(screen.getByText(/Cargando usuarios registrados/i)).toBeInTheDocument()
    expect(await screen.findByText('Vendedor Bodega')).toBeInTheDocument()

    const [url, opciones] = fetchMock.mock.calls[0]
    expect(url).toMatch(/\/usuarios$/)
    expect(opciones.headers.Authorization).toBe('Bearer jwt-test')
  })

  it('muestra switch de estado solo para empleados', async () => {
    fetchMock.mockReturnValueOnce(respuesta(200, usuariosApi))
    render(<GestionUsuariosApi usuarioActual={admin} />)
    await screen.findByText('Vendedor Bodega')

    expect(screen.getAllByRole('switch')).toHaveLength(2)
    expect(screen.queryByRole('switch', { name: /Cliente Prueba/i })).not.toBeInTheDocument()
    // No puede desactivarse a sí mismo
    expect(screen.getByRole('switch', { name: /Administrador/i })).toBeDisabled()
  })

  it('desactiva la cuenta de un empleado con PATCH /estado', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(200, usuariosApi))
      .mockReturnValueOnce(respuesta(200, { ...usuariosApi[1], activo: false }))
    render(<GestionUsuariosApi usuarioActual={admin} />)
    await screen.findByText('Vendedor Bodega')

    await usuario.click(screen.getByRole('switch', { name: /Vendedor Bodega/i }))

    expect(await screen.findByText(/desactivada correctamente/i)).toBeInTheDocument()
    const [url, opciones] = fetchMock.mock.calls[1]
    expect(url).toMatch(/\/usuarios\/2\/estado$/)
    expect(opciones.method).toBe('PATCH')
    expect(JSON.parse(opciones.body)).toMatchObject({ activo: false })
    expect(screen.getByRole('switch', { name: /Vendedor Bodega/i })).not.toBeChecked()
  })

  it('cambia el rol de un usuario con PUT', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(200, usuariosApi))
      .mockReturnValueOnce(respuesta(200, { ...usuariosApi[2], rol: 'VENDEDOR' }))
    render(<GestionUsuariosApi usuarioActual={admin} />)
    await screen.findByText('Cliente Prueba')

    const fila = screen.getByText('Cliente Prueba').closest('tr')
    await usuario.click(within(fila).getByRole('button', { name: /Cambiar rol/i }))
    await usuario.click(screen.getByRole('radio', { name: /Vendedor/i }))
    await usuario.click(screen.getByRole('button', { name: /Confirmar cambio/i }))

    expect(await screen.findByText(/actualizado a Vendedor/i)).toBeInTheDocument()
    const [url, opciones] = fetchMock.mock.calls[1]
    expect(url).toMatch(/\/usuarios\/3$/)
    expect(opciones.method).toBe('PUT')
    expect(JSON.parse(opciones.body)).toMatchObject({
      nombre: 'Cliente Prueba',
      correo: 'cliente@tiendamusica.cl',
      rol: 'VENDEDOR'
    })
  })

  it('muestra el historial de auditoría del usuario', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(200, usuariosApi))
      .mockReturnValueOnce(
        respuesta(200, [
          {
            id: 10,
            usuarioId: 2,
            accion: 'CAMBIO_ROL',
            detalle: 'Cambio de rol de CLIENTE a VENDEDOR',
            realizadoPor: 'admin@tiendamusica.cl',
            fechaHora: '2026-11-20T10:30:00'
          }
        ])
      )
    render(<GestionUsuariosApi usuarioActual={admin} />)
    await screen.findByText('Vendedor Bodega')

    const fila = screen.getByText('Vendedor Bodega').closest('tr')
    await usuario.click(within(fila).getByRole('button', { name: /Historial/i }))

    expect(await screen.findByText('Cambio de rol de CLIENTE a VENDEDOR')).toBeInTheDocument()
    expect(fetchMock.mock.calls[1][0]).toMatch(/\/usuarios\/2\/historial$/)
  })

  it('muestra error HTTP 403 y permite reintentar', async () => {
    const usuario = userEvent.setup()
    fetchMock
      .mockReturnValueOnce(respuesta(403, { error: 'Acceso denegado: permisos insuficientes' }))
      .mockReturnValueOnce(respuesta(200, usuariosApi))
    render(<GestionUsuariosApi usuarioActual={admin} />)

    expect(await screen.findByText(/No tienes permisos/i)).toBeInTheDocument()
    expect(screen.getByText('Error 403')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /Reintentar/i }))
    expect(await screen.findByText('Vendedor Bodega')).toBeInTheDocument()
  })

  it('informa cuando el servicio no está disponible', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    render(<GestionUsuariosApi usuarioActual={admin} />)
    expect(await screen.findByText(/No se pudo conectar con el servicio de usuarios/i)).toBeInTheDocument()
  })
})
