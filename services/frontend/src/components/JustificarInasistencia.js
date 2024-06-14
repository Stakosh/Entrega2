import React, { useState } from 'react';
import axios from 'axios';

const JustificarInasistencia = () => {
  const [certificado, setCertificado] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('/api/justificar-inasistencia', { certificado }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    alert('Justificación enviada correctamente');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Certificado:
        <input
          type="text"
          value={certificado}
          onChange={(e) => setCertificado(e.target.value)}
        />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default JustificarInasistencia;
