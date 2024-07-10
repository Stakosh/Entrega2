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
                const justificacionesData = response.data;
                const justificacionesConNombres = await Promise.all(justificacionesData.map(async (justificacion) => {
                    const res = await axios.get(`http://localhost:5000/api/estudiante/${justificacion.student_id}/info/existencia`);
                    return {...justificacion, student_name: res.data.nombre_completo};
                }));
                setJustificaciones(justificacionesConNombres);
            } catch (error) {
                console.error('Error fetching justifications:', error);
            }
        };

        fetchJustificaciones();
    }, []);

    const handleAprobar = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/justificacion/${id}/aprobar`);
            if (response.status === 200) {
                setJustificaciones(prev => prev.filter(justificacion => justificacion.id !== id));
            }
        } catch (error) {
            console.error('Error approving justification:', error);
        }
    };

    const handleRechazar = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/justificacion/${id}/rechazar`);
            if (response.status === 200) {
                setJustificaciones(prev => prev.filter(justificacion => justificacion.id !== id));
            }
        } catch (error) {
            console.error('Error rejecting justification:', error);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!justificaciones.length) {
        return <Container><h2>{t('noJustifications')}</h2></Container>;
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
                        <th>{t('subjects')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {justificaciones.map(justificacion => (
                        <tr key={justificacion.id}>
                            <td>{justificacion.student_name}</td>
                            <td>{justificacion.fecha_desde} - {justificacion.fecha_hasta}</td>
                            <td>{justificacion.razones}</td>
                            <td>
                                {justificacion.archivos.split(',').map((archivo, index) => (
                                    <a key={index} href={`http://localhost:5000/uploads/${archivo}`} download>{archivo}</a>
                                ))}
                            </td>
                            <td>
                                {justificacion.asignaturas.join(', ')}
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
