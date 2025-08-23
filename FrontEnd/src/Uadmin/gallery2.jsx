import React, { useState } from 'react';
import './gallery.css';
import HeaderAdm from '../components/HeaderAdm';



export default function ImageGallery() { 
  const [currentImage, setCurrentImage] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentModalPage, setCurrentModalPage] = useState(1);
  const [selectedComments, setSelectedComments] = useState([]);

  // Datos de ejemplo para la galería
  const images = [
    {
      id: 1,
      src: "https://picsum.photos/800/600?random=1",
      alt: "Imagen 1",
      comments: [
        {
          id: 1,
          author: "Usuario 1",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
          id: 2,
          author: "Usuario 2", 
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
      ]
    },
    {
      id: 2,
      src: "https://picsum.photos/800/600?random=2",
      alt: "Imagen 2",
      comments: [
        {
          id: 3,
          author: "Usuario 3",
          text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
        }
      ]
    },
    {
      id: 3,
      src: "https://picsum.photos/800/600?random=3",
      alt: "Imagen 3",
      comments: [
        {
          id: 4,
          author: "Usuario 4",
          text: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio."
        }
      ]
    },
    {
      id: 4,
      src: "https://picsum.photos/800/600?random=4",
      alt: "Imagen 4",
      comments: [
        {
          id: 5,
          author: "Usuario 5",
          text: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet."
        }
      ]
    },
    {
      id: 5,
      src: "https://picsum.photos/800/600?random=5",
      alt: "Imagen 5",
      comments: [
        {
          id: 6,
          author: "Usuario 6",
          text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
        }
      ]
    },
    {
      id: 6,
      src: "https://picsum.photos/800/600?random=6",
      alt: "Imagen 6",
      comments: [
        {
          id: 7,
          author: "Usuario 7",
          text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam."
        }
      ]
    }
  ];

  // Comentarios públicos de ejemplo para el modal
  const publicComments = [
    {
      id: 1,
      number: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
      status: 'pending'
    },
    {
      id: 2,
      number: 2,
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
      status: 'pending'
    },
    {
      id: 3,
      number: 3,
      text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
      status: 'pending'
    },
    {
      id: 4,
      number: 4,
      text: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.",
      status: 'pending'
    }
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  const openCommentModal = () => {
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setNewComment('');
    setSelectedComments([]);
    setCurrentModalPage(1);
  };

  const submitComment = () => {
    if (newComment.trim()) {
      console.log('Nuevo comentario:', newComment);
      closeCommentModal();
    }
  };

  const toggleCommentSelection = (commentId) => {
    setSelectedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handlePublishComment = (commentId) => {
    console.log('Publicar comentario:', commentId);
  };

  const handleRejectComment = (commentId) => {
    console.log('Rechazar comentario:', commentId);
  };

  const totalModalPages = Math.ceil(publicComments.length / 3);
  const currentModalComments = publicComments.slice(
    (currentModalPage - 1) * 3,
    currentModalPage * 3
  );

  return (
    <>
      <div className="app-container vh'90">
        {/* Header */}
        <HeaderAdm />

        <div className="gallery-container d-flex" style={{ height: '90vh' }}>
          {/* Área principal de la galería */}
          <div className="main-area flex-grow-1 d-flex flex-column">
            {/* Contenedor de imagen con navegación */}
            <div className="image-container flex-grow-1 position-relative d-flex align-items-center justify-content-center">
              <div className="image-wrapper w-90 h-90 p-4">
                <img
                  src={images[currentImage].src}
                  alt={images[currentImage].alt}
                  className="main-image w-100 h-100 rounded-3 shadow-lg"
                  style={{ objectFit: 'cover' }}
                />
                
                {/* Botones de navegación */}
                <button
                  onClick={prevImage}
                  className="nav-button nav-prev btn btn-light position-absolute top-50 translate-middle-y shadow rounded-3"
                  style={{ left: '16px', zIndex: 10 }}
                >
                  <span className="fs-3 fw-bold">‹</span>
                </button>
                
                <button
                  onClick={nextImage}
                  className="nav-button nav-next btn btn-light position-absolute top-50 translate-middle-y shadow rounded-3"
                  style={{ right: '16px', zIndex: 10 }}
                >
                  <span className="fs-3 fw-bold">›</span>
                </button>
              </div>
            </div>

            {/* Paginación */}
            <div className="pagination d-flex justify-content-center p-3 bg-white border-top gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`page-button btn ${index === currentImage 
                    ? 'btn-primary' 
                    : 'btn-outline-primary'
                  } rounded-2`}
                  style={{ width: '36px', height: '36px' }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Panel lateral de comentarios */}
          <div className="comments-panel bg-white border-start d-flex flex-column" style={{ width: '320px' }}>
            <div className="comments-list flex-grow-1 overflow-auto p-3">
              {images[currentImage].comments.map((comment, index) => (
                <div key={comment.id} className="comment-item card mb-3 border-primary-subtle shadow-sm">
                  <div className="card-body">
                    <div className="comment-user fw-semibold text-primary mb-2" style={{ fontSize: '14px' }}>
                      Comentario {index + 1}
                    </div>
                    <div className="comment-text text-dark" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      {comment.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {images[currentImage].comments.length === 0 && (
                <div className="no-comments text-center text-muted py-4 fst-italic">
                  No hay comentarios para esta imagen
                </div>
              )}
            </div>

            {/* Área para añadir comentario */}
            <div className="add-comment-section border-top">
              <div className="add-comment-header bg-primary text-white text-center py-2 fw-semibold text-uppercase" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
                Añadir Comentario
              </div>
              <div className="add-comment-body p-3 bg-light">
                <button 
                  className="add-comment-button btn btn-primary w-100 fw-semibold text-uppercase d-flex align-items-center justify-content-center gap-2"
                  onClick={openCommentModal}
                  style={{ letterSpacing: '0.5px' }}
                >
                  <span className="fs-5">+</span>
                  Añadir Comentario
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Selección Comentarios Públicos */}
        {showCommentModal && (
          <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
            <div className="modal-content bg-white rounded-3 shadow-lg" style={{ width: '90%', maxWidth: '768px', maxHeight: '80vh' }}>
              {/* Header del Modal */}
              <div className="modal-header bg-primary text-white p-3 position-relative rounded-top">
                <h3 className="modal-title text-center fw-semibold mb-0" style={{ fontSize: '18px', letterSpacing: '0.5px' }}>
                  Selección Comentarios Públicos
                </h3>
                <button 
                  className="modal-close btn btn-sm position-absolute top-50 translate-middle-y bg-white bg-opacity-25 border-0 rounded-circle text-white"
                  style={{ right: '16px', width: '32px', height: '32px' }}
                  onClick={closeCommentModal}
                >
                  <span className="fs-5">×</span>
                </button>
              </div>

              {/* Cuerpo del Modal */}
              <div className="modal-body p-4 overflow-auto" style={{ maxHeight: '384px' }}>
                {currentModalComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`modal-comment card mb-3 cursor-pointer ${selectedComments.includes(comment.id) 
                      ? 'border-primary bg-primary bg-opacity-10' 
                      : 'border-secondary-subtle'
                    }`}
                    onClick={() => toggleCommentSelection(comment.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body p-3">
                      <div className="modal-comment-header d-flex justify-content-between align-items-center mb-2">
                        <span className="modal-comment-number fw-semibold text-primary" style={{ fontSize: '14px' }}>
                          Comentario {comment.number}
                        </span>
                        <div className="modal-comment-actions d-flex gap-2">
                          <button 
                            className="modal-action-btn btn btn-sm btn-outline-info"
                            style={{ fontSize: '12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishComment(comment.id);
                            }}
                          >
                            Publicar
                          </button>
                          <button 
                            className="modal-action-btn btn btn-sm btn-outline-info"
                            style={{ fontSize: '12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectComment(comment.id);
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                      <p className="modal-comment-text mb-0 text-dark" style={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'justify' }}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer del Modal */}
              <div className="modal-footer border-top p-3 bg-light d-flex justify-content-between align-items-center">
                <div className="modal-pagination d-flex gap-1">
                  {Array.from({ length: totalModalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentModalPage(i + 1)}
                      className={`modal-page-btn btn btn-sm ${currentModalPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                      style={{ width: '28px', height: '28px', fontSize: '12px' }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="modal-submit-btn btn btn-warning fw-semibold"
                  onClick={submitComment}
                >
                  Añadir Comentario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}