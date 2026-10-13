export const pedidosIniciales = [
  {
    id: 101,
    cliente: "Juan Pérez",
    fecha: "2026-10-01",
    total: 599990,
    estado: "Despachado",
    productos: [
      { codigo: "BT005", nombre: "Batería Acústica 5 Piezas", cantidad: 1, precio: 599990 }
    ]
  },
  {
    id: 102,
    cliente: "María López",
    fecha: "2026-10-02",
    total: 299980,
    estado: "En preparación",
    productos: [
      { codigo: "MI001", nombre: "Micrófono Cardioide SM58", cantidad: 2, precio: 149990 }
    ]
  },
  {
    id: 103,
    cliente: "Mariana Silva",
    fecha: "2026-10-05",
    total: 950000,
    estado: "Despachado",
    productos: [
      { codigo: "BT01", nombre: "Batería Yamaha Stage Custom", cantidad: 1, precio: 950000 }
    ]
  },
  {
    id: 104,
    cliente: "Felipe Soto",
    fecha: "2026-10-08",
    total: 279980,
    estado: "Pendiente",
    productos: [
      { codigo: "ES001", nombre: "Focusrite Scarlett Solo", cantidad: 1, precio: 189990 },
      { codigo: "AC003", nombre: "Atril de Partitura Plegable", cantidad: 2, precio: 44995 }
    ]
  },
  {
    id: 105,
    cliente: "Andrea Rojas",
    fecha: "2026-10-09",
    total: 99990,
    estado: "Despachado",
    productos: [
      { codigo: "AM001", nombre: "Amplificador Guitarra 15W", cantidad: 1, precio: 99990 }
    ]
  },
  {
    id: 106,
    cliente: "Diego Fernández",
    fecha: "2026-10-10",
    total: 299990,
    estado: "Pendiente",
    productos: [
      { codigo: "BA001", nombre: "Bajo Eléctrico 4 Cuerdas", cantidad: 1, precio: 299990 }
    ]
  },
  {
    id: 107,
    cliente: "Camila Valenzuela",
    fecha: "2026-10-10",
    total: 189990,
    estado: "En preparación",
    productos: [
      { codigo: "GA002", nombre: "Guitarra Acústica Dreadnought Fender", cantidad: 1, precio: 189990 }
    ]
  }
];

export default pedidosIniciales;
