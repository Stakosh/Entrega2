import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Modalidad from './Modalidad';
import Restricciones from './Restricciones';
import ImgFondo from '../img/foto-fondo2.jpg';
import { useAuth } from './AuthContext';
import axios from 'axios';

function ProximosCursos() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [modalidad, setModalidad] = useState(null);
    const [encuestaCompletada, setEncuestaCompletada] = useState(false);
    const [showEncuesta, setShowEncuesta] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            console.log("Fetching student courses and info...");
            axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}/cursos`)
                .then(response => {
                    const courses = response.data;
                    console.log("Courses fetched:", courses);
                    setCursos(courses);
                    return axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}`);
                })
                .then(response => {
                    const studentData = response.data;
                    console.log("Student data fetched:", studentData);
                    setEncuestaCompletada(studentData.EncuestaAlimentaria);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching student info:', error);
                    setLoading(false);
                });
        }
    }, [currentUser]);

    const fetchHorarios = (courseId) => {
        console.log(`Fetching schedules for course ID: ${courseId}`);
        return axios.get(`http://localhost:5000/api/curso/${courseId}/horarios`)
            .then(response => {
                const horarios = response.data;
                const horariosUnicos = horarios.reduce((acc, current) => {
                    const x = acc.find(item => item.dia === current.dia && item.hora_inicio === current.hora_inicio && item.hora_fin === current.hora_fin && item.sala === current.sala);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                console.log("Schedules fetched:", horariosUnicos);
                return horariosUnicos;
            })
            .catch(error => {
                console.error('Error fetching course schedules:', error);
                return [];
            });
    };

    const handleConfirmar = async (index) => {
        const curso = cursos[index];
        console.log(`Confirming course: ${curso.name}`);
        const horarios = await fetchHorarios(curso.id);
        if (selectedCurso?.id !== curso.id) {
            setSelectedCurso({ ...curso, horarios });
            setModalidad(null); // Reset modalidad when a new course is selected
            console.log("Selected course with schedules:", { ...curso, horarios });
        }
    };

    const handleModalidadChange = (mode) => {
        setModalidad(mode);
        console.log("Selected modality:", mode);
    };

    const handleSubmit = () => {
        if (!selectedCurso || !modalidad) {
            alert("Debe seleccionar un curso y modalidad.");
            return;
        }
        console.log(`Submitting course confirmation: ${selectedCurso.name}, Modality: ${modalidad}`);
    
        axios.post(`http://localhost:5000/api/estudiante/${currentUser.id}/confirmar-curso`, {
            courseId: selectedCurso.id,
            modality: modalidad
        })
        .then(response => {
            console.log("Course and modality confirmed successfully.");
            alert(`Curso confirmado: ${selectedCurso.name}\nModalidad: ${modalidad}`);
        })
        .catch(error => {
            console.error('Error confirming course and modality:', error);
        });
    };

    const handleEncuestaSubmit = (restricciones) => {
        if (!currentUser || !currentUser.id) {
            console.error("Usuario no autenticado o ID de usuario no disponible.");
            return;
        }
        console.log("Submitting dietary restrictions:", restricciones);
        axios.post(`http://localhost:5000/api/estudiante/${currentUser.id}/restricciones`, restricciones)
            .then(response => {
                setEncuestaCompletada(true);
                setShowEncuesta(false);
                console.log("Dietary restrictions saved successfully.");
            })
            .catch(error => {
                console.error('Error saving dietary restrictions:', error);
            });
    };

    if (loading) {
        console.log("Loading state: true");
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
            </Container>
        );
    }

    if (!currentUser) {
        console.log("User not logged in.");
        return <Container><h1>{t('loginRequired')}</h1></Container>;
    }

    return (
        <div style={{ backgroundImage: `url(${ImgFondo})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Col md={8} lg={6} xl={4}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                            <h2 className="text-center mb-4">{t('proximosCursos')}</h2>
                            <div>
                                {cursos.map((curso, index) => (
                                    <div key={index} className="mb-3">
                                        <p>{curso.sigla_curso} - {curso.name} - Prof: {curso.teacher.nombre}</p>
                                        <Button variant="primary" onClick={() => handleConfirmar(index)} disabled={!encuestaCompletada} style={{ backgroundColor: encuestaCompletada ? '#0d6efd' : '#6c757d' }}>
                                            {t('confirmar')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {selectedCurso && (
                                <div className="mt-4">
                                    <h3>{selectedCurso.sigla_curso} - {selectedCurso.name}</h3>
                                    <div>
                                        {selectedCurso.horarios.map((horario, idx) => (
                                            <p key={idx}>{horario.dia} - {horario.hora_inicio} - {horario.hora_fin} - Sala: {horario.sala}</p>
                                        ))}
                                    </div>
                                    {!modalidad && <Modalidad onModalidadChange={handleModalidadChange} />}
                                    {modalidad && (
                                        <Button variant="primary" onClick={handleSubmit} disabled={!encuestaCompletada} style={{ backgroundColor: encuestaCompletada ? '#0d6efd' : '#6c757d' }}>
                                            {t('confirmar')}
                                        </Button>
                                    )}
                                </div>
                            )}
                            <Button variant="info" className="mt-4" onClick={() => setShowEncuesta(true)}>
                                {t('encuestaAlimentaria')}
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Modal show={showEncuesta} onHide={() => setShowEncuesta(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('encuestaAlimentaria')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Restricciones onSubmit={handleEncuestaSubmit} />
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default ProximosCursos;
