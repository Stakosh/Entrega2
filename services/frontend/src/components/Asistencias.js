
import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ImgFondo from '../img/fondo-1.jpg';

function Asistencias() {
    const { t } = useTranslation("global");
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);

    useEffect(() => {
        // Simulando la obtención de datos de una API
        setCursos([
            { curso: 'Programación Profe.', fecha: '18/06 11:45', sala: '202D' },
            { curso: 'Matemáticas Avanzadas', fecha: '19/06 10:00', sala: '303B' },
            { curso: 'Física Teórica', fecha: '20/06 09:00', sala: '101A' }
        ]);
    }, []);

    const handleConfirmar = (index) => {
        setSelectedCurso(cursos[index]);
    };

    const renderAttendanceGrid = () => {
        const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const attendance = [
            ['white', 'green', 'red', 'white', 'white'],
            ['green', 'white', 'white', 'red', 'white'],
            ['white', 'white', 'white', 'white', 'green']
        ];

        return (
            <Table bordered>
                <thead>
                    <tr>
                        {daysOfWeek.map((day, index) => (
                            <th key={index}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((week, rowIndex) => (
                        <tr key={rowIndex}>
                            {week.map((color, colIndex) => (
                                <td key={colIndex} style={{ backgroundColor: color }}></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    return (
        <div style={{ 
            backgroundImage: `url(${ImgFondo})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <Col md={8} lg={6} xl={4}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}>
                            <h2 className="text-center mb-4">{t('proximosCursos')}</h2>
                            <div>
                                {cursos.map((curso, index) => (
                                    <div key={index} className="mb-3">
                                        <p>{curso.curso} - {curso.fecha} - {curso.sala}</p>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleConfirmar(index)}
                                        >
                                            {t('verAsistencias')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {selectedCurso && (
                                <div className="mt-4">
                                    <h3>{selectedCurso.curso} - {selectedCurso.fecha} - {selectedCurso.sala}</h3>
                                    {renderAttendanceGrid()}
                                </div>
                            )}
                            <div className="mt-4">
                                <h4>{t('leyenda')}</h4>
                                <p><span style={{ backgroundColor: 'red', padding: '5px 10px' }}></span> {t('inasistencia')}</p>
                                <p><span style={{ backgroundColor: 'green', padding: '5px 10px' }}></span> {t('asistencia')}</p>
                                <p><span style={{ backgroundColor: 'white', padding: '5px 10px', border: '1px solid #ccc' }}></span> {t('noHayClases')}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Asistencias;
