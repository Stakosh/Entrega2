import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import ImgFondo from '../img/fondo-1.jpg';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
    const navigate = useNavigate();
    const { t } = useTranslation("global");
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
            alert(t('validationFailed'));
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            alert(t('passwordsDoNotMatch'));
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/reset-password', {
                user_id: userId,
                newPassword: formData.newPassword
            });
            console.log('Password reset successful:', response.data);
            alert(t('passwordResetSuccessful'));
            navigate('/');
        } catch (error) {
            console.error('Password reset failed:', error.response?.data);
            alert(t('passwordResetFailed'));
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
                                    <h2 className="text-center mb-4">{t('validateUser')}</h2>
                                    <Form onSubmit={handleValidateUser}>
                                        <Form.Group controlId="formName" className="mb-3">
                                            <Form.Label>{t('name')}:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder={t('enterYourName')}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formRUT" className="mb-3">
                                            <Form.Label>{t('rut')}:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="rut"
                                                value={formData.rut}
                                                onChange={handleChange}
                                                placeholder={t('enterYourRUT')}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="w-100 mb-2" style={{ backgroundColor: '#83d134', color: 'black' }}>
                                            {t('next')}
                                        </Button>
                                    </Form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-center mb-4">{t('resetPassword')}</h2>
                                    <Form onSubmit={handleResetPassword}>
                                        <Form.Group controlId="formNewPassword" className="mb-3">
                                            <Form.Label>{t('newPassword')}:</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder={t('enterYourNewPassword')}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formConfirmNewPassword" className="mb-3">
                                            <Form.Label>{t('confirmNewPassword')}:</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmNewPassword"
                                                value={formData.confirmNewPassword}
                                                onChange={handleChange}
                                                placeholder={t('confirmYourNewPassword')}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="w-100 mb-2" style={{ backgroundColor: '#83d134', color: 'black' }}>
                                            {t('resetPassword')}
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
