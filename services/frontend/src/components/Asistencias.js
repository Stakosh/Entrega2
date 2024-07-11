import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Form, Alert, Table } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { format, eachDayOfInterval, getDay, endOfMonth, startOfMonth } from 'date-fns';
import ImgFondo from '../img/foto-fondo2.jpg';
import { useTranslation } from 'react-i18next';

function Asistencias() {
    const { t } = useTranslation("global");
    const { currentUser } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState('');
    const [attendances, setAttendances] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser) {
            console.log("Fetching student courses...");
            axios.get(`http://localhost:5000/api/estudiante/${currentUser.id}/cursos`)
                .then(response => {
                    const data = response.data;
                    console.log("Courses fetched:", data);
                    setCursos(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching student courses:', error);
                    setError('Error fetching student courses. Please try again later.');
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
                fetchSchedules(courseId);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching attendances:', error);
                setError('Error fetching attendances. Please try again later.');
                setLoading(false);
            });
    };

    const fetchSchedules = (courseId) => {
        console.log(`Fetching schedules for course ID ${courseId}...`);
        axios.get(`http://localhost:5000/api/curso/${courseId}/horarios`)
            .then(response => {
                const data = response.data;
                console.log("Schedules fetched:", data);
                setSchedules(data);
            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
                setError('Error fetching schedules. Please try again later.');
            });
    };

    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        setSelectedCurso(courseId);
        if (courseId) {
            fetchAttendances(courseId);
        }
    };

    const renderCalendarForMonth = (month) => {
        const start = startOfMonth(new Date(new Date().getFullYear(), month, 1));
        const end = endOfMonth(start);
        const days = eachDayOfInterval({ start, end });

        const weeks = [];
        let currentWeek = [];

        // Padding days before the start of the month
        for (let i = 0; i < getDay(start); i++) {
            currentWeek.push(<td key={`empty-${i}`} className="bg-light"></td>);
        }

        days.forEach((day) => {
            const attendance = attendances.find(att => format(new Date(att.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
            let statusClass = '';
            if (attendance) {
                statusClass = attendance.status === 'present' ? 'bg-success' : 'bg-danger';
            } else if (getDay(day) === 0 || getDay(day) === 6) { // Check if it's a weekend
                statusClass = 'bg-light';
            } else {
                statusClass = schedules.find(schedule => schedule.dia === format(day, 'EEEE')) ? 'bg-white' : 'bg-light';
            }

            currentWeek.push(
                <td key={format(day, 'yyyy-MM-dd')} className={statusClass}>{format(day, 'dd')}</td>
            );

            if (currentWeek.length === 7) {
                weeks.push(<tr key={format(day, 'yyyy-MM-dd')}>{currentWeek}</tr>);
                currentWeek = [];
            }
        });

        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(<td key={`empty-${currentWeek.length}`} className="bg-light"></td>);
            }
            weeks.push(<tr key={`last-${currentWeek.length}`}>{currentWeek}</tr>);
        }

        return (
            <Table bordered key={month}>
                <thead>
                    <tr>
                        <th>{t('monday')}</th>
                        <th>{t('tuesday')}</th>
                        <th>{t('wednesday')}</th>
                        <th>{t('thursday')}</th>
                        <th>{t('friday')}</th>
                        <th>{t('saturday')}</th>
                        <th>{t('sunday')}</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks}
                </tbody>
            </Table>
        );
    };

    const renderAllCalendars = () => {
        const months = [2, 3, 4, 5, 6]; // March to July
        return months.map(month => (
            <div key={month} className="mb-4">
                <h5>{format(new Date(new Date().getFullYear(), month, 1), 'MMMM yyyy')}</h5>
                {renderCalendarForMonth(month)}
            </div>
        ));
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
        <div style={{  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Container className="mt-4">
                <Row className="justify-content-center align-items-center">
                    <Col md={8} lg={6} xl={10}>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                            <h2 className="text-center mb-4">{t('asistencia')}</h2>
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
                                <div className="mt-4">
                                    {renderAllCalendars()}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Asistencias;
