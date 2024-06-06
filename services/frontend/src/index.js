import React from 'react';
import { createRoot } from 'react-dom/client'; // Import from react-dom/client
import App from './App'; // Import your App component
import './index.css';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import global_es from "./traducciones/es/translation.json";
import global_en from "./traducciones/en/translation.json";

i18next.init({
    interpolation: { escapeValue: false }, // React already does escaping
    lng: 'es', // language to use
    resources: {
        es: {
        global: global_es // 'common' is our custom namespace
        },
        en: {
        global: global_en
        },
    },
    });


// Create a root element and render the App component
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <I18nextProvider i18n={i18next}>
        <App />
    </I18nextProvider>
);

