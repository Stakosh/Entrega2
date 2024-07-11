import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Spinner, Form, Alert } from 'react-bootstrap';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrUrl, setQrUrl] = useState('');

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
            const currentDate = new Date().toISOString();
            const qrUrl = `http://localhost:3000/marcar-asistencia?course=${selectedCurso}&date=${currentDate}`;
            console.log('Sending data to backend:', { course: selectedCurso, date: currentDate, qr_url: qrUrl });

            const formData = new FormData();
            formData.append('course', selectedCurso);
            formData.append('date', currentDate);
            formData.append('qr_url', qrUrl);

            fetch('http://localhost:5000/api/store_validation_data', {
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
                    alert('Datos enviados correctamente');
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError('Error sending data to backend. Please try again later.');
                });
        } catch (error) {
            console.error('Error generating data:', error);
            setError('Error generating data. Please try again later.');
        }
    };

    if (loading) {
        return (
            <Container className="mt-4" style={styles.container}>
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
        <Container className="mt-4" style={styles.container}>
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
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label>Seleccione el curso</Form.Label>
                        <Form.Control as="select" value={selectedCurso} onChange={handleCourseChange}>
                            <option value="">Seleccione un curso</option>
                            {cursos.map(course => (
                                <option key={course.sigla_curso} value={course.sigla_curso}>
                                    {course.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <div className="d-grid gap-2">
                        <Button variant="primary" onClick={confirmar} disabled={!selectedCurso}>
                            Confirmar
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-md-center mt-4">
                <Col xs={12} md={6} className="text-center">
                    <Button variant="success" disabled>
                        Botón Verde
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

const styles = {
    container: {
        backgroundImage: `url(${ImgFondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
        borderRadius: '10px',
        color: 'white'
    }
};

export default ObtenerQR;
