import React, { useState } from "react";
import HeaderAdm from "../../../components/HeaderSidebar/HeaderAdm";
import "../../CSS/Promotions.css";

export default function PromotionsEdit() {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        estado: "",
        precio: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(" Promoción editada con éxito");
    };

    return (
        <>

            <HeaderAdm />
            <br /><br /><br /><br />

            {/* Contenedor principal */}
            <div className="content-wrapper">
                <div className="form-container">
                    <h2>EDITAR PROMOCIÓN</h2>

                    <form onSubmit={handleSubmit} className="promo-form">
                        <label>Nombre Promoción</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ingrese el nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />

                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Ingrese la descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                        ></textarea>

                        <div className="row">
                            <div>
                                <label>Estado</label>
                                <input
                                    type="text"
                                    name="estado"
                                    placeholder="Activo / Inactivo"
                                    value={formData.estado}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label>Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    placeholder="Valor"
                                    value={formData.precio}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="button-group">
                            <button type="submit" className="btn-editar">
                                Editar Promoción
                            </button>
                            <button type="button" className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
