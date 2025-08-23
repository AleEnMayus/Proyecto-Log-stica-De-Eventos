import React, { useState } from 'react';
import './gallery2.css';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header simulado */}
      <div className="bg-white border-b border-purple-200 p-4">
        <h1 className="text-2xl font-bold text-purple-800">Galería de Imágenes - Admin</h1>
      </div>

      <div className="flex h-[90vh]">
        {/* Área principal de la galería */}
        <div className="flex-1 flex flex-col">
          {/* Contenedor de imagen con navegación */}
          <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
            <div className="w-[90%] h-[90%] p-5">
              <img
                src={images[currentImage].src}
                alt={images[currentImage].alt}
                className="w-full h-full object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
              
              {/* Botones de navegación */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-purple-300 rounded-xl p-3 shadow-md hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-2xl font-bold">‹</span>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border border-purple-300 rounded-xl p-3 shadow-md hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-2xl font-bold">›</span>
              </button>
            </div>
          </div>

          {/* Paginación */}
          <div className="flex justify-center p-4 bg-white border-t border-purple-200 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-9 h-9 rounded-lg border font-medium transition-all duration-200 ${
                  index === currentImage 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                    : 'bg-white text-cyan-600 border-purple-300 hover:bg-blue-50 hover:border-purple-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Panel lateral de comentarios */}
        <div className="w-80 bg-white border-l border-purple-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {images[currentImage].comments.map((comment, index) => (
              <div key={comment.id} className="bg-gradient-to-br from-blue-50 to-slate-50 border border-purple-300 rounded-xl p-4 mb-4 hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="text-sm font-semibold text-purple-600 mb-2">
                  Comentario {index + 1}
                </div>
                <div className="text-sm text-purple-800 leading-relaxed">
                  {comment.text}
                </div>
              </div>
            ))}
            
            {images[currentImage].comments.length === 0 && (
              <div className="text-center text-gray-500 py-8 italic">
                No hay comentarios para esta imagen
              </div>
            )}
          </div>

          {/* Área para añadir comentario */}
          <div className="border-t border-purple-200 bg-blue-50">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center py-3 text-sm font-semibold uppercase tracking-wide">
              Añadir Comentario
            </div>
            <div className="p-4 bg-white border-l border-r border-purple-200">
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg text-sm font-semibold uppercase tracking-wide hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
                onClick={openCommentModal}
              >
                <span className="text-base">+</span>
                Añadir Comentario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Selección Comentarios Públicos */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-5 relative">
              <h3 className="text-lg font-semibold text-center tracking-wide">
                Selección Comentarios Públicos
              </h3>
              <button 
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors"
                onClick={closeCommentModal}
              >
                ×
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {currentModalComments.map((comment) => (
                <div 
                  key={comment.id} 
                  className={`bg-gradient-to-br from-blue-50 to-slate-50 border rounded-lg p-4 mb-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                    selectedComments.includes(comment.id) 
                      ? 'border-purple-600 bg-purple-50/50 shadow-purple-200 shadow-sm' 
                      : 'border-purple-300 hover:border-purple-600'
                  }`}
                  onClick={() => toggleCommentSelection(comment.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-purple-600">
                      Comentario {comment.number}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        className="bg-white border border-purple-300 text-cyan-600 px-2 py-1 rounded text-xs hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishComment(comment.id);
                        }}
                      >
                        Publicar
                      </button>
                      <button 
                        className="bg-white border border-purple-300 text-cyan-600 px-2 py-1 rounded text-xs hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectComment(comment.id);
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-purple-800 leading-relaxed text-justify">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer del Modal */}
            <div className="border-t border-purple-200 p-4 bg-blue-50 flex justify-between items-center">
              <div className="flex gap-1">
                {Array.from({ length: totalModalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentModalPage(i + 1)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-all ${
                      currentModalPage === i + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-cyan-600 border border-purple-300 hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button 
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-amber-500/30"
                onClick={submitComment}
              >
                Añadir Comentario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}