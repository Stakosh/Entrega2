import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';

const MarcarAsistencia = () => {
    const { sessionId } = useParams();  // Suponiendo que la URL contiene un parámetro 'sessionId'
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Aquí podrías verificar si la sesión es válida o si el estudiante ya marcó asistencia
        checkSessionValidity(sessionId);
    }, [sessionId]);

    const checkSessionValidity = (sessionId) => {
        // Simulación: Supón que llamas a una API para verificar
        if (sessionId === '123') {  // Asume que '123' es una ID de sesión válida
            setStatus('valid');
        } else {
            setStatus('invalid');
        }
    };

    const markAttendance = () => {
        // Simulación de marcar asistencia
        console.log(`Asistencia marcada para la sesión ${sessionId}`);
        setStatus('marked');
        setTimeout(() => navigate('/inicio'), 2000);  // Redirigir después de marcar
    };

    return (
        <Container className="mt-4">
            <h1>Marcar Asistencia</h1>
            {status === 'valid' && (
                <Button variant="success" onClick={markAttendance}>
                    Marcar Asistencia
                </Button>
            )}
            {status === 'marked' && (
                <Alert variant="success">
                    Asistencia marcada con éxito. Redirigiendo...
                </Alert>
            )}
            {status === 'invalid' && (
                <Alert variant="danger">
                    Sesión inválida o expirada.
                </Alert>
            )}
        </Container>
    );
};

export default MarcarAsistencia;
