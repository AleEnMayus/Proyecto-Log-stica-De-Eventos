import React, { useMemo, useState, useEffect } from "react";
import "../../CSS/components.css";
import "../../CSS/Lists.css";
import "../../CSS/modals.css";

const AssignResourcesModal = ({ onClose, onSave, preselectedIds = [] }) => {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [seleccion, setSeleccion] = useState(new Set(preselectedIds));
  const [recursos, setRecursos] = useState([]); // 👈 ahora vienen de API
  const recursosPorPagina = 5;

  // 🔹 Función para traer los recursos desde APIrouter.get('/', resourceController.getResources);
const fetchRecursos = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/resources"); 
    if (!response.ok) throw new Error("Error al cargar recursos");
    const data = await response.json();
    setRecursos(data);
  } catch (error) {
    console.error("Error cargando recursos:", error);
  }
};


  // 🔹 Cargar recursos cuando se abre el modal
  useEffect(() => {
    fetchRecursos();
  }, []);

  // 🔍 Filtrado de recursos
  const recursosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return recursos;
    return recursos.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.codigo.toLowerCase().includes(q) ||
        r.estado.toLowerCase().includes(q)
    );
  }, [busqueda, recursos]);

  // 📄 Paginación
  const totalPaginas = Math.max(
    1,
    Math.ceil(recursosFiltrados.length / recursosPorPagina)
  );

  // Reinicia la paginación al cambiar búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Ajusta página si se sale de rango
  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [totalPaginas, paginaActual]);

  // Recursos que se muestran en la página actual
  const indexPrimero = (paginaActual - 1) * recursosPorPagina;
  const recursosActuales = recursosFiltrados.slice(
    indexPrimero,
    indexPrimero + recursosPorPagina
  );

  // ✅ Selección de recursos
  const toggleSeleccion = (id) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 📑 Paginación dinámica (ventana de 5 botones)
  const getPagesWindow = () => {
    const maxButtons = 5;
    if (totalPaginas <= maxButtons)
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);

    let start = Math.max(1, paginaActual - 2);
    let end = start + (maxButtons - 1);
    if (end > totalPaginas) {
      end = totalPaginas;
      start = end - (maxButtons - 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Asignar Recursos</h2>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar recurso..."
          className="input-search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Tabla de recursos */}
        <table className="custom-table">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Nombre</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {recursosActuales.length > 0 ? (
              recursosActuales.map((r) => (
                <tr key={r.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={seleccion.has(r.id)}
                      onChange={() => toggleSeleccion(r.id)}
                    />
                  </td>
                  <td>{r.nombre}</td>
                  <td>{r.codigo}</td>
                  <td>{r.cantidad}</td>
                  <td>{r.estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron recursos.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="pagination">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          {getPagesWindow().map((n) => (
            <button
              key={n}
              className={paginaActual === n ? "active" : ""}
              onClick={() => setPaginaActual(n)}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() =>
              setPaginaActual((p) => Math.min(totalPaginas, p + 1))
            }
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>

        {/* Botones de acción */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary-custom"
            onClick={() => onSave?.(Array.from(seleccion))}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignResourcesModal;
