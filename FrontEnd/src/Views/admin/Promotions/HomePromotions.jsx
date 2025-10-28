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

  // Traer promociones desde API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/promotions");
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
      promo.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastPromo = currentPage * promotionsPerPage;
  const indexOfFirstPromo = indexOfLastPromo - promotionsPerPage;
  const currentPromos = promotionsFiltradas.slice(
    indexOfFirstPromo,
    indexOfLastPromo
  );
  const totalPages = Math.ceil(promotionsFiltradas.length / promotionsPerPage);

  // Ver promoción (redirección)
  const handleVerPromo = (promotionId) => {
    navigate(`/promotions/details/${promotionId}`);
  };

  // Loading
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

      {/* Search Bar */}
      <div className="search-container mb-4 w-50-lg">
        <span className="search-label">Buscar promociones</span>
        <div className="search-input-group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentcolor"
          >
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>
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
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Descuento</th>
              <th>Estado</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {currentPromos.map((promo) => (
              <tr key={promo.PromotionId}>
                <td>{promo.PromotionId}</td>
                <td style={{ fontWeight: "500", color: "#2c3e50" }}>
                  {promo.Title}
                </td>
                <td style={{ color: "#34495e" }}>
                  {promo.Description || "Sin descripción"}
                </td>
                <td style={{ fontWeight: "600", color: "#ff7a00" }}>
                  {promo.Discount ? `${promo.Discount}%` : "—"}
                </td>
                <td>
                  <span
                    style={{
                      background:
                        promo.Status === "Active" ? "#e6ffe6" : "#ffe6e6",
                      color:
                        promo.Status === "Active" ? "#13a927" : "#ff0000",
                      border: `1px solid ${
                        promo.Status === "Active" ? "#13a927" : "#ff0000"
                      }`,
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                    }}
                  >
                    {promo.Status || "N/A"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-custom btn-edit-custom d-flex align-items-center mx-auto"
                    onClick={() => handleVerPromo(promo.PromotionId)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estado vacío */}
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
              className={`pagination-btn ${
                currentPage === i + 1 ? "active" : ""
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
