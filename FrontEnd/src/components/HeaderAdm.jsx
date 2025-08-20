import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './components.css';

const HeaderAdm = () => {
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

            {/* Menú de usuario */}
            <div className="col-6 text-end position-relative">
              <div 
                className="d-inline-flex align-items-center user-menu-trigger" 
                onClick={toggleUserMenu}
                style={{ cursor: 'pointer' }}
              >
                <span className="me-2">🔔</span>
                <span className="me-2">👤</span>
                <span className="fw-bold">Ana....</span>
                <span className="ms-1">▼</span>
              </div>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="p-3 border-bottom">
                    <div className="fw-bold">User name</div>
                    <div className="text-muted small">example@gmail.com</div>
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
      ></div>

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
            <a href="#agendar" className="sidebar-menu-item">Contrato</a>
            {/* Aquí va el link corregido */}
            <Link to="/survay" className="sidebar-menu-item">Encuestas</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default HeaderAdm;
