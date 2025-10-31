import React, { useState, useEffect } from 'react';
import '../CSS/components.css';
import '../CSS/Home.css';
import '../../Views/CSS/HeaderSB.css';
import HeaderCl from '../../components/HeaderSidebar/HeaderCl';
import PromotionModal from '../../components/Modals/ModalPromotion';

const HomeClient = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // === Cargar usuario desde localStorage ===
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // === Login y Logout ===
  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // === Carrusel ===
  const images = [
    { id: 1, alt: "Evento 1" },
    { id: 2, alt: "Evento 2" },
    { id: 3, alt: "Evento 3" },
    { id: 4, alt: "Evento 4" },
    { id: 5, alt: "Evento 5" }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  // === Promociones ===
  const promociones = [
    { id: 1, titulo: "PROMOCIÓN UNO", nombre: "Fiesta Premium", descripcion: "Paquete con decoración, catering y animación infantil.", valor: "$1.000.000" },
    { id: 2, titulo: "PROMOCIÓN DOS", nombre: "Evento Corporativo", descripcion: "Ideal para reuniones empresariales y cenas ejecutivas.", valor: "$1.500.000" },
    { id: 3, titulo: "PROMOCIÓN TRES", nombre: "Cumpleaños Sorpresa", descripcion: "Organizamos tu sorpresa completa con detalles personalizados.", valor: "$900.000" },
    { id: 4, titulo: "PROMOCIÓN CUATRO", nombre: "Boda de Ensueño", descripcion: "Incluye planificación total, música, decoración y fotografía.", valor: "$2.500.000" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* ====== HEADER CLIENTE ====== */}
      <HeaderCl user={user} onLogout={handleLogout} />

      <main className="container my-5 mt-5 pt-5">
        {/* ====== SECCIÓN BIENVENIDA ====== */}
        <section id="inicio" className="mb-5 mt-5">
          <h1 className="section-title display-4">Panel de Cliente - ¡Bienvenido {user?.fullName }!</h1>
          <p className="lead text-muted mb-4">
            Ahora puedes agendar citas, ver tus eventos y acceder a promociones exclusivas.
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
        <section id="eventos" className="mb-5">
          <h2 className="section-title h3">Agendamiento de Citas</h2>
          <p className="text-muted mb-4">
            Como usuario registrado, puedes agendar tus citas fácilmente para organizar eventos únicos.
          </p>
          <a href="/Schedule" className="btn-secondary-custom btn">
            Agendar Nueva Cita
          </a>
        </section>

        {/* ====== PROMOCIONES ====== */}
        <section id="promociones" className="mb-5">
          <h2 className="section-title h3">Paquetes de Promociones</h2>
          <p className="text-muted mb-4">
            Descubre nuestros paquetes especiales diseñados para todo tipo de eventos.
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
                    <p className="fw-bold mb-0" style={{ color: 'rgb(255, 83, 121)' }}>
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

      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default HomeClient;
