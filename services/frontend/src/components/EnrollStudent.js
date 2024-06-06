import React, { useState } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function EnrollStudent() {
    const [formData, setFormData] = useState({ rut: '', course_id: '' });
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/enroll', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to enroll student');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleFormSubmit} className="mt-4">
                        <Form.Group controlId="formRut">
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                                type="text"
                                name="rut"
                                value={formData.rut}
                                onChange={handleChange}
                                placeholder="Enter student RUT"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCourseId">
                            <Form.Label>Course ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="course_id"
                                value={formData.course_id}
                                onChange={handleChange}
                                placeholder="Enter course ID"
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-3">Enroll Student</Button>
                        {message && <Alert className="mt-3">{message}</Alert>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EnrollStudent;
