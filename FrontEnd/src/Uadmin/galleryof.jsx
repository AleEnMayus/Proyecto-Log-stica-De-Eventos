import React, { useState, useRef } from 'react';
import './galleryof.css';

const EventGalleryManager = () => {
  const [images, setImages] = useState(Array(9).fill(null));
  const [selectedFiles, setSelectedFiles] = useState({});
  const fileInputRefs = useRef({});
    
  const handleImageUpload = (index, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = {
          id: Date.now() + index,
          url: e.target.result,
          file: file,
          name: file.name,
          size: file.size
        };
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(index, file);
    }
  };

  const triggerFileInput = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(index, imageFile);
    }
  };

  const saveGallery = () => {
    const imagesToSave = images.filter(img => img !== null);
    console.log('Guardando galería:', imagesToSave);
    alert(`Galería guardada con ${imagesToSave.length} imágenes`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
            📷 Gestionar Galería
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Sube, organiza y gestiona tus imágenes. Arrastra y suelta archivos o haz clic para seleccionarlos.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={saveGallery} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              💾 Guardar Galería
            </button>
            <button 
              onClick={() => setImages(Array(9).fill(null))} 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              🗑️ Limpiar Todo
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(index, e)}
            >
              {/* Hidden file input */}
              <input
                ref={(el) => fileInputRefs.current[index] = el}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(index, e)}
                className="hidden"
              />

              <div className="relative">
                {image ? (
                  // Image preview
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex gap-3">
                        <button
                          onClick={() => triggerFileInput(index)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors duration-200"
                          title="Cambiar imagen"
                        >
                          📤
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200"
                          title="Eliminar imagen"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    
                    {/* Image info badge */}
                    <div className="absolute top-3 left-3 bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {index + 1}
                    </div>
                  </div>
                ) : (
                  // Empty placeholder
                  <div
                    onClick={() => triggerFileInput(index)}
                    className="h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors duration-200 border-2 border-dashed border-slate-300 m-4 rounded-lg"
                  >
                    <div className="text-4xl mb-4">
                      🖼️
                    </div>
                    <p className="text-lg font-semibold text-slate-700 mb-2">Subir Imagen</p>
                    <p className="text-sm text-slate-500 text-center px-4">
                      Haz clic aquí o arrastra una imagen
                    </p>
                    <div className="absolute top-3 left-3 bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {index + 1}
                    </div>
                  </div>
                )}
              </div>

              {/* Image details */}
              {image && (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-800 truncate mb-2">
                    {image.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tamaño: {formatFileSize(image.size)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventGalleryManager;