import React from 'react';
import logo from '../img/logo.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Image, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from './AuthContext'; 
import '../App.css';


const Layout = ({ children }) => {
    const { t, i18n } = useTranslation('global'); // Usa el namespace 'global'
    console.log(i18n.language); // Verifica el idioma actual
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <Navbar bg="white" variant="white" expand="lg" className="justify-content-between">
                <Container>
                    <Navbar.Brand as={Link} to="/inicio">
                        <Image src={logo} alt="Logo" fluid style={{ maxHeight: '80px' }} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <div className="d-flex align-items-center">
                        <div className="language-buttons me-2">
                            <Button variant="outline-secondary" size="sm" onClick={() => changeLanguage('en')}>
                                English
                            </Button>
                            {' '}
                            <Button variant="outline-secondary" size="sm" onClick={() => changeLanguage('es')}>
                                Español
                            </Button>
                        </div>
                        {isAuthenticated && (
                            <div className="d-flex align-items-center">
                                {(location.pathname === '/proximos-cursos' || location.pathname === '/justificaciones') && (
                                    <Nav className="me-auto">
                                        <Nav.Link as={Link} to="/inicio">{t('inicio')}</Nav.Link>
                                        <Nav.Link as={Link} to="/justificaciones">{t('justificaciones')}</Nav.Link>
                                    </Nav>
                                )}
                                {(location.pathname === '/justificaciones' || location.pathname === '/justificaciones') && (
                                    <Nav className="me-auto">
                                        <Nav.Link as={Link} to="/proximos-cursos">{t('proximosCursos')}</Nav.Link>
                                        <Nav.Link as={Link} to="/inicio">{t('inicio')}</Nav.Link>
                                    </Nav>
                                )}
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                    <FiLogOut size={20} />
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </Navbar>

            <div style={{ width: '100%' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
