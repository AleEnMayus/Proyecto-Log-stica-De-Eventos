import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './components.css';
<<<<<<< HEAD
import PerfilModal from './AccountModal/account';
import EditModal from "./AccountModal/EditAccount";
=======
import Notifications from "../UCliente/Notification-tray";
>>>>>>> Nury

const HeaderAdm = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
<<<<<<< HEAD
  const [userData, setUserData] = useState(null);
  
  const [showPerfil, setShowPerfil] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
=======
  const [showNotifications, setShowNotifications] = useState(false);
>>>>>>> Nury

  useEffect(() => {
    // Obtener datos del usuario del localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const userImageUrl = userData?.profilePicture || null;

  return (
    <>
      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <button className="menu-btn me-3" onClick={toggleMenu}>
                  ☰
                </button>
                <a href='/' className='d-flex logolink'>
                <img src="/HAE_logo.png" className='img-50'/>
                <div className="logo-text">Happy-Art Eventos</div>
                </a>
              </div>
            </div>

            {/* Notificaciones y Menú de usuario */}
            <div className="col-6 d-flex justify-content-end align-items-center gap-3">
              {/* Botón de Notificaciones */}
              <Link 
                to="/notifications-admin" 
                className="d-inline-flex align-items-center justify-content-center notification-trigger me-3"
                style={{ textDecoration: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentcolor"><path d="M160-200v-60h80v-304q0-84 49.5-150.5T420-798v-22q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v22q81 17 130.5 83.5T720-564v304h80v60H160Zm320-302Zm0 422q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM300-260h360v-304q0-75-52.5-127.5T480-744q-75 0-127.5 52.5T300-564v304Z"/></svg>
              </Link>

              {/* Menú de Usuario */}
              <div 
                className="d-inline-flex align-items-center user-menu-trigger" 
                onClick={toggleUserMenu} 
                style={{ cursor: 'pointer' }}
              >
                <span className="fw-bold me-2 title-headersb">
                  {userData ? (userData.fullName).split(' ')[0] : 'Invitado'}
                </span>

                {userImageUrl ? (
                  <img src={userImageUrl} alt="Avatar del usuario" className="ms-2 rounded-circle img-50"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#0e40b68b"><path d="M222-255q63-40 124.5-60.5T480-336q72 0 134 20.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm257.81-195q-57.81 0-97.31-39.69-39.5-39.68-39.5-97.5 0-57.81 39.69-97.31 39.68-39.5 97.5-39.5 57.81 0 97.31 39.69 39.5 39.68 39.5 97.5 0 57.81-39.69 97.31-39.68 39.5-97.5 39.5Zm-.21 370q-83.15 0-156.28-31.5t-127.22-86Q142-252 111-324.84 80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.5t-127.13 86Q562.74-80 479.6-80Z"/></svg>
                )}

                <span className="ms-2">{isUserMenuOpen ? '▲' : '▼'}</span>
              </div>

              {/* Dropdown de Usuario */}
              {isUserMenuOpen && userData && (
                <div className="user-dropdown position-absolute end-0 me-4 mt-2">
                  <div className="p-3 border-bottom">
                    <div className="fw-bold">{userData.fullName}</div>
                    <div className="text-muted small">{userData.email}</div>
                    <div className="badge bg-secondary small mt-1">{userData.role}</div>
                  </div>
                  <Link className="dropdown-item-custom" onClick={() => {setShowPerfil(true); setIsUserMenuOpen(false)}}>
                    Ver perfil
                  </Link>
                  
                  
                  <Link to="/logout" className="dropdown-item-custom">
                    Cerrar sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="p-4 mt-5 pt-5">
          <nav className="mt-5">
            <a href="/" className="sidebar-menu-item">Inicio</a>
            <a href="#galeria" className="sidebar-menu-item">Galería</a>
            <a href="#eventos" className="sidebar-menu-item">Eventos</a>
            <a href="#promociones" className="sidebar-menu-item">Promociones</a>
            <a href="#contacto" className="sidebar-menu-item">Contacto</a>
            <a href="#agendar" className="sidebar-menu-item">Agendar Cita</a>
            <a href="#agendar" className="sidebar-menu-item">Contrato</a>
            <Link to="/survay" className="sidebar-menu-item">Encuestas</Link>
            <Link to="/Notification" className="sidebar-menu-item">Notificaciones</Link>
          </nav>
        </div>
      </div>

      {/* Modal de perfil */}
      <PerfilModal
        isOpen={showPerfil}
        onClose={() => setShowPerfil(false)}
        user={userData}
        onEdit={() => {
          setShowPerfil(false);
          setShowEdit(true);
        }}
      />

      {/* Modal de edición */}
      <EditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        user={userData}
      />
    </>
  );
};

export default HeaderAdm;
