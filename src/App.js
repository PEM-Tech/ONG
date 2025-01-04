import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';

function App() {
    // Simular se o usuário está autenticado
    const isAuthenticated = false; // Altere para `true` quando o usuário estiver autenticado

    return (
        <Router>
            <Routes>
                {/* Redirecionar "/" para "/login" se não estiver autenticado */}
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                {/* Página de Login */}
                <Route path="/login" element={<Login />} />
                {/* Página Home */}
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
