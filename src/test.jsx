import React, { useState } from 'react';
import './components/components.css';

const TEST = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos del carrusel
  const images = [
    { id: 1, alt: "Evento 1" },
    { id: 2, alt: "Evento 2" },
    { id: 3, alt: "Evento 3" },
    { id: 4, alt: "Evento 4" },
    { id: 5, alt: "Evento 5" }
  ];

  // Promociones
  const promociones = [
    {
      id: 1,
      titulo: "PROMOCION UNO",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      valor: "$1.000.000"
    },
    {
      id: 2,
      titulo: "PROMOCION DOS",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      valor: "$1.000.000"
    },
    {
      id: 3,
      titulo: "PROMOCION TRES",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      valor: "$1.000.000"
    },
    {
      id: 4,
      titulo: "PROMOCION CUATRO",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      valor: "$1.000.000"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>

      {/* Main Content */}
      <main className="container my-5 mt-5 pt-5">
        {/* Hero Section */}
        <section id="inicio" className="mb-5">
          <h1 className="section-title display-4">
            Happy Art Event
          </h1>
          <p className="lead text-muted mb-4">
            Información general de la empresa, donde se especifica sus funciones, sus propósitos y objetivos generales.
          </p>
        </section>

        {/* Galería de Eventos */}
        <section id="galeria" className="mb-5">
          <h2 className="section-title h3">Galería De Eventos</h2>
          <div className="carousel-container">
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={image.id} className="carousel-slide">
                  <div className="text-center">
                    <div 
                      style={{ 
                        width: '200px', 
                        height: '150px', 
                        background: '#dee2e6',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}
                    >
                      🖼️
                    </div>
                    <p className="mt-3 mb-0">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="carousel-btn prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="carousel-btn next" onClick={nextSlide}>
              ›
            </button>
          </div>
        </section>

        {/* Agendamiento de Citas */}
        <section id="eventos" className="mb-5">
          <h2 className="section-title h3">Agendamiento De Citas</h2>
          <p className="text-muted mb-4">
            Especificación de espacio donde se podrá asignar una cita para el evento que desee el usuario.
          </p>
          <button className="btn-secondary-custom btn">
            Agendar Cita
          </button>
        </section>

        {/* Promociones */}
        <section id="promociones" className="mb-5">
          <h2 className="section-title h3">Paquetes De Promociones</h2>
          <p className="text-muted mb-4">
            Información general de la empresa, donde se especifica sus funciones, sus propósitos y objetivos generales.
          </p>
          
          <div className="row">
            {promociones.map((promo) => (
              <div key={promo.id} className="col-lg-6 col-xl-3 mb-4">
                <div className="promo-card h-100">
                  <h5 className="text-primary fw-bold mb-3">{promo.titulo}</h5>
                  <h6 className="mb-3">{promo.nombre}</h6>
                  <p className="text-muted small mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <strong>Descripción:</strong> {promo.descripcion}
                  </p>
                  <div className="mt-auto">
                    <p className="fw-bold mb-0" style={{ color: 'rgb(255, 83, 121)' }}>
                      <strong>Valor: {promo.valor}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contacto y Redes Sociales */}
        <section id="contacto" className="contact-section">
          <div className="row">
            <div className="col-md-6 mb-5 mb-md-0">
              <h3 className="section-title h4 ">Contacto</h3>
              <div className="mb-3">
                <strong>Teléfono:</strong> +57 312400579
              </div>
              <div className="mb-3">
                <strong>Dirección:</strong> Calle 67 A Sur N° 68-81
              </div>
              <div>
                <strong>Correo Electrónico:</strong> dpspadgpg@gmail.com
              </div>
            </div>
            <div className="col-md-6 mt-5 mt-md-0">
              <h3 className="section-title h4 ">Redes Sociales</h3>
              <div className="mb-3">
                <strong>Facebook:</strong> Happy-Art-Event
              </div>
              <div className="mb-3">
                <strong>Youtube:</strong> Happy-Art-Event
              </div>
              <div>
                <strong>Instagram:</strong> Happy-Art-Event
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default TEST;