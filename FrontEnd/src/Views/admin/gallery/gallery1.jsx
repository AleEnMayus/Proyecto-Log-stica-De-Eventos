import React, { useState, useEffect } from "react";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/Gallery.css";
import "../../CSS/components.css";
import { useNavigate } from "react-router-dom";
import UploadPhotoModal from "./galleryof";
import ConfirmModal from "../../../components/Modals/ModalConfirm";

import { useToast } from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";

const ImageGalleryC = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const imagesPerPage = 8;
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // Cargar imágenes al montar el componente
  useEffect(() => {
    fetchImages();
  }, []);

  // Obtener todas las imágenes del backend
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/gallery");
      if (!response.ok) throw new Error("Error al obtener imágenes");

      const data = await response.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching images:", error);
      addToast("Error al cargar las imágenes", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Subir imagen al backend
  const handleConfirmUpload = async (foto) => {
    try {
      const formData = new FormData();
      formData.append("file", foto);

      const response = await fetch("http://localhost:4000/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir la imagen");

      const result = await response.json();
      console.log("Imagen subida:", result);

      // Recargar la galería
      await fetchImages();
      addToast("Imagen subida correctamente", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast("Error al subir la imagen", "danger");
    }
  };

  // Confirmar eliminación individual
  const requestDeleteImage = (idx, e) => {
    e.stopPropagation();
    setConfirmAction(() => () => handleDeleteImage(idx));
    setConfirmMessage("¿Estás seguro de que deseas eliminar esta imagen?");
    setShowConfirmModal(true);
  };

  // Confirmar eliminación de toda la galería
  const requestClearAll = () => {
    setConfirmAction(() => handleClearAll);
    setConfirmMessage("¿Estás seguro de que deseas eliminar TODAS las imágenes?");
    setShowConfirmModal(true);
  };

  // Eliminar imagen individual del backend
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

  // Eliminar todas las imágenes del backend
  const handleClearAll = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/gallery", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar todas las imágenes");

      setImages([]);
      setCurrentPage(1);
      addToast("Todas las imágenes fueron eliminadas", "info");
    } catch (error) {
      console.error("Error clearing gallery:", error);
      addToast("Error al eliminar todas las imágenes", "danger");
    }
  };

  // Navegación
  const handleImageClick = (idx) => {
  const realIndex = indexOfFirstImage + idx;
  const selected = images[realIndex];

  navigate("/GalleryViewAdmin/" + selected.FileId);
};


  // Paginación
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pageNumbers.push(i);
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, "...");
      for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1, "...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++)
        pageNumbers.push(i);
      pageNumbers.push("...", totalPages);
    }
    return pageNumbers;
  };

  return (
    <div className="gallery-manager">
      <HeaderAdm />

      <div className="gallery-left">
        <div className="gallery-header">
          <h2 className="gallery-title">Galería de Eventos</h2>

          <div className="gallery-actions d-flex">
            <button
              className="btn-primary-custom btn"
              onClick={() => setShowUploadModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="currentcolor"
                style={{ marginRight: "8px" }}
              >
                <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
              Subir Imagen
            </button>

            {images.length > 0 && (
              <button
                className="btn btn-outline-danger ms-2"
                onClick={requestClearAll}
              >
                Eliminar Todo
              </button>
            )}
          </div>
        </div>

        <div className="gallery-grid">
          {currentImages.map((img, idx) => (
            <div key={img.FileId} className="image-card">
              <div
                onClick={() => handleImageClick(idx)}
                className="image-wrapper"
              >
                <img
                  src={img.url}
                  alt={img.FileName}
                  className="preview-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>

              <button
                className="delete-image-btn"
                onClick={(e) => requestDeleteImage(idx, e)}
                title="Eliminar imagen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentcolor"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-arrow"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="currentcolor"
              >
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
            </button>

            <div className="pagination-numbers">
              {renderPageNumbers().map((pageNum, index) =>
                pageNum === "..." ? (
                  <span key={`dots-${index}`} className="pagination-dots">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${currentPage === pageNum ? "active" : ""
                      }`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              className="pagination-arrow"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="currentcolor"
              >
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      <UploadPhotoModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onConfirm={handleConfirmUpload}
        title="Subir Nueva Imagen"
      />

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
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ImageGalleryC;