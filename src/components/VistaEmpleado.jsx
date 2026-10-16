import { useState } from "react";
import { Link } from "react-router-dom";
import { productosIniciales } from "../data/productos";

export const pedidosIniciales = [
  {
    id: 101,
    cliente: "Juan Perez",
    fecha: "2023-06-01",
    total: 599990,
    estado: "Pendiente",
    tipoEntrega: "Retiro local",
    productos: [
      { codigo: "BT001", nombre: "Batería Acústica 5 Piezas"}
    ]
  },
  {
    id: 102,
    cliente: "Maria Lopez",
    fecha: "2023-06-02",
    total: 299980,
    estado: "En preparación",
    tipoEntrega: "Envío a domicilio",
    productos: [
      { codigo: "MI003", nombre: "Micrófono Condensador"}
    ]
  },
  {
    id: 103,
    cliente: "Mariana Silva",
    fecha: "2026-05-13",
    total: 549990,
    estado: "En preparación",
    tipoEntrega: "Envío a domicilio",
    productos: [
      { codigo: "GE005", nombre: "Guitarra Eléctrica Semi-hollow"}
    ]
  },
  {
    id: 104,
    cliente: "Felipe Soto",
    fecha: "2026-05-13",
    total: 100980,
    estado: "Pendiente",
    tipoEntrega: "Retiro local",
    productos: [
      { codigo: "GA003", nombre: "Guitarra Acústica Clásica 4/4"},
      { codigo: "AC002", nombre: "Cuerdas Guitarra Acústica 12-53"},
      { codigo: "AC002", nombre: "Cuerdas Guitarra Acústica 12-53"}
    ]
  },
  {
    id: 105,
    cliente: "Andrea Rojas",
    fecha: "2026-05-14",
    total: 149990,
    estado: "Despachado",
    tipoEntrega: "Envío a domicilio",
    productos: [
      { codigo: "ES001", nombre: "Interfaz de Audio 2x2 USB"}
    ]
  },
  {
    id: 106,
    cliente: "Diego Fernández",
    fecha: "2026-05-14",
    total: 99990,
    estado: "Despachado",
    tipoEntrega: "Envío a domicilio",
    productos: [
      { codigo: "PE006", nombre: "Pedal Overdrive"}
    ]
  }
];

