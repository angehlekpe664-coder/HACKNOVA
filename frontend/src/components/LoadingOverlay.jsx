import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LoadingOverlay = ({ isVisible }) => {
  const { t } = useLanguage();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messagesFr = [
    "Analyse de votre marque...",
    "Exploration de l'univers concurrentiel...",
    "Génération de la palette de couleurs stratégique...",
    "Conception du logo professionnel (Studio Design)...",
    "Rédaction d'un slogan percutant...",
    "Finalisation de votre identité visuelle...",
    "Préparation du pack de marque complet..."
  ];

  const messagesEn = [
    "Analyzing your brand...",
    "Exploring competitive landscape...",
    "Generating strategic color palette...",
    "Designing professional logo (Design Studio)...",
    "Crafting an impactful slogan...",
    "Finalizing your visual identity...",
    "Preparing full brand pack..."
  ];

  const { language } = useLanguage();
  const messages = language === 'fr' ? messagesFr : messagesEn;

  useEffect(() => {
    if (isVisible) {
      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 3500);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95; // Don't reach 100 before actual completion
          return prev + 1;
        });
      }, 200);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      setMessageIndex(0);
      setProgress(0);
    }
  }, [isVisible, messages.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617]/95 backdrop-blur-xl">
      <div className="noise-bg opacity-[0.03]"></div>
      
      <div className="relative w-32 h-32 mb-16 animate-fade-in">
        {/* Animated AI Glow */}
        <div className="absolute inset-0 bg-[#2F00E6] rounded-full animate-ping opacity-30"></div>
        <div className="absolute inset-[-10px] bg-[#2F00E6] rounded-full blur-[30px] opacity-20 animate-pulse"></div>
        
        {/* Core Icon */}
        <div className="absolute inset-4 bg-gradient-to-br from-[#2F00E6] via-[#13009E] to-[#0D0066] rounded-[2.5rem] shadow-[0_20px_50px_rgba(47,0,230,0.5)] flex items-center justify-center border border-white/10">
            <svg className="w-10 h-10 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeDasharray="30 60" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        </div>
      </div>
      
      <div className="text-center px-10 max-w-xl animate-fade-in-up">
        <h2 className="text-white text-3xl font-black mb-4 font-['Outfit'] tracking-tight">
          {t('generating') || "L'IA travaille pour vous"}
        </h2>
        <p className="text-gray-400 text-lg font-bold h-8 transition-all duration-700 italic">
          {messages[messageIndex]}
        </p>
      </div>

      {/* Advanced Progress Bar */}
      <div className="w-80 mt-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Status</span>
          <span className="text-[10px] font-black text-[#2F00E6] uppercase tracking-[0.2em]">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative ring-1 ring-white/10">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2F00E6] to-[#5CA8FF] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(47,0,230,0.5)]" 
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Decorative text */}
      <div className="absolute bottom-12 text-[10px] font-black text-white/10 uppercase tracking-[0.5em] animate-pulse">
        Brand Intelligence Synthesis • 2026
      </div>
    </div>
  );
};

export default LoadingOverlay;
