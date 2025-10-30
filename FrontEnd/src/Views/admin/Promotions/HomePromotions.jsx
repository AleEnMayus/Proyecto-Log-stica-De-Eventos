import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS/components.css";
import "../../CSS/Lists.css";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";

const ListPromotionsA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const promotionsPerPage = 5;

  // Traer promociones desde el backend
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/promotion");
        if (!res.ok) throw new Error("Error al obtener promociones");
        const data = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Filtro
  const promotionsFiltradas = promotions.filter(
    (promo) =>
      promo.TitleProm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.DescriptionProm?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastPromo = currentPage * promotionsPerPage;
  const indexOfFirstPromo = indexOfLastPromo - promotionsPerPage;
  const currentPromos = promotionsFiltradas.slice(
    indexOfFirstPromo,
    indexOfLastPromo
  );
  const totalPages = Math.ceil(promotionsFiltradas.length / promotionsPerPage);

  // botones
  const handleEdit = (promotionId) => {
    navigate(`/PromotionsEdit/${promotionId}`);
  };

  const handleDelete = (promotionId) => {
    navigate(`/promotions/details/${promotionId}`);
  };

  // Cargando
  if (loading) {
    return (
      <div className="list-container mle-0">
        <HeaderAdm />
        <p className="mt-5 pt-5 text-center">Cargando promociones...</p>
      </div>
    );
  }

  return (
    <div className="list-container mle-0">
      <HeaderAdm />

      {/* Header */}
      <div className="list-header mt-5 pt-5">
        <h2 className="list-title">LISTADO DE PROMOCIONES</h2>
        <Link to="/PromotionsForm" className="btn-create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ffffff"
          >
            <path d="M417-417H166v-126h251v-251h126v251h251v126H543v251H417v-251Z" />
          </svg>
          Crear Promoción
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar promociones</span>
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {currentPromos.map((promo) => (
              <tr key={promo.PromotionId}>
                <td style={{ fontWeight: "500", color: "#2c3e50" }}>
                  {promo.TitleProm}
                </td>
                <td style={{ color: "#34495e" }}>
                  {promo.DescriptionProm || "Sin descripción"}
                </td>
                <td style={{ fontWeight: "600", color: "#ff7a00" }}>
                  ${promo.Price}
                </td>
                <td>
                  <span
                    style={{
                      background:
                        promo.StatusProm === "active" ? "#e6ffe6" : "#ffe6e6",
                      color:
                        promo.StatusProm === "active" ? "#13a927" : "#ff0000",
                      border: `1px solid ${promo.StatusProm === "active" ? "#13a927" : "#ff0000"
                        }`,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                    }}
                  >
                    {promo.StatusProm === "active" ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="d-flex">
                  <button
                    className="btn-custom btn-edit-custom mx-auto"
                    onClick={() => handleEdit(promo.PromotionId)}
                    aria-label="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    className="btn-custom btn-delete-custom mx-auto"
                    onClick={() => handleDelete(promo.PromotionId)}
                    aria-label="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sin resultados */}
      {promotionsFiltradas.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron promociones que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* Paginación */}
      <div className="pagination">
        <button
          className="pagination-arrow"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀
        </button>

        <div className="pagination-numbers">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? "active" : ""
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="pagination-arrow"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default ListPromotionsA;
