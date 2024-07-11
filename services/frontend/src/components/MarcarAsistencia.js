import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function MarcarAsistencia({ currentUser }) {
    const { t } = useTranslation("global");
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState('');
    const [validador, setValidador] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (currentUser && currentUser.id) {
            console.log("Fetching student courses and info...");
            axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}/asignaturas`)
                .then(response => {
                    const courses = response.data;
                    console.log("Courses fetched:", courses);
                    setCursos(courses);
                })
                .catch(error => {
                    console.error('Error fetching student info:', error);
                    setError('Error al cargar los cursos del estudiante');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [currentUser]);

    const handleCursoChange = (event) => {
        setSelectedCurso(event.target.value);
    };

    const handleValidadorChange = (event) => {
        setValidador(event.target.value);
    };

    const submitAsistencia = async () => {
        console.log(`Submitting attendance for course ${selectedCurso} with validator ${validador}`);
        const currentDate = new Date().toISOString().split('T')[0];

        try {
            const verifyResponse = await axios.post('http://localhost:5000/api/verify_link', {
                course: selectedCurso,
                link: validador,
                date: currentDate
            });

            if (verifyResponse.status === 200) {
                const attendanceResponse = await axios.post('http://localhost:5000/api/mark-attendance', {
                    token_info: validador,
                    student_id: currentUser.id
                });

                if (attendanceResponse.status === 200) {
                    setSuccess('Asistencia marcada correctamente');
                    setError('');
                } else {
                    setError('Error al registrar la asistencia');
                    setSuccess('');
                }
            } else {
                setError('Link de validación incorrecto');
                setSuccess('');
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            setError('Error al marcar asistencia');
            setSuccess('');
        }
    };

    if (loading) {
        return (
            <Container className="mt-4">
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
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h1>Marcar Asistencia</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Seleccione su curso:</Form.Label>
                            <Form.Control as="select" value={selectedCurso} onChange={handleCursoChange}>
                                <option value="">Seleccione un curso</option>
                                {cursos.map((curso) => (
                                    <option key={curso.course_id} value={curso.course_id}>{curso.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {selectedCurso && (
                            <Form.Group className="mt-3">
                                <Form.Label>Token de Validación:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el token de validación" value={validador} onChange={handleValidadorChange} />
                            </Form.Group>
                        )}
                        <Button className="mt-3" onClick={submitAsistencia} disabled={!validador || !selectedCurso}>Confirmar</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default MarcarAsistencia;
