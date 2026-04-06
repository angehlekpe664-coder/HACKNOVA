import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronDown, Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = async () => {
    if (user) {
      await supabase.auth.signOut();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="h-[70px] lg:h-[100px] flex items-center justify-between px-6 lg:px-12 w-full relative z-40 bg-white/30 dark:bg-[#020617]/30 backdrop-blur-2xl border-b border-white/50 dark:border-white/5 transition-all duration-300">
      
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          onClick={onMenuClick} 
          className="p-3 bg-white/80 dark:bg-white/5 rounded-2xl shadow-xl border border-white/50 dark:border-white/10 text-[#2F00E6] dark:text-blue-400 hover:scale-110 transition-all active:scale-95"
        >
          <Menu className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Invisible spacer for flex layout balance - matching Sidebar space */}
      <div className="hidden lg:block w-[80px]"></div>
      
      {/* Premium CTA Button */}
      <div className="flex-1 flex justify-center">
        <button className="group relative bg-[#2F00E6] text-white px-6 lg:px-10 py-3 lg:py-4 rounded-[1.2rem] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(47,0,230,0.3)] hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <Sparkles className="w-4 h-4 text-white animate-pulse" fill="white" />
          <span className="font-black text-[11px] lg:text-[13px] uppercase tracking-[0.2em]">{t('get_more')}</span>
        </button>
      </div>
      
      {/* Controls & Auth Section */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Theme & Language Toggles */}
        <div className="hidden sm:flex items-center gap-2 bg-white/50 dark:bg-white/5 p-1.5 rounded-2xl border border-white dark:border-white/10">
          <button 
            onClick={() => setLanguage(l => l === 'fr' ? 'en' : 'fr')}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[11px] hover:bg-white dark:hover:bg-white/10 transition-all text-[#2F00E6] dark:text-blue-400"
          >
            {language.toUpperCase()}
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-white/10"></div>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-white/10 transition-all text-[#2F00E6] dark:text-blue-400"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div 
          className="flex items-center gap-3 cursor-pointer group bg-white/50 dark:bg-white/5 px-5 py-3 rounded-2xl border border-white dark:border-white/10 hover:bg-[#2F00E6]/5 transition-all"
          onClick={handleAuthClick}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${user ? 'bg-red-500/10 text-red-500' : 'bg-[#2F00E6]/10 text-[#2F00E6]'}`}>
            {user ? <LogOut size={16} strokeWidth={2.5} /> : <User size={16} strokeWidth={2.5} />}
          </div>
          <span className="hidden md:block font-black text-[11px] lg:text-[13px] uppercase tracking-widest text-[#0D0066] dark:text-white">
            {user ? t('logout') : t('login')}
          </span>
          {!user && <ChevronDown className="hidden md:block w-4 h-4 text-gray-400 group-hover:translate-y-0.5 transition-transform" />}
        </div>
      </div>
      
    </header>
  );
};

export default Header;
