import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function Modalidad({ onModalidadChange }) {
    const { t } = useTranslation("global");

    return (
        <div>
            <h4>{t('comoParticiparas')}</h4>
            <Button variant="success" className="me-2" onClick={() => onModalidadChange('presencial')}>{t('presencial')}</Button>
            <Button variant="secondary" onClick={() => onModalidadChange('online')}>{t('online')}</Button>
        </div>
    );
}

export default Modalidad;
