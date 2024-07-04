import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, Row, Col, DropdownButton, Dropdown, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import './styles/Justificaciones.css'; // Añade una hoja de estilos personalizada

function Justificaciones() {
    const { studentData } = useAuth();
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [razones, setRazones] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
    const { t } = useTranslation("global");

    useEffect(() => {
        if (studentData) {
            console.log('Fetching asignaturas for studentData:', studentData);
            fetch(`http://localhost:5000/api/estudiante/${studentData.id}/asignaturas`)
                .then(response => response.json())
                .then(data => {
                    console.log('Asignaturas:', data);
                    setAsignaturas(data);
                })
                .catch(error => console.error('Error fetching subjects:', error));
        } else {
            console.log('No studentData available');
        }
    }, [studentData]);

    const handleFechaDesdeChange = (e) => {
        setFechaDesde(e.target.value);
    };

    const handleFechaHastaChange = (e) => {
        setFechaHasta(e.target.value);
    };

    const handleRazonesChange = (e) => {
        setRazones(e.target.value);
    };

    const handleArchivoChange = (e) => {
        const files = Array.from(e.target.files);
        setArchivos(files);
    };

    const handleAsignaturaSeleccionada = (asignatura) => {
        if (!asignaturasSeleccionadas.some((asig) => asig.id === asignatura.id)) {
            setAsignaturasSeleccionadas([...asignaturasSeleccionadas, asignatura]);
        }
    };

    const handleSeleccionarTodas = () => {
        setAsignaturasSeleccionadas([...asignaturas]);
    };

    const handleQuitarAsignatura = (asignatura) => {
        const nuevasAsignaturas = asignaturasSeleccionadas.filter((asig) => asig.id !== asignatura.id);
        setAsignaturasSeleccionadas(nuevasAsignaturas);
    };

    const generarJustificacion = () => {
        const formData = new FormData();
        formData.append('student_id', studentData.id); // Usar el ID real del estudiante
        formData.append('fechaDesde', fechaDesde);
        formData.append('fechaHasta', fechaHasta);
        formData.append('razones', razones);
        archivos.forEach((archivo, index) => {
            formData.append(`archivo${index}`, archivo);
        });
        asignaturasSeleccionadas.forEach((asignatura, index) => {
            formData.append(`asignatura${index}`, asignatura.id);
        });
    
        fetch('http://localhost:5000/api/justificacion', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('Justificación enviada correctamente');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al enviar la justificación');
            });
    };

    return (
        <div className="justificaciones-bg">
            <Container className="justificaciones-container">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="justificaciones-card">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">{t('justificationRequest')}</Card.Title>
                                <Form>
                                    <div className="justificaciones-step">
                                        <h4>{t('step')} 1: {t('dateRange')}</h4>
                                        <Row>
                                            <Col>
                                                <Form.Group controlId="fechaDesde">
                                                    <Form.Label>{t('from')}:</Form.Label>
                                                    <Form.Control type="date" value={fechaDesde} onChange={handleFechaDesdeChange} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId="fechaHasta">
                                                    <Form.Label>{t('to')}:</Form.Label>
                                                    <Form.Control type="date" value={fechaHasta} onChange={handleFechaHastaChange} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="justificaciones-step">
                                        <h4>{t('step')} 2: {t('selectSubjects')}</h4>
                                        <DropdownButton id="dropdown-asignaturas" title={t('selectSubject')}>
                                            <Dropdown.Item onClick={handleSeleccionarTodas}>{t('selectAll')}</Dropdown.Item>
                                            {asignaturas.map((asignatura) => (
                                                <Dropdown.Item key={asignatura.id} onClick={() => handleAsignaturaSeleccionada(asignatura)}>
                                                    {asignatura.name}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </div>

                                    {asignaturasSeleccionadas.length > 0 && (
                                        <div className="justificaciones-selected">
                                            <h5>{t('selectedSubjects')}:</h5>
                                            {asignaturasSeleccionadas.map((asignatura) => (
                                                <div key={asignatura.id} className="selected-asignatura">
                                                    <Button variant="outline-primary" className="mr-2 mb-2">
                                                        {asignatura.name}
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleQuitarAsignatura(asignatura)}>{t('remove')}</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="justificaciones-step">
                                        <h4>{t('step')} 3: {t('commentReasons')}</h4>
                                        <Form.Group controlId="razones">
                                            <Form.Control as="textarea" rows={5} maxLength={500} value={razones} onChange={handleRazonesChange} placeholder={t('commentHere')} />
                                        </Form.Group>
                                    </div>

                                    <div className="justificaciones-step">
                                        <h4>{t('step')} 4: {t('attachDocuments')}</h4>
                                        <Form.Group controlId="archivos">
                                            <Form.Control type="file" multiple onChange={handleArchivoChange} />
                                        </Form.Group>
                                    </div>

                                    <div className="text-center mt-4">
                                        <Button variant="primary" onClick={generarJustificacion}>{t('submit')}</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Justificaciones;
