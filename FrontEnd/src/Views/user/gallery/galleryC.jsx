import React, { useState } from "react";
import HeaderCl from "../../../components/HeaderSidebar/HeaderCl";
import { useNavigate } from "react-router-dom"; 
import "../../CSS/Gallery.css";

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

  const [isEditing, setIsEditing] = useState(false);

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

  const handleImageClick = (idx) => {
    navigate("/galleryview", { state: { selectedImage: images[idx] } });
  };

  return (
    <div className="gallery-manager" style={{ paddingTop: '120px' }}>
      <HeaderCl />

      <div className="gallery-left">
        <div className="gallery-header">
          <h2 className="page-title">GALERÍA DE EVENTOS</h2>
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
                  src="https://via.placeholder.com/150?text=🖼️"
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
