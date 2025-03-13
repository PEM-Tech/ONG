import React, { useState, useEffect } from "react";
import "../../assets/css/ModalTipoConsulta.css"; // Estilo do modal
import tipoConsultaService from "../../services/TipoConsultaService";

function ModalCadastroTipoConsulta({ isOpen, onClose, onSubmit, tipoConsultaEditada }) {
    const [formData, setFormData] = useState({
        nome: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    // Se o modal for aberto para edição, preenche os campos com os dados do tipo de consulta
    useEffect(() => {
        if (tipoConsultaEditada) {
            setFormData({
                nome: tipoConsultaEditada.nome
            });
        } else {
            setFormData({
                nome: ""
            });
        }
        setErrorMessage("");
    }, [tipoConsultaEditada, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome) {
            setErrorMessage("Por favor, preencha o nome do tipo de consulta.");
            return;
        }

        try {
            setErrorMessage("");

            onSubmit({ ...tipoConsultaEditada, ...formData });
            onClose();
        } catch (error) {
            console.error("Erro ao salvar tipo de consulta:", error);
            setErrorMessage("Erro ao salvar tipo de consulta.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{tipoConsultaEditada ? "Editar Tipo de Consulta" : "Cadastrar Novo Tipo de Consulta"}</h2>
                <form onSubmit={handleSubmit} className="form-modal">
                    <label>
                        Nome:
                        <input
                            className="modal-input"
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {errorMessage && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}
                    <div className="botoes">
                        <button type="submit" className="botao-salvar">
                            {tipoConsultaEditada ? "Atualizar" : "Salvar"}
                        </button>
                        <button
                            type="button"
                            className="botao-cancelar"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCadastroTipoConsulta;
