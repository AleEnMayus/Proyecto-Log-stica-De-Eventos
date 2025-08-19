import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './components.css';

const HeaderCl = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

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
                <div className="logo-text">Happy-Art Eventos</div>
              </div>
            </div>

            <div className="col-6 text-end position-relative">
              {user ? (
                // 👤 Menú de usuario (cuando está logueado)
                <div 
                  className="d-inline-flex align-items-center user-menu-trigger"
                  onClick={toggleUserMenu}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="me-2">🔔</span>
                  <span className="me-2">👤</span>
                  <span className="fw-bold">{user.name}</span>
                  <span className="ms-1">▼</span>
                </div>
              ) : (
                // 🔑 Botones de login/registro (cuando no está logueado)
                <>
                  <a href='/Register' className="btn btn-outline-primary me-2 register-btn mb-1 mb-lg-0">
                    Registrarse
                  </a>
                  <Link to="/login" className="btn-primary-custom btn">
                    Iniciar Sesión
                  </Link>
                </>
              )}

              {isUserMenuOpen && user && (
                <div className="user-dropdown">
                  <div className="p-3 border-bottom">
                    <div className="fw-bold">{user.name}</div>
                    <div className="text-muted small">{user.email}</div>
                  </div>
                  <Link to="/editar-perfil" className="dropdown-item-custom">
                    ⚙ Editar perfil
                  </Link>
                  <Link to="/logout" className="dropdown-item-custom">
                    ↩ Cerrar sesión
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
      />

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="p-4 mt-5 pt-5">
          <nav className="mt-5">
            <a href="#inicio" className="sidebar-menu-item">Inicio</a>
            <a href="#galeria" className="sidebar-menu-item">Galería</a>
            <a href="#eventos" className="sidebar-menu-item">Eventos</a>
            <a href="#promociones" className="sidebar-menu-item">Promociones</a>
            <a href="#contacto" className="sidebar-menu-item">Contacto</a>
            <a href="#agendar" className="sidebar-menu-item">Agendar Cita</a>
            <Link to="/contracts-client" className="sidebar-menu-item">Contratos</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default HeaderCl;
