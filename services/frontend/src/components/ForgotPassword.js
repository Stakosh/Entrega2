import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import ImgFondo from '../img/fondo-1.jpg';

function ForgotPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', rut: '', newPassword: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/forgot-password', formData);
            console.log('Password reset successful:', response.data);
            alert('Password reset successful. You can now log in with your new password.');
            navigate('/');
        } catch (error) {
            console.error('Password reset failed:', error.response?.data);
            alert('Invalid credentials, please try again.');
        }
    };

    return (
        <div style={{ backgroundImage: `url(${ImgFondo})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ height: '100%' }}>
                    <Col md={6} lg={4} className="mt-20">
                        <div className="forgot-password-box bg-white p-4 rounded shadow">
                            <h2 className="text-center mb-4">Forgot Password</h2>
                            <Form onSubmit={handleFormSubmit}>
                                <Form.Group controlId="formName" className="mb-3">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formRUT" className="mb-3">
                                    <Form.Label>RUT:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="rut"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        placeholder="Enter your RUT (e.g., 1.111.111-1)"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword" className="mb-3">
                                    <Form.Label>New Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter your new password"
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="w-100 mb-2" style={{ backgroundColor: '#83d134', color: 'black' }}>
                                    Reset Password
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ForgotPassword;
