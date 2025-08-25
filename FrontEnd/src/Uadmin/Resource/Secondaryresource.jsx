import React, { useState } from "react";
import '../Admin.css';

const Secondaryresources = () => {
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { id: 2, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { id: 3, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { id: 4, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { id: 5, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { id: 6, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
    { id: 7, nombre: "Content", codigo: "Content", cantidad: "Content", estado: "Content" },
  ]);

  const eliminarRecurso = (id) => {
    setRecursos(recursos.filter((r) => r.id !== id));
  };

  return (
    <div className="recursos-container">
      <h2 className="section-title">Recursos Agregar Y Eliminar</h2>

      {/* Tabla de nuevo recurso */}
      <table className="recursos-table">
        <thead>
          <tr>
            <th>Nuevo Recurso</th>
            <th>Código del Recurso Nuevo</th>
            <th>Cantidad del Recurso</th>
            <th>Estado del Recurso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Content</td>
            <td>Content</td>
            <td>Content</td>
            <td>Content</td>
          </tr>
        </tbody>
      </table>

      {/* Buscador */}
      <div className="buscador-container">
        <input
          type="text"
          placeholder="🔍 Buscar recurso"
          className="buscador-input"
        />
      </div>

      {/* Tabla de recursos */}
      <table className="recursos-table">
        <thead>
          <tr>
            <th>Nombre del Recurso</th>
            <th>Código del Recurso</th>
            <th>Cantidad de Recursos</th>
            <th>Estado del Recurso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recursos.map((recurso) => (
            <tr key={recurso.id}>
              <td>{recurso.nombre}</td>
              <td>{recurso.codigo}</td>
              <td>{recurso.cantidad}</td>
              <td>{recurso.estado}</td>
              <td>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarRecurso(recurso.id)}
                >
                  Eliminar recurso
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón guardar */}
      <div className="guardar-container">
        <button className="btn-guardar">Guardar</button>
      </div>
    </div>
  );
};

export default Secondaryresources;
