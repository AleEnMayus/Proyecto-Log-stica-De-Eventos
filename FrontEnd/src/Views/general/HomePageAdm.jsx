import React, { useState, useEffect } from 'react';
import '../CSS/components.css';
import '../CSS/Home.css';
import '../../Views/CSS/HeaderSB.css';
import HeaderAdm from '../../components/HeaderSidebar/HeaderAdm';
import PromotionModal from '../../components/Modals/ModalPromotion';

const HomeAdmin = ({ user, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [adminUser, setAdminUser] = useState(user || null);

  useEffect(() => {
    // Carga del usuario desde localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) setAdminUser(JSON.parse(storedUser));

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setAdminUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Funciones para el carrusel
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  // Imágenes de galería
  const images = [
    { id: 1, alt: "Evento 1" },
    { id: 2, alt: "Evento 2" },
    { id: 3, alt: "Evento 3" },
    { id: 4, alt: "Evento 4" },
    { id: 5, alt: "Evento 5" }
  ];

  // Promociones (de ejemplo)
  const promociones = [
    {
      id: 1,
      titulo: "PROMOCIÓN UNO",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet...",
      valor: "$1.000.000"
    },
    {
      id: 2,
      titulo: "PROMOCIÓN DOS",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet...",
      valor: "$1.000.000"
    },
    {
      id: 3,
      titulo: "PROMOCIÓN TRES",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet...",
      valor: "$1.000.000"
    },
    {
      id: 4,
      titulo: "PROMOCIÓN CUATRO",
      nombre: "Nombre Promoción",
      descripcion: "Lorem ipsum dolor sit amet...",
      valor: "$1.000.000"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <HeaderAdm user={adminUser} onLogout={onLogout} />

      <main className="container my-5 mt-5 pt-5">
        {/* ====== SECCIÓN INICIO ====== */}
        <section id="inicio" className="mb-5 mt-5">
          <h1 className="section-title display-4">
            Panel de Administrador - ¡Bienvenido {adminUser?.fullName || 'Administrador'}!
          </h1>
          <p className="lead text-muted mb-4">
            Desde aquí puedes gestionar usuarios, eventos y ver estadísticas completas del sistema.
          </p>
        </section>

        {/* ====== GALERÍA ====== */}
        <section id="galeria" className="mb-5">
          <h2 className="section-title h3">Galería de Eventos</h2>
          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image) => (
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
                      🖼
                    </div>
                    <p className="mt-3 mb-0">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
            <button className="carousel-btn next" onClick={nextSlide}>›</button>
          </div>
        </section>

        {/* ====== CITAS ====== */}
        <section id="citas" className="mb-5">
          <h2 className="section-title h3">Gestión de Citas</h2>
          <p className="text-muted mb-4">
            Como administrador, puedes ver y gestionar todas las citas registradas en el sistema.
          </p>
          <a
            href="/AdminCitas"
            className="btn-secondary-custom btn"
          >
            Gestionar Citas
          </a>
        </section>

        {/* ====== PROMOCIONES ====== */}
        <section id="promociones" className="mb-5">
          <h2 className="section-title h3">Administrar Promociones</h2>
          <p className="text-muted mb-4">
            Aquí puedes visualizar, modificar o eliminar promociones y paquetes del sistema.
          </p>

          <div className="row">
            {promociones.map((promo) => (
              <div
                key={promo.id}
                className="col-lg-6 col-xl-3 mb-4"
                onClick={() => setSelectedPromo(promo)}
                style={{ cursor: 'pointer' }}
              >
                <div className="promo-card h-100">
                  <h5 className="text-primary fw-bold mb-3">{promo.titulo}</h5>
                  <h6 className="mb-3">{promo.nombre}</h6>
                  <p
                    className="text-muted small mb-4"
                    style={{ fontSize: '0.85rem', lineHeight: '1.4' }}
                  >
                    <strong>Descripción:</strong> {promo.descripcion}
                  </p>
                  <div className="mt-auto">
                    <p
                      className="fw-bold mb-0"
                      style={{ color: 'rgb(255, 83, 121)' }}
                    >
                      <strong>Valor: {promo.valor}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de promoción */}
          {selectedPromo && (
            <PromotionModal
              promo={selectedPromo}
              onClose={() => setSelectedPromo(null)}
            />
          )}
        </section>

        {/* ====== CONTACTO ====== */}
        <section id="contacto" className="contact-section">
          <div className="row">
            <div className="col-md-6 mb-5 mb-md-0">
              <h3 className="section-title h4">Contacto</h3>
              <div className="mb-3"><strong>Teléfono:</strong> +57 312400579</div>
              <div className="mb-3"><strong>Dirección:</strong> Calle 67 A Sur N° 68-81</div>
              <div><strong>Correo Electrónico:</strong> dpspadgpg@gmail.com</div>
            </div>

            <div className="col-md-6 mt-5 mt-md-0">
              <h3 className="section-title h4">Redes Sociales</h3>
              <div className="mb-3"><strong>TikTok:</strong> Happy-Art-Events</div>
              <div className="mb-3"><strong>Youtube:</strong> Happy-Art-Events</div>
              <div><strong>Instagram:</strong> Happy-Art-Event</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeAdmin;
