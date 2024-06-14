import React from 'react';
import logo from '../img/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Image, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from './AuthContext'; // Asegúrate de importar useAuth
import '../App.css';

const Layout = ({ children }) => {
    const { t, i18n } = useTranslation();
    const { logout, isAuthenticated } = useAuth(); // Suponiendo que useAuth proporciona isAuthenticated
    const navigate = useNavigate();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
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
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className='ml-auto'>
                            <Link to="/proximos-cursos" className='nav-link'>
                                {t('Proximos Cursos')} {/* Próximos Cursos */}
                            </Link>
                            <Link to="/justificaciones" className='nav-link'>
                                {t('Justificaciones')} {/* Justificaciones */}
                            </Link>
                            <Link to="/asistencias" className='nav-link'>
                                {t('Asistencias')} {/* Asistencias */}
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
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
                            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                <FiLogOut size={20} />
                            </Button>
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
