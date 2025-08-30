// DocModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Modals.css";

const DocModal = ({ isOpen, onClose, user }) => {
 const [reason, setReason] = useState('');

 if (!isOpen) return null;

 const stop = (e) => e.stopPropagation();

 const SendReason = () => {
   if (reason.trim()) {
     console.log('Motivo enviado:', reason);
     onClose();
   }
 };

 return (
   <>
     <div className="sidebar-overlay active" onClick={onClose}>
       <div
        className="profile-modal w-80 position-absolute top-50 start-50 translate-middle"
        onClick={stop} role="dialog" aria-modal="true">

         <button className="close-btn" aria-label="Cerrar" onClick={onClose}>
           ×
         </button>

         <h4 className="modal-title text-center mb-3">Solicitud de cambio de Documento</h4>

         <div className="pm-body ">
           <div className="field-row w-100">
             <div className="field">
               <div className="field-label">Motivo</div>
               <textarea
                 className="field-value w-100 min-h-200px"
                 placeholder="Escriba el documento y por qué desea cambiarlo..."
                 value={reason}
                 onChange={(e) => setReason(e.target.value)}
                 rows={4}
                 maxLength={100}
               />
             </div>
             
           </div>
         </div>
            <div className="text-start small text-muted mt-0 mb-3">
                {100 - reason.length} caracteres restantes
             </div>
         <button className="btn-primary-custom w-100" onClick={SendReason}>
           Enviar
         </button>
       </div>
     </div>
   </>
 );
};

export default DocModal;