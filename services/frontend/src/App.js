import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NewRegister from './components/NewRegister';
import ForgotPassword from './components/ForgotPassword';
import Justificaciones from './components/Justificaciones';
import Asistencias from './components/Asistencias';
import ProximosCursos from './components/ProximosCursos';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './LanguageContext';
import Layout from './components/Layout';
import Inicio from './components/Inicio';
import Login from './components/Login';

import VerAsistencias from './components/VerAsistencias';
import MarcarAsistencia from './components/MarcarAsistencia';



const App = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<NewRegister />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/inicio" element={<ProtectedRoute component={Inicio} />} />
                            <Route path="/asistencias" element={<ProtectedRoute component={Asistencias} />} />
                            <Route path="/ver-asistencias" element={<ProtectedRoute component={VerAsistencias} />} />
                            <Route path="/marcar-asistencia" element={<ProtectedRoute component={MarcarAsistencia} />} />
                            <Route path="/justificaciones" element={<ProtectedRoute component={Justificaciones} />} />
                            <Route path="/proximos-cursos" element={<ProtectedRoute component={ProximosCursos} />} />
                        </Routes>
                    </Layout>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
