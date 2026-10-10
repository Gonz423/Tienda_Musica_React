
import { Routes, Route } from "react-router-dom";
import VistaEmpleado from "./components/VistaEmpleado";
import DetalleProducto from "./pages/DetalleProducto";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<VistaEmpleado />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
        </Routes>
      </main>


      <Footer /> 
    </div>
  );
}

export default App;