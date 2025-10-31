import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../CSS/GalleryView.css";
import "../../CSS/Modals.css";
import "../../CSS/components.css";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import ConfirmModal from "../../../components/Modals/ModalConfirm";

export default function ImageDetail() {
  const { ImgId } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  // Estados para modal de comentarios
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [currentModalPage, setCurrentModalPage] = useState(1);
  const [selectedComments, setSelectedComments] = useState([]);
  const [publicComments, setPublicComments] = useState([]);

  // Paginación de la galería
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // cantidad de imágenes por página

  const fetchImages = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/gallery/${ImgId}`
      );

      if (!res.ok) throw new Error("Error al obtener imágenes");

      const data = await res.json();
      setImages(data.images || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error al cargar imágenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage, ImgId]);


  // Controles de página
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };


  // Función para recargar comentarios
  const refreshComments = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/gallery/${ImgId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setSelectedComments(data.map((c) => c.CommentId));
      }
    } catch (err) {
      console.error("Error al recargar comentarios:", err);
    }
  };

  // Cargar imagen y comentarios
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const imageRes = await fetch(`http://localhost:4000/api/gallery/${ImgId}`);
        if (imageRes.status === 404) throw new Error("Imagen no encontrada");
        if (!imageRes.ok) throw new Error("Error al obtener la imagen");

        const imageData = await imageRes.json();
        if (mounted) {
          setImage({
            ImgId: imageData.FileId,
            src: imageData.url,
            alt: imageData.FileName,
          });
        }

        await refreshComments();
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, [ImgId]);

  // Cargar comentarios públicos cuando se abre el modal
  const openCommentModal = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/gallery/comments/public");
      if (res.ok) {
        const data = await res.json();
        setPublicComments(data);
      }
    } catch (err) {
      console.error("Error al cargar comentarios públicos:", err);
    }
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setCurrentModalPage(1);
    refreshComments();
  };

  // requestDeleteImage

  const requestDeleteImage = (idx, e) => {
    e.stopPropagation();
    setConfirmAction(() => () => handleDeleteImage(idx));
    setConfirmMessage("¿Estás seguro de que deseas eliminar esta imagen?");
    setShowConfirmModal(true);
  };

  const handleDeleteImage = async (idx) => {
    try {
      const realIndex = indexOfFirstImage + idx;
      const imageToDelete = images[realIndex];

      const response = await fetch(`http://localhost:4000/api/gallery/${imageToDelete.FileId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la imagen");

      // Recargar la galería
      await fetchImages();

      // Ajustar página si es necesario
      const updatedLength = images.length - 1;
      if (updatedLength <= indexOfFirstImage && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      addToast("Imagen eliminada correctamente", "success");
    } catch (error) {
      console.error("Error deleting image:", error);
      addToast("Error al eliminar la imagen", "danger");
    }
  };


  const toggleCommentSelection = async (commentId) => {
    try {
      if (selectedComments.includes(commentId)) {
        const res = await fetch(`http://localhost:4000/api/gallery/${ImgId}/comments/${commentId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setSelectedComments((prev) => prev.filter((c) => c !== commentId));
          setComments((prev) => prev.filter((c) => c.CommentId !== commentId));

          const pubRes = await fetch("http://localhost:4000/api/gallery/comments/public");
          if (pubRes.ok) setPublicComments(await pubRes.json());
        }
      } else {
        const res = await fetch(`http://localhost:4000/api/gallery/${ImgId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId }),
        });

        if (res.ok) {
          setSelectedComments((prev) => [...prev, commentId]);
          await refreshComments();

          const pubRes = await fetch("http://localhost:4000/api/gallery/comments/public");
          if (pubRes.ok) setPublicComments(await pubRes.json());
        }
      }
    } catch (err) {
      console.error("Error al agregar/remover comentario:", err);
      alert("Error al procesar el comentario");
    }
  };

  const commentsPerPage = 5;
  const totalModalPages = Math.ceil(publicComments.length / commentsPerPage);
  const currentModalComments = publicComments.slice(
    (currentModalPage - 1) * commentsPerPage,
    currentModalPage * commentsPerPage
  );

  if (loading) {
    return (
      <div className="gallery-page">
        <HeaderAdm />
        <div style={{ textAlign: "center", marginTop: 80, padding: "20px" }}>
          <p>Cargando imagen...</p>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="gallery-page">
        <HeaderAdm />
        <div style={{ textAlign: "center", marginTop: 80, padding: "20px" }}>
          <p>{error || "No se encontró la imagen seleccionada."}</p>
          <button className="btn-secondary-custom mt-3" onClick={() => navigate(-1)}>
            Volver a la galería
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <HeaderAdm />

      <div className="gallery-wrapper">
        {/* Imagen principal */}
        <div className="image-section">
          <div className="main-image-wrapper">
            <img src={image.src} alt={image.alt} className="main-image" />
          </div>
        </div>

        {/* Panel lateral */}
        <aside className="comments-panel">
          <button className="btn-secondary-custom mb-3 w-100" onClick={() => navigate(-1)}>
            Volver a la galería
          </button>
          <button className="btn-secondary-custom mb-3 w-100"
            onClick={(e) => requestDeleteImage(ImgId, e)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
            Eliminar foto
          </button>

          <h3 className="panel-title">Comentarios ({comments.length})</h3>

          <div className="comments-list">
            {comments.length ? (
              comments.map((c) => (
                <div key={c.CommentId} className="comment-card">
                  <p className="comment-text">{c.CommentText}</p>
                  <span className="comment-author">
                    — {c.UserName || "Usuario"}
                    <small style={{ fontSize: "10px", marginLeft: "8px", display: "block" }}>
                      {new Date(c.PublicationDate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#6c757d" }}>
                <p className="no-comments">No hay comentarios aún</p>
                <small>¡Sé el primero en agregar uno!</small>
              </div>
            )}
          </div>

          <button className="btn-primary-custom w-100" onClick={openCommentModal}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentcolor" style={{ marginRight: "8px" }}>
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
            Añadir Comentario
          </button>
        </aside>
      </div>

      {/* Modal */}
      {showCommentModal && (
        <>
          <div className="modal-overlay" onClick={closeCommentModal}></div>
          <div className="profile-modal w-800 mt-5">
            <button className="close-btn" onClick={closeCommentModal}>
              &times;
            </button>

            <header style={{ marginBottom: "15px", textAlign: "center" }}>
              <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Seleccionar Comentarios Públicos
              </h3>

              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#007bff", fontWeight: "600", fontSize: "15px", marginBottom: "10px" }}>
                  Imagen seleccionada: <span style={{ color: "#333" }}>#{image.ImgId}</span>
                </p>
              </div>

              {publicComments.length === 0 && (
                <p style={{ textAlign: "center", color: "#6c757d", fontSize: "14px" }}>
                  No hay comentarios disponibles
                </p>
              )}
            </header>

            {/* Comentarios públicos */}
            <div
              className="pm-body"
              style={{
                flexDirection: "column",
                maxHeight: "400px",
                overflowY: "auto",
                gap: "10px",
              }}
            >
              {currentModalComments.length > 0 ? (
                currentModalComments.map((c) => (
                  <div key={c.CommentId} className="modal-comment-item">
                    <div style={{ flex: 1 }}>
                      <p className="comment-text" style={{ margin: 0 }}>
                        {c.CommentText}
                      </p>
                    </div>
                    <button
                      className="btn-primary-custom"
                      onClick={() => toggleCommentSelection(c.CommentId)}
                      style={{
                        minWidth: "120px",
                        opacity: selectedComments.includes(c.CommentId) ? 0.8 : 1,
                      }}
                    >
                      {selectedComments.includes(c.CommentId) ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentcolor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                          </svg>
                          Agregado
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentcolor">
                            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                          </svg>
                          Agregar
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>
                  <p>No hay comentarios públicos disponibles</p>
                </div>
              )}
            </div>

            <div className="pm-footer">
              <button className="btn btn-status w-100" onClick={closeCommentModal}>
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}


      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          confirmAction?.();
          setShowConfirmModal(false);
        }}
        message={confirmMessage}
        confirmText="Sí, eliminar"
      />

    </div>
  );
}