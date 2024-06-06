import React, { useState } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function AdminAddCourse() {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/add-course', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to add course');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleFormSubmit} className="mt-4">
                        <Form.Group controlId="formCourseName">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter course name"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCourseDescription">
                            <Form.Label>Course Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter course description"
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-3">Add Course</Button>
                        {message && <Alert className="mt-3">{message}</Alert>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminAddCourse;
