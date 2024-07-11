import React, { useState } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NewRegister() {
    const navigate = useNavigate();
    const { t } = useTranslation("global");
    const [formData, setFormData] = useState({
        rut: '',
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

    const calculateDv = (rut) => {
        let suma = 0;
        let mul = 2;
        for (let i = rut.length - 1; i >= 0; i--) {
            suma += parseInt(rut[i]) * mul;
            mul = mul === 7 ? 2 : mul + 1;
        }
        const res = 11 - (suma % 11);
        if (res === 11) return '0';
        if (res === 10) return 'K';
        return res.toString();
    };

    const validateRut = (rut) => {
        const rutParts = rut.split('-');
        if (rutParts.length !== 2) {
            return false;
        }
        const rutNumber = rutParts[0].replace(/\D/g, ''); // Remove non-numeric characters
        const dv = rutParts[1].toUpperCase();
        return calculateDv(rutNumber) === dv;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        if (!validateRut(formData.rut)) {
            setError(t('invalidRut'));
            return;
        }

        const formattedRut = formData.rut.replace(/\D/g, ''); // Remove non-numeric characters and hyphen

        try {
            const response = await fetch('http://localhost:5000/api/creacion-nuevo-alumno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rut: formattedRut,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    tipo_acceso: formData.tipo_acceso
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || t('creationFailed'));
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
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <div className="p-4 rounded shadow-lg bg-white mt-5">
                        <h2 className="text-center mb-4">{t('register')}</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{t('registrationSuccessful')}</Alert>}
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formBasicRut" className="mb-3">
                                <Form.Label>{t('rut')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('enterRut')}
                                    name="rut"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicFirstName" className="mb-3">
                                <Form.Label>{t('firstName')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('enterFirstName')}
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicLastName" className="mb-3">
                                <Form.Label>{t('lastName')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={t('enterLastName')}
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                <Form.Label>{t('email')}</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder={t('enterEmail')}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                <Form.Label>{t('password')}</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder={t('password')}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formConfirmPassword" className="mb-3">
                                <Form.Label>{t('confirmPassword')}</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder={t('confirmPassword')}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicAccessType" className="mb-3">
                                <Form.Label>{t('accessType')}</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="tipo_acceso"
                                    value={formData.tipo_acceso}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="admin">{t('admin')}</option>
                                    <option value="profesor">{t('profesor')}</option>
                                    <option value="alumno">{t('alumno')}</option>
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                {t('register')}
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default NewRegister;
