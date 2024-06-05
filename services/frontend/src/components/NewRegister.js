import React, { useState } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NewRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_id: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        tipo_acceso: 'alumno'  // Default value for tipo_acceso
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // To handle success state

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/creacion-nuevo-alumno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: formData.student_id,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    tipo_acceso: formData.tipo_acceso
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create credential');
            }

            console.log('Credential created:', data);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000); // Redirect after a short delay
        } catch (error) {
            setError(error.message);
            setSuccess(false);
        }
    };

    return (
        <Container>
            <Row>
                <Col md={6} className="offset-md-3">
                    <div className="p-4 rounded shadow-lg bg-white mt-5">
                        <h2 className="text-center mb-4">Register</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">Registration successful! Redirecting...</Alert>}
                        <Form onSubmit={handleFormSubmit}>
                            {/* Student ID */}
                            <Form.Group controlId="formBasicStudentId" className="mb-3">
                                <Form.Label>Student ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter student ID"
                                    name="student_id"
                                    value={formData.student_id}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* First Name */}
                            <Form.Group controlId="formBasicFirstName" className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Last Name */}
                            <Form.Group controlId="formBasicLastName" className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Email Address */}
                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Password */}
                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Confirm Password */}
                            <Form.Group controlId="formConfirmPassword" className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {/* Access Type */}
                            <Form.Group controlId="formBasicAccessType" className="mb-3">
                                <Form.Label>Access Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="tipo_acceso"
                                    value={formData.tipo_acceso}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="admin">admin</option>
                                    <option value="profesor">profesor</option>
                                    <option value="alumno">alumno</option>
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Register
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default NewRegister;
