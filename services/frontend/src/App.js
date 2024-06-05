import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Inicio from './components/Inicio';
import ProximosCursos from './components/ProximosCursos';
import Justificaciones from './components/Justificaciones';
import Asistencias from './components/Asistencias';
import NewRegister from './components/NewRegister';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <LanguageProvider>
            <Router>
                <AuthProvider>
                    <div className="App">
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route path="/new" element={<NewRegister />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route
                                    path="/inicio"
                                    element={<ProtectedRoute element={Inicio} />}
                                />
                                <Route
                                    path="/justificaciones"
                                    element={<ProtectedRoute element={Justificaciones} />}
                                />
                                <Route
                                    path="/asistencias"
                                    element={<ProtectedRoute element={Asistencias} />}
                                />
                                <Route
                                    path="/cursos"
                                    element={<ProtectedRoute element={ProximosCursos} />}
                                />
                            </Routes>
                        </Layout>
                    </div>
                </AuthProvider>
            </Router>
        </LanguageProvider>
    );
}

export default App;
