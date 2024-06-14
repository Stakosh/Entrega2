import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      const response = await axios.get('/api/ver-asistencias', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAsistencias(response.data);
    };
    fetchAsistencias();
  }, []);

  return (
    <div>
      <h1>Mis Asistencias</h1>
      <ul>
        {asistencias.map(asistencia => (
          <li key={asistencia.id}>{asistencia.fecha_asistencia} - {asistencia.confirmado ? 'Confirmada' : 'No Confirmada'}</li>
        ))}
      </ul>
    </div>
  );
};

export default VerAsistencias;
