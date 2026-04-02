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
    <div className="w-full max-w-[1300px] mx-auto lg:px-10 pb-20 pt-10 transition-all duration-300 relative">
      <div className="noise-bg opacity-10"></div>
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-[#2F00E6]/5 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[45%] h-[45%] bg-[#5CA8FF]/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

      <div className="mb-16 border-b border-gray-100 dark:border-white/5 pb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 mb-6 group cursor-default">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2F00E6] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2F00E6]">{t('challenge_technova')}</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight leading-[0.9] mb-6">{t('about_title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-xl max-w-3xl leading-relaxed">{t('about_subtitle')}</p>
        <div className="flex items-center gap-4 mt-8">
           <div className="h-px w-12 bg-[#2F00E6]/30"></div>
           <p className="text-[#2F00E6] dark:text-[#5CA8FF] font-black uppercase tracking-[0.3em] text-xs">{t('credit_hacknova')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 relative z-10 animate-fade-in-up">
        <div className="glass-card p-12 rounded-[3.5rem] shadow-xl border border-white/50 dark:border-white/5 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#2F00E6]/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#2F00E6]/10 transition-all duration-1000"></div>
          <div className="w-16 h-16 bg-[#2F00E6]/10 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner border border-[#2F00E6]/10">
            <Rocket className="w-8 h-8 text-[#2F00E6]" />
          </div>
          <h2 className="text-3xl font-black text-[#0D0066] dark:text-white mb-6 font-['Outfit'] tracking-tight">{t('mission_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg leading-relaxed opacity-80">
            {t('mission_desc')}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-[#2F00E6] via-[#1200AB] to-[#0A0066] p-12 rounded-[3.5rem] shadow-[0_30px_100px_rgba(47,0,230,0.3)] text-white flex flex-col justify-center relative overflow-hidden group">
           <div className="noise-bg opacity-20"></div>
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
           <h3 className="text-4xl lg:text-5xl font-black mb-6 relative z-10 font-['Outfit'] italic tracking-tighter leading-none">
             "Empowering the next generation of brands through AI."
           </h3>
           <div className="flex items-center gap-4 relative z-10 opacity-40">
             <div className="h-0.5 w-10 bg-white"></div>
             <span className="font-black uppercase tracking-[0.4em] text-[10px]">Vision 2026</span>
           </div>
        </div>
      </div>

      <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{t('tech_title')}</h2>
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/5"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {techStack.map((tech, index) => (
            <div 
              key={index} 
              className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/50 dark:border-white/5 hover:shadow-2xl transition-all duration-500 flex items-start gap-8 group hover:-translate-y-1"
            >
              <div className={`shrink-0 w-16 h-16 ${tech.bg} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-inner border border-white/10`}>
                <tech.icon className={`w-8 h-8 ${tech.color}`} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{tech.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed opacity-80">
                  {tech.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-28 py-12 border-t border-gray-100 dark:border-white/5 flex flex-col items-center gap-6 opacity-30">
        <div className="flex items-center gap-4 font-black uppercase tracking-[0.5em] text-[10px]">
          <span>BRAND.AI</span>
          <div className="w-1.5 h-1.5 bg-[#2F00E6] rounded-full"></div>
          <span>V 2.1.0</span>
        </div>
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">{t('credit_hacknova')}</p>
      </div>

    </div>
  );
};

export default About;
