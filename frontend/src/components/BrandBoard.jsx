import React, { forwardRef } from 'react';

const BrandBoard = forwardRef(({ data, t }, ref) => {
  if (!data) return null;

  return (
    <div 
      ref={ref} 
      className="w-[1000px] p-16 bg-white text-[#0D0066] font-['Outfit']"
      style={{ minHeight: '1414px' }} // Approx A4 aspect ratio (1000x1414)
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-16 border-b-2 pb-10" style={{ borderColor: '#f3f4f6' }}>
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
            {data.brand_name || data.name}
          </h1>
          <p className="font-bold uppercase tracking-[0.3em] text-sm italic" style={{ color: '#9ca3af' }}>
            {t('brand_board_title')} • 2026
          </p>
        </div>
        <div className="text-right">
          <div className="font-black text-xl tracking-widest uppercase" style={{ color: '#2F00E6' }}>BRAND.AI</div>
          <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#d1d5db' }}>{t('powered_by')}</div>
        </div>
      </div>

      {/* Main Logo & Slogan */}
      <div className="mb-20">
        <h2 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: '#d1d5db' }}>{t('section_logo_vision')}</h2>
        <div className="flex flex-col items-center gap-12 rounded-[3rem] p-16 border shadow-inner" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
          <div className="w-64 h-64 flex items-center justify-center">
            {data.logos && data.logos[0] ? (
              <img src={data.logos[0].url} alt="Main Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="italic" style={{ color: '#e5e7eb' }}>{t('no_logo_found')}</div>
            )}
          </div>
          <div className="text-center">
            <p className="text-4xl font-black tracking-tight leading-tight italic">
              "{data.slogan}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16">
        {/* Colors */}
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: '#d1d5db' }}>{t('section_palette')}</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-6 group">
              <div className="w-20 h-20 rounded-2xl shadow-lg border" style={{ backgroundColor: data.colors?.primary, borderColor: '#f3f4f6' }}></div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-1">{t('primary_color')}</p>
                <p className="font-mono uppercase" style={{ color: '#9ca3af' }}>{data.colors?.primary}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl shadow-lg border" style={{ backgroundColor: data.colors?.secondary, borderColor: '#f3f4f6' }}></div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-1">{t('secondary_color')}</p>
                <p className="font-mono uppercase" style={{ color: '#9ca3af' }}>{data.colors?.secondary}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl shadow-lg border" style={{ backgroundColor: data.colors?.accent, borderColor: '#f3f4f6' }}></div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-1">{t('accent_color')}</p>
                <p className="font-mono uppercase" style={{ color: '#9ca3af' }}>{data.colors?.accent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: '#d1d5db' }}>{t('section_typography')}</h2>
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#2F00E6' }}>{t('heading')} / {data.typography?.heading}</p>
              <h3 className="text-5xl font-black leading-none mb-2" style={{ fontFamily: data.typography?.heading }}>
                Aa Bb Cc
              </h3>
              <p className="text-xs italic" style={{ color: '#9ca3af' }}>{t('typography_desc')}</p>
            </div>
            <div className="pt-8 border-t" style={{ borderColor: '#f9fafb' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: '#2F00E6' }}>{t('body')} / {data.typography?.body}</p>
              <p className="text-lg leading-relaxed" style={{ fontFamily: data.typography?.body, color: '#4b5563' }}>
                {t('quote_example')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-20 flex justify-between items-end">
        <div className="max-w-xs text-[10px] leading-relaxed font-bold uppercase tracking-widest" style={{ color: '#d1d5db' }}>
            {t('footer_disclaimer')}
        </div>
        <div className="font-black text-8xl leading-none tracking-tighter -mb-4 select-none uppercase" style={{ color: '#f3f4f6' }}>
          UNIQUE
        </div>
      </div>
    </div>
  );
});

export default BrandBoard;
