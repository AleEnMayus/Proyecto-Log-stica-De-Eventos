import React, { useState } from "react";
import HeaderCl from "../../../components/HeaderSidebar/HeaderCl";
import "../gallery/gallery1.css";
import { useNavigate } from "react-router-dom"; 

const ImageGalleryC = () => {
  const navigate = useNavigate(); 

  const [images, setImages] = useState([
    "https://sl.bing.net/gwWxcrN32s0",
    "https://source.unsplash.com/random/400x300?party",
    "https://source.unsplash.com/random/400x300?concert",
    "https://source.unsplash.com/random/400x300?festival",
    "https://source.unsplash.com/random/400x300?meeting",
    "https://source.unsplash.com/random/400x300?people",
    "https://source.unsplash.com/random/400x300?celebration",
    "https://source.unsplash.com/random/400x300?gathering",
    "https://source.unsplash.com/random/400x300?music"
  ]);
  
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const updated = [...images];
    files.forEach((file) => {
      const slot = updated.findIndex((i) => i === null);
      if (slot !== -1) {
        updated[slot] = URL.createObjectURL(file);
      }
    });
    setImages(updated);
  };

  const handleClearAll = () => {
    setImages(Array(9).fill(null));
  };

  //  Redirigir al hacer clic en una imagen
  const handleImageClick = (idx) => { 
    navigate("/GalleryViewAdmin", { state: { selectedImage: images[idx] } });
  };

  // Redirigir al apartado de edición
  const goToEditGallery = () => {
    navigate("/GalleryAdmin"); // asegúrate que esta ruta exista en tus <Routes>
  };

  return (
    <div className="gallery-manager">
      <HeaderCl />

      <div className="gallery-left">
        <div className="gallery-header">
          <br /><br /><br /><br />
          <h2 className="gallery-title">Galería de Eventos</h2>

          {/* Botón que lleva al otro apartado */}
          <button className="btn btn-dark" onClick={goToEditGallery}>
            Editar Galería
          </button>
        </div>

        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="image-card"
              onClick={() => handleImageClick(idx)}
              style={{ cursor: "pointer" }}
            >
              {img ? (
                <img
                  src={img}
                  alt={`imagen-${idx}`}
                  className="preview-image"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/150?text="
                  alt="placeholder"
                  className="preview-image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryC;
