import React from 'react';
import '../assets/css/login.css';
import logo from '../assets/logo.png'; // Insira o caminho correto para sua logo

function Login() {
    const handleLogin = (e) => {
        e.preventDefault();
        // Adicione a lógica de autenticação aqui
        alert("Login realizado!");
    };

    return (
        <div className="login-page">
            <div className="login-logo">
                <img src={logo} alt="Logo Ong Superação" />
            </div>
            <div className="login-form-container">
                <h1>ONG Superação</h1>
                <form onSubmit={handleLogin}>
                    <label>
                        Usuário
                        <input type="text" placeholder="Insira seu usuário..." required />
                    </label>
                    <label>
                        Senha
                        <input type="password" placeholder="Insira sua senha..." required />
                    </label>
                    <button type="submit" className='login-btn'>Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
