import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Modalidad from './Modalidad';
import Restricciones from './Restricciones';
import ImgFondo from '../img/fondo-1.jpg';
import { useAuth } from './AuthContext'; 
import axios from 'axios';

function ProximosCursos() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth(); // Usa la propiedad correcta del contexto
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [modalidad, setModalidad] = useState(null);
    const [encuestaCompletada, setEncuestaCompletada] = useState(false);
    const [showEncuesta, setShowEncuesta] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.id) {
            // Cambio en la URL para obtener horarios y detalles de asignaturas
            axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}/horarios`)
                .then(response => {
                    setCursos(response.data); // Ajusta el manejo de datos según la nueva estructura
                    console.log("Cursos fetched:", response.data);
                })
                .catch(error => console.error('Error fetching courses:', error));
        }

        const encuestaStatus = localStorage.getItem('encuestaCompletada') === 'true';
        setEncuestaCompletada(encuestaStatus);
    }, [currentUser]);

    const handleConfirmar = (index) => {
        setSelectedCurso(cursos[index]);
    };

    const handleModalidadChange = (mode) => {
        setModalidad(mode);
    };

    const handleSubmit = () => {
        alert(`Curso confirmado: ${selectedCurso.curso}\nModalidad: ${modalidad}`);
    };

    const handleEncuestaSubmit = (restricciones) => {
        if (!currentUser || !currentUser.id) {
            console.error("Usuario no autenticado o ID de usuario no disponible.");
            return;
        }
        axios.post(`http://localhost:5000/api/estudiante/${currentUser.id}/restricciones`, restricciones)
            .then(response => {
                setEncuestaCompletada(true);
                localStorage.setItem('encuestaCompletada', 'true');
                setShowEncuesta(false);
            })
            .catch(error => {
                console.error('Error saving dietary restrictions:', error);
            });
    };

    if (!currentUser) {
        return <Container><h1>{t('loginRequired')}</h1></Container>;
    }

    return (
        <div style={{ backgroundImage: `url(${ImgFondo})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Col md={8} lg={6} xl={4}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                            <h2 className="text-center mb-4">{t('proximosCursos')}</h2>
                            <div>
                                {cursos.map((curso, index) => (
                                    <div key={index} className="mb-3">
                                        <p>{curso.curso} - {curso.fecha} - {curso.sala} - Prof: {curso.profesor.nombre}</p>
                                        <Button variant="primary" onClick={() => handleConfirmar(index)} disabled={!encuestaCompletada} style={{ backgroundColor: encuestaCompletada ? '#0d6efd' : '#6c757d' }}>
                                            {t('confirmar')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {selectedCurso && (
                                <div className="mt-4">
                                    <h3>{selectedCurso.curso} - {selectedCurso.fecha} - {selectedCurso.sala}</h3>
                                    {!modalidad && <Modalidad onModalidadChange={handleModalidadChange} />}
                                    {modalidad && (
                                        <Button variant="primary" onClick={handleSubmit} disabled={!encuestaCompletada} style={{ backgroundColor: encuestaCompletada ? '#0d6efd' : '#6c757d' }}>
                                            {t('confirmar')}
                                        </Button>
                                    )}
                                </div>
                            )}
                            <Button variant="info" className="mt-4" onClick={() => setShowEncuesta(true)}>
                                {t('encuestaAlimentaria')}
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Modal show={showEncuesta} onHide={() => setShowEncuesta(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('encuestaAlimentaria')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Restricciones onSubmit={handleEncuestaSubmit} />
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default ProximosCursos;
