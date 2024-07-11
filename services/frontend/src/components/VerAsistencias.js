import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Form, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

function VerAsistencias() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState('');
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser) {
            console.log("Fetching teacher courses...");
            axios.get(`http://localhost:5000/api/professors/${currentUser.id}/cursos2`)
                .then(response => {
                    const data = response.data;
                    console.log("Courses fetched:", data);
                    setCursos(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching teacher courses:', error);
                    setError('Error fetching teacher courses. Please try again later.');
                    setLoading(false);
                });
        } else {
            setError('No current user or user ID found.');
            setLoading(false);
        }
    }, [currentUser]);

    const fetchAttendances = (courseId) => {
        setLoading(true);
        console.log(`Fetching attendances for course ID ${courseId}...`);
        axios.get(`http://localhost:5000/api/courses/${courseId}/attendances`)
            .then(response => {
                const data = response.data;
                console.log("Attendances fetched:", data);
                setAttendances(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching attendances:', error);
                setError('Error fetching attendances. Please try again later.');
                setLoading(false);
            });
    };

    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCurso(courseId);
        if (courseId) {
            fetchAttendances(courseId);
        }
    };

    const getAttendanceData = () => {
        const presentCount = attendances.filter(att => att.status === 'present').length;
        const absentCount = attendances.filter(att => att.status === 'absent').length;

        return {
            labels: [t('Present'), t('Absent')],
            datasets: [
                {
                    data: [presentCount, absentCount],
                    backgroundColor: ['#36A2EB', '#FF6384'],
                    hoverBackgroundColor: ['#36A2EB', '#FF6384']
                }
            ]
        };
    };

    if (loading) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!currentUser) {
        return <Container><h1>{t('loginRequired')}</h1></Container>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container className="py-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflowY: 'auto', maxHeight: '90vh' }}>
                <Row className="justify-content-center align-items-center">
                    <Col md={8} lg={6} xl={10}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                            <h2 className="text-center mb-4">{t('total-attendance')}</h2>
                            <Form.Group>
                                <Form.Label>{t('selectCourse')}</Form.Label>
                                <Form.Control as="select" value={selectedCurso} onChange={handleCourseChange}>
                                    <option value="">{t('selectCourse')}</option>
                                    {cursos.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {selectedCurso && (
                                <div className="mt-4" style={{ width: '60%', margin: '0 auto' }}>
                                    <Pie data={getAttendanceData()} />
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default VerAsistencias;
