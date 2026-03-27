import React from 'react';
import { Bell, Moon, Sun, Globe, Shield, ChevronRight, User, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, t, toggleLanguage } = useLanguage();

  const settingsSections = [
    {
      title: t('general'),
      items: [
        { 
          icon: Globe, 
          label: t('language'), 
          value: language === 'fr' ? t('french') : t('english'), 
          id: 'lang',
          onClick: toggleLanguage
        },
        { 
          icon: theme === 'dark' ? Sun : Moon, 
          label: t('theme'), 
          value: theme === 'dark' ? t('dark') : t('light'), 
          id: 'theme',
          onClick: toggleTheme
        },
      ],
    },
    {
      title: t('notifications'),
      items: [
        { icon: Bell, label: t('email_notif'), value: t('enabled'), id: 'notif-email' },
      ],
    },
    {
      title: t('security') || 'Sécurité',
      items: [
        { icon: Shield, label: t('auth') || 'Authentification', value: 'Supabase Auth', id: 'auth-provider' },
      ],
    },
    {
      title: 'À propos du Projet',
      items: [
        { 
          icon: User, 
          label: 'Créateurs', 
          value: 'Emmanuel TOHOUEGNON & Ange HLEKPE', 
          id: 'creators' 
        },
        { 
          icon: Sparkles, 
          label: 'Compétition', 
          value: 'TECH NOVA Challenge', 
          id: 'challenge' 
        },
        { 
          icon: Shield, 
          label: 'Organisation', 
          value: 'HACKNOVA 2026', 
          id: 'org' 
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto animate-fade-in-up lg:px-10 pb-20 pt-8 transition-colors duration-300">

      <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
        <h1 className="text-3xl lg:text-4xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{t('settings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t('settings_desc')}</p>
      </div>

      <div className="flex flex-col gap-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-[#1A1A2E] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <h2 className="text-[10px] font-black text-[#1700E5] dark:text-blue-400 uppercase tracking-[0.2em] px-8 pt-6 pb-2 opacity-80">
              {section.title}
            </h2>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center justify-between px-8 py-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all ${item.onClick ? 'cursor-pointer group' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-[#1700E5]/5 dark:bg-[#1700E5]/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                      <item.icon className="w-5 h-5 text-[#1700E5] dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{item.label}</span>
                      {item.onClick && <span className="text-[10px] text-[#1700E5] dark:text-blue-400 font-medium opacity-60">Modifier</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.value}</span>
                    {item.onClick && <ChevronRight className="w-4 h-4 text-[#1700E5]/40 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 p-6 bg-[#1700E5] rounded-3xl text-white shadow-xl shadow-[#1700E5]/20 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h3 className="text-xl font-black font-['Outfit']">BRAND.AI - Next Gen Assistant</h3>
               <p className="text-white/70 text-sm mt-1">Propulsé par Google Gemini 2.0 Flash</p>
             </div>
             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 uppercase tracking-widest text-[10px] font-bold">
               <Sparkles size={14} className="animate-pulse" /> Finaliste Tech Nova
             </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-8 font-bold uppercase tracking-[0.2em]">{t('version')} 2.1.0 • Stable Build</p>
      </div>
    </div>
  );
};

export default Settings;
