// TeacherViewAttendance.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TeacherViewAttendance = () => {
    const { currentUser } = useAuth();
    const [rut, setRut] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        // Fetch all courses
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);

        if (rut) {
            try {
                const response = await axios.get(`http://localhost:5000/api/attendance/records?rut=${rut}&course_id=${courseId}`);
                setAttendance(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        }
    };

    const handleRutChange = (e) => {
        setRut(e.target.value);
    };

    const handleFetchAttendance = async () => {
        if (rut && selectedCourse) {
            try {
                const response = await axios.get(`http://localhost:5000/api/attendance/records?rut=${rut}&course_id=${selectedCourse}`);
                setAttendance(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        }
    };

    return (
        <Container>
            <h1>View Student Attendance</h1>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Enter Student RUT</Form.Label>
                        <Form.Control type="text" value={rut} onChange={handleRutChange} placeholder="Enter RUT" />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Select Course</Form.Label>
                        <Form.Control as="select" onChange={handleCourseChange}>
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Button onClick={handleFetchAttendance} disabled={!rut || !selectedCourse}>Fetch Attendance</Button>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map(record => (
                        <tr key={record.date}>
                            <td>{record.date}</td>
                            <td>{record.present ? 'Present' : 'Absent'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default TeacherViewAttendance;
