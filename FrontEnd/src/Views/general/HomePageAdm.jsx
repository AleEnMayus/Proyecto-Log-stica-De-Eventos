import React, { useState, useEffect } from 'react';
import '../CSS/components.css';
import '../CSS/Home.css';
import '../../Views/CSS/HeaderSB.css';
import HeaderAdm from '../../components/HeaderSidebar/HeaderAdm';
import PromotionModal from '../../components/Modals/PromotionModal/EditPromotion';
import ModalPromotionCreate from '../../components/Modals/PromotionModal/CreatePromotion';

const HomeAdmin = ({ user, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [creating, setCreating] = useState(false); 
  const [adminUser, setAdminUser] = useState(user || null);
  const [promociones, setPromociones] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setAdminUser(JSON.parse(storedUser));

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setAdminUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cargar galería de imágenes
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

  // Cargar promociones
  const loadPromotions = () => {
    fetch("http://localhost:4000/api/promotions")
      .then(res => res.json())
      .then(data => setPromociones(data))
      .catch(err => console.error("Error cargando promociones:", err));
  };

  useEffect(() => {
    loadPromotions();
    loadGallery();
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <HeaderAdm user={adminUser} onLogout={onLogout} />

      <main className="container my-5 mt-5 pt-5">
        
        {/* INICIO */}
        <section id="inicio" className="mb-5 mt-5">
          <h1 className="section-title display-4">
            Panel de Administrador - ¡Bienvenido {adminUser?.fullName || 'Administrador'}!
          </h1>
          <p className="lead text-muted mb-4">
            Desde aquí puedes gestionar usuarios, eventos y ver estadísticas completas del sistema.
          </p>
        </section>

        {/* GALERÍA */}
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

        {/* CITAS */}
        <section id="citas" className="mb-5">
          <h2 className="section-title h3">Gestión de Eventos</h2>
          <p className="text-muted mb-4">
            Como administrador, puedes ver y gestionar todas los eventos registrados en el sistema.
          </p>
          <a href="/EventsHomeAdmin" className="btn-secondary-custom btn">
            Gestionar Eventos
          </a>
        </section>

        {/* PROMOCIONES */}
        <section id="promociones" className="mb-5">
          <h2 className="section-title h3">Administrar Promociones</h2>
          <p className="text-muted mb-4">
            Aquí puedes visualizar, modificar o eliminar promociones y paquetes del sistema.
          </p>

          {promociones.length < 4 && (
            <div className="text-end mb-3">
              <button
                className="btn-primary-custom btn"
                onClick={() => setCreating(true)}
              >
                + Crear Promoción
              </button>
            </div>
          )}

          <div className="row">
            {promociones.map((promo) => (
              <div
                key={promo.PromotionId}
                className="col-lg-6 col-xl-3 mb-4"
                onClick={() => setSelectedPromo(promo)}
                style={{ cursor: 'pointer' }}
              >
                <div className="promo-card h-100">
                  <h5 className="text-primary fw-bold mb-3">
                    {promo.TitleProm}
                  </h5>
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

          {selectedPromo && (
            <PromotionModal
              promo={selectedPromo}
              onClose={() => setSelectedPromo(null)}
              refreshPromos={loadPromotions}
            />
          )}

          {creating && (
            <ModalPromotionCreate
              onClose={() => setCreating(false)}
              refreshPromos={loadPromotions}
            />
          )}
        </section>

        {/* CONTACTO */}
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
    </div>
  );
};

export default HomeAdmin;