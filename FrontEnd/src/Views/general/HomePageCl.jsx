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
  const [promociones, setPromociones] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

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

  // Cargar galería de imágenes
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoadingGallery(true);
        // Primero obtenemos una imagen para saber cuántas hay en total
        const response = await fetch("http://localhost:4000/api/gallery/1");
        const data = await response.json();
        
        if (data && data.navigation) {
          const totalImages = data.navigation.totalImages;
          const imagesToLoad = Math.min(totalImages, 5); // Máximo 5 imágenes
          
          // Cargar todas las imágenes necesarias
          const imagePromises = [];
          for (let i = 1; i <= imagesToLoad; i++) {
            imagePromises.push(
              fetch(`http://localhost:4000/api/gallery/${i}`)
                .then(res => res.json())
                .catch(err => null)
            );
          }
          
          const images = await Promise.all(imagePromises);
          const validImages = images.filter(img => img && img.url);
          setGalleryImages(validImages);
        }
      } catch (err) {
        console.error("Error cargando galería:", err);
        setGalleryImages([]);
      } finally {
        setLoadingGallery(false);
      }
    };

    loadGallery();
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

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
          
          {loadingGallery ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="carousel-container">
              <div
                className="carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {galleryImages.map((image, index) => (
                  <div key={image.FileId} className="carousel-slide">
                      <img
                        src={image.url}
                        alt={image.FileName}
                        style={{
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          margin: '0 auto',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                  </div>
                ))}
              </div>

              {galleryImages.length > 1 && (
                <>
                  <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
                  <button className="carousel-btn next" onClick={nextSlide}>›</button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <p>No hay imágenes en la galería</p>
            </div>
          )}
        </section>

        {/* ====== CITAS ====== */}
        <section id="eventos" className="mb-5">
          <h2 className="section-title h3">Agendamiento de Citas</h2>
          <p className="text-muted mb-4">
            Como usuario registrado, puedes agendar tus citas fácilmente para organizar eventos únicos.
          </p>
          <a href="/Schedule" className="btn-secondary-custom btn w-200p">
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

                  <p className="promo-description">
                    {promo.DescriptionProm}
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

          {/* Modal solo lectura */}
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