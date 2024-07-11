import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import { useTranslation } from 'react-i18next';

function VerEstadisticas() {
    const { t } = useTranslation("global");
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/statistics')
            .then(response => {
                setStatistics(response.data);
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
            });
    }, []);

    if (!statistics) {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                </Spinner>
            </Container>
        );
    }

    const encuestaAlimentariaData = {
        labels: [t('Participated'), t('Not Participated')],
        datasets: [{
            data: [
                statistics.encuesta_alimentaria.true || 0,
                statistics.encuesta_alimentaria.false || 0
            ],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    const attendanceData = {
        labels: [t('Present'), t('Absent')],
        datasets: [{
            data: [
                statistics.attendance.present || 0,
                statistics.attendance.absent || 0
            ],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    const modalidadData = {
        labels: [t('Presencial'), t('Online')],
        datasets: [{
            data: [
                statistics.modalidad.presencial || 0,
                statistics.modalidad.online || 0
            ],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    const justificacionesData = {
        labels: [t('Pendiente'), t('Aprobada'), t('Rechazada')],
        datasets: [{
            data: [
                statistics.justificaciones.pendiente || 0,
                statistics.justificaciones.aprobada || 0,
                statistics.justificaciones.rechazada || 0
            ],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
        }]
    };

    const dietaryRestrictionsData = {
        labels: [t('Vegano'), t('Celiaco'), t('Diabetico Tipo 1'), t('Diabetico Tipo 2'), t('Alergico'), t('Vegetariano'), t('Intolerante a la Lactosa'), t('Otra')],
        datasets: [{
            data: [
                statistics.dietary_restrictions.vegano || 0,
                statistics.dietary_restrictions.celiaco || 0,
                statistics.dietary_restrictions.diabetico_tipo1 || 0,
                statistics.dietary_restrictions.diabetico_tipo2 || 0,
                statistics.dietary_restrictions.alergico || 0,
                statistics.dietary_restrictions.vegetariano || 0,
                statistics.dietary_restrictions.intolerante_lactosa || 0,
                statistics.dietary_restrictions.otra || 0
            ],
            backgroundColor: '#36A2EB'
        }]
    };

    return (
        <Container style={{ padding: '40px' }}>
            <Row className="justify-content-center align-items-center">
                <Col md={8} lg={6} xl={4} className="mb-4">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                        <h3 className="text-center mb-4">{t('encuestaAlimentaria')}</h3>
                        <Pie data={encuestaAlimentariaData} />
                    </div>
                </Col>
                <Col md={8} lg={6} xl={4} className="mb-4">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                        <h3 className="text-center mb-4">{t('asistencia')}</h3>
                        <Pie data={attendanceData} />
                    </div>
                </Col>
                <Col md={8} lg={6} xl={4} className="mb-4">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                        <h3 className="text-center mb-4">{t('modalidadDeAsistencia')}</h3>
                        <Pie data={modalidadData} />
                    </div>
                </Col>
                <Col md={8} lg={6} xl={4} className="mb-4">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                        <h3 className="text-center mb-4">{t('justificaciones')}</h3>
                        <Pie data={justificacionesData} />
                    </div>
                </Col>
                <Col md={12} className="mb-4">
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                        <h3 className="text-center mb-4">{t('dietaryRestrictions')}</h3>
                        <Bar data={dietaryRestrictionsData} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default VerEstadisticas;
