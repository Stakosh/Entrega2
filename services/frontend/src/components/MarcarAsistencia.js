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
    const [selectedCurso, setSelectedCurso] = useState(null);
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
        const date = new Date().toISOString().split('T')[0];
        const courseSigla = selectedCurso.sigla_curso;
    
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
                console.log('Verification result - Link:', link);
                console.log('Verification result - Date:', date);
                console.log('Verification result - Course:', courseSigla);
            }
        } catch (error) {
            console.error('Error verifying link:', error.response || error.message);
            setIsValid(false);
        }
    };

    const confirmarAsistencia = async () => {
        const date = new Date().toISOString().split('T')[0];
        console.log(`Confirming Attendance - Course ID: ${selectedCurso.id}, Date: ${date}`);
        if (isValid) {
            try {
                const response = await axios.post(`http://localhost:5000/api/attendances`, {
                    course_id: selectedCurso.id,
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
            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 className="text-center mb-4">{t("attendance.markAttendance")}</h2>
                {loading ? (
                    <Spinner animation="border" variant="primary" />
                ) : (
                    <>
                        <Form.Select aria-label="Select course" onChange={e => {
                            const selected = cursos.find(curso => curso.id === parseInt(e.target.value));
                            setSelectedCurso(selected);
                        }}>
                            <option>{t("selectCourse")}</option>
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.id}>
                                    {curso.name} ({curso.sigla_curso})
                                </option>
                            ))}
                        </Form.Select>
                        {selectedCurso && (
                            <>
                                <Form.Group className="mb-3" controlId="formLink">
                                    <Form.Label>{t("verificationLink")}</Form.Label>
                                    <Form.Control type="text" placeholder={t("enterLink")} onChange={e => setLink(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary" onClick={verificarInformacion}>{t("verifyInformation")}</Button>
                            </>
                        )}
                        {isValid !== null && (
                            <Alert variant={isValid ? 'success' : 'danger'}>
                                {isValid ? t("verificationSuccessful") : t("verificationFailed")}
                            </Alert>
                        )}
                        {isValid && (
                            <Button variant="success" onClick={confirmarAsistencia}>{t("confirmAttendance")}</Button>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

export default MarcarAsistencia;
