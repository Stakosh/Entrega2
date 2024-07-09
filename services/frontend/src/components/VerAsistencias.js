// para el profe que vea las asistencias

import React, { useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const VerAsistencias = () => {
    // Datos simulados para la asistencia
    const [asistencia, setAsistencia] = useState([
        { id: 1, nombre: "Ana Pérez", fecha: "2023-07-09", asistio: true },
        { id: 2, nombre: "Juan Martínez", fecha: "2023-07-09", asistio: false },
        { id: 3, nombre: "Sofía Castro", fecha: "2023-07-09", asistio: true },
        { id: 4, nombre: "Carlos López", fecha: "2023-07-09", asistio: false },
    ]);

    // Puede agregar una función para manejar cambios o acciones, como marcar asistencia
    const toggleAsistencia = (id) => {
        setAsistencia(asistencia.map(a => 
            a.id === id ? { ...a, asistio: !a.asistio } : a
        ));
    };

    return (
        <Container>
            <h1>Registro de Asistencia</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Asistencia</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencia.map((a) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.nombre}</td>
                            <td>{a.fecha}</td>
                            <td>{a.asistio ? "Presente" : "Ausente"}</td>
                            <td>
                                <Button variant="info" onClick={() => toggleAsistencia(a.id)}>
                                    Cambiar Estado
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default VerAsistencias;
