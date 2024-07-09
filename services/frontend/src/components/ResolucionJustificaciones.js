import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ResolucionJustificaciones() {
    const { t } = useTranslation("global");
    const { isAuthenticated } = useAuth();
    const [justificaciones, setJustificaciones] = useState([]);

    useEffect(() => {
        const fetchJustificaciones = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/justificaciones/pendientes');
                setJustificaciones(response.data);
            } catch (error) {
                console.error('Error fetching justifications:', error);
            }
        };

        fetchJustificaciones();
    }, []);

    const handleAprobar = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/justificacion/${id}/aprobar`);
            setJustificaciones(justificaciones.filter(justificacion => justificacion.id !== id));
        } catch (error) {
            console.error('Error approving justification:', error);
        }
    };

    const handleRechazar = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/justificacion/${id}/rechazar`);
            setJustificaciones(justificaciones.filter(justificacion => justificacion.id !== id));
        } catch (error) {
            console.error('Error rejecting justification:', error);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Container>
            <h2 className="text-center my-4">{t('pendingJustifications')}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>{t('student')}</th>
                        <th>{t('dateRange')}</th>
                        <th>{t('reasons')}</th>
                        <th>{t('attachments')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {justificaciones.map(justificacion => (
                        <tr key={justificacion.id}>
                            <td>{justificacion.student.first_name} {justificacion.student.last_name}</td>
                            <td>{justificacion.fecha_desde} - {justificacion.fecha_hasta}</td>
                            <td>{justificacion.razones}</td>
                            <td>
                                {justificacion.archivos.split(',').map((archivo, index) => (
                                    <a key={index} href={`http://localhost:5000/uploads/${archivo}`} download>{archivo}</a>
                                ))}
                            </td>
                            <td>
                                <Button variant="success" onClick={() => handleAprobar(justificacion.id)}>{t('approve')}</Button>
                                <Button variant="danger" onClick={() => handleRechazar(justificacion.id)}>{t('reject')}</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ResolucionJustificaciones;
