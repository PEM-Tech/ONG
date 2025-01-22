import React from 'react';
import '../assets/css/login.css';
import logo from '../assets/logo.jpeg'; // Insira o caminho correto para sua logo

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
                    <label className='labelUser'>
                        Email
                        <input type="text" placeholder="Insira seu email..." required />
                    </label>
                    <label className='labelPass'>
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
