import React, { useState } from 'react';
import './galleryC2.css';
import HeaderAdm from '../components/HeaderAdm';

const ImageGalleryViewerC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [newComment, setNewComment] = useState('');

  // Datos de ejemplo
  const images = [
    { id: 1, src: 'https://picsum.photos/400/300?random=1', alt: 'Imagen 1' },
    { id: 2, src: 'https://picsum.photos/400/300?random=2', alt: 'Imagen 2' },
    { id: 3, src: 'https://picsum.photos/400/300?random=3', alt: 'Imagen 3' },
    { id: 4, src: 'https://picsum.photos/400/300?random=4', alt: 'Imagen 4' },
    { id: 5, src: 'https://picsum.photos/400/300?random=5', alt: 'Imagen 5' },
    { id: 6, src: 'https://picsum.photos/400/300?random=6', alt: 'Imagen 6' },
  ];

  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Comentario 1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      imageId: 1
    },
    {
      id: 2,
      user: 'Comentario 2', 
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      imageId: 1
    }
  ]);

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePageClick = (pageIndex) => {
    setCurrentImage(pageIndex);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: 'Comentario ${comments.length + 1}',
        text: newComment,
        imageId: images[currentImage].id
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  };

  const currentImageComments = comments.filter(comment => comment.imageId === images[currentImage].id);

  return (
    <div>
      <HeaderAdm />
      <div className="gallery-container" style={{ marginTop: '80px' }}>
        {/* Área principal de imagen */}
        <div className="main-area">
          {/* Imagen con controles de navegación */}
          <div className="image-container">
            {/* Botón anterior */}
            <button
              onClick={handlePrevImage}
              className="nav-button prev"
            >
              <span className="nav-icon">‹</span>
            </button>

            {/* Imagen central */}
            <div className="image-wrapper">
              {images[currentImage] ? (
                <img
                  src={images[currentImage].src}
                  alt={images[currentImage].alt}
                  className="main-image"
                />
              ) : (
                <div className="placeholder-image">
                  <span className="placeholder-icon">👤</span>
                </div>
              )}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={handleNextImage}
              className="nav-button next"
            >
              <span className="nav-icon">›</span>
            </button>
          </div>

          {/* Paginación */}
          <div className="pagination">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index)}
                className={`page-button ${currentImage === index ? 'active' : 'inactive'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Panel de comentarios */}
        <div className="comments-panel">
          {/* Lista de comentarios */}
          <div className="comments-list">
            {currentImageComments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-user">
                  {comment.user}
                </div>
                <div className="comment-text">
                  {comment.text}
                </div>
              </div>
            ))}
            
            {currentImageComments.length === 0 && (
              <div className="no-comments">
                No hay comentarios para esta imagen
              </div>
            )}
          </div>

          {/* Área para añadir comentario */}
          <div className="add-comment-area">
            <div className="add-comment-header">
              Añadir Comentario
            </div>
            <div className="add-comment-body">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu comentario aquí... (Ctrl+Enter para enviar)"
                className="comment-textarea"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="add-comment-button"
                style={{
                  backgroundColor: newComment.trim() ? '#4b5563' : '#9ca3af',
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                <span className="add-icon">+</span>
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryViewerC;