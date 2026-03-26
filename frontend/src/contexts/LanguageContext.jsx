import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    settings: 'Paramètres',
    settings_desc: 'Gérez les préférences de votre compte Brand.Ai.',
    general: 'Général',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    email_notif: 'Notifications email',
    security: 'Sécurité',
    auth: 'Authentification',
    enabled: 'Activées',
    disabled: 'Désactivées',
    light: 'Clair',
    dark: 'Sombre',
    french: 'Français',
    english: 'Anglais',
    version: 'Brand.Ai — Version 1.0.0',
    generate_brand: 'Générer une marque',
    my_results: 'Mes résultats',
    about: 'À propos',
    help: 'Aide',
    get_more: 'Obtenir plus',
    logout: 'Déconnexion',
    login: 'Connexion',
  },
  en: {
    settings: 'Settings',
    settings_desc: 'Manage your Brand.Ai account preferences.',
    general: 'General',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    email_notif: 'Email notifications',
    security: 'Security',
    auth: 'Authentication',
    enabled: 'Enabled',
    disabled: 'Disabled',
    light: 'Light',
    dark: 'Dark',
    french: 'French',
    english: 'English',
    version: 'Brand.Ai — Version 1.0.0',
    generate_brand: 'Generate a Brand',
    my_results: 'My Results',
    about: 'About',
    help: 'Help',
    get_more: 'Get more',
    logout: 'Logout',
    login: 'Login',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
