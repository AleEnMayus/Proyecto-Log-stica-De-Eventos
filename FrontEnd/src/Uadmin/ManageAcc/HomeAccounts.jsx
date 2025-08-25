import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import HeaderAdm from '../../components/HeaderAdm';
import ConfirmModal from "../../components/ModalConfirm";
import ModalState from "../../components/ModalState";
import './Acc.css'

const AdminAccountsList = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: 'Admin Usuario',
      role: 'admin',
      email: 'admin@happyart.com',
      phoneNumber: '300 9876543',
      birthDate: '1985-03-15',
      identificationType: 'cedula',
      documentNumber: '123456789',
      profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      estado: 'Activo'
    },
    {
      id: 2,
      fullName: 'Juan Pérez',
      role: 'user',
      email: 'user@happyart.com',
      phoneNumber: '300 1234567',
      birthDate: '1992-07-20',
      identificationType: 'cedula',
      documentNumber: '987654321',
      profilePicture: 'https://randomuser.me/api/portraits/men/46.jpg',
      estado: 'Activo'
    },
    {
      id: 3,
      fullName: 'María González',
      role: 'user',
      email: 'maria@happyart.com',
      phoneNumber: '300 5555555',
      birthDate: '1990-11-08',
      identificationType: 'cedula',
      documentNumber: '555666777',
      profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
      estado: 'Activo'
    },
    {
      id: 4,
      fullName: 'Carlos Rodríguez',
      role: 'user',
      email: 'carlos@happyart.com',
      phoneNumber: '300 7777777',
      birthDate: '1988-05-22',
      identificationType: 'cedula',
      documentNumber: '111222333',
      profilePicture: 'https://randomuser.me/api/portraits/men/68.jpg',
      estado: 'Activo'
    },
    {
      id: 5,
      fullName: 'Ana Martínez',
      role: 'user',
      email: 'ana@happyart.com',
      phoneNumber: '300 8888888',
      birthDate: '1995-09-12',
      identificationType: 'cedula',
      documentNumber: '444555666',
      profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg',
      estado: 'Activo'
    },
    {
      id: 6,
      fullName: 'Pedro López',
      role: 'user',
      email: 'pedro@happyart.com',
      phoneNumber: '300 9999999',
      birthDate: '1987-02-28',
      identificationType: 'cedula',
      documentNumber: '777888999',
      profilePicture: 'https://randomuser.me/api/portraits/men/54.jpg',
      estado: 'Activo'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [showStateModal, setShowStateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const handleDelete = (userId) => {
    setModalConfig({
      message: "¿Seguro quieres eliminar la cuenta?",
      confirmText: "Eliminar",
      onConfirm: () => {
        console.log("Usuario eliminado:", userId);
        setShowModal(false);
      }
    });
    setShowModal(true);
  };

  const handleOpenStatusModal = (userId, currentStatus) => {
    setSelectedUser({ id: userId, status: currentStatus });
    setShowStateModal(true);
  };

  // Función que maneja la confirmación desde el ModalState
  const handleStatusChangeFromModal = (userId, newStatus) => {
    const user = users.find(u => u.id === userId);
    const userName = user ? user.fullName : 'Usuario';
    
    // Cerramos el modal de estado
    setShowStateModal(false);
    
    // Configuramos el modal de confirmación con los valores directos
    setModalConfig({
      message: `¿Estás seguro de cambiar el estado del usuario "${userName}" a "${newStatus}"?`,
      confirmText: "Confirmar cambio",
      onConfirm: () => {
        // Ejecutamos el cambio real con los valores capturados
        executeStatusChange(userId, newStatus);
        setShowModal(false);
      }
    });
    
    // Mostramos el modal de confirmación
    setShowModal(true);
  };

  // Función que ejecuta el cambio de estado real
  const executeStatusChange = (userId, newStatus) => {
    console.log("Estado cambiado:", userId, "->", newStatus);
    
    // Actualizar el estado local
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, estado: newStatus } : user
      )
    );
    
    // Aquí harías tu request al backend
    // try {
    //   await updateUserStatus(userId, newStatus);
    // } catch (error) {
    //   console.error('Error al cambiar estado:', error);
    // }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const navigate = useNavigate();

  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`); // Redirige a la página de edición
  };


  return (
    <div className="admin-accounts-container">
      {/* Header */}
      <HeaderAdm />

      <div className="admin-header mt-5 pt-5">
        <h2 className="admin-title">ADMINISTRAR CUENTA</h2>
        <Link to="/CreateAccount" className="btn-create-account d-flex" style={{ textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffffff">
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z"/>
          </svg>
          Crear cuenta
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Nombre o usuario</span>
        <div className="search-input-group">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
          </svg>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar cuenta..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table admin-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre usuario</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <span className="user-type">{user.id}</span>
                </td>
                <td>
                  <div className="user-info">
                    <img
                      src={user.profilePicture}
                      alt={user.fullName}
                      className="user-avatar me-2"
                    />
                    <span className="user-name">{user.fullName}</span>
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-status"
                    onClick={() => handleOpenStatusModal(user.id, user.estado)}
                  >
                    {user.estado}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(user.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffffff">
                      <path d="M269-86q-53 0-89.5-36.5T143-212v-497H80v-126h257v-63h284v63h259v126h-63v497q0 53-36.5 89.5T691-86H269Zm422-623H269v497h422v-497ZM342-281h103v-360H342v360Zm173 0h103v-360H515v360ZM269-709v497-497Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
          </svg>
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
          </svg>
        </button>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalConfig.onConfirm}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
      />

      {/* Modal de Estado */}
      <ModalState
        show={showStateModal}
        onClose={() => setShowStateModal(false)}
        onConfirm={handleStatusChangeFromModal} // Cambiado el nombre de la función
        currentStatus={selectedUser?.status}
        entityId={selectedUser?.id}
        options={["Activo", "Inactivo"]}
        title="Cambiar estado de usuario"
      />
    </div>
  );
};

export default AdminAccountsList