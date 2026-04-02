import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingOverlay from '../components/LoadingOverlay';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BrandGenerator = () => {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!brandName || !industry) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert(t('auth_required_msg') || "Vous devez être connecté pour générer une marque.");
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
        localStorage.setItem('brandResult', JSON.stringify({ ...result.data, brand_name: brandName }));
        navigate('/results');
      } else {
        const errData = await response.json();
        alert(`${t('ai_error') || 'Erreur IA'} : ${errData.detail || t('error_try_again')}`);
      }
    } catch (error) {
      console.error('Error generating brand:', error);
      alert(t('server_error') || "Erreur de connexion avec le serveur Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full px-6 relative overflow-hidden bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-300">
      <LoadingOverlay isVisible={loading} />
      
      {/* Premium Background Effects */}
      <div className="noise-bg opacity-10"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#2F00E6]/5 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-[#5CA8FF]/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '-5s' }}></div>

      <div className="text-center mb-12 lg:mb-16 relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 mb-6 group hover:bg-[#2F00E6]/10 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-[#2F00E6]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#2F00E6]">Intelligence Artificielle</span>
        </div>
        <h1 className="text-[55px] sm:text-[75px] lg:text-[90px] font-black tracking-tight leading-[0.9] mb-4 text-[#13009E] dark:text-white font-['Outfit']">
          Créez votre <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F00E6] to-[#5CA8FF]">identité unique</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg lg:text-xl max-w-lg mx-auto">
          Dites-nous qui vous êtes, nous définissons qui vous serez.
        </p>
      </div>
      
      <form onSubmit={handleGenerate} className="w-full max-w-[700px] grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
        
        <div className="md:col-span-2 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-4">Nom de la marque</label>
          <input 
            type="text" 
            placeholder={t('brand_name_placeholder')} 
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full h-[65px] lg:h-[75px] px-8 rounded-2xl glass-card text-lg lg:text-xl text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#2F00E6]/10 border-2 border-white/50 dark:border-white/5 transition-all placeholder:text-gray-400/50 font-black"
          />
        </div>
        
        <div className="md:col-span-2 group">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-4">Secteur d'activité</label>
          <input 
            type="text" 
            placeholder={t('industry_placeholder')} 
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full h-[65px] lg:h-[75px] px-8 rounded-2xl glass-card text-lg lg:text-xl text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#2F00E6]/10 border-2 border-white/50 dark:border-white/5 transition-all placeholder:text-gray-400/50 font-black"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !brandName || !industry}
          className="md:col-span-2 mt-6 group relative bg-[#2F00E6] hover:bg-[#1200AB] text-white text-[20px] lg:text-[24px] font-black py-5 rounded-2xl shadow-[0_20px_50px_rgba(47,0,230,0.3)] transition-all hover:scale-[1.02] active:scale-95 duration-300 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('generating')}
              </>
            ) : (
              <>
                {t('generate_btn')}
                <Sparkles size={24} />
              </>
            )}
          </span>
        </button>

      </form>
      
      {/* Decorative footer text */}
      <p className="mt-16 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] opacity-40 relative z-10">
        Branding Automatisé • Propulsé par BRAND.AI
      </p>
      
    </div>
  );
};

export default BrandGenerator;
