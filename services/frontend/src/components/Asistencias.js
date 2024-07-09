import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';

function Asistencias() {
    const [attendances, setAttendances] = useState([]);

    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/attendances', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`  // Asegúrate de incluir el token JWT adecuadamente
                    }
                });
                setAttendances(response.data);
            } catch (error) {
                console.error('Error fetching attendances:', error);
            }
        };

        fetchAttendances();
    }, []);

    return (
        <Container>
            <h2>Mis Asistencias</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Curso</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map((attendance, index) => (
                        <tr key={index}>
                            <td>{attendance.date}</td>
                            <td>{attendance.course}</td>
                            <td>{attendance.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Asistencias;
