import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { capitalize } from "../../../utils/FormatText";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import ConfirmModal from "../../../components/Modals/ModalConfirm";
import ModalState from "../../../components/Modals/ModalState";
import "../../CSS/Lists.css";
import "../../CSS/components.css";

const API_URL = "http://localhost:4000/api/accounts";

const AdminAccountsList = () => {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [showStateModal, setShowStateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estado del buscador
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const navigate = useNavigate();

  // --- Cargar cuentas desde la API ---
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
      setCurrentPage(1); // Reinicia la paginación al cargar datos
    } catch (err) {
      console.error("Error cargando cuentas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // --- Eliminar cuenta ---
  const handleDelete = (userId) => {
    setModalConfig({
      message: "¿Seguro que quieres eliminar esta cuenta?",
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) throw new Error("Error al eliminar cuenta");

          // Elimina la cuenta de la lista local
          setUsers((prev) => prev.filter((u) => u.UserId !== userId));
          setShowModal(false);
        } catch (err) {
          console.error("Error eliminando cuenta:", err);
          alert("No se pudo eliminar la cuenta");
        }
      },
    });
    setShowModal(true);
  };

  // --- Abrir modal de cambio de estado ---
  const handleOpenStatusModal = (userId, currentStatus) => {
    setSelectedUser({ id: userId, status: currentStatus });
    setShowStateModal(true);
  };

  // --- Confirmar cambio de estado desde el modal ---
  const handleStatusChangeFromModal = (userId, newStatus) => {
    const user = users.find((u) => u.UserId === userId);
    const userName = user ? user.Names : "Usuario";

    setShowStateModal(false);

    setModalConfig({
      message: `¿Estás seguro de cambiar el estado del usuario "${userName}" a "${newStatus}"?`,
      confirmText: "Confirmar cambio",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/${userId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Status: newStatus }),
          });

          if (!res.ok) throw new Error("Error al cambiar estado");

          // Actualiza el estado localmente
          setUsers((prev) =>
            prev.map((u) =>
              u.UserId === userId ? { ...u, Status: newStatus } : u
            )
          );
          setShowModal(false);
        } catch (err) {
          console.error("Error cambiando estado:", err);
          alert("No se pudo cambiar el estado");
        }
      },
    });

    setShowModal(true);
  };

  // --- Filtrado por búsqueda ---
  const filteredUsers = users.filter(
    (user) =>
      user.Names.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.UserId.toString().includes(searchTerm)
  );

  // --- Cálculo de paginación ---
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // --- Cambiar página ---
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Navegar a edición ---
  const handleEdit = (userId) => {
    navigate(`/ManageAccounts/edit/${userId}`);
  };

  return (
    <div className="list-container">
      <HeaderAdm />

      {/* Encabezado */}
      <div className="list-header mt-3">
        <h2 className="list-title">LISTADO DE CUENTAS</h2>
        <Link
          to="/CreateAccount"
          className="btn-create d-flex align-items-center justify-content-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ffffff"
          >
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Crear Cuenta
        </Link>
      </div>

      {/* Buscador */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Nombre o usuario</span>
        <div className="search-input-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentcolor"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar cuenta..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reinicia a la primera página al buscar
            }}
          />
        </div>
      </div>

      {/* Tabla de cuentas */}
      <div className="table-container">
        {loading ? (
          <div className="empty-state">Cargando cuentas...</div>
        ) : (
          <table className="table list-table">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell">ID</th>
                <th>Nombre usuario</th>
                <th className="d-none d-md-table-cell">Número de documento</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.UserId}>
                    <td className="d-none d-md-table-cell">{user.UserId}</td>
                    <td className="align-middle">
                      <p className="fw-semibold mb-0">{user.Names}</p>
                      <p className="text-muted small mb-0">{user.Email}</p>
                    </td>
                    <td className="d-none d-md-table-cell">{user.DocumentNumber}</td>
                    <td className="fw-semibold text-muted small mb-0">{capitalize(user.Role)}</td>
                    <td>
                      <button
                        className="btn-custom btn-status-custom mx-auto"
                        onClick={() =>
                          handleOpenStatusModal(user.UserId, user.Status)
                        }
                      >
                        {capitalize(user.Status)}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-custom btn-edit-custom mx-auto"
                        onClick={() => handleEdit(user.UserId)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="22px"
                          viewBox="0 -960 960 960"
                          width="22px"
                          fill="#e3e3e3"
                        >
                          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Z" />
                        </svg>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-custom btn-delete-custom mx-auto"
                        onClick={() => handleDelete(user.UserId)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="22px"
                          viewBox="0 -960 960 960"
                          width="22px"
                          fill="#ffffffff"
                        >
                          <path d="M269-86q-53 0-89.5-36.5T143-212v-497H80v-126h257v-63h284v63h259v126h-63v497q0 53-36.5 89.5T691-86H269Zm422-623H269v497h422v-497Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No hay cuentas disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación personalizada */}
      {totalPages > 1 && (
        <div className="pagination d-flex justify-content-center mt-2">
          {/* Flecha anterior */}
          <button
            className="pagination-arrow"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀
          </button>

          {/* Números */}
          <div className="pagination-numbers d-flex">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Flecha siguiente */}
          <button
            className="pagination-arrow"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      )}

      {/* Modales */}
      <ConfirmModal
        {...modalConfig}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
      <ModalState
        show={showStateModal}
        onClose={() => setShowStateModal(false)}
        onConfirm={handleStatusChangeFromModal}
        currentStatus={selectedUser?.status}
        entityId={selectedUser?.id}
        options={["Active", "Inactive"]}
        title="Cambiar estado de usuario"
      />
    </div>
  );
};

export default AdminAccountsList;