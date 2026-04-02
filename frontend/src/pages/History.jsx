import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trash2, ArrowRight, Bookmark } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('brandHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm(t('confirm_clear_history'))) {
      localStorage.removeItem('brandHistory');
      setHistory([]);
    }
  };

  const viewResult = (item) => {
    localStorage.setItem('brandResult', JSON.stringify(item));
    navigate('/results');
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto lg:px-10 pb-20 pt-10 transition-all duration-300 relative">
      <div className="noise-bg opacity-10"></div>
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-[-5%] right-[-10%] w-[30%] h-[30%] bg-[#2F00E6]/5 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] bg-[#5CA8FF]/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

      <div className="flex justify-between items-end mb-12 border-b border-gray-100 dark:border-white/5 pb-8 animate-fade-in-up">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 mb-2">
            <Bookmark className="w-3 h-3 text-[#2F00E6]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2F00E6]">Archives</span>
          </div>
          <h1 className="text-4xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{t('history_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">{t('history_subtitle')}</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-red-500 bg-red-500/5 px-6 py-3 rounded-2xl font-black hover:bg-red-500/10 transition-all border border-red-500/10 uppercase tracking-widest text-[11px] active:scale-95"
          >
            <Trash2 className="w-4 h-4" /> {t('clear_btn')}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] p-16 text-center shadow-xl flex flex-col items-center animate-fade-in-up relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2F00E6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="w-24 h-24 bg-[#2F00E6]/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-[#2F00E6]/10 relative z-10">
            <Sparkles className="w-10 h-10 text-[#2F00E6] animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-[#0D0066] dark:text-white mb-4 relative z-10 font-['Outfit']">{t('no_history')}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 max-w-md relative z-10">{t('no_history_desc')}</p>
          <button 
            onClick={() => navigate('/generate')}
            className="group relative bg-[#2F00E6] text-white px-10 py-5 rounded-2xl font-black hover:bg-[#1200AB] transition-all shadow-[0_20px_50px_rgba(47,0,230,0.3)] active:scale-95 overflow-hidden z-10"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative z-10 flex items-center gap-3">
              {t('generate_brand')}
              <Sparkles size={20} />
            </span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item, index) => (
            <div 
              key={index}
              className="glass-card rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-[380px] hover:-translate-y-2 animate-fade-in-up border border-white/50 dark:border-white/5"
              onClick={() => viewResult(item)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Preview */}
              <div className="h-[180px] w-full bg-gray-50 dark:bg-black/20 overflow-hidden relative shadow-inner">
                {item.logos && item.logos.length > 0 ? (
                  <img src={item.logos[0].url} alt="Logo preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full bg-[#2F00E6]/5 flex items-center justify-center">
                    <Sparkles className="text-[#2F00E6]/20 w-12 h-12" />
                  </div>
                )}
                
                {/* Date Badge */}
                <div className="absolute top-5 left-5 bg-white/80 dark:bg-black/70 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl text-gray-700 dark:text-gray-200 shadow-xl border border-white/20">
                  {new Date(item.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </div>
              </div>

              {/* Data Preview */}
              <div className="p-8 flex-1 flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-xl text-[#0D0066] dark:text-white line-clamp-1 font-['Outfit'] group-hover:text-[#2F00E6] transition-colors">
                    {item.brand_name || t('unnamed_brand')}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-[#2F00E6] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                
                {/* Colors Mini Palette */}
                <div className="flex gap-2.5 mb-6 h-8">
                  {item.colors && Object.values(item.colors).map((hex, i) => (
                    <div key={i} className="flex-1 h-full rounded-lg shadow-inner border border-black/5 dark:border-white/5 transition-transform hover:scale-110" style={{ backgroundColor: hex }} />
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold line-clamp-2 mt-auto italic opacity-80 leading-relaxed">
                  "{item.slogan}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default History;
