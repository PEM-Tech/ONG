import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/login";
import Home from "./pages/home";
import ProtectedLayout from "./components/ProtectedLayout";
import ListarAssistidos from "./pages/Assistidos/ListarAssistidos"; // Atualize o caminho conforme sua estrutura
import CadastroAssistidos from "./pages/Assistidos/CadastroAssistidos";
import HomeVoluntarios from "./pages/Voluntarios/HomeVoluntarios";
import HomeConfig from "./pages/Configurações/HomeConfig";
import HomeUsuarios from "./pages/Usuarios/HomeUsuarios";

// Função para proteger rotas privadas
function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  console.log ("token não encontrado.",AuthContext )
  return user ? children : <Navigate to="/login" />;
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

          {/* Rota para Listar Assistidos */}
          <Route path="/assistidos" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <ListarAssistidos/>
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

          <Route path="/home-config" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HomeConfig />
              </ProtectedLayout>
            </ProtectedRoute>
          } />

          <Route path="/home-usuarios" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HomeUsuarios />
              </ProtectedLayout>
            </ProtectedRoute>
          }/>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;localStorage.getItem("authToken")

