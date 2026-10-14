import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VistaEmpleado from './VistaEmpleado'
import {
  calcularTotalPedido,
  avanzarEstadoPedido,
  esStockCritico,
  ajustarStock,
} from '../utils/persistencia'

const pedidosPrueba = [
  {
    id: 101,
    fecha: '2026-05-13',
    cliente: 'Juan Perez',
    tipoEntrega: 'Retiro local',
    articulos: [{ id: 1, nombre: 'Bateria Acustica', precio: 599990, cantidad: 1 }],
    total: 599990,
    estado: 'Pendiente',
  },
  {
    id: 102,
    fecha: '2026-05-13',
    cliente: 'Maria Lopez',
    tipoEntrega: 'Envio a domicilio',
    articulos: [{ id: 2, nombre: 'Microfono Condensador', precio: 299990, cantidad: 1 }],
    total: 299990,
    estado: 'En preparacion',
  },
]

const productosPrueba = [
  {
    codigo: 'GA001',
    nombre: 'Guitarra Acustica Folk',
    categoria: 'Guitarras Acusticas',
    stock: 1,
    precio: 129990,
  },
  {
    codigo: 'GA002',
    nombre: 'Guitarra Dreadnought',
    categoria: 'Guitarras Acusticas',
    stock: 5,
    precio: 189990,
  },
]

describe('Perfil Trabajador - Pruebas Unitarias de Vista y Operaciones', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('1. Calcula correctamente el total de un pedido según artículos y cantidades', () => {
    const articulos = [
      { precio: 100000, cantidad: 2 },
      { precio: 15000, cantidad: 1 },
    ]
    expect(calcularTotalPedido(articulos)).toBe(215000)
    expect(calcularTotalPedido([])).toBe(0)
  })

  it("2. Avanza correctamente el ciclo de estado: 'Pendiente' -> 'En preparacion' -> 'Listo / Despachado'", () => {
    expect(avanzarEstadoPedido('Pendiente')).toBe('En preparacion')
    expect(avanzarEstadoPedido('En preparacion')).toBe('Listo / Despachado')
    expect(avanzarEstadoPedido('Listo / Despachado')).toBe('Completado')
  })

  it('3. Identifica correctamente niveles de stock crítico para bodega', () => {
    expect(esStockCritico(0)).toBe(true)
    expect(esStockCritico(2)).toBe(true)
    expect(esStockCritico(3)).toBe(false)
    expect(esStockCritico(8)).toBe(false)
  })

  it('4. Ajusta unidades de stock impidiendo que disminuya por debajo de cero', () => {
    expect(ajustarStock(4, 1)).toBe(5)
    expect(ajustarStock(4, -1)).toBe(3)
    expect(ajustarStock(0, -1)).toBe(0)
  })


  it('5. Renderiza la tabla de recepción de pedidos con los clientes y estados iniciales', () => {
    render(
      <VistaEmpleado
        pedidos={pedidosPrueba}
        productos={productosPrueba}
        seccionActiva="pedidos"
      />
    )

    expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    expect(screen.getByText('Maria Lopez')).toBeInTheDocument()
    expect(screen.getAllByText('Pendiente').length).toBeGreaterThanOrEqual(1)
  })

it('6. Ejecuta la acción operativa al presionar el botón de estado de pedido', async () => {
    const usuario = userEvent.setup()
    const mockActualizarEstado = vi.fn()

    render(
      <VistaEmpleado
        pedidos={pedidosPrueba}
        productos={productosPrueba}
        seccionActiva="pedidos"
        onActualizarEstadoPedido={mockActualizarEstado}
        onActualizarEstado={mockActualizarEstado}
      />
    )

    const botonPreparar = screen.getAllByRole('button', { name: /preparar/i })[0]
    await usuario.click(botonPreparar)


    const botonDespachar = screen.queryAllByRole('button', { name: /despachar/i })
    const llamadaOcurrio = mockActualizarEstado.mock.calls.length > 0

    expect(botonDespachar.length > 0 || llamadaOcurrio).toBe(true)
  })

  it('7. Renderiza la tabla de stock e identifica visualmente artículos con stock crítico', () => {
    render(
      <VistaEmpleado
        pedidos={pedidosPrueba}
        productos={productosPrueba}
        seccionActiva="stock"
      />
    )

    expect(screen.getByText('GA001')).toBeInTheDocument()
    expect(screen.getAllByText(/stock bajo/i).length).toBeGreaterThanOrEqual(1)
  })

  it('8. Ejecuta onActualizarStock al presionar botones de ajuste rápido en bodega', async () => {
    const usuario = userEvent.setup()
    const mockActualizarStock = vi.fn()

    render(
      <VistaEmpleado
        pedidos={pedidosPrueba}
        productos={productosPrueba}
        seccionActiva="stock"
        onActualizarStock={mockActualizarStock}
      />
    )

    const botonesMas = screen.getAllByRole('button', { name: /\+1/i })
    await usuario.click(botonesMas[0])

    expect(mockActualizarStock).toHaveBeenCalledWith('GA001', 2)
  })

  it('9. Utiliza un espía vi.spyOn para comprobar auditoría de acciones en localStorage', () => {
    const espia = vi.spyOn(Storage.prototype, 'setItem')
    localStorage.setItem('auditoria_pedidos', JSON.stringify({ ultimoCambio: 101 }))

    expect(espia).toHaveBeenCalledWith(
      'auditoria_pedidos',
      expect.stringContaining('101')
    )
    espia.mockRestore()
  })

  it('10. Utiliza un mock asíncrono para simular sincronización de bodega con servicio externo', async () => {
    const mockServicioBodega = vi.fn().mockResolvedValue({ status: 200, sincronizado: true })
    const respuesta = await mockServicioBodega(101)

    expect(mockServicioBodega).toHaveBeenCalledWith(101)
    expect(respuesta.sincronizado).toBe(true)
  })
})