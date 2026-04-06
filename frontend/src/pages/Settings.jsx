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
      title: t('project_about'),
      items: [
        {
          icon: User,
          label: t('creators'),
          value: 'Emmanuel TOHOUEGNON & Ange HLEKPE',
          id: 'creators'
        },
        {
          icon: Sparkles,
          label: t('competition'),
          value: 'TECH NOVA Challenge',
          id: 'challenge'
        },
        {
          icon: Shield,
          label: t('Equipe'),
          value: 'HACKNOVA ',
          id: 'org'
        },
      ],
    },
  ];

  return (
    <div className="w-full max-w-[900px] mx-auto lg:px-10 pb-20 pt-10 transition-all duration-300 relative">
      <div className="noise-bg opacity-10"></div>

      {/* Animated Glow Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-[#2F00E6]/5 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#5CA8FF]/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

      <div className="mb-12 border-b border-gray-100 dark:border-white/5 pb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 mb-4">
          <Sparkles className="w-3 h-3 text-[#2F00E6]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2F00E6]">Configuration</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{t('settings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">{t('settings_desc')}</p>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {settingsSections.map((section, idx) => (
          <div
            key={section.title}
            className="glass-card rounded-[2.5rem] shadow-xl overflow-hidden animate-fade-in-up border border-white/50 dark:border-white/5"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <h2 className="text-[11px] font-black text-[#2F00E6] dark:text-blue-400 uppercase tracking-[0.3em] px-10 pt-8 pb-3 opacity-60">
              {section.title}
            </h2>
            <div className="divide-y divide-gray-100/30 dark:divide-white/5">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center justify-between px-10 py-6 hover:bg-[#2F00E6]/5 transition-all ${item.onClick ? 'cursor-pointer group' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${item.onClick ? 'bg-[#2F00E6]/10 group-hover:bg-[#2F00E6] group-hover:text-white group-hover:rotate-[10deg]' : 'bg-gray-100 dark:bg-white/5'}`}>
                      <item.icon className={`w-5 h-5 ${item.onClick ? 'text-[#2F00E6] group-hover:text-white' : 'text-gray-400'}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-[#0D0066] dark:text-gray-100 text-[15px]">{item.label}</span>
                      {item.onClick && <span className="text-[10px] text-[#2F00E6] font-black uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{t('modifier')}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#2F00E6]/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-[#2F00E6]/10">
                      <span className="text-xs font-black text-[#2F00E6] dark:text-blue-400 uppercase tracking-tighter">{item.value}</span>
                    </div>
                    {item.onClick && <ChevronRight className="w-5 h-5 text-[#2F00E6]/40 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Project Card Overlay */}
        <div className="mt-12 p-10 bg-gradient-to-br from-[#2F00E6] via-[#1200AB] to-[#0A0066] rounded-[3rem] text-white shadow-[0_30px_100px_rgba(47,0,230,0.3)] relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="noise-bg opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
              <h3 className="text-3xl font-black font-['Outfit'] tracking-tight">BRAND.AI <span className="opacity-40 text-lg ml-2 font-black">v2.1.0</span></h3>
              <p className="text-white/70 font-bold text-lg">{t('vision_statement')}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3 bg-white text-[#2F00E6] px-6 py-3 rounded-2xl shadow-2xl font-black tracking-widest text-[11px] uppercase transition-transform hover:scale-105">
                <Sparkles size={16} fill="#2F00E6" /> TECH NOVA 2026
              </div>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Binôme 35 • HackNova</span>
            </div>
          </div>
          {/* Decorative background shape */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-1000"></div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 opacity-40">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em]">Stable Build • Next-Gen Framework</p>
          <div className="h-1 w-20 bg-gray-200 dark:bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
