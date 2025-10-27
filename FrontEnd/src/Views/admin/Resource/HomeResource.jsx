import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eraseUnderscore } from '../../../utils/FormatText';
import HeaderAdm from '../../../components/HeaderSidebar/HeaderAdm';
import ConfirmModal from "../../../components/Modals/ModalConfirm";
import EditResource from "./EditResource";
import '../../CSS/Lists.css';
import '../../CSS/components.css';

import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";

const API_URL = "http://localhost:4000/api/resources";

const ListResource = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // --- Cargar recursos desde API ---
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error("No se pudieron cargar los recursos");
      }
      const data = await res.json();
      setRecursos(data);
    } catch (err) {
      console.error("Error cargando recursos:", err);
      addToast(err.message || "Error al cargar los recursos", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // --- Eliminar recurso ---
  const handleDelete = (id) => {
    setModalConfig({
      message: "¿Seguro que quieres eliminar este recurso?",
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (res.ok) {
            setRecursos(prev => prev.filter(r => r.ResourceId !== id));
            addToast("Recurso eliminado correctamente", "success");
          } else {
            const data = await res.json();
            addToast(data.error || "No se pudo eliminar el recurso", "danger");
          }
        } catch (err) {
          console.error("Error eliminando recurso:", err);
          addToast(err.message || "Error inesperado", "danger");
        } finally {
          setShowModal(false);
        }
      }
    });
    setShowModal(true);
  };

  // --- Editar recurso ---
  const handleEdit = (id) => {
    const resource = recursos.find(r => r.ResourceId === id);
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedResource) => {
    try {
      const res = await fetch(`${API_URL}/${updatedResource.ResourceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedResource),
      });

      if (res.ok) {
        const saved = await res.json();
        setRecursos(prev =>
          prev.map(r => (r.ResourceId === saved.ResourceId ? saved : r))
        );
        addToast("Recurso actualizado correctamente", "success");
      } else {
        const data = await res.json();
        addToast(data.error || "Error al actualizar recurso", "danger");
      }
    } catch (err) {
      console.error("Error actualizando recurso:", err);
      addToast(err.message || "Error inesperado", "danger");
    } finally {
      setShowEditModal(false);
    }
  };

  // --- Crear recurso ---
  const handleCreate = () => {
    navigate('/CreateResource');
  };

  // --- Filtros y paginación ---
  const filteredResources = recursos.filter(r =>
    (r.ResourceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.Status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * resourcesPerPage;
  const indexOfFirst = indexOfLast - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="list-container">
      <HeaderAdm />

      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">LISTADO DE RECURSOS</h2>
        <button onClick={handleCreate} className="btn-create d-flex">
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
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar por nombre o estado..."
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
        {loading ? (
          <div className="empty-state">Cargando recursos...</div>
        ) : (
          <table className="table list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentResources.map((r) => (
                <tr key={r.ResourceId}>
                  <td>{r.ResourceId}</td>
                  <td>{r.ResourceName}</td>
                  <td>{r.Quantity}</td>
                  <td>{eraseUnderscore(r.Status)}</td>
                  <td>{r.StatusDescription}</td>
                  <td>{r.Price}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn-custom btn-edit-custom"
                        onClick={() => handleEdit(r.ResourceId)}
                        aria-label="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
                        </svg>
                      </button>
                      <button
                        className="btn-custom btn-delete-custom"
                        onClick={() => handleDelete(r.ResourceId)}
                        aria-label="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentResources.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      No se encontraron recursos que coincidan con la búsqueda.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button
          className="pagination-arrow"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ▶
        </button>
      </div>

      {/* Modal eliminar */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalConfig.onConfirm}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />

      {/* Modal editar */}
      {showEditModal && selectedResource && (
        <EditResource
          show={showEditModal}
          onCancel={() => setShowEditModal(false)}
          resource={selectedResource}
          onSave={handleSaveEdit}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ListResource;
