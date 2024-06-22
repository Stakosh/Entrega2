import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function Restricciones({ onSubmit }) {
    const { t } = useTranslation("global");
    const [restricciones, setRestricciones] = useState({
        celiaco: false,
        lactosa: false,
        otra: ''
    });

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
            <Form.Check 
                type="checkbox"
                label={t('celiaquia')}
                name="celiaco"
                checked={restricciones.celiaco}
                onChange={handleRestriccionChange}
                className="mb-2"
            />
            <Form.Check 
                type="checkbox"
                label={t('intoleranciaLactosa')}
                name="lactosa"
                checked={restricciones.lactosa}
                onChange={handleRestriccionChange}
                className="mb-2"
            />
            <Form.Group className="mb-3">
                <Form.Label>{t('otra')}</Form.Label>
                <Form.Control
                    type="text"
                    name="otra"
                    value={restricciones.otra}
                    onChange={handleRestriccionChange}
                />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>{t('confirmar')}</Button>
        </div>
    );
}

export default Restricciones;