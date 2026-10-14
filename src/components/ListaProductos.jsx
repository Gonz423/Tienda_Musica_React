import ProductCard from './ProductCard';

function ListaProductos({ productos, onAgregarAlCarrito }) {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAgregarAlCarrito={onAgregarAlCarrito}
        />
      ))}
    </div>
  );
}

export default ListaProductos;