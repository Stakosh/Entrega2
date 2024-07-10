import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function Restricciones({ onSubmit }) {
    const { t } = useTranslation("global");
    const [restricciones, setRestricciones] = useState({
        vegano: false,
        celiaco: false, // Asegúrate que 'lactosa' es el nombre correcto usado en el backend
        diabetico_tipo1: false,
        diabetico_tipo2: false,
        alergico: false,
        vegetariano: false,
        intolerante_lactosa: false,
        otra: ''
    });
//['vegano', 'celiaco', 'diabetico_tipo1', 'diabetico_tipo2', 'alergico', 'vegetariano', 'intolerante-lactosa']:
    const handleRestriccionChange = (event) => {
        const { name, checked, value } = event.target;
        setRestricciones(prevState => ({
            ...prevState,
            [name]: name === 'otra' ? value : checked
        }));
    };

    const handleSubmit = () => {
        onSubmit(restricciones);
    };

    return (
        <div>
            <h4>{t('tienesRestriccion')}</h4>
            {Object.keys(restricciones).map((key, index) => (
                key !== 'otra' ? (
                    <Form.Check 
                        key={index}
                        type="checkbox"
                        label={t(key)} // Asegúrate de tener las traducciones correctas en tus archivos de localización
                        name={key}
                        checked={restricciones[key]}
                        onChange={handleRestriccionChange}
                        className="mb-2"
                    />
                ) : (
                    <Form.Group key={index} className="mb-3">
                        <Form.Label>{t(key)}</Form.Label>
                        <Form.Control
                            type="text"
                            name={key}
                            value={restricciones[key]}
                            onChange={handleRestriccionChange}
                        />
                    </Form.Group>
                )
            ))}
            <Button variant="primary" onClick={handleSubmit}>{t('confirmar')}</Button>
        </div>
    );
}

export default Restricciones;
