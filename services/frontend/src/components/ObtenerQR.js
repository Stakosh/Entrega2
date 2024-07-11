import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Spinner, Form, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import ImgFondo from '../img/foto-fondo2.jpg';


function ObtenerQR() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState('');
    const [qrValue, setQrValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser && currentUser.id) {
            console.log("Fetching professor courses...");
            axios.get(`http://localhost:5000/api/professors/${currentUser.id}/cursos`)
                .then(response => {
                    const courses = response.data;
                    console.log("Courses fetched:", courses);
                    setCursos(courses);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching professor courses:', error);
                    setError('Error fetching professor courses. Please try again later.');
                    setLoading(false);
                });
        } else {
            setError('No current user or user ID found.');
            setLoading(false);
        }
    }, [currentUser]);

    const handleCourseChange = (event) => {
        setSelectedCurso(event.target.value);
        console.log('Selected course ID:', event.target.value);
    };

    const confirmar = () => {
        try {
            const currentDate = new Date().toISOString().split('T')[0];  // Convertir a formato YYYY-MM-DD
            const qrUrl = `http://localhost:3000/marcar-asistencia?course=${selectedCurso}&date=${currentDate}`;
            console.log('Sending data to backend:', { course: selectedCurso, date: currentDate, qr_url: qrUrl });

            axios.post('http://localhost:5000/api/store_validation_data', {
                course: selectedCurso,
                date: currentDate,
                qr_url: qrUrl
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log('Backend response:', response.data);
                setQrValue(qrUrl);  // Establecer el valor QR después de la respuesta
                alert('Datos enviados correctamente');
            })
            .catch(error => {
                console.error('Error sending data to backend:', error);
                setError('Error sending data to backend. Please try again later.');
            });
        } catch (error) {
            console.error('Error generating data:', error);
            setError('Error generating data. Please try again later.');
        }
    };

    if (loading) {
        return (
            <Container className="mt-4" >
                <Row className="justify-content-md-center">
                    <Col xs={12} className="text-center">
                        <Spinner animation="border" />
                        <p>{t('Cargando cursos...')}</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-4" >
            {error && (
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}
            <Row className="justify-content-md-center">
                <Col xs={12} md={8} lg={6}>
                    <Card >
                        <Card.Body>
                            <Card.Title className="text-center mb-4">{t('Generar Código QR')}</Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label>{t('Seleccione el curso')}</Form.Label>
                                    <Form.Control as="select" value={selectedCurso} onChange={handleCourseChange}>
                                        <option value="">{t('Seleccione un curso')}</option>
                                        {cursos.map(course => (
                                            <option key={course.sigla_curso} value={course.sigla_curso}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <div className="d-grid gap-2 mt-3">
                                    <Button variant="primary" onClick={confirmar} disabled={!selectedCurso}>
                                        {t('Confirmar')}
                                    </Button>
                                </div>
                            </Form>
                            {qrValue && (
                                <div className="text-center mt-4">
                                    <QRCode value={qrValue} size={256} level={"H"} includeMargin={true} />
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}



export default ObtenerQR;
