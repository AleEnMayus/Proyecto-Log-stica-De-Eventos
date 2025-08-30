// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simula proceso de cierre de sesión
    const timer = setTimeout(() => {
      localStorage.clear(); // elimina datos de usuario
      navigate(0); // recarga la página
      navigate("/login");   // redirige al login
    }, 2000); // 2 segundos de "cargando"

    return () => clearTimeout(timer);
  }, navigate(0)
  );

  return (
    <div className="logout-container">
      <div className="spinner"></div>
      <p>Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
