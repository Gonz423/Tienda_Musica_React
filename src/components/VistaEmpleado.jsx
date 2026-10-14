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
  pedidosExternos,
  onActualizarEstado,
  onActualizarStock: onActualizarStockProp
}) {


  const [pedidosLocales, setPedidosLocales] = useState(pedidosIniciales);
  const [productosLocales, setProductosLocales] = useState(productosProp);

  const pedidos = pedidosExternos || pedidosLocales;
  const productos = productosProp || productosLocales;

  const obtenerStockReal = (codigo) => {
    const item = productos.find(
      (p) => String(p.codigo).toLowerCase() === String(codigo).toLowerCase()
    );
    return item ? item.stock : 0;
  };

  const agruparProductos = (listaProductos = []) => {
  const contador = {};

  listaProductos.forEach((prod) => {
    const clave = prod.codigo;
    const cantidadSumar = prod.cantidad ?? prod.cant ?? 1;

    if (!contador[clave]) {
      contador[clave] = {
        ...prod,
        cantidad: cantidadSumar,
      };
    } else {
      contador[clave].cantidad += cantidadSumar;
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
    } else if (pedidoActual.estado === "En preparación") {
      nuevoEstado = "Despachado";
    }

    if (onActualizarEstado) {
      onActualizarEstado(id, nuevoEstado);
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
        prev.map((p) =>
          p.codigo === codigo ? { ...p, stock: Number(nuevoStock) } : p
        )
      );
    }
  };

  const obtenerColorBadge = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-warning text-dark";
      case "En preparación":
        return "bg-primary";
      case "Despachado":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <section className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h3 mb-1">Panel operativo de tienda </h2>
          <p className="text-muted mb-0">
            Recepción, preparación y despacho de pedidos solicitados en tiempo real. 
            Mantenga actualizado el estado de cada pedido para garantizar una experiencia de cliente satisfactoria.
          </p>
        </div>

        {seccionActiva === "pedidos" && (
          <span className="badge bg-dark fs-6">
            Pedidos activos: {pedidos.filter((p) => p.estado !== "Despachado").length}
          </span>
        )}
      </div>

      {seccionActiva === "pedidos" && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col"># ID</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Tipo de entrega</th>
                <th scope="col">Artículos</th>
                <th scope="col">Total venta</th>
                <th scope="col">Estado de venta</th>
                <th scope="col" className="text-center">Acción Operativa</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="fw-bold">#{pedido.id}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.cliente}</td>
                  <td>
                    <span
                      className={`badge ${
                        pedido.tipoEntrega === "Envío a domicilio"
                          ? "bg-info text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {pedido.tipoEntrega}
                    </span>
                  </td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {agruparProductos(pedido.productos).map((prod) => {
                        
                        return (
                          <li key={prod.id} className="py-1">
                            <span>
                              {prod.cantidad ?? prod.cant ?? 1}x{" "}
                              <Link to={`/producto/${prod.codigo}`}> 
                                  {prod.nombre}
                                </Link>
                              </span>{" "}
                        {prod.stock < 3 && (
                          <span className="badge bg-danger ms-1">
                            Stock bajo: {prod.stock} disp.
                          </span>
                        )}
                      </li>
                        );
})}
                  </ul>
                </td>

                                <td className="fw-semibold">
                  ${pedido.total.toLocaleString("es-CL")}
                </td>

                  
                  <td>
                    <span className={`badge ${obtenerColorBadge(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    {pedido.estado === "Pendiente" && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => avanzarEstado(pedido.id)}
                      >
                        Preparar
                      </button>
                    )}

                    {pedido.estado === "En preparación" && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => avanzarEstado(pedido.id)}
                      >
                        Despachar
                      </button>
                    )}

                    {pedido.estado === "Despachado" && (
                      <span className="text-muted small fw-bold">Completado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {seccionActiva === "stock" && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Inventario y Disponibilidad en Bodega</h5>
            <span className="badge bg-danger">
              Cantidad de productos con stock bajo: {productos.filter((p) => p.stock < 3).length}
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Estado Stock</th>
                  <th>Unidades</th>
                  <th className="text-center">Ajuste Rápido</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id || prod.codigo}>
                    <td className="fw-bold">{prod.codigo}</td>
                    <td>
                      <Link
                        to={`/producto/${prod.codigo}`}
                        className="text-decoration-none fw-semibold text-dark"
                      >
                        {prod.nombre}
                      </Link>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{prod.categoria}</span>
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
                    <td className="fw-bold fs-6">{prod.stock}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleAjustarStock(prod.codigo, Math.max(0, prod.stock - 1))
                          }
                          disabled={prod.stock === 0}
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-success"
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