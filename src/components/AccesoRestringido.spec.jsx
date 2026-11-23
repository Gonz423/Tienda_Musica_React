import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AccesoRestringido from './AccesoRestringido'

describe('AccesoRestringido', () => {
  it('muestra el contenido al rol permitido (ADMIN)', () => {
    render(
      <AccesoRestringido usuario={{ rol: 'jefe', rolOriginal: 'ADMIN' }} rolesPermitidos={['ADMIN']}>
        <p>Panel usuarios</p>
      </AccesoRestringido>
    )
    expect(screen.getByText('Panel usuarios')).toBeInTheDocument()
  })

  it('bloquea a un VENDEDOR en la gestión de usuarios', () => {
    render(
      <AccesoRestringido usuario={{ rol: 'trabajador', rolOriginal: 'VENDEDOR' }} rolesPermitidos={['ADMIN']}>
        <p>Panel usuarios</p>
      </AccesoRestringido>
    )
    expect(screen.queryByText('Panel usuarios')).not.toBeInTheDocument()
    expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
  })

  it('permite la bodega al VENDEDOR y la bloquea sin sesión', () => {
    const { rerender } = render(
      <AccesoRestringido usuario={{ rol: 'trabajador' }} rolesPermitidos={['VENDEDOR']}>
        <p>Bodega</p>
      </AccesoRestringido>
    )
    expect(screen.getByText('Bodega')).toBeInTheDocument()

    rerender(
      <AccesoRestringido usuario={null} rolesPermitidos={['VENDEDOR']}>
        <p>Bodega</p>
      </AccesoRestringido>
    )
    expect(screen.queryByText('Bodega')).not.toBeInTheDocument()
    expect(screen.getByText(/Inicia sesión con una cuenta autorizada/i)).toBeInTheDocument()
  })
})
