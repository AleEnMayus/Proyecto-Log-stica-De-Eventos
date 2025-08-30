import React, { useState } from "react";
import '../Admin.css'; // Importa los estilos

const Mainresources = () => {
  const [search, setSearch] = useState("");

  // Datos de ejemplo
  const recursos = [
    { nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" }
  ];

  const filteredRecursos = recursos.filter((r) =>
    r.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recursos-container">
      <h2 className="recursos-title">Listado de recurso</h2>

      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="🔍 Buscar recurso"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="recursos-search"
      />

      {/* Tabla */}
      <table className="recursos-table">
        <thead>
          <tr>
            <th>Nombre del Recurso</th>
            <th>Código del Recurso</th>
            <th>Cantidad de Recursos</th>
            <th>Estado del Recurso</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecursos.map((r, index) => (
            <tr key={index}>
              <td>{r.nombre}</td>
              <td>{r.codigo}</td>
              <td>{r.cantidad}</td>
              <td>{r.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón editar */}
      <div className="recursos-btn-container">
        <button className="btn-edit">Editar recursos</button>
      </div>
    </div>
  );
};

export default Mainresources;
