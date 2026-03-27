import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Cpu, Globe, Rocket, ShieldCheck, Zap } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const techStack = [
    {
      icon: Cpu,
      name: 'Google Gemini 2.0 Flash',
      description: t('gemini_desc'),
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Zap,
      name: 'Stable Diffusion (Pollinations)',
      description: t('sd_desc'),
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    {
      icon: Rocket,
      name: 'LangChain Orchestration',
      description: t('langchain_desc'),
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      icon: Globe,
      name: 'React + Tailwind CSS',
      description: t('react_desc'),
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto animate-fade-in-up lg:px-10 pb-10 pt-8 transition-colors duration-300">
      
      <div className="mb-12 text-center lg:text-left relative">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2F00E6] to-[#0D0066] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-lg animate-bounce">
          <ShieldCheck className="w-3.5 h-3.5" />
          {t('challenge_technova')}
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-[#0D0066] dark:text-white font-['Outfit'] mb-4">{t('about_title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">{t('about_subtitle')}</p>
        <p className="text-[#2F00E6] dark:text-[#5CA8FF] font-black mt-4 uppercase tracking-widest text-sm">{t('credit_hacknova')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-white dark:bg-[#1A1A2E] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-[#2F00E6]/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-[#2F00E6]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('mission_title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('mission_desc')}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#1800E5] to-[#0D0066] p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>
           <h3 className="text-3xl font-black mb-4 relative z-10 font-['Outfit'] italic">"Empowering the next generation of brands through AI."</h3>
        </div>
      </div>

      <h2 className="text-2xl font-black text-[#0D0066] dark:text-white font-['Outfit'] mb-8 px-2">{t('tech_title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techStack.map((tech, index) => (
          <div key={index} className="bg-white dark:bg-[#1A1A2E] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex items-start gap-5 group">
            <div className={`shrink-0 w-12 h-12 ${tech.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <tech.icon className={`w-6 h-6 ${tech.color}`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">{tech.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {tech.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-gray-400 text-sm">Brand.Ai — {t('version')}</p>
      </div>

    </div>
  );
};

export default About;
