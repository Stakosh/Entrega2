import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Modalidad from './Modalidad';
import Restricciones from './Restricciones';
import ImgFondo from '../img/fondo-1.jpg';

function ProximosCursos() {
    const { t } = useTranslation("global");
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [modalidad, setModalidad] = useState(null);

    useEffect(() => {
        // Simulating fetching data from API
        setCursos([
            { curso: 'Programación Profe.', fecha: '18/06 11:45', sala: '202D' },
            { curso: 'Programación Profe.', fecha: '18/06 13:10', sala: '202D' },
            { curso: 'Programación Profe.', fecha: '25/06 11:45', sala: '202D' }
        ]);
    }, []);

    const handleConfirmar = (index) => {
        setSelectedCurso(cursos[index]);
    };

    const handleModalidadChange = (mode) => {
        setModalidad(mode);
    };

    const handleSubmit = (restricciones) => {
        // Process form submission logic here
        alert(`Curso confirmado: ${selectedCurso.curso}\nModalidad: ${modalidad}\nRestricciones alimentarias: ${JSON.stringify(restricciones)}`);
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
                                        <Button variant="primary" onClick={() => handleConfirmar(index)}>{t('confirmar')}</Button>
                                    </div>
                                ))}
                            </div>
                            {selectedCurso && (
                                <div className="mt-4">
                                    <h3>{selectedCurso.curso} - {selectedCurso.fecha} - {selectedCurso.sala}</h3>
                                    {!modalidad && <Modalidad onModalidadChange={handleModalidadChange} />}
                                    {modalidad && modalidad === 'presencial' && <Restricciones onSubmit={handleSubmit} />}
                                    {modalidad && modalidad === 'online' && <Button onClick={() => handleSubmit({})}>{t('confirmar')}</Button>}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ProximosCursos;