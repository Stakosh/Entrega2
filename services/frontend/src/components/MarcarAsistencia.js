import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ImgFondo from '../img/foto-fondo2.jpg';
import { useAuth } from './AuthContext';
import axios from 'axios';

function MarcarAsistencia() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null); // Cambiar a objeto para almacenar id y sigla_curso
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(true);
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
        const date = new Date().toISOString().split('T')[0];  // Fecha actual
        const courseSigla = selectedCurso.sigla_curso; // Usar sigla_curso para la verificación
    
        console.log(`Verifying - Course Sigla: ${courseSigla}, Link: ${link}, Date: ${date}`);
        try {
            const response = await axios.post(`http://localhost:5000/api/verify`, {
                course: courseSigla,
                link: link,
                date: date
            });
            if (response.status === 200) {
                setIsValid(response.data.isValid);
                console.log('Verification result:', response.data);
                // Imprimir los valores después de la verificación
                console.log('Verification result - Link:', link);
                console.log('Verification result - Date:', date);
                console.log('Verification result - Course:', courseSigla);
            }
        } catch (error) {
            console.error('Error verifying link:', error.response || error.message);
            setIsValid(false); // Asumir inválido si ocurre un error
        }
    };

    const confirmarAsistencia = async () => {
        const date = new Date().toISOString().split('T')[0];  // Fecha actual
        console.log(`Confirming Attendance - Course ID: ${selectedCurso.id}, Date: ${date}`);
        if (isValid) {
            try {
                const response = await axios.post(`http://localhost:5000/api/attendances`, {
                    course_id: selectedCurso.id,  // Usar id para el registro de asistencia
                    student_id: currentUser.id,
                    status: 'present',
                    date: date
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
                        <Form.Select aria-label="Select course" onChange={e => {
                            const selected = cursos.find(curso => curso.id === parseInt(e.target.value));
                            setSelectedCurso(selected);
                        }}>
                            <option>Select a course</option>
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.name} ({curso.sigla_curso})
                                </option>
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
