import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cargarSesionUsuario,
  guardarSesionUsuario,
  decodificarToken,
  tokenVigente,
  normalizarRol
} from './authService'
import { fetchConAuth, EVENTO_SESION_EXPIRADA } from './apiCliente'

// Genera un JWT de prueba (firma falsa: el frontend nunca la verifica, lo hace el backend)
function crearToken(payload) {
  const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.firma`
}

const enUnaHora = () => Math.floor(Date.now() / 1000) + 3600
const haceUnaHora = () => Math.floor(Date.now() / 1000) - 3600

describe('Gestión de sesión con JWT', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('normaliza los roles del backend a las vistas del frontend', () => {
    expect(normalizarRol('ADMIN')).toBe('jefe')
    expect(normalizarRol('VENDEDOR')).toBe('trabajador')
    expect(normalizarRol('CLIENTE')).toBe('cliente')
    expect(normalizarRol(undefined)).toBe('cliente')
  })

  it('decodifica el payload y detecta expiración', () => {
    const token = crearToken({ sub: 'a@b.cl', rol: 'ADMIN', exp: enUnaHora() })
    expect(decodificarToken(token).sub).toBe('a@b.cl')
    expect(tokenVigente(token)).toBe(true)
    expect(tokenVigente(crearToken({ sub: 'a@b.cl', exp: haceUnaHora() }))).toBe(false)
    expect(tokenVigente('basura')).toBe(false)
  })

  it('la sesión persiste tras recargar (F5) mientras el token esté vigente', () => {
    const token = crearToken({ sub: 'admin@tiendamusica.cl', rol: 'ADMIN', exp: enUnaHora() })
    guardarSesionUsuario({ token, nombre: 'Administrador' })

    const sesion = cargarSesionUsuario()
    expect(sesion.rol).toBe('jefe')
    expect(sesion.nombre).toBe('Administrador')
    expect(sesion.email).toBe('admin@tiendamusica.cl')
  })

  it('descarta la sesión si el token expiró', () => {
    const token = crearToken({ sub: 'a@b.cl', rol: 'ADMIN', exp: haceUnaHora() })
    guardarSesionUsuario({ token, nombre: 'X' })

    expect(cargarSesionUsuario()).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('el rol sale del token: editar usuario_actual en localStorage no da permisos', () => {
    const token = crearToken({ sub: 'cliente@tiendamusica.cl', rol: 'CLIENTE', exp: enUnaHora() })
    guardarSesionUsuario({ token, nombre: 'Cliente' })
    localStorage.setItem('usuario_actual', JSON.stringify({ nombre: 'Hacker', rol: 'jefe' }))

    expect(cargarSesionUsuario().rol).toBe('cliente')
  })

  it('ante un 401 renueva el token una vez y repite la petición', async () => {
    const viejo = crearToken({ sub: 'a@b.cl', rol: 'VENDEDOR', exp: enUnaHora() })
    const nuevo = crearToken({ sub: 'a@b.cl', rol: 'VENDEDOR', exp: enUnaHora() + 60 })
    guardarSesionUsuario({ token: viejo, nombre: 'A' })

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: nuevo, nombre: 'A' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('[]', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const respuesta = await fetchConAuth('http://api/pedidos')

    expect(respuesta.status).toBe(200)
    expect(fetchMock.mock.calls[1][0]).toContain('/auth/refresh')
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe(`Bearer ${nuevo}`)
    expect(localStorage.getItem('token')).toBe(nuevo)
  })

  it('si la renovación falla cierra la sesión y emite "sesion-expirada"', async () => {
    guardarSesionUsuario({ token: crearToken({ sub: 'a@b.cl', rol: 'ADMIN', exp: enUnaHora() }), nombre: 'A' })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })))
    const escucha = vi.fn()
    window.addEventListener(EVENTO_SESION_EXPIRADA, escucha)

    const respuesta = await fetchConAuth('http://api/usuarios')

    expect(respuesta.status).toBe(401)
    expect(localStorage.getItem('token')).toBeNull()
    expect(escucha).toHaveBeenCalledTimes(1)
    window.removeEventListener(EVENTO_SESION_EXPIRADA, escucha)
  })
})
