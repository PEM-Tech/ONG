import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Importar para redirecionar
import { AuthContext } from "../context/AuthContext";
import usuarioService from "../services/usuarioService";
import { mostrarErro, mostrarSucesso } from "../components/SweetAlert";
import "../assets/css/login.css";

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); // 🔹 Criar navegação
    const [formData, setFormData] = useState({ email: "", senha: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(formData);
            mostrarSucesso("Login realizado!", "Bem-vindo ao sistema!");
            navigate("/home"); // 🔹 Redireciona para Home após login
        } catch (error) {
            mostrarErro("Erro no login", "Verifique suas credenciais.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <label>Senha:</label>
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
