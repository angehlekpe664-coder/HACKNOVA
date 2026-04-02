import React, { useEffect } from 'react';
import { Compass, Check, Settings, ChevronDown, X, Sparkles } from 'lucide-react';
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
      <div className={`w-[280px] h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-50 bg-[#0D0066] transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-2xl lg:shadow-none'} border-r border-white/5`}>
        <div className="noise-bg opacity-10"></div>
        
        {/* Top Header Block */}
        <div className="h-[100px] flex items-center justify-between px-8 shrink-0 relative z-10">
          <h1 className="text-white text-[28px] font-black tracking-tighter font-['Outfit'] flex items-center gap-1 group cursor-pointer">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mr-1">
              <div className="w-4 h-4 bg-[#0D0066] rounded-sm animate-pulse-glow"></div>
            </div>
            BRAND<span className="text-white/40">.AI</span>
          </h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/50 hover:text-white p-2 rounded-xl bg-white/5 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Sidebar Body */}
        <div className="flex-1 flex flex-col justify-between pt-4 text-white pb-10 relative z-10">
          <nav className="space-y-2 px-4">
            {[
              { to: "/generate", icon: Compass, label: t('generate_brand') },
              { to: "/features", icon: Sparkles, label: t('entrepreneur_ai') },
              { to: "/history", icon: Check, label: t('my_results') },
              { to: "/settings", icon: Settings, label: t('settings') },
            ].map((link) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({isActive}) => `
                  flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[11px]
                  ${isActive 
                    ? 'bg-white text-[#0D0066] shadow-[0_10px_30px_rgba(255,255,255,0.15)] scale-[1.02]' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1'
                  }
                `}
              >
                <link.icon className="w-5 h-5" strokeWidth={2.5}/>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer Area */}
          <div className="flex flex-col gap-8 w-full mt-10 px-6">
            <div className="flex items-center gap-6 text-[10px] uppercase font-black tracking-[0.2em] px-4 opacity-40">
              <NavLink to="/about" className="hover:text-white transition-colors">{t('about')}</NavLink>
              <NavLink to="/help" className="hover:text-white transition-colors">{t('help')}</NavLink>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col gap-4 group hover:bg-white/10 transition-all duration-500 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Plan Actuel</span>
                  <span className="font-black text-lg">Free Tier</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Sparkles size={18} className="text-white animate-pulse" />
                </div>
              </div>
              <button className="w-full bg-white text-[#0D0066] py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Upgrade Pro
              </button>
            </div>

            <p className="px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed">
              Binôme 35 • TECHNOVA<br/>Emmanuel & Ange
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
