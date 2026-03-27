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
    <div className="w-full max-w-[900px] mx-auto animate-fade-in-up lg:px-10 pb-10 pt-8 transition-colors duration-300">
      
      <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <h1 className="text-4xl font-black text-[#0D0066] dark:text-white font-['Outfit'] mb-3">{t('help_title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('help_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-[#2F00E6]" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('faq_title')}</h2>
          </div>
          
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-[#1A1A2E] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-start gap-2">
                <span className="text-[#2F00E6] font-black">Q:</span> {faq.q}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Sidebar Tips & Support */}
        <div className="space-y-6">
          <div className="bg-[#2F00E6]/5 dark:bg-[#2F00E6]/10 p-6 rounded-2xl border border-[#2F00E6]/10">
            <div className="flex items-center gap-2 mb-4 text-[#2F00E6] dark:text-[#5CA8FF]">
              <Lightbulb className="w-5 h-5" />
              <h3 className="font-bold">{t('tips_title')}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {t('tips_desc')}
            </p>
            <button className="text-[#2F00E6] dark:text-[#5CA8FF] text-xs font-bold flex items-center gap-1 hover:underline">
              {t('get_more')} <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#1A1A2E] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-4 text-[#0D0066] dark:text-white">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-bold">{t('contact_title')}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              {t('contact_desc')}
            </p>
            <a href="mailto:support@brand.ai" className="block w-full text-center bg-[#0D0066] text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors">
              support@brand.ai
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Help;
