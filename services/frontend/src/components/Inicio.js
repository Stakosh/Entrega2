import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImgFondo from '../img/foto-fondo2.jpg';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext'; 

function Inicio() {
    const navigate = useNavigate(); // Hook to enable navigation
    const { t } = useTranslation("global"); // Hook for translations
    const { currentUser } = useAuth(); // Obtén el rol del usuario

    return (
        <div>
            <div
                style={{
                    backgroundImage: `url(${ImgFondo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    height: '100vh',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Container>
                    <Row className="justify-content-center">
                        {currentUser?.tipo_acceso === 'student' && (
                            <>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        className="mb-3"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/justificaciones')}
                                    >
                                        {t('justificaciones')}
                                    </Button>
                                </Row>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        className="mb-3"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/proximos-cursos')}
                                    >
                                        {t('proximosCursos')}
                                    </Button>
                                </Row>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/asistencias')}
                                    >
                                        {t('asistencias')}
                                    </Button>
                                </Row>
                            </>
                        )}
                        {currentUser?.tipo_acceso === 'teacher' && (
                            <>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        className="mb-3"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/obtener-qr')}
                                    >
                                        {t('obtenerQR')}
                                    </Button>
                                </Row>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/ver-asistencia')}
                                    >
                                        {t('verAsistencia')}
                                    </Button>
                                </Row>
                            </>
                        )}
                        {currentUser?.tipo_acceso === 'admin' && (
                            <>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        className="mb-3"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/resolucion-justificaciones')}
                                    >
                                        {t('resolucionJustificaciones')}
                                    </Button>
                                </Row>
                                <Row xs="auto" className="justify-content-center">
                                    <Button
                                        variant="light"
                                        style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                        onClick={() => navigate('/estadisticas')}
                                    >
                                        {t('estadisticas')}
                                    </Button>
                                </Row>
                            </>
                        )}
                    </Row>
                </Container>
            </div>
            <Col>
                <Container>
                    {/* Additional content can go here */}
                </Container>
            </Col>
        </div>
    );
}

export default Inicio;
