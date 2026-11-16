import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetricasJefe from './MetricasJefe'
import { cargarMetricasAsincronas } from '../services/jefeServicio'

describe('MetricasJefe - Pruebas Unitarias', () => {
  const productosPrueba = [
    {
      codigo: 'GA001',
      categoria: 'Guitarras Acústicas',
      nombre: 'Guitarra Folk',
      marca: 'Yamaha',
      modelo: 'F310',
      stock: 2,
      precio: 120000,
      descripcion: 'Guitarra acustica para estudio'
    },
    {
      codigo: 'GA002',
      categoria: 'Guitarras Acústicas',
      nombre: 'Guitarra Clásica',
      marca: 'Fender',
      modelo: 'CD60',
      stock: 8,
      precio: 150000,
      descripcion: 'Guitarra con sonido nitido'
    }
  ]

  const pedidosPrueba = [
    { id: 101, cliente: 'Juan Perez', total: 120000, estado: 'Despachado', fecha: '2026-10-09' },
    { id: 102, cliente: 'Ana Gomez', total: 80000, estado: 'Pendiente', fecha: '2026-10-10' }
  ]

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('1. Renderiza correctamente las tarjetas de resumen KPI (ventas, pedidos y stock critico)', () => {
    render(<MetricasJefe productos={productosPrueba} pedidos={pedidosPrueba} />)

    expect(screen.getByText(/Total Ventas Acumuladas/i)).toBeInTheDocument()
    expect(screen.getByText(/Flujo de Pedidos/i)).toBeInTheDocument()
    expect(screen.getByText(/Productos Stock Crítico/i)).toBeInTheDocument()
  })

  it('2. Calcula correctamente el total acumulado de ventas sumando los pedidos', () => {
    render(<MetricasJefe productos={productosPrueba} pedidos={pedidosPrueba} />)

    expect(screen.getByText('$200.000')).toBeInTheDocument()
    expect(screen.getByText(/2 pedidos totales/i)).toBeInTheDocument()
  })

  it('3. Calcula correctamente la cantidad de productos con stock critico (<= 3 unidades)', () => {
    render(<MetricasJefe productos={productosPrueba} pedidos={pedidosPrueba} />)

    const badgeCritico = screen.getByText('Stock ≤ 3 unidades')
    expect(badgeCritico).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '1' })).toBeInTheDocument()
  })

  it('4. Utiliza un mock asincrono vi.fn().mockResolvedValue para simular la carga de metricas', async () => {
    const mockServicio = {
      obtenerMetricas: vi.fn().mockResolvedValue({ totalVentas: 500000, pedidosAtendidos: 12 })
    }

    const resultado = await cargarMetricasAsincronas(mockServicio)
    expect(mockServicio.obtenerMetricas).toHaveBeenCalled()
    expect(resultado.totalVentas).toBe(500000)
    expect(resultado.pedidosAtendidos).toBe(12)
  })

  it('5. Renderiza correctamente con propiedades por defecto', () => {
    render(<MetricasJefe />)
    expect(screen.getByText(/Total Ventas Acumuladas/i)).toBeInTheDocument()
  })
})
