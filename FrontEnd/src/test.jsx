import React, { useState, useEffect } from "react";
import "./Views/CSS/FormsUser.css";

const ClientSurvey = () => {
  const handleUpload = async (event) => {
    const formData = new FormData();
    formData.append("pdf", event.target.files[0]);

    const response = await fetch("http://localhost:4000/api/upload-pdf", {
      method: "POST",
      body: formData
    });

      const data = await response.json();
      console.log(data);
  };


  return (
    <div className="survey-main-container">
      <input type="file" accept="application/pdf" onChange={handleUpload} />
    </div>
  );
};

export default ClientSurvey;