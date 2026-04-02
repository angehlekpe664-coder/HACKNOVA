import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { HelpCircle, MessageCircle, Lightbulb, ExternalLink } from 'lucide-react';

const Help = () => {
  const { t } = useLanguage();

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') }
  ];

  return (
    <div className="w-full max-w-[1300px] mx-auto lg:px-10 pb-20 pt-10 transition-all duration-300 relative">
      <div className="noise-bg opacity-10"></div>
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[30%] h-[30%] bg-[#2F00E6]/5 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-[#5CA8FF]/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

      <div className="mb-12 border-b border-gray-100 dark:border-white/5 pb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 mb-4">
          <HelpCircle className="w-3 h-3 text-[#2F00E6]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2F00E6]">Support</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{t('help_title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">{t('help_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#0D0066] dark:text-white uppercase tracking-tight font-['Outfit']">{t('faq_title')}</h2>
            <div className="w-20 h-1 bg-[#2F00E6]/20 rounded-full"></div>
          </div>
          
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="glass-card p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-white/5 group hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-black text-xl text-[#0D0066] dark:text-gray-100 mb-4 flex items-start gap-4">
                <span className="text-[#2F00E6] bg-[#2F00E6]/5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#2F00E6] group-hover:text-white transition-all duration-500">Q</span> 
                {faq.q}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed pl-14 opacity-80">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Sidebar Tips & Support */}
        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          
          <div className="glass-card p-10 rounded-[2.5rem] shadow-xl bg-gradient-to-br from-[#2F00E6]/5 to-transparent border border-[#2F00E6]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F00E6]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#2F00E6]/20 transition-all duration-700"></div>
            <div className="flex items-center gap-3 mb-6 text-[#2F00E6] relative z-10">
              <Lightbulb className="w-6 h-6 animate-pulse" />
              <h3 className="font-black uppercase tracking-widest text-xs">{t('tips_title')}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-8 relative z-10">
              {t('tips_desc')}
            </p>
            <button className="group/btn relative h-12 w-full bg-white dark:bg-white/5 text-[#2F00E6] dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#2F00E6]/20 transition-all flex items-center justify-center gap-2 hover:bg-[#2F00E6] hover:text-white hover:border-transparent active:scale-95">
              <span className="relative z-10">{t('get_more')}</span>
              <ExternalLink className="w-4 h-4 relative z-10" />
            </button>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/50 dark:border-white/5 relative group">
            <div className="flex items-center gap-3 mb-6 text-[#0D0066] dark:text-white">
              <div className="w-10 h-10 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-xs">{t('contact_title')}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed mb-8">
              {t('contact_desc')}
            </p>
            <a 
              href="mailto:support@brand.ai" 
              className="group relative h-14 w-full bg-[#0D0066] text-white flex items-center justify-center rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-[0_15px_30px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10">support@brand.ai</span>
            </a>
          </div>

          {/* Social Links or Extra Info */}
          <div className="px-6 py-8 border-t border-gray-100 dark:border-white/5 flex flex-col items-center gap-4 opacity-40">
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-center">Tech Nova 2026<br/>Binôme 35 • HackNova</p>
             <div className="h-1 w-12 bg-gray-200 dark:bg-white/10 rounded-full"></div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Help;
