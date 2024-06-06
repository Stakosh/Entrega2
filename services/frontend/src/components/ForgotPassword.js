import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import ImgFondo from '../img/fondo-1.jpg';

function ForgotPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', rut: '', newPassword: '', confirmNewPassword: '' });
    const [userId, setUserId] = useState(null);
    const [step, setStep] = useState(1);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleValidateUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/validate-user', {
                name: formData.name,
                rut: formData.rut
            });
            setUserId(response.data.user_id);
            setStep(2);
        } catch (error) {
            console.error('Validation failed:', error.response?.data);
            alert('Invalid name or RUT, please try again.');
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            alert('Passwords do not match, please try again.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/reset-password', {
                user_id: userId,
                newPassword: formData.newPassword
            });
            console.log('Password reset successful:', response.data);
            alert('Password reset successful. You can now log in with your new password.');
            navigate('/');
        } catch (error) {
            console.error('Password reset failed:', error.response?.data);
            alert('Password reset failed, please try again.');
        }
    };

    return (
        <div style={{ backgroundImage: `url(${ImgFondo})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ height: '100%' }}>
                    <Col md={6} lg={4} className="mt-20">
                        <div className="forgot-password-box bg-white p-4 rounded shadow">
                            {step === 1 ? (
                                <>
                                    <h2 className="text-center mb-4">Validate User</h2>
                                    <Form onSubmit={handleValidateUser}>
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
                                        <Button type="submit" className="w-100 mb-2" style={{ backgroundColor: '#83d134', color: 'black' }}>
                                            Next
                                        </Button>
                                    </Form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-center mb-4">Reset Password</h2>
                                    <Form onSubmit={handleResetPassword}>
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
                                        <Form.Group controlId="formConfirmNewPassword" className="mb-3">
                                            <Form.Label>Confirm New Password:</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmNewPassword"
                                                value={formData.confirmNewPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your new password"
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="w-100 mb-2" style={{ backgroundColor: '#83d134', color: 'black' }}>
                                            Reset Password
                                        </Button>
                                    </Form>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ForgotPassword;
