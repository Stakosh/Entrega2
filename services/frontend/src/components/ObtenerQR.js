import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Spinner, Form, Alert, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useAuth } from './AuthContext';
import axios from 'axios';

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
                    console.error(t('qr.errorFetchingCourses'), error);
                    setError(t('qr.errorFetchingCourses'));
                    setLoading(false);
                });
        } else {
            setError(t('qr.errorFetchingCourses'));
            setLoading(false);
        }
    }, [currentUser, t]);

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
                alert(t('qr.dataSentSuccessfully'));
            })
            .catch(error => {
                console.error(t('qr.errorSendingData'), error);
                setError(t('qr.errorSendingData'));
            });
        } catch (error) {
            console.error(t('qr.errorGeneratingData'), error);
            setError(t('qr.errorGeneratingData'));
        }
    };

    if (loading) {
        return (
            <Container className="mt-4" >
                <Row className="justify-content-md-center">
                    <Col xs={12} className="text-center">
                        <Spinner animation="border" />
                        <p>{t('qr.loadingCourses')}</p>
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
                            <Card.Title className="text-center mb-4">{t('qr.generateQR')}</Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label>{t('qr.selectCourse')}</Form.Label>
                                    <Form.Control as="select" value={selectedCurso} onChange={handleCourseChange}>
                                        <option value="">{t('qr.selectACourse')}</option>
                                        {cursos.map(course => (
                                            <option key={course.sigla_curso} value={course.sigla_curso}>
                                                {course.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <div className="d-grid gap-2 mt-3">
                                    <Button variant="primary" onClick={confirmar} disabled={!selectedCurso}>
                                        {t('qr.confirm')}
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


