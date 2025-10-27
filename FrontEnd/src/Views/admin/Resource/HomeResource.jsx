import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { toasts, addToast } = useToast();

  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("No se pudieron cargar los recursos");
      const data = await res.json();
      setRecursos(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || "Error al cargar los recursos", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleDelete = (id) => {
    setModalConfig({
      message: "¿Seguro que quieres eliminar este recurso?",
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (res.ok) setRecursos(prev => prev.filter(r => r.ResourceId !== id));
        } catch (err) { console.error(err); }
        finally { setShowModal(false); }
      }
    });
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const resource = recursos.find(r => r.ResourceId === id);
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedResource) => {
    setRecursos(prev => prev.map(r => r.ResourceId === updatedResource.ResourceId ? updatedResource : r));
    setShowEditModal(false);
    addToast("Recurso actualizado correctamente", "success");
  };

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
    <>
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

      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar recurso</span>
        <div className="search-input-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar por nombre o estado..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? <div className="empty-state">Cargando recursos...</div> :
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
              {currentResources.map(r => (
                <tr key={r.ResourceId}>
                  <td>{r.ResourceId}</td>
                  <td>{r.ResourceName}</td>
                  <td>{r.Quantity}</td>
                  <td>{r.Status === "Available" ? "Disponible" : "En uso"}</td>
                  <td>{r.StatusDescription}</td>
                  <td>{r.Price}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn-custom btn-edit-custom" onClick={() => handleEdit(r.ResourceId)}>Editar</button>
                      <button className="btn-custom btn-delete-custom" onClick={() => handleDelete(r.ResourceId)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentResources.length === 0 &&
                <tr><td colSpan="7"><div className="empty-state">No se encontraron recursos.</div></td></tr>}
            </tbody>
          </table>
        }
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

      <ConfirmModal show={showModal} onClose={() => setShowModal(false)} onConfirm={modalConfig.onConfirm} message={modalConfig.message} confirmText={modalConfig.confirmText} />
      {showEditModal && selectedResource &&
        <EditResource resource={selectedResource} onCancel={() => setShowEditModal(false)} onSave={handleSaveEdit} />
      }

      <ToastContainer toasts={toasts} removeToast={() => {}} />
    </div>
    </>
  );
};

export default ListResource;
