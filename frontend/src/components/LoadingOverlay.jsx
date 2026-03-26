import React, { useState, useEffect } from 'react';

const LoadingOverlay = ({ isVisible }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyse de votre marque...",
    "Exploration de l'univers concurrentiel...",
    "Génération de la palette de couleurs stratégique...",
    "Conception du logo professionnel (Studio Design)...",
    "Rédaction d'un slogan percutant...",
    "Finalisation de votre identité visuelle...",
    "Préparation du pack de marque complet..."
  ];

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [isVisible, messages.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="relative w-24 h-24 mb-12">
        {/* Animated AI Shape / Pulse */}
        <div className="absolute inset-0 bg-[#1800E5] rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-2 bg-[#1800E5] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute inset-4 bg-gradient-to-br from-[#1800E5] to-[#0D0066] rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
        </div>
      </div>
      
      <div className="text-center px-6">
        <h2 className="text-[#1800E5] text-2xl font-black mb-2 animate-pulse font-['Outfit']">
          L'IA travaille pour vous
        </h2>
        <p className="text-gray-500 text-lg font-medium h-8 transition-all duration-500">
          {messages[messageIndex]}
        </p>
      </div>

      {/* Progress Bar background */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-10 overflow-hidden relative">
        <div 
          className="absolute inset-y-0 left-0 bg-[#1800E5] transition-all duration-1000 ease-in-out" 
          style={{ width: `${((messageIndex + 1) / messages.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
