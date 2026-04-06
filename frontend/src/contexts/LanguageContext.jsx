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
    loading_history: "Chargement de vos archives...",
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
    // Login & Account
    login_welcome: 'BIENVENUE',
    signup_welcome: 'REJOINDRE',
    login_subtitle: 'Accéder à votre espace stratégique.',
    signup_subtitle: 'Lancez votre empire.',
    email_placeholder: 'ADRESSE EMAIL',
    password_placeholder: 'MOT DE PASSE',
    forgot_password_link: 'Oublié ?',
    login_btn: 'SE CONNECTER',
    signup_btn: 'S\'INSCRIRE',
    loading_btn: 'CHARGEMENT...',
    or_divider: 'OU',
    already_member: 'DÉJÀ MEMBRE ?',
    not_member: 'PAS ENCORE ?',
    back_to_login: '← Retourner',
    reset_btn: 'RÉINITIALISER',
    sending_btn: 'ENVOI...',
    forgot_title: 'Oublié ?',
    forgot_subtitle: 'On s\'occupe de tout.',
    confirm_email_msg: 'Compte créé ! Veuillez consulter votre boîte mail pour confirmer votre adresse avant de vous connecter.',
    account_created_msg: 'Compte créé ! Vous êtes maintenant connecté.',
    email_not_confirmed: "Votre email n'est pas encore confirmé. Vérifiez votre boîte de réception.",
    session_expired: 'Session expirée, veuillez vous reconnecter.',
    auth_error: "Une erreur est survenue lors de l'authentification.",
    version_label: 'Version',
    project_about: 'À propos du Projet',
    creators: 'Créateurs',
    competition: 'Compétition',
    organization: 'Organisation',
    modifier: 'Modifier',
    vision_statement: "L'excellence de l'intelligence stratégique pour les entrepreneurs de demain.",
    ai_badge: 'Intelligence Artificielle',
    main_headline_prefix: 'Créez votre',
    main_headline_suffix: 'identité unique',
    generator_subtitle: 'Dites-nous qui vous êtes, nous définissons qui vous serez.',
    automated_branding: 'Branding Automatisé',
    powered_by: 'Propulsé par BRAND.AI',
    brand_board_title: "Planche d'identité de marque",
    section_logo_vision: '01. Logo & Vision',
    section_palette: '02. Palette de couleurs',
    section_typography: '03. Typographie',
    primary_color: 'Couleur principale',
    secondary_color: 'Couleur secondaire',
    accent_color: "Couleur d'accent",
    typography_desc: "Sélection pour les titres et l'impact principal.",
    quote_example: "Tout ce que vous pouvez imaginer est réel. L'art lave notre âme de la poussière du quotidien.",
    footer_disclaimer: "Identité générée par l'intelligence artificielle Brand.Ai. Tous droits réservés au propriétaire de la marque.",
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
    loading_history: "Loading your archives...",
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
    // Login & Account
    login_welcome: 'WELCOME',
    signup_welcome: 'JOIN US',
    login_subtitle: 'Access your strategic workspace.',
    signup_subtitle: 'Launch your empire today.',
    email_placeholder: 'EMAIL ADDRESS',
    password_placeholder: 'PASSWORD',
    forgot_password_link: 'Forgot?',
    login_btn: 'LOGIN',
    signup_btn: 'SIGN UP',
    loading_btn: 'LOADING...',
    or_divider: 'OR',
    already_member: 'ALREADY A MEMBER?',
    not_member: 'NOT A MEMBER?',
    back_to_login: '← Go back',
    reset_btn: 'RESET PASSWORD',
    sending_btn: 'SENDING...',
    forgot_title: 'Forgot?',
    forgot_subtitle: 'We carry out every detail.',
    confirm_email_msg: 'Account created! Please check your mailbox to confirm your address before logging in.',
    account_created_msg: 'Account created! You are now logged in.',
    email_not_confirmed: "Your email is not confirmed yet. Check your inbox.",
    session_expired: 'Session expired, please log in again.',
    auth_error: 'An error occurred during authentication.',
    version_label: 'Version',
    project_about: 'About the Project',
    creators: 'Creators',
    competition: 'Competition',
    organization: 'Organization',
    modifier: 'Change',
    vision_statement: "The excellence of strategic intelligence for tomorrow's entrepreneurs.",
    ai_badge: 'Artificial Intelligence',
    main_headline_prefix: 'Create your',
    main_headline_suffix: 'unique identity',
    generator_subtitle: 'Tell us who you are, we define who you will be.',
    automated_branding: 'Automated Branding',
    powered_by: 'Powered by BRAND.AI',
    brand_board_title: 'Brand Identity Board',
    section_logo_vision: '01. Logo & Vision',
    section_palette: '02. Color Palette',
    section_typography: '03. Typography',
    primary_color: 'Primary Color',
    secondary_color: 'Secondary Color',
    accent_color: 'Accent Color',
    typography_desc: 'Selection for titles and main impact.',
    quote_example: 'Everything you imagine is real. The purpose of art is washing the dust of daily life off our souls.',
    footer_disclaimer: 'Identity generated by Brand.Ai synthesized intelligence. All rights reserved to the brand owner.',
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
