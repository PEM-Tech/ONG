import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 Importar para redirecionar
import { AuthContext } from "../context/AuthContext";
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

            // Verifica se o usuário está definido antes de navegar
            const user = JSON.parse(localStorage.getItem("usuario"));
            if (user) {
                mostrarSucesso("Login realizado!", `Bem-vindo, ${user.nome}!`);
                setTimeout(() => navigate("/home"), 500); // Aguarda estado antes de redirecionar
            } else {
                mostrarErro("Erro no login", "erro ta aqui no login quando ele tenta puxar o const user");
            }
        } catch (error) {
            mostrarErro("Erro no login", "Verifique suas credenciais.");
        }
    };

    return (
        <div className="login-page">
            {/* Logo da clínica ou sistema */}
            <div className="login-logo">
                <img src="/logo.png" alt="Logo" />
            </div>

            {/* Formulário de Login */}
            <div className="login-form-container">
                <h1>Login</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="labelUser">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="labelPass">Senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                    />

                    <button className="login-btn" type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
