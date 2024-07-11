import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function MarcarAsistencia({ currentUser }) {
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState('');
    const [validador, setValidador] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (currentUser && currentUser.id) {
            console.log("Fetching student courses...");
            axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}/cursos`)
                .then(response => {
                    const courses = response.data;
                    console.log("Courses fetched:", courses);
                    setCursos(courses);
                })
                .catch(error => {
                    console.error('Error fetching student courses:', error);
                    setError('Error al cargar los cursos');
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
                const attendanceResponse = await axios.post('http://localhost:5000/api/attendances', {
                    student_id: currentUser.id,
                    course_id: selectedCurso,
                    status: 'present',
                    date: currentDate
                });

                if (attendanceResponse.status === 201) {
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
        return <p>Cargando cursos...</p>;
    }

    return (
        <Container>
            <Row>
                <Col>
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
                            <Form.Group>
                                <Form.Label>Validador del Profesor:</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese el validador" value={validador} onChange={handleValidadorChange} />
                            </Form.Group>
                        )}
                        <Button onClick={submitAsistencia} disabled={!validador || !selectedCurso}>Marcar Asistencia</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default MarcarAsistencia;
