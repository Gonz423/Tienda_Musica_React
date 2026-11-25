import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RutaProtegida from './RutaProtegida'

describe('RutaProtegida - restricciones de acceso por rol', () => {
  const Panel = () => <p>Panel de administración</p>

  it('sin sesión pide iniciar sesión y no muestra el contenido', async () => {
    const onAbrirLogin = vi.fn()
    render(
      <RutaProtegida sesion={null} rolesPermitidos={['jefe']} onAbrirLogin={onAbrirLogin}>
        <Panel />
      </RutaProtegida>
    )

    expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    expect(onAbrirLogin).toHaveBeenCalled()
  })

  it('un vendedor no puede entrar a una vista solo para ADMIN', () => {
    render(
      <RutaProtegida sesion={{ rol: 'trabajador' }} rolesPermitidos={['jefe']}>
        <Panel />
      </RutaProtegida>
    )

    expect(screen.getByText(/acceso denegado/i)).toBeInTheDocument()
    expect(screen.queryByText('Panel de administración')).not.toBeInTheDocument()
  })

  it('un cliente no puede entrar a la bandeja de pedidos del personal', () => {
    render(
      <RutaProtegida sesion={{ rol: 'cliente' }} rolesPermitidos={['trabajador', 'jefe']}>
        <Panel />
      </RutaProtegida>
    )

    expect(screen.getByTestId('ruta-acceso-denegado')).toBeInTheDocument()
  })

  it('muestra el contenido cuando el rol está permitido', () => {
    render(
      <RutaProtegida sesion={{ rol: 'jefe' }} rolesPermitidos={['jefe']}>
        <Panel />
      </RutaProtegida>
    )

    expect(screen.getByText('Panel de administración')).toBeInTheDocument()
  })
})
