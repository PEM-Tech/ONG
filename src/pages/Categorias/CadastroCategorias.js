import React, { useState, useEffect } from "react";
import "../../assets/css/modalCategoria.css"; // Estilo do modal
import categoriaService from "../../services/CategoriaService"

function ModalCadastroCategoria({ isOpen, onClose, onSubmit, categoriaEditada }) {
    const [formData, setFormData] = useState({
        nome: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    // Se o modal for aberto para edição, preenche os campos com os dados da categoria
    useEffect(() => {
        if (categoriaEditada) {
            setFormData({
                nome: categoriaEditada.nome
            });
        } else {
            setFormData({
                nome: ""
            });
        }
        setErrorMessage("");
    }, [categoriaEditada, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome) {
            setErrorMessage("Por favor, preencha o nome da categoria.");
            return;
        }

        try {
            setErrorMessage("");

            onSubmit({ ...categoriaEditada, ...formData });
            onClose();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            setErrorMessage("Erro ao salvar categoria.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{categoriaEditada ? "Editar Categoria" : "Cadastrar Nova Categoria"}</h2>
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
                            {categoriaEditada ? "Atualizar" : "Salvar"}
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

export default ModalCadastroCategoria;
