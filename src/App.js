import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedLayout from "./components/ProtectedLayout";
import HomePacientes from "./pages/Assistidos/HomeAssistidos";
import HomeVoluntarios from "./pages/Voluntarios/HomeVoluntarios";
import HomeConfig from "./pages/Configurações/HomeConfig"; // Importação do HomeConfig

function App() {
    const isAuthenticated = true; // Alterar para false se necessário

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={
                        isAuthenticated ? (
                            <ProtectedLayout>
                                <Home />
                            </ProtectedLayout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/home-pacientes"
                    element={
                        isAuthenticated ? (
                            <ProtectedLayout>
                                <HomePacientes />
                            </ProtectedLayout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/home-voluntarios"
                    element={
                        isAuthenticated ? (
                            <ProtectedLayout>
                                <HomeVoluntarios />
                            </ProtectedLayout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/home-config"
                    element={
                        isAuthenticated ? (
                            <ProtectedLayout>
                                <HomeConfig />
                            </ProtectedLayout>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
