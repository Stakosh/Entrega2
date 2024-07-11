import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImgFondo from '../img/foto-fondo2.jpg';
import { Button, Container, Row} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext'; 

function Inicio() {
    const navigate = useNavigate(); // Hook to enable navigation
    const { t } = useTranslation("global"); // Hook for translations
    const { currentUser } = useAuth(); // Obtén el rol del usuario
    console.log("CurrentUser:", currentUser);
    console.log("Tipo de acceso:", currentUser?.tipo_acceso);

    if (!currentUser) {
        console.log("No currentUser data available");
    }

    return (
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
                    {currentUser?.tipo_acceso === 'alumno' && (
                        <>
                            <Row xs="auto" className="justify-content-center mb-3">
                                <Button
                                    variant="light"
                                    style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                    onClick={() => navigate('/justificaciones')}
                                >
                                    {t('enviar-justificaciones')}
                                </Button>
                            </Row>
                            <Row xs="auto" className="justify-content-center mb-3">
                                <Button
                                    variant="light"
                                    style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                    onClick={() => navigate('/proximos-cursos')}
                                >
                                    {t('ver-proximosCursos')}
                                </Button>
                            </Row>
                            <Row xs="auto" className="justify-content-center mb-3">
                                <Button
                                    variant="light"
                                    style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                    onClick={() => navigate('/asistencias')}
                                >
                                    {t('ver-asistencias')}
                                </Button>
                            </Row>
                            <Row xs="auto" className="justify-content-center">
                                <Button
                                    variant="light"
                                    style={{ width: '50%', padding: '10px', color: 'black', backgroundColor: 'whitesmoke' }}
                                    onClick={() => navigate('/marcar-asistencia')}
                                >
                                    {t('registrar-asistencia')}
                                </Button>
                            </Row>
                        </>
                    )}
                    {currentUser?.tipo_acceso === 'profesor' && (
                        <>
                            <Row xs="auto" className="justify-content-center mb-3">
                                <Button
                                    variant="light"
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
                                    onClick={() => navigate('/ver-asistencias')}
                                >
                                    {t('verAsistencia')}
                                </Button>
                            </Row>
                        </>
                    )}
                    {currentUser?.tipo_acceso === 'admin' && (
                        <>
                            <Row xs="auto" className="justify-content-center mb-3">
                                <Button
                                    variant="light"
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
                                    onClick={() => navigate('/Ver-Estadisticas')}
                                >
                                    {t('VerEstadisticas')}
                                </Button>
                            </Row>
                        </>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default Inicio;
