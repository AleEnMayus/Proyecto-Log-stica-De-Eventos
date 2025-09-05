import React, { useState } from 'react';
import HeaderAdm from '../../components/HeaderAdm';
import ConfirmModal from "../../components/ModalConfirm";
import '../../components/CSS/Lists.css';
import '../../components/components.css';

const ListResource = () => {
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: "Proyector", codigo: "PRJ-01", cantidad: 3, estado: "Disponible" },
    { id: 2, nombre: "Micrófono", codigo: "MIC-01", cantidad: 5, estado: "En uso" },
    { id: 3, nombre: "Silla", codigo: "SLL-01", cantidad: 50, estado: "Disponible" },
    { id: 4, nombre: "Mesa", codigo: "MSA-01", cantidad: 20, estado: "Mantenimiento" },
    { id: 5, nombre: "Parlante", codigo: "PRL-01", cantidad: 4, estado: "Disponible" },
    { id: 6, nombre: "Laptop", codigo: "LAP-01", cantidad: 8, estado: "Disponible" },
    { id: 7, nombre: "Cámara", codigo: "CAM-01", cantidad: 2, estado: "En uso" },
    { id: 8, nombre: "Trípode", codigo: "TRP-01", cantidad: 6, estado: "Disponible" },
    { id: 9, nombre: "Pizarra", codigo: "PIZ-01", cantidad: 10, estado: "Disponible" },
    { id: 10, nombre: "Cable HDMI", codigo: "CBL-01", cantidad: 15, estado: "Disponible" },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 5;

  // Filtrar por búsqueda
  const filteredResources = recursos.filter(r =>
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * resourcesPerPage;
  const indexOfFirst = indexOfLast - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const handleDelete = (rId) => {
    setModalConfig({
      message: "¿Seguro quieres eliminar el recurso?",
      confirmText: "Eliminar",
      onConfirm: () => {
        console.log("Recurso eliminado:", rId);
        setShowModal(false);
      }
    });
    setShowModal(true);
  };

  const handleEdit = (id) => {
    alert(`Editar recurso con ID: ${id}`);
  };

  const handleCreate = () => {
    alert("Crear nuevo recurso");
  };

  return (
    <div className="list-container">
      <HeaderAdm />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">LISTA DE RECURSOS</h2>
        <button
          onClick={handleCreate}
          className="btn-create d-flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Crear recurso
        </button>
      </div>

      {/* Buscador */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar recurso</span>
        <div className="search-input-group">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar por nombre, código o estado..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="table list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentResources.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.codigo}</td>
                <td>{r.cantidad}</td>
                <td>{r.estado}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* Editar */}
                    <button
                      className="btn-custom btn-edit-custom"
                      onClick={() => handleEdit(r.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff">
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Z" />
                      </svg>
                    </button>

                    {/* Eliminar */}
                    <button
                      className="btn-custom btn-delete-custom"
                      onClick={() => handleDelete(r.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff">
                        <path d="M269-86q-53 0-89.5-36.5T143-212v-497H80v-126h257v-63h284v63h259v126h-63v497q0 53-36.5 89.5T691-86H269Zm422-623H269v497h422v-497ZM342-281h103v-360H342v360Zm173 0h103v-360H515v360Z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {currentResources.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    No se encontraron recursos que coincidan con la búsqueda.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="pagination">
          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </nav>
      )}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalConfig.onConfirm}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />
    </div>

  );
};

export default ListResource;