import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedLayout from "./components/ProtectedLayout";
import ListarAssistidos from "./pages/Assistidos/ListarAssistidos";
import CadastroAssistidos from "./pages/Assistidos/CadastroAssistidos";
import Pacientes from "./pages/Assistidos/HomeAssistidos";
import EditarAssistido from "./pages/Assistidos/EditarAssistidos";
import HomeVoluntarios from "./pages/Voluntarios/HomeVoluntarios";
import HomeConfig from "./pages/Configurações/HomeConfig";
import HomeUsuarios from "./pages/Usuarios/HomeUsuarios";
import ListVoluntarios from "./pages/Voluntarios/ListarVoluntarios"
import anamnese from "./pages/Assistidos/anamnese";
import { mostrarErro } from "./components/SweetAlert";


// 🔹 Função para proteger rotas privadas
function ProtectedRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>; // Pode ser um spinner ou tela de loading
  }

  return user && token ? children : <Navigate to="/login" />;
}

// 🔹 Função para proteger rotas por PERMISSÃO
function ProtectedRouteWithPermission({ children, requiredPermission }) {
  const { user, loading } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && user.permissao < requiredPermission) {
      setShowAlert(true);
      mostrarErro("Acesso negado", "Você não tem permissão para acessar esta página.");
    }
  }, [loading, user, requiredPermission]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user || user.permissao < requiredPermission) {
    return <Navigate to="/home" state={{ from: location }} />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>  
          <Route path="/login" element={<Login />} />

          <Route path="/home" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Home />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          <Route path="/cadastrar-assistido" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <CadastroAssistidos />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          <Route path="/home-voluntarios" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HomeVoluntarios />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          {/* 🔹 Somente usuários com permissão 4 podem acessar essa rota */}
          <Route path="/home-config" element={
            <ProtectedRouteWithPermission requiredPermission={4}>
              <ProtectedLayout>
                <HomeConfig />
              </ProtectedLayout>
            </ProtectedRouteWithPermission>
          } />

          <Route path="/home-usuarios" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HomeUsuarios />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

          <Route path="/homeassistidos" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Pacientes />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

          <Route path="/listarassistido" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ListarAssistidos />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

          <Route path="/anamnese" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <anamnese />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

            <Route path="/listarVoluntarios" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ListVoluntarios />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

          <Route path="/editarassistido/:id" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <EditarAssistido />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
