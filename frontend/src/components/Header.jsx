import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronDown, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { t } = useLanguage();
  const { theme } = useTheme();

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
    <header className="h-[70px] lg:h-[90px] pt-4 lg:pt-8 flex items-center lg:items-start justify-between px-6 lg:px-16 w-full relative z-10 shrink-0">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick} 
        className="lg:hidden p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-gray-100 dark:border-slate-700 text-[#12009E] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#12009E]"
        aria-label="Ouvrir le menu menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Invisible spacer for flex layout balance on desktop */}
      <div className="hidden lg:block w-[100px]"></div>
      
      {/* Centered Button */}
      <button className="bg-gradient-to-r from-[#1700CA] to-[#0A008A] text-white px-5 lg:px-8 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1 transition-transform duration-300 lg:ml-16">
        <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white animate-pulse" fill="white" />
        <span className="font-semibold text-[13px] lg:text-[15px]">{t('get_more')}</span>
      </button>
      
      {/* Login / Logout Auth Section */}
      <div 
        className="flex items-center gap-2 cursor-pointer group hover:opacity-70 transition-opacity"
        onClick={handleAuthClick}
      >
        <span className="font-medium text-sm lg:text-lg text-black dark:text-white transition-colors">
          {user ? t('logout') : t('login')}
        </span>
        {user ? (
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-black dark:text-white group-hover:translate-y-0.5 transition-transform" />
        )}
      </div>
      
    </header>
  );
};

export default Header;
