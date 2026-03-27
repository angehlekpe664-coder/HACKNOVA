import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    // Settings
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
    
    // Sidebar & Header
    generate_brand: 'Générer une marque',
    my_results: 'Mes résultats',
    about: 'À propos',
    help: 'Aide',
    get_more: 'Obtenir plus',
    logout: 'Déconnexion',
    login: 'Connexion',
    credit_hacknova: 'Développé par le groupe HACKNOVA',
    challenge_technova: 'Créé pour le challenge de technologie TECHNOVA',
    
    // About Page
    about_title: 'À propos de Brand.Ai',
    about_subtitle: 'L\'avenir du design d\'identité propulsé par l\'IA.',
    mission_title: 'Notre Mission',
    mission_desc: 'Simplifier la création de marque pour les entrepreneurs du monde entier en utilisant les technologies d\'intelligence artificielle les plus avancées.',
    tech_title: 'Technologies Utilisées',
    gemini_desc: 'Utilisé pour le raisonnement stratégique de marque et la génération de logos vectoriels SVG haute fidélité.',
    sd_desc: 'Générateur d\'images utilisé en appoint pour créer des rendus visuels riches et inspirants.',
    langchain_desc: 'Orchestration intelligente des agents IA pour garantir des résultats cohérents et professionnels.',
    react_desc: 'Une interface utilisateur moderne, rapide et réactive en mode sombre natif.',

    // Help Page
    help_title: 'Centre d\'Aide',
    help_subtitle: 'Tout ce que vous devez savoir pour réussir votre branding.',
    faq_title: 'Questions Fréquentes',
    q1: 'Comment obtenir les meilleurs résultats ?',
    a1: 'Soyez précis dans le nom et le secteur d\'activité. Plus le contexte est clair, plus l\'IA sera pertinente.',
    q2: 'Puis-je utiliser les logos commercialement ?',
    a2: 'Oui, les identités générées sont destinées à votre usage professionnel.',
    q3: 'Qu\'est-ce que le Kit ZIP ?',
    a3: 'C\'est un dossier contenant votre logo SVG (vectoriel), votre palette de couleurs et votre guide de style.',
    tips_title: 'Conseils de Pro',
    tips_desc: 'Utilisez des mots-clés évocateurs pour le secteur d\'activité pour influencer la direction artistique de l\'IA.',
    contact_title: 'Besoin d\'aide ?',
    contact_desc: 'Notre équipe support est là pour vous accompagner dans votre aventure créative.',
    
    // Generator
    welcome: 'Bienvenue',
    brand_name_placeholder: 'Nom de la marque',
    industry_placeholder: 'Secteur d\'activité',
    generating: 'Génération...',
    generate_btn: 'Générer mon branding',
    auth_required_msg: 'Vous devez être connecté pour générer une marque.',
    ai_error: 'Erreur IA',
    error_try_again: 'Impossible de générer la marque. Veuillez réessayer.',
    server_error: 'Erreur de connexion avec le serveur Backend.',
    
    // History
    history_title: 'Historique des générations',
    history_subtitle: 'Retrouvez toutes vos anciennes créations ici.',
    confirm_clear_history: 'Voulez-vous vraiment effacer tout votre historique ?',
    clear_btn: 'Vider',
    no_history: 'Aucun historique',
    no_history_desc: 'Vous n\'avez pas encore généré d\'identité de marque. Laissez l\'IA faire la magie pour vous !',
    unnamed_brand: 'Marque sans nom',
    view_detail: 'Voir en détail',
    
    // Results
    loading_identity: 'Chargement de votre identité...',
    results_title: 'Votre Identité de Marque',
    results_subtitle: 'Générée avec succès par l\'IA.',
    preparing: 'Préparation...',
    download_kit: 'Télécharger Kit ZIP',
    view_history: 'Voir mon historique',
    logo_label: 'Logo généré par IA',
    download_logo_title: 'Télécharger le logo',
    no_logo_found: 'Aucun logo trouvé',
    palette_label: 'Palette de couleurs',
    color_background: 'Fond',
    typography_label: 'Typographies',
    typography_preview_text: 'Héritage, simplicité et élégance.',
    heading: 'Titre',
    body: 'Corps',
    slogan_label: 'Slogan officiel',
    slogan_desc: 'Votre message de marque principal, optimisé pour l\'impact marketing.',
    ai_crafted: 'Rédigé par Intelligence Artificielle.',
    zip_error: 'Erreur lors de la génération du ZIP.',
    download_error: 'Une erreur est survenue lors du téléchargement.',
    
    // Other Features
    other_features: 'Autres fonctionnalités',
    entrepreneur_ai: 'IA Entrepreneuriat',
    chat_placeholder: 'Posez votre question sur l\'entrepreneuriat...',
    chat_welcome: 'Bonjour ! Je suis **BRAND.AI**, votre assistant expert en entrepreneuriat développé pour le Tech Nova Challenge par **Emmanuel TOHOUEGNON** et **Ange HLEKPE**. Comment puis-je vous aider ?',
    send: 'Envoyer',
    new_chat: 'Nouvelle conversation',
    history: 'Historique',
    upload_file: 'Joindre un fichier',
    unsupported_file: 'Type de fichier non supporté (Images et PDF uniquement)',
    clear_chat: 'Effacer la conversation',
  },
  en: {
    // Settings
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
    
    // Sidebar & Header
    generate_brand: 'Generate a Brand',
    my_results: 'My Results',
    about: 'About',
    help: 'Help',
    get_more: 'Get more',
    logout: 'Logout',
    login: 'Login',
    credit_hacknova: 'Developed by Group HACKNOVA',
    challenge_technova: 'Created for the TECHNOVA technology challenge',

    // About Page
    about_title: 'About Brand.Ai',
    about_subtitle: 'The future of identity design powered by AI.',
    mission_title: 'Our Mission',
    mission_desc: 'Simplify brand creation for entrepreneurs worldwide using the most advanced artificial intelligence technologies.',
    tech_title: 'Technologies Used',
    gemini_desc: 'Used for strategic brand reasoning and high-fidelity SVG vector logo generation.',
    sd_desc: 'Image generator used as a supplement to create rich and inspiring visual renderings.',
    langchain_desc: 'Intelligent orchestration of AI agents to ensure consistent and professional results.',
    react_desc: 'A modern, fast, and responsive user interface with native dark mode.',

    // Help Page
    help_title: 'Help Center',
    help_subtitle: 'Everything you need to know to succeed in your branding.',
    faq_title: 'Frequently Asked Questions',
    q1: 'How to get the best results?',
    a1: 'Be precise in the brand name and industry. The clearer the context, the more relevant the AI will be.',
    q2: 'Can I use the logos commercially?',
    a2: 'Yes, the generated identities are intended for your professional use.',
    q3: 'What is the ZIP Kit?',
    a3: 'It is a folder containing your SVG logo (vector), your color palette, and your style guide.',
    tips_title: 'Pro Tips',
    tips_desc: 'Use evocative keywords for the industry to influence the AI\'s artistic direction.',
    contact_title: 'Need help?',
    contact_desc: 'Our support team is here to accompany you on your creative journey.',
    
    // Generator
    welcome: 'Welcome',
    brand_name_placeholder: 'Brand Name',
    industry_placeholder: 'Industry / Activity',
    generating: 'Generating...',
    generate_btn: 'Generate my branding',
    auth_required_msg: 'You must be logged in to generate a brand.',
    ai_error: 'AI Error',
    error_try_again: 'Could not generate the brand. Please try again.',
    server_error: 'Connection error with the Backend server.',

    // History
    history_title: 'Generation History',
    history_subtitle: 'Find all your previous creations here.',
    confirm_clear_history: 'Are you sure you want to clear all your history?',
    clear_btn: 'Clear',
    no_history: 'No history yet',
    no_history_desc: 'You haven\'t generated any brand identity yet. Let AI do the magic for you!',
    unnamed_brand: 'Unnamed Brand',
    view_detail: 'View details',

    // Results
    loading_identity: 'Loading your identity...',
    results_title: 'Your Brand Identity',
    results_subtitle: 'Successfully generated by AI.',
    preparing: 'Preparing...',
    download_kit: 'Download ZIP Kit',
    view_history: 'View my history',
    logo_label: 'AI Generated Logo',
    download_logo_title: 'Download logo',
    no_logo_found: 'No logo found',
    palette_label: 'Color Palette',
    color_background: 'Background',
    typography_label: 'Typography',
    typography_preview_text: 'Heritage, simplicity and elegance.',
    heading: 'Heading',
    body: 'Body',
    slogan_label: 'Official Slogan',
    slogan_desc: 'Your main brand message, optimized for marketing impact.',
    ai_crafted: 'Crafted by Artificial Intelligence.',
    zip_error: 'Error while generating the ZIP.',
    download_error: 'An error occurred during download.',
    
    // Other Features
    other_features: 'Other Features',
    entrepreneur_ai: 'Entrepreneur AI',
    chat_placeholder: 'Ask your question about entrepreneurship...',
    chat_welcome: 'Hello! I am **BRAND.AI**, your expert entrepreneurship assistant developed for the Tech Nova Challenge by **Emmanuel TOHOUEGNON** and **Ange HLEKPE**. How can I help you today?',
    send: 'Send',
    new_chat: 'New Chat',
    history: 'History',
    upload_file: 'Attach file',
    unsupported_file: 'Unsupported file type (Images and PDF only)',
    clear_chat: 'Clear Chat',
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
