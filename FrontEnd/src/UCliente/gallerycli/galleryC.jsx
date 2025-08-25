import React, { useState } from 'react';
import './galleryC.css';
import HeaderCl from "../components/HeaderCl";

const ImageGalleryC = () => {
  const [images, setImages] = useState(Array(9).fill(null));

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const updated = [...images];
    files.forEach((file) => {
      const slot = updated.findIndex(i => i === null);
      if (slot !== -1) {
        updated[slot] = URL.createObjectURL(file);
      }
    });
    setImages(updated);
  };

  

  const handleClearAll = () => {
    setImages(Array(9).fill(null));
  };

  const handlePreview = () => {
    const existingImages = images.filter(img => img !== null);
    if (existingImages.length > 0) {
      alert(`Tienes ${existingImages.length} imagen(es) cargadas.`);
    } else {
      alert('No hay imágenes cargadas.');
    }
  };

  const handleSave = () => {
    alert('Cambios guardados correctamente.');
  };

  return (
    <div className="gallery-manager">
      <div className="gallery-left">
        <h2 className="gallery-title">Gestionar Galeria de Eventos</h2>
        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div key={idx} className="image-card">
              {img ? (
                <img src={img} alt={`imagen-${idx}`} className="preview-image" />
              ) : (
                <img src="https://via.placeholder.com/64?text=🖼️" alt="placeholder" className="preview-image" />
              )}
              
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar">
        <label htmlFor="image-upload" className="btn btn-dark">⬆ Subir imagen</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden-input"
        />

        <button className="btn btn-dark" onClick={handleSave}>Guardar</button>
        <button className="btn btn-dark" onClick={handlePreview}>👁️ Previsualizar</button>
        <button className="btn btn-dark" onClick={handleClearAll}>🧹 Vaciar galería</button>
      </div>
    </div>
  );
};

export default ImageGalleryC;
