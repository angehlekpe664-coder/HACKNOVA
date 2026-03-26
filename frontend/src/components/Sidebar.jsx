import React, { useEffect } from 'react';
import { Compass, Check, Settings, ChevronDown, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar fixed menu */}
      <div className={`w-[280px] h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50 bg-[#12009E] transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-2xl lg:shadow-none'}`}>
        
        {/* Top Header Block */}
        <div className="h-[80px] flex items-center justify-between px-8 border-b border-white/20 shrink-0">
          <h1 className="text-white text-[32px] font-black tracking-tighter font-['Outfit'] flex items-baseline relative mt-2">
            <span>Brand</span>
            <span className="w-2 h-2 bg-white rounded-sm mx-0.5"></span>
            <span className="font-normal text-[32px]">Ai</span>
          </h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Sidebar Body */}
        <div className="flex-1 flex flex-col justify-between pt-6 text-white pb-6">
          <nav className="space-y-1">
            <NavLink 
              to="/generate" 
              className={({isActive}) => `flex items-center gap-4 px-8 py-3.5 transition-all font-medium border-l-4 ${isActive ? 'bg-white/10 border-white text-white' : 'border-transparent text-white/80 hover:bg-white/5 hover:text-white'}`}
            >
              <Compass className="w-5 h-5" strokeWidth={2}/>
              <span className="text-[16px]">{t('generate_brand')}</span>
            </NavLink>
            
            <NavLink 
              to="/history" 
              className={({isActive}) => `flex items-center gap-4 px-8 py-3.5 transition-all font-medium border-l-4 ${isActive ? 'bg-white/10 border-white text-white' : 'border-transparent text-white/80 hover:bg-white/5 hover:text-white'}`}
            >
              <Check className="w-5 h-5" strokeWidth={2}/>
              <span className="text-[16px]">{t('my_results')}</span>
            </NavLink>
            
            <NavLink 
              to="/settings" 
              className={({isActive}) => `flex items-center gap-4 px-8 py-3.5 transition-all font-medium border-l-4 ${isActive ? 'bg-white/10 border-white text-white' : 'border-transparent text-white/80 hover:bg-white/5 hover:text-white'}`}
            >
              <Settings className="w-5 h-5" strokeWidth={2}/>
              <span className="text-[16px]">{t('settings')}</span>
            </NavLink>
          </nav>

          {/* Footer Area */}
          <div className="flex flex-col gap-6 w-full mt-10">
            <div className="flex flex-col gap-3 px-8 text-[15px]">
              <a href="#" className="text-white/80 hover:text-white transition-opacity">{t('about')}</a>
              <a href="#" className="text-white/80 hover:text-white transition-opacity">{t('help')}</a>
            </div>
            
            <div className="bg-[#E5E7EB] text-black h-[50px] px-6 mx-6 rounded-md flex items-center justify-between cursor-pointer group hover:bg-[#D1D5DB] transition-colors">
              <span className="font-semibold text-[15px]">Free</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Sidebar;
