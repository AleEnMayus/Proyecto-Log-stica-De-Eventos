import React, { useState, useEffect } from 'react';
import '../CSS/components.css';
import '../CSS/Home.css';
import '../../Views/CSS/HeaderSB.css';
import HeaderSidebar from '../../components/HeaderSidebar/HeaderSidebar';

// Modal SOLO LECTURA para guest
import ModalPromotionView from '../../components/Modals/PromotionModal/ModalPromotionView';

const HomeGuest = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promociones, setPromociones] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // ============================
  // Cargar promociones reales
  // ============================
  const loadPromotions = () => {
    fetch("http://localhost:4000/api/promotions")
      .then(res => res.json())
      .then(data => setPromociones(data))
      .catch(err => console.error("Error cargando promociones:", err));
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // ============================
  // Cargar galería de imágenes
  // ============================
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoadingGallery(true);
        const response = await fetch("http://localhost:4000/api/gallery/1");
        const data = await response.json();
        
        if (data && data.navigation) {
          const totalImages = data.navigation.totalImages;
          const imagesToLoad = Math.min(totalImages, 5);
          
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <HeaderSidebar />

      <main className="container my-5 mt-5 pt-5">

        {/* ===============================
            SECCIÓN INICIO
        =============================== */}
        <section id="inicio" className="mb-5 mt-5">
          <h1 className="section-title display-4">Happy-Art-Events</h1>
          <p className="lead text-muted mb-4">
            Nuestra empresa transforma la forma de organizar eventos a través de una plataforma moderna y segura que permite explorar nuestra galería, conocer paquetes de servicios, registrarse fácilmente, gestionar eventos, descargar contratos, agendar citas y recibir notificaciones automáticas.
          </p>
        </section>

        {/* ===============================
            GALERÍA
        =============================== */}
        <section id="galeria" className="mb-5">
          <h2 className="section-title h3">Galería De Eventos</h2>
          
          {loadingGallery ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="carousel-container">
              <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
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

        {/* ===============================
            CITAS
        =============================== */}
        <section id="eventos" className="mb-5">
          <h2 className="section-title h3">Agendamiento De Citas</h2>
          <p className="text-muted mb-4">
            Especificación de espacio donde se podrá asignar una cita para el evento que desee el usuario.
          </p>
          <a href="/login" className="btn-secondary-custom btn w-200p">
            Agendar Cita
          </a>
        </section>

        {/* ===============================
            PROMOCIONES (solo lectura)
        =============================== */}
        <section id="promociones" className="mb-5">
          <h2 className="section-title h3">Paquetes De Promociones</h2>
          <p className="text-muted mb-4">Información general de la empresa.</p>

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

                  {/* DESCRIPCIÓN CON LÍMITE DE 3 LÍNEAS */}
                  <p className="promo-description">
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

          {/*  Modal SOLO LECTURA */}
          {selectedPromo && (
            <ModalPromotionView
              promo={selectedPromo}
              onClose={() => setSelectedPromo(null)}
            />
          )}
        </section>

        {/* ===============================
            CONTACTO
        =============================== */}
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

export default HomeGuest;