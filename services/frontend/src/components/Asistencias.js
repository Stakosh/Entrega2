import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Asistencias() {
    const navigate = useNavigate();
    const { t } = useTranslation("global");

    return (
        <div>
            <h1>{t('Asistencias')}</h1>
            <button onClick={() => navigate('/teacher-view-attendance')}>{t('Teacher View Attendance')}</button>
            <button onClick={() => navigate('/mark/my/attendance')}>{t('Mark Attendance')}</button>
        </div>
    );
}

export default Asistencias;
