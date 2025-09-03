import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import '../../components/components.css';
import '../../components/CSS/Lists.css';
import HeaderAdm from '../../components/HeaderAdm';

const AssingResources = () => {
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const recursosPorPagina = 5;

  const recursos = [
    { id: 1, nombre: 'Proyector', codigo: 'PRJ-01', cantidad: 3, estado: 'Disponible' },
    { id: 2, nombre: 'Micrófono', codigo: 'MIC-01', cantidad: 5, estado: 'En uso' },
    { id: 3, nombre: 'Silla', codigo: 'SLL-01', cantidad: 50, estado: 'Disponible' },
    { id: 4, nombre: 'Mesa', codigo: 'MSA-01', cantidad: 20, estado: 'Mantenimiento' },
    { id: 5, nombre: 'Parlante', codigo: 'PRL-01', cantidad: 4, estado: 'Disponible' },
    { id: 6, nombre: 'Pantalla', codigo: 'PNT-01', cantidad: 2, estado: 'En uso' },
    { id: 7, nombre: 'Portátil', codigo: 'LTP-01', cantidad: 10, estado: 'Disponible' }
  ];

  const recursosFiltrados = recursos.filter(recurso =>
    recurso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    recurso.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    recurso.estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexUltimo = paginaActual * recursosPorPagina;
  const indexPrimero = indexUltimo - recursosPorPagina;
  const recursosActuales = recursosFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(recursosFiltrados.length / recursosPorPagina);

  return (
    <div className="list-container mle-0">
      <HeaderAdm />

      {/* Título centrado */}
      <div className="list-header mt-5 pt-5" style={{ justifyContent: 'center' }}>
        <h2 className="list-title text-center">ASIGNAR RECURSOS</h2>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar recurso</span>
        <div className="search-input-group">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, código o estado..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
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
            {recursosActuales.map((recurso) => (
              <tr key={recurso.id}>
                <td>{recurso.nombre}</td>
                <td>{recurso.codigo}</td>
                <td>{recurso.cantidad}</td>
                <td>{recurso.estado}</td>
                <td>
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación con clases de tu CSS */}
      <div className="pagination">
        <button 
          className="pagination-arrow"
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
        >
          ◀
        </button>

        <div className="pagination-numbers">
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${paginaActual === i + 1 ? 'active' : ''}`}
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button 
          className="pagination-arrow"
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
        >
          ▶
        </button>
      </div>

      {/* Botón de registrar asignación abajo */}
      <div className="mt-4 d-flex justify-content-center">
        <Link to="/CreateAssignment" className="btn-create">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffffff">
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Registrar Asignación
        </Link>
      </div>

      {/* Estado vacío */}
      {recursosFiltrados.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron recursos que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  );
};

export default AssingResources;
