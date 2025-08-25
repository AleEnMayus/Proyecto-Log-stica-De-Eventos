import React from "react";
import HeaderAdm from "../../components/HeaderAdm";
import './survey.css';

const CreateSurvay = () => {
  return (
    <div className="survay-container">
      <HeaderAdm />
      <div className="survay-card">
        <h2 class className="title" >Crear Encuesta</h2>

        {/* Estrellas */}
        <div className="survay-stars">
          <span>🔒</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star">★</span>
          <span className="star half">★</span>
        </div>

        {/* Inputs */}
        <input type="text" placeholder="Título" className="survay-input" />
        <textarea placeholder="Input text" className="survay-textarea"></textarea>

        {/* Botón grande con + */}
        <button className="survay-add">＋</button>
      </div>
    </div>
  );
};

export default CreateSurvay;
