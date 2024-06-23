import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Modalidad from './Modalidad';
import Restricciones from './Restricciones';
import ImgFondo from '../img/fondo-1.jpg';

function ProximosCursos() {
    const { t } = useTranslation("global");
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [modalidad, setModalidad] = useState(null);
    const [encuestaCompletada, setEncuestaCompletada] = useState(false);
    const [showEncuesta, setShowEncuesta] = useState(false);

    useEffect(() => {
        // Simulating fetching data from API
        setCursos([
            { curso: 'Programación Profe.', fecha: '18/06 11:45', sala: '202D' },
            { curso: 'Programación Profe.', fecha: '18/06 13:10', sala: '202D' },
            { curso: 'Programación Profe.', fecha: '25/06 11:45', sala: '202D' }
        ]);

        // Simulating fetching user's survey completion status from API
        const encuestaStatus = localStorage.getItem('encuestaCompletada') === 'true';
        setEncuestaCompletada(encuestaStatus);
    }, []);

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
        setEncuestaCompletada(true);
        localStorage.setItem('encuestaCompletada', 'true');
        setShowEncuesta(false);
    };

    return (
        <div style={{ 
            backgroundImage: `url(${ImgFondo})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Col md={8} lg={6} xl={4}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}>
                            <h2 className="text-center mb-4">{t('proximosCursos')}</h2>
                            <div>
                                {cursos.map((curso, index) => (
                                    <div key={index} className="mb-3">
                                        <p>{curso.curso} - {curso.fecha} - {curso.sala}</p>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleConfirmar(index)}
                                            disabled={!encuestaCompletada}
                                            style={{ backgroundColor: encuestaCompletada ? '#0d6efd' : '#6c757d' }}
                                        >
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
                                        <Button 
                                            variant="primary" 
                                            onClick={handleSubmit}
                                            disabled={!encuestaCompletada}
                                            style={{ backgroundColor: encuestaCompletada ? '#0d6efd' : '#6c757d' }}
                                        >
                                            {t('confirmar')}
                                        </Button>
                                    )}
                                </div>
                            )}
                            <Button 
                                variant="info" 
                                className="mt-4" 
                                onClick={() => setShowEncuesta(true)}
                            >
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