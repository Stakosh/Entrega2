import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormControl, FormGroup, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import ImgFondo from '../img/foto-fondo2.jpg';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

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
            fetch(`/api/estudiante/${studentData.id}/asignaturas`)
                .then(response => response.json())
                .then(data => {
                    console.log('Asignaturas:', data);
                    setAsignaturas(data);
                })
                .catch(error => console.error('Error fetching subjects:', error));
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

        fetch('/api/justificacion', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
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
                <Row style={{ marginTop: '100px' }}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>{t('step')} 1: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>{t('dateRange')}:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group controlId="fechaDesde">
                                        <Form.Label style={{ color: 'white' }}>{t('from')}:</Form.Label>
                                        <Form.Control type="date" value={fechaDesde} onChange={handleFechaDesdeChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="fechaHasta">
                                        <Form.Label style={{ color: 'white' }}>{t('to')}:</Form.Label>
                                        <Form.Control type="date" value={fechaHasta} onChange={handleFechaHastaChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>{t('step')} 2: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>{t('selectSubjects')}:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DropdownButton id="dropdown-asignaturas" title={t('selectSubject')}>
                            <Dropdown.Item onClick={handleSeleccionarTodas}>{t('selectAll')}</Dropdown.Item>
                            {asignaturas.map((asignatura) => (
                                <Dropdown.Item key={asignatura.id} onClick={() => handleAsignaturaSeleccionada(asignatura)}>
                                    {asignatura.name}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '30px' }}>
                    <Col>
                        {asignaturasSeleccionadas.length > 0 && (
                            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', marginBottom: '10px' }}>
                                <h3 style={{ color: 'black', marginBottom: '5px', fontSize: '1.5em' }}>{t('selectedSubjects')}:</h3>
                                {asignaturasSeleccionadas.map((asignatura) => (
                                    <span key={asignatura.id}>
                                        <Button variant="light" style={{ marginRight: '5px', marginBottom: '5px' }}>
                                            {asignatura.name}
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleQuitarAsignatura(asignatura)}>{t('remove')}</Button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>

                <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>{t('step')} 3: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>{t('commentReasons')}:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <FormGroup controlId="razones">
                                <FormControl as="textarea" rows={5} maxLength={500} value={razones} onChange={handleRazonesChange} placeholder={t('commentHere')} />
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>{t('step')} 4: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>{t('attachDocuments')}:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <FormGroup controlId="archivos">
                                <FormControl type="file" multiple onChange={handleArchivoChange} />
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>

                <Row>
                    <Col style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Button variant="primary" onClick={generarJustificacion}>{t('submit')}</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Justificaciones;
