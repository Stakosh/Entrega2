import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProximosCursos = () => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const response = await axios.get('/api/proximos-cursos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCursos(response.data);
    };
    fetchCursos();
  }, []);

  return (
    <div>
      <h1>Próximos Cursos</h1>
      <ul>
        {cursos.map(curso => (
          <li key={curso.id}>{curso.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProximosCursos;