function VistaEmpleado({
  productos: productosProp = productosIniciales,
  seccionActiva = "pedidos",
  pedidos: pedidosProp,
  pedidosExternos,
  onActualizarEstado,
  onActualizarEstadoPedido,
  onActualizarStock: onActualizarStockProp
}) {
  const [pedidosLocales, setPedidosLocales] = useState(pedidosIniciales);
  const [productosLocales, setProductosLocales] = useState(productosProp);

  const pedidos = pedidosProp || pedidosExternos || pedidosLocales;
  const productos = productosProp || productosLocales;

  const callbackEstado = onActualizarEstadoPedido || onActualizarEstado;

  const obtenerStockReal = (codigo) => {
    const item = productos.find(
      (p) => String(p.codigo).toLowerCase() === String(codigo).toLowerCase()
    );
    return item ? item.stock : 0;
  };

  const agruparProductos = (listaProductos = []) => {
    const contador = {};

    listaProductos.forEach((prod, index) => {
      const clave = prod.codigo || prod.id || `${prod.nombre}-${index}`;

      if (!contador[clave]) {
        contador[clave] = {
          ...prod,
          id: prod.id || prod.codigo || clave,
          cantidad: Number(prod.cantidad || prod.cant || 1),
          stock: obtenerStockReal(prod.codigo),
        };
      } else {
        contador[clave].cantidad += Number(prod.cantidad || prod.cant || 1);
      }
    });

    return Object.values(contador);
  };

  const avanzarEstado = (id) => {
    const pedidoActual = pedidos.find((p) => p.id === id);
    if (!pedidoActual) return;

    let nuevoEstado = pedidoActual.estado;
    if (pedidoActual.estado === "Pendiente") {
      nuevoEstado = "En preparación";
    } else if (
      pedidoActual.estado === "En preparación" ||
      pedidoActual.estado === "En preparacion"
    ) {
      nuevoEstado = "Despachado";
    }

    if (callbackEstado) {
      callbackEstado(id, nuevoEstado);
    } else {
      setPedidosLocales((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    }
  };

  const handleAjustarStock = (codigo, nuevoStock) => {
    if (onActualizarStockProp) {
      onActualizarStockProp(codigo, nuevoStock);
    } else {
      setProductosLocales((prev) =>
        prev.map((p) => (p.codigo === codigo ? { ...p, stock: nuevoStock } : p))
      );
    }
  };

  const obtenerColorBadge = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-warning text-dark";
      case "En preparación":
        return "btn-sv-primary";
      case "Despachado":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const totalPendientes = pedidos.filter((p) => p.estado === "Pendiente").length;
  const totalPreparacion = pedidos.filter((p) => p.estado === "En preparación").length;
  const totalDespachados = pedidos.filter((p) => p.estado === "Despachado").length;
  const stockBajoCount = productos.filter((p) => p.stock < 3).length;

  return (
    <section className="container py-4 py-md-5">
      {/* Encabezado con identidad Sonido Vivo */}
      <div className="mb-4">
        <span className="badge btn-sv-secondary text-uppercase px-3 py-2 rounded-pill mb-2 shadow-sm">
          <i className="bi bi-briefcase me-1"></i> Rol: Trabajador de Tienda
        </span>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--color-secundario)' }}>
              {seccionActiva === "pedidos" ? "Recepción y Despacho de Pedidos" : "Control de Stock e Inventario"}
            </h1>
            <p className="text-muted small mb-0">
              Gestión operativa en tiempo real para optimizar la entrega de instrumentos y accesorios.
            </p>
          </div>
          {seccionActiva === "pedidos" && (
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm">
              <i className="bi bi-box-seam me-1 text-warning"></i>
              Pedidos activos: <strong>{totalPendientes + totalPreparacion}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas KPI Operativas */}
      {seccionActiva === "pedidos" && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Por Preparar</span>
                <h3 className="fw-bold my-1 text-warning">{totalPendientes}</h3>
                <span className="text-muted small">Estado pendiente</span>
              </div>
              <div style={{ color: '#d97706' }}>
                <i className="bi bi-hourglass-split fs-2"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-bold">En Preparación</span>
                <h3 className="fw-bold my-1" style={{ color: 'var(--color-acento)' }}>{totalPreparacion}</h3>
                <span className="text-muted small">Listos para empaque</span>
              </div>
              <div style={{ color: 'var(--color-acento)' }}>
                <i className="bi bi-box-seam fs-2"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 bg-white rounded-3 shadow-sm border h-100 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Despachados</span>
                <h3 className="fw-bold my-1 text-success">{totalDespachados}</h3>
                <span className="text-muted small">Entregados con éxito</span>
              </div>
              <div style={{ color: '#16a34a' }}>
                <i className="bi bi-check2-circle fs-2"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECCION 1: TABLA DE PEDIDOS */}
      {seccionActiva === "pedidos" && (
        <div
          className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4"
          style={{ border: '1px solid rgba(75, 46, 43, 0.15)' }}
        >
          <div
            className="p-3 header-sonido-vivo text-white d-flex justify-content-between align-items-center"
          >
            <h5 className="mb-0 fw-bold fs-6">
              <i className="bi bi-list-check me-2"></i>Cola de Despacho y Retiro en Tienda
            </h5>
            <span className="badge bg-light text-dark rounded-pill fw-bold">
              {pedidos.length} órdenes
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th scope="col" className="ps-3"># ID</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Tipo de entrega</th>
                  <th scope="col">Artículos</th>
                  <th scope="col">Total venta</th>
                  <th scope="col">Estado de venta</th>
                  <th scope="col" className="text-center pe-3">Acción Operativa</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="fw-bold ps-3 text-dark">#{pedido.id}</td>
                    <td className="small text-muted">{pedido.fecha}</td>
                    <td className="fw-semibold">{pedido.cliente}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          pedido.tipoEntrega?.toLowerCase().includes("domicilio")
                            ? "bg-light text-dark border border-secondary"
                            : "btn-sv-secondary"
                        }`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className={`bi ${pedido.tipoEntrega?.toLowerCase().includes("domicilio") ? 'bi-truck' : 'bi-shop'} me-1`}></i>
                        {pedido.tipoEntrega}
                      </span>
                    </td>
                    <td>
                      <ul className="list-unstyled mb-0 small">
                        {agruparProductos(pedido.productos).map((prod, idx) => (
                          <li key={`${prod.codigo || prod.id || idx}-${idx}`} className="py-1">
                            <span>
                              <strong>{prod.cantidad ?? prod.cant ?? 1}x</strong>{" "}
                              <Link
                                to={`/producto/${prod.codigo}`}
                                className="text-decoration-none text-dark fw-medium"
                              >
                                {prod.nombre}
                              </Link>
                            </span>{" "}
                            {prod.stock < 3 && (
                              <span className="badge bg-danger ms-1" style={{ fontSize: '0.68rem' }}>
                                Stock bajo: {prod.stock} disp.
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="fw-bold" style={{ color: 'var(--color-primario)' }}>
                      ${pedido.total.toLocaleString("es-CL")}
                    </td>

                    <td>
                      <span className={`badge ${obtenerColorBadge(pedido.estado)} px-2 py-1`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="text-center pe-3">
                      {pedido.estado === "Pendiente" && (
                        <button
                          type="button"
                          className="btn btn-warning btn-sm fw-semibold shadow-sm text-dark"
                          onClick={() => avanzarEstado(pedido.id)}
                        >
                          Preparar
                        </button>
                      )}

                      {(pedido.estado === "En preparación" || pedido.estado === "En preparacion") && (
                        <button
                          type="button"
                          className="btn btn-sv-primary btn-sm fw-semibold shadow-sm"
                          onClick={() => avanzarEstado(pedido.id)}
                        >
                          Despachar
                        </button>
                      )}

                      {pedido.estado === "Despachado" && (
                        <span className="badge bg-success px-2 py-1">
                          Completado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECCION 2: TABLA DE STOCK */}
      {seccionActiva === "stock" && (
        <div
          className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white"
          style={{ border: '1px solid rgba(75, 46, 43, 0.15)' }}
        >
          <div
            className="p-3 header-sonido-vivo text-white d-flex justify-content-between align-items-center flex-wrap gap-2"
          >
            <h5 className="mb-0 fw-bold fs-6">
              <i className="bi bi-boxes me-2"></i>Inventario y Disponibilidad en Bodega
            </h5>
            <span className="badge bg-danger text-white rounded-pill px-3 py-1 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-1"></i>
              Cantidad de productos con stock bajo: {stockBajoCount}
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="ps-3">Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Estado Stock</th>
                  <th>Unidades</th>
                  <th className="text-center pe-3">Ajuste Rápido</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id || prod.codigo}>
                    <td className="fw-bold ps-3">{prod.codigo}</td>
                    <td>
                      <Link
                        to={`/producto/${prod.codigo}`}
                        className="text-decoration-none fw-semibold text-dark"
                      >
                        {prod.nombre}
                      </Link>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{prod.categoria}</span>
                    </td>
                    <td>
                      {prod.stock === 0 ? (
                        <span className="badge bg-danger">Agotado</span>
                      ) : prod.stock < 3 ? (
                        <span className="badge bg-warning text-dark">Stock bajo</span>
                      ) : (
                        <span className="badge bg-success">Disponible</span>
                      )}
                    </td>
                    <td className="fw-bold fs-6" style={{ color: 'var(--color-primario)' }}>
                      {prod.stock}
                    </td>
                    <td className="text-center pe-3">
                      <div className="btn-group btn-group-sm border rounded bg-white shadow-sm">
                        <button
                          type="button"
                          className="btn btn-light px-3 py-1 border-end text-danger fw-bold"
                          onClick={() =>
                            handleAjustarStock(prod.codigo, Math.max(0, prod.stock - 1))
                          }
                          disabled={prod.stock === 0}
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          className="btn btn-light px-3 py-1 text-success fw-bold"
                          onClick={() => handleAjustarStock(prod.codigo, prod.stock + 1)}
                        >
                          +1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default VistaEmpleado;