import React, { useState, useEffect } from "react";
import "../../assets/css/modalUsuario.css"; // Estilo do modal
import usuarioService from "../../services/usuarioService";

function ModalCadastroUsuario({ isOpen, onClose, onSubmit, usuarioEditado }) {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        desabilitado: "não",
        permissao: "1",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(null);

    // Se o modal for aberto para edição, preenche os campos com os dados do usuário
    useEffect(() => {
        if (usuarioEditado) {
            setFormData({
                nome: usuarioEditado.nome,
                email: usuarioEditado.email,
                senha: "", // Não preencher por segurança
                confirmarSenha: "",
                desabilitado: usuarioEditado.desabilitado ? "sim" : "não",
                permissao: usuarioEditado.permissao,
            });
        } else {
            setFormData({
                nome: "",
                email: "",
                senha: "",
                confirmarSenha: "",
                desabilitado: "não",
                permissao: "1",
            });
        }
        setErrorMessage("");
        setPasswordMatch(null);
    }, [usuarioEditado, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "senha" || name === "confirmarSenha") {
            const { senha, confirmarSenha } = { ...formData, [name]: value };
            setPasswordMatch(senha && confirmarSenha ? senha === confirmarSenha : null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.email || !formData.permissao) {
            setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (formData.senha && formData.senha !== formData.confirmarSenha) {
            setErrorMessage("As senhas não coincidem.");
            return;
        }

        try {
            setErrorMessage("");

          

            onSubmit({ ...usuarioEditado, ...formData });
            onClose();
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            setErrorMessage("Erro ao salvar usuário.");
        }
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{usuarioEditado ? "Editar Usuário" : "Cadastrar Novo Usuário"}</h2>
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
                        <div className="input-password">
                            <input
                                className="modal-input"
                                type={showPassword ? "text" : "password"}
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                            />
                            <span onClick={toggleShowPassword}>
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </label>
                    <label>
                        Confirmar Senha:
                        <div className="input-password">
                            <input
                                className="modal-input"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleChange}
                            />
                            <span onClick={toggleShowConfirmPassword}>
                                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                            </span>
                        </div>
                    </label>
                    {passwordMatch === false && (
                        <p className="error-message">
                            As senhas não coincidem.
                        </p>
                    )}
                    {passwordMatch === true && (
                        <p className="success-message">
                            As senhas coincidem.
                        </p>
                    )}
                    {errorMessage && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}
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
                        Nivel de Permissão:
                        <select
                            className="modal-select"
                            name="permissao"
                            value={formData.permissao}
                            onChange={handleChange}
                            required
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </label>
                    <div className="botoes">
                        <button type="submit" className="botao-salvar">
                            {usuarioEditado ? "Atualizar" : "Salvar"}
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
