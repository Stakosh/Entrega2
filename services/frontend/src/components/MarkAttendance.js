// MarkAttendance.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from './AuthContext';

const MarkAttendance = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        course_id: '',
        present: true
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch courses the student is enrolled in
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/enrollments?rut=${currentUser.rut}`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [currentUser.rut]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const now = new Date();
        const currentHour = now.getUTCHours();

        if (currentHour < 10 || currentHour >= 12) {
            setMessage('You can only mark attendance between 10:00 and 12:00 UTC.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/attendance/mark', {
                rut: currentUser.rut,
                course_id: formData.course_id,
                date: now.toISOString().split('T')[0], // Send date in YYYY-MM-DD format
                present: formData.present
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to mark attendance');
        }
    };

    return (
        <Container>
            <h1>Mark Attendance</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCourse">
                    <Form.Label>Course</Form.Label>
                    <Form.Control as="select" name="course_id" onChange={handleChange} required>
                        <option value="">Select a course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Button type="submit">Mark Attendance</Button>
                {message && <Alert className="mt-3">{message}</Alert>}
            </Form>
        </Container>
    );
};

export default MarkAttendance;
