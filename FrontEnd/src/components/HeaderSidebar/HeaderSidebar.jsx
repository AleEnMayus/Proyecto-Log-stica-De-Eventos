import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Views/CSS/components.css';

const HeaderSidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky-top header-container">
        <div className="container d-flex justify-content-between align-items-center py-3">
          
          {/* Logo + menú */}
          <div className="d-flex align-items-center">
            <button className="menu-btn me-3" onClick={toggleMenu}>
              ☰
            </button>
            <a href="/" className="navbar-brand d-flex align-items-center">
              <img src="/HAE_logo.png" className="img-50" alt="Logo" />
              <div className="logo-text ms-2">Happy-Art-Events</div>
            </a>
          </div>

          {/* Botones de acción */}
          <div className="d-flex align-items-center gap-2">
            <a 
              href="/Register" 
              className="btn btn-outline-primary register-btn"
            >
              Registrarse
            </a>
            <Link 
              to="/login" 
              className="btn btn-primary-custom"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Fondo oscuro cuando el menú está abierto */}
      <div
        className={`sidebar-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="p-4 mt-5 pt-5">
          <nav className="mt-5">
            {/* Ahora sí sube hasta arriba */}
            <button
              className="sidebar-menu-item border-0 bg-transparent w-100 text-start"
              onClick={() => {
                scrollToTop();
                toggleMenu();
              }}
            >
              Inicio
            </button>

            <a href="/login" className="sidebar-menu-item">Agendar Cita</a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default HeaderSidebar;
