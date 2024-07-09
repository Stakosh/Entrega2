// para el admin que vea las respuestas de las encuestas en varios graficos
// cuantos confirmaron presencial, cuantos online, cuantos no respondieron, etc

// Asegúrate de importar el contexto de autenticación

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const VerEstadisticas = () => {
    // Datos simulados para los gráficos
    const barData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [
            {
                label: 'Visitas por mes',
                data: [65, 59, 80, 81, 56],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const doughnutData = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

    const lineData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [
            {
                label: 'Ganancias',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56],
            },
        ],
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Gráfico de Barras - Visitas por Mes</Card.Title>
                            <Bar data={barData} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Gráfico de Dona - Distribución de Colores</Card.Title>
                            <Doughnut data={doughnutData} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title>Gráfico de Líneas - Ganancias por Mes</Card.Title>
                            <Line data={lineData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default VerEstadisticas;
