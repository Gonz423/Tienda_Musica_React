import { useState } from "react";
import { Link } from "react-router-dom";

const pedidosIniciales = [
  {
    id: 101,
    cliente: "Juan Perez",
    fecha: "2023-06-01",
    total: 599990,
    estado: "Pendiente",
    tipoEntrega: "Retiro local",
    productos: [
      { codigo: "BT001", nombre: "Batería Acústica 5 Piezas", cantidad: 1, stock: 6 }
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
      { codigo: "MI003", nombre: "Micrófono Condensador", cantidad: 2, stock: 8 }
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
      { codigo: "GE005", nombre: "Guitarra Eléctrica Semi-hollow", cantidad: 1, stock: 5 }
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
      { codigo: "GA003", nombre: "Guitarra Acústica Clásica 4/4", cantidad: 1, stock: 1 },
      { codigo: "AC002", nombre: "Cuerdas Guitarra Acústica 12-53", cantidad: 1, stock: 3 }
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
      { codigo: "ES001", nombre: "Interfaz de Audio 2x2 USB", cantidad: 1, stock: 8 }
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
      { codigo: "PE006", nombre: "Pedal Overdrive", cantidad: 1, stock: 8 }
    ]
  }
];

function VistaEmpleado() {
 
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const avanzarEstado = (id) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) => {
        if (pedido.id !== id) return pedido;

        let nuevoEstado = pedido.estado;
        if (pedido.estado === "Pendiente") {
          nuevoEstado = "En preparación";
        } else if (pedido.estado === "En preparación") {
          nuevoEstado = "Despachado";
        }

        return { ...pedido, estado: nuevoEstado };
      })
    );
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Panel de estado de pedidos</h2>
          <p className="text-muted mb-0">
        Recepción, preparación y despacho de pedidos solicitados
          </p>
        </div>
        <span className="badge bg-dark fs-6">
          Pedidos activos: {pedidos.filter((p) => p.estado !== "Despachado").length}
        </span>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover table-striped align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th scope="col"># ID pedido</th>
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
                    {pedido.productos.map((prod) => (
                      <li key={prod.id} className="py-1">
                        <span>
                          {prod.cantidad}x{" "}
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
                    ))}
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
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => avanzarEstado(pedido.id)}
                    >
                      Comenzar Preparación
                    </button>
                  )}

                  {pedido.estado === "En preparación" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => avanzarEstado(pedido.id)}
                    >
                      Despachar
                    </button>
                  )}

                  {pedido.estado === "Despachado" && (
                    <span className="text-muted small">Completado </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default VistaEmpleado;