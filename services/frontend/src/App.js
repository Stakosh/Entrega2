
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherViewAttendance from './components/TeacherViewAttendance';
import NewRegister from './components/NewRegister';
import ForgotPassword from './components/ForgotPassword';
import Justificaciones from './components/Justificaciones';
import Asistencias from './components/Asistencias';
import ProximosCursos from './components/ProximosCursos';
import EnrollStudent from './components/EnrollStudent';
import AdminAddCourse from './components/AdminAddCourse';
import MarkAttendance from './components/MarkAttendance';
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
                            <Route path="/admin/enroll-student" element={<ProtectedRoute component={EnrollStudent} allowedAccess={['admin']} />} />
                            <Route path="/mark/my/attendance" element={<ProtectedRoute component={MarkAttendance} />} />
                            <Route path="/teacher-view-attendance" element={<ProtectedRoute component={TeacherViewAttendance} />} />

                        </Routes>
                    </Layout>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
