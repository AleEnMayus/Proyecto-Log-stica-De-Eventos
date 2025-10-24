import React, { useState } from "react";
import "../../CSS/Gallery.css";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";

export default function ImageGallery() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentModalPage, setCurrentModalPage] = useState(1);
  const [selectedComments, setSelectedComments] = useState([]);

  const images = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/800/600?random=${i + 1}`,
    alt: `Imagen ${i + 1}`,
    comments: [
      {
        id: i + 1,
        author: `Usuario ${i + 1}`,
        text: "Lorem ipsum dolor sit amet consectetur adipiscing elit."
      }
    ]
  }));

  const publicComments = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    text: "Texto de comentario público de ejemplo.",
    status: "pending"
  }));

  const nextImage = () => setCurrentImage((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImage((i) => (i - 1 + images.length) % images.length);
  const goToImage = (i) => setCurrentImage(i);
  const openCommentModal = () => setShowCommentModal(true);
  const closeCommentModal = () => {
    setShowCommentModal(false);
    setNewComment("");
    setSelectedComments([]);
    setCurrentModalPage(1);
  };
  const submitComment = () => newComment.trim() && (console.log("Nuevo comentario:", newComment), closeCommentModal());
  const toggleCommentSelection = (id) =>
    setSelectedComments((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const handlePublishComment = (id) => console.log("Publicar:", id);
  const handleRejectComment = (id) => console.log("Rechazar:", id);

  const totalModalPages = Math.ceil(publicComments.length / 3);
  const currentModalComments = publicComments.slice((currentModalPage - 1) * 3, currentModalPage * 3);

  return (
    <div className="app-container vh-90">
      <HeaderAdm />
      <br />
      <br />
      <br />
      <div className="gallery-container d-flex" style={{ height: "90vh" }}>
        {/* Imagen principal */}
        <div className="main-area flex-grow-1 d-flex flex-column">
          <div className="image-container flex-grow-1 position-relative d-flex align-items-center justify-content-center">
            <div className="image-wrapper w-90 h-90 p-4">
              <img src={images[currentImage].src} alt={images[currentImage].alt} className="main-image w-100 h-100 rounded-3 shadow-lg" style={{ objectFit: "cover" }} />
              <button onClick={prevImage} className="nav-button btn btn-light position-absolute top-50 translate-middle-y shadow rounded-3" style={{ left: 16 }}>
                ‹
              </button>
              <button onClick={nextImage} className="nav-button btn btn-light position-absolute top-50 translate-middle-y shadow rounded-3" style={{ right: 16 }}>
                ›
              </button>
            </div>
          </div>
          {/* Paginación */}
          <div className="pagination d-flex justify-content-center p-3 bg-white border-top gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => goToImage(i)} className={`btn ${i === currentImage ? "btn-primary" : "btn-outline-primary"} rounded-2`} style={{ width: 36, height: 36 }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {/* Panel comentarios */}
        <div className="comments-panel bg-white border-start d-flex flex-column" style={{ width: 320 }}>
          <div className="comments-list flex-grow-1 overflow-auto p-3">
            {images[currentImage].comments.length ? (
              images[currentImage].comments.map((c, i) => (
                <div key={c.id} className="card mb-3 border-primary-subtle shadow-sm">
                  <div className="card-body">
                    <div className="fw-semibold text-primary mb-2" style={{ fontSize: 14 }}>
                      Comentario {i + 1}
                    </div>
                    <div className="text-dark" style={{ fontSize: 14, lineHeight: 1.5 }}>
                      {c.text}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4 fst-italic">No hay comentarios</div>
            )}
          </div>
          <div className="border-top">
            <div className="bg-primary text-white text-center py-2 fw-semibold text-uppercase" style={{ fontSize: 14 }}>
              Añadir Comentario
            </div>
            <div className="p-3 bg-light">
              <button className="btn btn-primary w-100 fw-semibold text-uppercase d-flex align-items-center justify-content-center gap-2" onClick={openCommentModal}>
                + Añadir Comentario
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showCommentModal && (
        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
          <div className="modal-content bg-white rounded-3 shadow-lg" style={{ width: "90%", maxWidth: 768, maxHeight: "80vh" }}>
            <div className="modal-header bg-primary text-white p-3 position-relative rounded-top">
              <h3 className="modal-title text-center fw-semibold mb-0" style={{ fontSize: 18 }}>
                Selección Comentarios Públicos
              </h3>
              <button className="btn btn-sm position-absolute top-50 translate-middle-y bg-white bg-opacity-25 border-0 rounded-circle text-white" style={{ right: 16, width: 32, height: 32 }} onClick={closeCommentModal}>
                x
              </button>
            </div>
            <div className="modal-body p-4 overflow-auto" style={{ maxHeight: 384 }}>
              {currentModalComments.map((c) => (
                <div key={c.id} className={`card mb-3 ${selectedComments.includes(c.id) ? "border-primary bg-primary bg-opacity-10" : "border-secondary-subtle"}`} onClick={() => toggleCommentSelection(c.id)}>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-primary" style={{ fontSize: 14 }}>
                        Comentario {c.number}
                      </span>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-info" style={{ fontSize: 12 }} onClick={(e) => (e.stopPropagation(), handlePublishComment(c.id))}>
                          Publicar
                        </button>
                        <button className="btn btn-sm btn-outline-info" style={{ fontSize: 12 }} onClick={(e) => (e.stopPropagation(), handleRejectComment(c.id))}>
                          Rechazar
                        </button>
                      </div>
                    </div>
                    <p className="mb-0 text-dark" style={{ fontSize: 14, lineHeight: 1.5, textAlign: "justify" }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer border-top p-3 bg-light d-flex justify-content-between align-items-center">
              <div className="d-flex gap-1">
                {Array.from({ length: totalModalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentModalPage(i + 1)} className={`btn btn-sm ${currentModalPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`} style={{ width: 28, height: 28, fontSize: 12 }}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button className="btn btn-warning fw-semibold" onClick={submitComment}>
                Añadir Comentario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
