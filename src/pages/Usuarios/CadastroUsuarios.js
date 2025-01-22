import React, { useState, useEffect } from "react";
import "../../assets/css/modalUsuario.css"; // Estilo do modal

function ModalCadastroUsuario({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        desabilitado: "não",
        permissao: "",
        anexo: null, // Dados do anexo enviado
    });

    const [file, setFile] = useState(null); // Armazena o arquivo selecionado

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                nome: "",
                email: "",
                senha: "",
                desabilitado: "não",
                permissao: "",
                anexo: null,
            });
            setFile(null); // Limpa o arquivo selecionado
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Armazena o arquivo selecionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nome || !formData.email || !formData.senha || !formData.permissao) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        let anexoInfo = null;

        if (file) {
            const formDataFile = new FormData();
            formDataFile.append("file", file);

            try {
                const response = await fetch("http://localhost:5000/api/upload", {
                    method: "POST",
                    body: formDataFile,
                });

                if (response.ok) {
                    anexoInfo = await response.json();
                } else {
                    alert("Erro ao enviar o arquivo.");
                    return;
                }
            } catch (error) {
                console.error("Erro ao enviar o arquivo:", error);
                alert("Erro ao enviar o arquivo.");
                return;
            }
        }

        const finalFormData = {
            ...formData,
            anexo: anexoInfo, // Inclui os dados do anexo no formulário
        };

        onSubmit(finalFormData); // Envia os dados para o componente pai
        onClose(); // Fecha o modal
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Cadastrar Novo Usuário</h2>
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
                    <label>
                        Email:
                        <input
                            className="modal-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Senha:
                        <input
                            className="modal-input"
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Desabilitado:
                        <select
                            className="modal-select"
                            name="desabilitado"
                            value={formData.desabilitado}
                            onChange={handleChange}
                            required
                        >
                            <option value="não">Não</option>
                            <option value="sim">Sim</option>
                        </select>
                    </label>
                    <label>
                        Permissão:
                        <input
                            className="modal-input"
                            type="text"
                            name="permissao"
                            value={formData.permissao}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Anexo (Opcional):
                        <input
                            className="modal-input"
                            type="file"
                            name="anexo"
                            onChange={handleFileChange}
                        />
                    </label>
                    <div className="botoes">
                        <button type="submit" className="botao-salvar">
                            Salvar
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

export default ModalCadastroUsuario;
