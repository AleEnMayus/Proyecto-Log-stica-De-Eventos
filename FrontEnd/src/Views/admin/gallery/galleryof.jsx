import React, { useState } from 'react';
import './galleryof.css';
import HeaderAdm from '../../../components/HeaderSidebar/HeaderAdm';

const ManagerImageGallery = () => {
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

  const handleDelete = (index) => {
    const updated = [...images];
    updated[index] = null;
    setImages(updated);
  };

  const handleSave = () => {
    alert('Cambios guardados correctamente.');
  };

  return (
    <div className="gallery-manager">
      <HeaderAdm />

      {/* Galería de imágenes */}
      <div className="gallery-left">
        <br /><br /><br />
        <h2 className="gallery-title">Gestionar Galería de Eventos</h2>
        <br /><br /><br />

        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div key={idx} className="image-card">
              {img ? (
                <img src={img} alt={`imagen-${idx}`} className="preview-image" />
              ) : (
                <img
                  src="https://via.placeholder.com/64?text=🖼️"
                  alt="placeholder"
                  className="preview-image"
                />
              )}
              <button className="btn-delete" onClick={() => handleDelete(idx)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* Barra lateral con los botones */}
      <div className="sidebar">
        {/* Input real oculto para subir */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />

        {/* ✅ Botón Subir Imagen */}
        <button
          className="btn btn-dark"
          onClick={() => document.getElementById('image-upload').click()}
        >
          Subir Imagen
        </button>

        {/* ✅ Botón Guardar Cambios */}
        <button
          className="btn btn-dark"
          onClick={handleSave}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ManagerImageGallery;
