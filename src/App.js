import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedLayout from "./components/ProtectedLayout";

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
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
