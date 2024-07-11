import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Modal, Spinner, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ImgFondo from '../img/foto-fondo2.jpg';
import { useAuth } from './AuthContext';
import axios from 'axios';

function MarcarAsistencia() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}/cursos`)
            .then(response => {
                setCursos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, [currentUser]);

    const verificarInformacion = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/verify`, {
                course: selectedCurso,
                link: link,
                date: new Date().toISOString().split('T')[0]
            });
            setIsValid(response.data.isValid);
            console.log('Verification result:', response.data);
        } catch (error) {
            console.error('Error verifying link:', error);
        }
    };

    const confirmarAsistencia = async () => {
        if (isValid) {
            try {
                const response = await axios.post(`http://localhost:5000/api/attendances`, {
                    course_id: selectedCurso,
                    student_id: currentUser.id,
                    status: 'present',
                    date: new Date().toISOString().split('T')[0]
                });
                console.log('Attendance confirmed:', response.data);
            } catch (error) {
                console.error('Error confirming attendance:', error);
            }
        }
    };

    return (
        <div style={{ backgroundImage: `url(${ImgFondo})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container className="d-flex flex-column justify-content-center align-items-center">
                <h2 className="text-light">{t("attendance.markAttendance")}</h2>
                {loading ? (
                    <Spinner animation="border" variant="light" />
                ) : (
                    <>
                        <Form.Select aria-label="Select course" onChange={e => setSelectedCurso(e.target.value)}>
                            <option>Select a course</option>
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.id}>{curso.name}</option>
                            ))}
                        </Form.Select>
                        {selectedCurso && (
                            <>
                                <Form.Group className="mb-3" controlId="formLink">
                                    <Form.Label>Verification Link</Form.Label>
                                    <Form.Control type="text" placeholder="Enter link or data here" onChange={e => setLink(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary" onClick={verificarInformacion}>Verify Information</Button>
                            </>
                        )}
                        {isValid !== null && (
                            <Alert variant={isValid ? 'success' : 'danger'}>
                                {isValid ? 'Verification Successful. Confirming attendance...' : 'Verification Failed. Please try again.'}
                            </Alert>
                        )}
                        {isValid && (
                            <Button variant="success" onClick={confirmarAsistencia}>Confirm Attendance</Button>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

export default MarcarAsistencia;
