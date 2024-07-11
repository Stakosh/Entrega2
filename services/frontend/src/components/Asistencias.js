import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Spinner, Alert, Form } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { format, eachDayOfInterval, getDay, endOfMonth, startOfMonth } from 'date-fns';

function Asistencias() {
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
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                        <th>Sábado</th>
                        <th>Domingo</th>
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
            <Container className="mt-4">
                <Row className="justify-content-md-center">
                    <Col xs={12} className="text-center">
                        <Spinner animation="border" />
                        <p>Loading attendances...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
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
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            {selectedCurso && (
                <Row className="justify-content-md-center mt-4">
                    <Col xs={12} md={8}>
                        {renderAllCalendars()}
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default Asistencias;
