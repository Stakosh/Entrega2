
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NewRegister from './components/NewRegister';
import ForgotPassword from './components/ForgotPassword';
import Justificaciones from './components/Justificaciones';
import Asistencias from './components/Asistencias';
import ProximosCursos from './components/ProximosCursos';
import AdminAddCourse from './components/AdminAddCourse';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './LanguageContext';
import Layout from './components/Layout';
import Inicio from './components/Inicio';
import Login from './components/Login';
import React from 'react';




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
                            <Route path="/justificaciones" element={<ProtectedRoute component={Justificaciones} />} />
                            <Route path="/proximos-cursos" element={<ProtectedRoute component={ProximosCursos} />} />
                            <Route path="/admin/add-course" element={<ProtectedRoute component={AdminAddCourse} allowedAccess={['admin']} />} />

        

                        </Routes>
                    </Layout>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
