import React, { useMemo, useState, useEffect } from "react";
import "../../CSS/components.css";
import "../../CSS/Lists.css";
import "../../CSS/modals.css"; // usa tu archivo de modals

const AssignResourcesModal = ({ onClose, onSave, preselectedIds = [] }) => {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [seleccion, setSeleccion] = useState(new Set(preselectedIds));
  const recursosPorPagina = 5;

  const recursos = [
    { id: 1, nombre: "Proyector",  codigo: "PRJ-01", cantidad: 3,  estado: "Disponible" },
    { id: 2, nombre: "Micrófono",  codigo: "MIC-01", cantidad: 5,  estado: "En uso" },
    { id: 3, nombre: "Silla",      codigo: "SLL-01", cantidad: 50, estado: "Disponible" },
    { id: 4, nombre: "Mesa",       codigo: "MSA-01", cantidad: 20, estado: "Mantenimiento" },
    { id: 5, nombre: "Parlante",   codigo: "PRL-01", cantidad: 4,  estado: "Disponible" },
    { id: 6, nombre: "Pantalla",   codigo: "PNT-01", cantidad: 2,  estado: "En uso" },
    { id: 7, nombre: "Portátil",   codigo: "LTP-01", cantidad: 10, estado: "Disponible" },
  ];

  // filtro memoizado
  const recursosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return recursos;
    return recursos.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.codigo.toLowerCase().includes(q) ||
        r.estado.toLowerCase().includes(q)
    );
  }, [busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(recursosFiltrados.length / recursosPorPagina));

  // si cambia el filtro, volver a la página 1
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // clamp página si fuera necesario
  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [totalPaginas, paginaActual]);

  const indexPrimero = (paginaActual - 1) * recursosPorPagina;
  const recursosActuales = recursosFiltrados.slice(indexPrimero, indexPrimero + recursosPorPagina);

  const toggleSeleccion = (id) => {
    setSeleccion(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // helper: ventana de páginas (máx 5 números visibles)
  const getPagesWindow = () => {
    const maxButtons = 5;
    if (totalPaginas <= maxButtons) return Array.from({length: totalPaginas}, (_,i) => i+1);
    let start = Math.max(1, paginaActual - 2);
    let end = start + (maxButtons - 1);
    if (end > totalPaginas) { end = totalPaginas; start = end - (maxButtons - 1); }
    return Array.from({length: end - start + 1}, (_,i) => start + i);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="profile-modal assign-resources-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // evita que clic dentro cierre modal
      >
        <button className="close-btn" onClick={onClose} aria-label="Cerrar">×</button>

        {/* inner container centrado */}
        <div className="assign-modal-inner">
          <div className="list-header" style={{ justifyContent: "center", marginBottom: 6 }}>
            <h2 className="list-title">ASIGNAR RECURSOS</h2>
          </div>

          {/* buscador alineado a la izquierda */}
          <div className="search-container" style={{ width: "40%", marginBottom: "18px" }}>
            <div className="search-input-group">
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentcolor">
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nombre, código o estado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* tabla */}
          <div className="table-container" style={{ width: "100%", margin: "0 auto" }}>
            <table className="list-table">
              <thead>
                <tr>
                  <th>Nombre del Recurso</th>
                  <th>Código</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {recursosActuales.map(r => (
                  <tr key={r.id}>
                    <td style={{ textAlign: "left", paddingLeft: 24 }}>{r.nombre}</td>
                    <td>{r.codigo}</td>
                    <td>{r.cantidad}</td>
                    <td>{r.estado}</td>
                    <td>
                      <label className="checkbox-wrapper" style={{ justifyContent: "center" }}>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={seleccion.has(r.id)}
                          onChange={() => toggleSeleccion(r.id)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                  </tr>
                ))}
                {recursosActuales.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: 24 }}>No se encontraron recursos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* paginación */}
          <div className="pagination" style={{ marginTop: 18 }}>
            <button
              className="pagination-arrow"
              onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
            >
              ◀
            </button>

            <div className="pagination-numbers" style={{ alignItems: "center" }}>
              {getPagesWindow().map(p => (
                <button
                  key={p}
                  className={`pagination-btn ${paginaActual === p ? "active" : ""}`}
                  onClick={() => setPaginaActual(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              className="pagination-arrow"
              onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
            >
              ▶
            </button>
          </div>

          {/* footer */}
          <div className="pm-footer" style={{ justifyContent: "center", marginTop: 18 }}>
            <button className="btn-cancel" onClick={onClose} style={{ marginRight: 12 }}>Cancelar</button>
            <button className="btn-primary-custom" onClick={() => onSave?.(Array.from(seleccion))}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignResourcesModal;
