import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto de idioma
const LanguageContext = createContext();

// Creamos un proveedor de contexto para manejar el estado del idioma
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Por defecto, establecemos el idioma en inglés

  // Función para cambiar el idioma
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto de idioma
export const useLanguage = () => {
  return useContext(LanguageContext);
};