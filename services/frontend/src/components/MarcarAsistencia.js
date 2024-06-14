import React, { useState } from 'react';
import axios from 'axios';

const MarcarAsistencia = () => {
  const [idClase, setIdClase] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/marcar-asistencia', { id_clase: idClase }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    alert('Asistencia marcada correctamente');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID Clase:
        <input
          type="text"
          value={idClase}
          onChange={(e) => setIdClase(e.target.value)}
        />
      </label>
      <button type="submit">Marcar Asistencia</button>
    </form>
  );
};

export default MarcarAsistencia;
