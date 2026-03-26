import React from 'react';
import { Bell, Moon, Sun, Globe, Shield, ChevronRight } from 'lucide-react';
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
      title: t('security'),
      items: [
        { icon: Shield, label: t('auth'), value: 'Supabase Auth', id: 'auth-provider' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto animate-fade-in-up lg:px-10 pb-10 pt-8 transition-colors duration-300">

      <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-black text-[#0D0066] dark:text-white font-['Outfit']">{t('settings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('settings_desc')}</p>
      </div>

      <div className="flex flex-col gap-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-[#1A1A2E] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-6 pt-5 pb-3">
              {section.title}
            </h2>
            {section.items.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.onClick}
                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${idx < section.items.length - 1 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#2F00E6]/10 dark:bg-[#2F00E6]/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[#2F00E6] dark:text-[#4F46E5]" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-sm">{item.value}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        ))}

        <p className="text-center text-xs text-gray-400 mt-4">{t('version')}</p>
      </div>
    </div>
  );
};

export default Settings;
