import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingOverlay from '../components/LoadingOverlay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BrandGenerator = () => {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!brandName || !industry) return;
    
    setLoading(true);
    try {
      // Get current auth session to attach JWT
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert("Vous devez être connecté pour générer une marque.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ brand_name: brandName, industry: industry }),
      });
      
      if (response.ok) {
        const result = await response.json();
        // On sauvegarde aussi le nom de la marque pour l'historique
        localStorage.setItem('brandResult', JSON.stringify({ ...result.data, brand_name: brandName }));
        navigate('/results');
      } else {
        const errData = await response.json();
        alert(`Erreur IA : ${errData.detail || 'Impossible de générer la marque. Veuillez réessayer.'}`);
      }
    } catch (error) {
      console.error('Error generating brand:', error);
      alert("Erreur de connexion avec le serveur Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-[40px] lg:pt-[80px] pb-10 w-full px-4 lg:px-0">
      <LoadingOverlay isVisible={loading} />
      
      <div className="text-center mb-8 lg:mb-12 animate-fade-in-up">
        <h1 className="text-[50px] sm:text-[60px] lg:text-[75px] font-black tracking-tight leading-none mb-2 lg:mb-3 inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#2F00E6] to-[#5CA8FF] font-['Outfit']">
          Bienvenue
        </h1>
        <div className="flex items-center justify-center gap-2 text-black/70">
          <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-[#E2E814]" fill="#E2E814" />
          <span className="font-medium text-xs lg:text-sm">Powered by AI</span>
        </div>
      </div>
      
      <form onSubmit={handleGenerate} className="w-full max-w-[650px] flex flex-col items-center lg:items-start gap-4 lg:gap-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        
        <input 
          type="text" 
          placeholder="Nom de la marque" 
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full h-[55px] lg:h-[65px] px-6 lg:px-8 rounded-full border border-gray-200 shadow-sm bg-white text-base lg:text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F00E6] transition-all placeholder:text-gray-400 font-medium"
        />
        
        <input 
          type="text" 
          placeholder="Secteur d'activité" 
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full h-[55px] lg:h-[65px] px-6 lg:px-8 rounded-full border border-gray-200 shadow-sm bg-white text-base lg:text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2F00E6] transition-all placeholder:text-gray-400 font-medium"
        />
        
        <button 
          type="submit" 
          disabled={loading || !brandName || !industry}
          className="mt-4 bg-[#2100E0] hover:bg-[#1A00B8] text-white font-bold text-[18px] lg:text-[20px] py-4 w-full lg:w-auto lg:px-12 rounded-[16px] shadow-[0_8px_20px_rgba(33,0,224,0.3)] transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95"
        >
          {loading ? 'Génération...' : 'Générer mon branding'}
        </button>

      </form>
      
    </div>
  );
};

export default BrandGenerator;
