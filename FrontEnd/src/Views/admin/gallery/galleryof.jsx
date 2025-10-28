import React, { useState } from 'react';
import "../../CSS/Gallery.css";
import HeaderAdm from '../../../components/HeaderSidebar/HeaderAdm';

const ManagerImageGallery = () => {
  const [images, setImages] = useState(Array(9).fill(null));

  // === SUBIR IMÁGENES ===
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

  // === ELIMINAR IMAGEN ===
  const handleDelete = (index) => {
    const updated = [...images];
    updated[index] = null;
    setImages(updated);
  };

  // === GUARDAR CAMBIOS ===
  const handleSave = () => {
    alert('Cambios guardados correctamente.');
  };

  // === CLICK EN BOTÓN DE SUBIR ===
  const triggerUpload = () => {
    document.getElementById('image-upload').click();
  };

  return (
    <div className="gallery-manager">
      <HeaderAdm />

      {/* ===== CABECERA ===== */}
      <div className="gallery-header">
        <h2 className="gallery-title">Gestionar Galería de Eventos</h2>

        {/* Input oculto */}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        

        {/* Botón subir imágenes */}
        <button className="btn-upload" onClick={triggerUpload}>
          <i className="bi bi-cloud-upload"></i> Subir imágenes
        </button>
      </div>

      {/* ===== GALERÍA ===== */}
      <div className="gallery-left">
        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div key={idx} className="image-card">
              {img ? (
                <img src={img} alt={`imagen-${idx}`} className="preview-image" />
              ) : (
                <img
                  src="https://via.placeholder.com/300x200?text=Sin+imagen"
                  alt="placeholder"
                  className="preview-image"
                />
              )}
              <button className="btn-delete" onClick={() => handleDelete(idx)}>×</button>
            </div>
          ))}
        </div>

        {/* Botón Guardar */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button className="add-comment-button" onClick={handleSave}>
            Guardar cambios
          </button>

        </div>
      </div>
    </div>
  );
};

export default ManagerImageGallery;

