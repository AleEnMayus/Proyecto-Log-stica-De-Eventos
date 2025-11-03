import React, { useState, useEffect } from 'react';
import '../CSS/components.css';
import '../CSS/Home.css';
import '../../Views/CSS/HeaderSB.css';
import HeaderCl from '../../components/HeaderSidebar/HeaderCl';

// modal SOLO LECTURA
import ModalPromotionView from '../../components/Modals/PromotionModal/ModalPromotionView';

const HomeClient = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // Promociones reales
  const [promociones, setPromociones] = useState([]);

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

  // Cargar promociones reales desde el backend
  useEffect(() => {
    fetch("http://localhost:4000/api/promotions")
      .then(res => res.json())
      .then(data => setPromociones(data))
      .catch(err => console.error("Error cargando promociones:", err));
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* ====== HEADER CLIENTE ====== */}
      <HeaderCl user={user} onLogout={handleLogout} />

      <main className="container my-5 mt-5 pt-5">
        {/* ====== SECCIÓN BIENVENIDA ====== */}
        <section id="inicio" className="mb-5 mt-5">
          <h1 className="section-title display-4">
            Panel de Cliente - ¡Bienvenido {user?.fullName}!
          </h1>
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
                key={promo.PromotionId}
                className="col-lg-6 col-xl-3 mb-4"
                onClick={() => setSelectedPromo(promo)}
                style={{ cursor: 'pointer' }}
              >
                <div className="promo-card h-100">
                  <h5 className="text-primary fw-bold mb-3">{promo.TitleProm}</h5>

                  <p className="text-muted small mb-4" style={{ fontSize: '0.85rem' }}>
                    <strong>Descripción:</strong> {promo.DescriptionProm}
                  </p>

                  <div className="mt-auto">
                    <p className="fw-bold mb-0" style={{ color: 'rgb(255, 83, 121)' }}>
                      <strong>Valor: ${promo.Price}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Modal solo lectura */}
          {selectedPromo && (
            <ModalPromotionView
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
              <div className="mb-3"><strong>Teléfono:</strong> +57 3133409132</div>
              <div className="mb-3"><strong>Dirección:</strong> Calle 77 Sur N° 81H-20/Bogotá D.C-Colombia</div>
              <div><strong>Correo Electrónico:</strong> happy.art.eventos@gmail.com</div>
            </div>

            <div className="col-md-6 mt-5 mt-md-0">
              <h3 className="section-title h4">Redes Sociales</h3>
              <div className="mb-3"><strong>TikTok:</strong> @happy.art.eventos</div>
              <div className="mb-3"><strong>Instagram:</strong> @happy_art_eventos</div>
              <div className="mb-3"><strong>Facebook:</strong> Happy-Art-EVENTOS</div>
            </div>
          </div>
        </section>
      </main>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default HomeClient;
