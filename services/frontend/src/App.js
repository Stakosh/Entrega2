import React from 'react';
import Login from './components/Login';
import Layout from './components/Layout.js';
import Inicio from './components/Inicio.js';
import { LanguageProvider } from './LanguageContext'; // Importa el proveedor de contexto de idioma
import { AuthProvider } from './components/AuthContext';
import ProximosCursos from './components/ProximosCursos';
import Justificaciones from './components/Justificaciones';
import Asistencias from './components/Asistencias.js';
import NewRegister from './components/NewRegister.js';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';







function App() {
    return (
        <LanguageProvider> {/* Utiliza el proveedor de contexto de idioma en lugar de I18nextProvider */}
            <Router>
                <AuthProvider>
                    <div className="App">
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route path="/new" element={<NewRegister />} />
                                <Route path="/inicio" element={<Inicio />} />
                                <Route path="/justificaciones" element={<Justificaciones/>} />
                                <Route path="/asistencias" element={<Asistencias/>} />
                                <Route path="/cursos" element={<ProximosCursos />} />
                                {/* Elimina la ruta duplicada a '/new' ya que está definida arriba */}
                            </Routes>
                        </Layout>
                    </div>
                </AuthProvider>
            </Router>
        </LanguageProvider>
    );
}

export default App;