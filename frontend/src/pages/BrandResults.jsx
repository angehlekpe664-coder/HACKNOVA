import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Download, Bookmark, Sparkles, Loader2, FileText, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import BrandBoard from '../components/BrandBoard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const BrandResults = () => {
  const [data, setData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const boardRef = React.useRef(null);
  const isSavingRef = React.useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('brandResult');
    if (saved) {
      let parsedData = JSON.parse(saved);
      
      // Fix format for older logos that were just an array of strings
      let logos = parsedData.logos;
      try {
        if (typeof logos === 'string') logos = JSON.parse(logos);
      } catch(e) {
        if (typeof logos === 'string') logos = [logos];
      }
      if (logos && Array.isArray(logos) && logos.length > 0) {
        parsedData.logos = logos.map((logo, index) => {
          if (typeof logo === 'string') {
            return { id: index + 1, url: logo };
          }
          return logo;
        });
      } else {
        parsedData.logos = [];
      }
      
      setData(parsedData);
      
      // Enregistrement uniquement local (Pas de base de données)
      const appendToLocalHistory = (brandData) => {
        try {
           let historyObj = localStorage.getItem('brandHistoryArray');
           let historyArr = historyObj ? JSON.parse(historyObj) : [];
           historyArr = historyArr.filter(item => item.slogan !== brandData.slogan);
           historyArr.unshift({...brandData, created_at: new Date().toISOString()});
           let success = false;
           while (!success && historyArr.length > 0) {
              try {
                  localStorage.setItem('brandHistoryArray', JSON.stringify(historyArr));
                  success = true;
              } catch (e) {
                  historyArr.pop();
              }
           }
        } catch(e) {}
      };
      
      if (!isSavingRef.current) {
        isSavingRef.current = true;
        const lastSavedSlogan = sessionStorage.getItem('lastSavedSlogan');
        if (lastSavedSlogan !== parsedData.slogan) {
           appendToLocalHistory(parsedData);
           sessionStorage.setItem('lastSavedSlogan', parsedData.slogan);
        }
      }
    } else {
      navigate('/generate');
    }
  }, [navigate]);

  const handleDownloadLogo = async (url) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'brand-logo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };
  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/export-zip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.brand_name || data.name || "Ma_Marque",
          logo_url: data.logos?.[0]?.url,
          colors: data.colors,
          typography: data.typography,
          slogan: data.slogan
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const brandNameSafe = (data?.brand_name || data?.name || "ma_marque").toLowerCase().replace(/\s+/g, '_');
        a.download = `brand_kit_${brandNameSafe}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert(t('zip_error') || "Erreur lors de la génération du ZIP.");
      }
    } catch (err) {
      console.error('ZIP Download failed:', err);
      alert(t('download_error') || "Une erreur est survenue lors du téléchargement.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!boardRef.current) return;
    try {
      setIsDownloading(true);

      if (!data.logos || data.logos.length === 0) {
        alert(t('no_logo_found') || "Logo non disponible pour l'export.");
        return;
      }
      
      // Temporary style to ensure it's visible for capture but off-screen
      const element = boardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const brandNameSafe = (data?.brand_name || data?.name || "ma_marque").toLowerCase().replace(/\s+/g, '_');
      pdf.save(`brand_board_${brandNameSafe}.pdf`);
      
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert(`${t('pdf_error') || "Erreur lors de l'export PDF."}\n\nDétails: ${err.message || 'Capture impossible'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!data) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#f8fafc] dark:bg-[#020617] relative">
      <div className="noise-bg opacity-10"></div>
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="w-16 h-16 bg-[#2F00E6]/10 rounded-2xl flex items-center justify-center border border-[#2F00E6]/20">
          <Sparkles className="text-[#2F00E6] animate-spin-slow" />
        </div>
        <span className="text-xl font-black text-[#2F00E6] dark:text-blue-400 uppercase tracking-[0.2em]">{t('loading_identity')}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1300px] mx-auto lg:px-10 pb-20 pt-10 transition-all duration-300 relative">
      <div className="noise-bg opacity-10"></div>
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[30%] h-[30%] bg-[#2F00E6]/5 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-[#5CA8FF]/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-gray-100 dark:border-white/5 pb-8 gap-6 animate-fade-in-up">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 mb-2">
            <Sparkles className="w-3 h-3 text-[#2F00E6]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2F00E6]">Intelligence Artificielle</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0D0066] dark:text-white font-['Outfit'] tracking-tight">{t('results_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">{t('results_subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 md:flex md:flex-row md:items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="group relative flex items-center justify-center gap-2 md:gap-3 bg-white dark:bg-white/10 text-[#0D0066] dark:text-white px-2 py-3 md:px-8 md:py-4 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-xl active:scale-95 disabled:opacity-50 border border-gray-100 dark:border-white/10 text-xs md:text-base text-center"
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#2F00E6]" /> 
            <span>{isDownloading ? t('preparing') : 'Brand Board'}</span>
          </button>
          <button 
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="group relative flex items-center justify-center gap-2 md:gap-3 bg-[#2F00E6] text-white px-2 py-3 md:px-8 md:py-4 rounded-2xl font-black hover:bg-[#1200AB] transition-all shadow-[0_20px_50px_rgba(47,0,230,0.25)] active:scale-95 disabled:opacity-50 overflow-hidden text-xs md:text-base text-center"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <Download className="w-4 h-4 md:w-5 md:h-5 relative z-10" /> 
            <span className="relative z-10">{isDownloading ? t('preparing') : t('download_kit')}</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1 md:gap-2 text-gray-400 bg-white/50 dark:bg-white/5 px-2 py-3 md:px-6 md:py-4 rounded-2xl font-black hover:bg-white dark:hover:bg-white/10 transition-all border border-gray-100 dark:border-white/10 uppercase tracking-widest text-[9px] md:text-[11px]"
            title="Imprimer ou Sauvegarder en PDF"
          >
            <Printer className="w-3 h-3 md:w-4 md:h-4" /> {t('print') || 'PDF'}
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center justify-center gap-1 md:gap-2 text-[#2F00E6] dark:text-blue-400 bg-[#2F00E6]/5 dark:bg-blue-400/5 px-2 py-3 md:px-6 md:py-4 rounded-2xl font-black hover:bg-[#2F00E6]/10 transition-all border border-[#2F00E6]/10 uppercase tracking-widest text-[9px] md:text-[11px]"
          >
            <Bookmark className="w-3 h-3 md:w-4 md:h-4" /> {t('view_history')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Logos Tiles */}
        <div className="glass-card p-6 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 h-auto lg:h-[380px] flex flex-col group relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[13px] text-gray-400 uppercase tracking-widest">{t('logo_label')}</h2>
            <div className="w-8 h-1 bg-[#2F00E6]/20 rounded-full"></div>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-black/20 flex items-center justify-center overflow-hidden relative rounded-3xl border border-gray-100 dark:border-white/5 shadow-inner">
             {data.logos && data.logos.length > 0 ? (
               <>
                 <img 
                   key={data.logos[0].id} 
                   src={data.logos[0].url} 
                   alt="Generated Brand Logo" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                 />
                 <button 
                   onClick={() => handleDownloadLogo(data.logos[0].url)}
                   disabled={isDownloading}
                   className="absolute bottom-5 right-5 bg-black/80 hover:bg-black backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 disabled:opacity-50 border border-white/10"
                   title={t('download_logo_title')}
                 >
                   <Download className="w-6 h-6" />
                 </button>
               </>
             ) : (
               <div className="flex flex-col items-center gap-4 text-gray-400">
                 <Loader2 className="w-8 h-8 animate-spin" />
                 <span className="font-bold text-sm">{t('no_logo_found')}</span>
               </div>
             )}
          </div>
        </div>
        
        {/* Palette Tiles */}
        <div className="glass-card p-6 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 h-[380px] flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[13px] text-gray-400 uppercase tracking-widest">{t('palette_label')}</h2>
            <span className="text-[#2F00E6] bg-[#2F00E6]/5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-[#2F00E6]/10">Smart Selection</span>
          </div>
          <div className="flex-1 flex overflow-hidden rounded-3xl shadow-xl border border-gray-100 dark:border-white/5">
              <div className="w-[45%] flex items-center justify-center text-[10px] font-black mix-blend-difference text-white uppercase tracking-widest -rotate-90" style={{ backgroundColor: data.colors?.background || '#FFFFFF' }}>{t('color_background')}</div>
              <div className="w-[55%] flex flex-wrap">
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-black text-white mix-blend-overlay hover:brightness-110 transition-all cursor-crosshair group/c" style={{ backgroundColor: data.colors?.primary || '#2F00E6' }}>
                  <span className="opacity-0 group-hover/c:opacity-100 transition-opacity uppercase">{data.colors?.primary || '#2F00E6'}</span>
                </div>
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-black text-white mix-blend-overlay hover:brightness-110 transition-all cursor-crosshair group/c" style={{ backgroundColor: data.colors?.secondary || '#0D0066' }}>
                  <span className="opacity-0 group-hover/c:opacity-100 transition-opacity uppercase">{data.colors?.secondary || '#0D0066'}</span>
                </div>
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-black text-white mix-blend-overlay hover:brightness-125 transition-all cursor-crosshair group/c" style={{ backgroundColor: data.colors?.accent || '#00A7D6' }}>
                  <span className="opacity-0 group-hover/c:opacity-100 transition-opacity uppercase">{data.colors?.accent || '#00A7D6'}</span>
                </div>
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-white/5 uppercase tracking-tighter">Default App</div>
              </div>
          </div>
        </div>
        
        {/* Typographies Tiles */}
        <div className="glass-card p-6 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 h-[380px] flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[13px] text-gray-400 uppercase tracking-widest">{t('typography_label')}</h2>
            <div className="w-8 h-1 bg-[#2F00E6]/20 rounded-full"></div>
          </div>
          <div className="flex-1 flex flex-col justify-center bg-gray-50 dark:bg-black/20 rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-inner">
            <h1 className="text-6xl text-[#0D0066] dark:text-white font-black tracking-tighter mb-4 truncate leading-none" style={{ fontFamily: data.typography?.heading }}>
              Aa
            </h1>
            <p className="text-[12px] font-black text-[#2F00E6] dark:text-blue-400 mb-8 uppercase tracking-widest">{t('heading')}: <span className="text-gray-400">{data.typography?.heading}</span></p>
            
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-tight font-sans border-l-4 border-[#2F00E6] pl-4 mb-4 truncate" style={{ fontFamily: data.typography?.body }}>
              {t('typography_preview_text')}
            </p>
            <p className="text-[10px] font-black text-gray-400 pl-5 uppercase tracking-widest">{t('body')}: {data.typography?.body}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        {/* Slogan Container */}
        <div className="glass-card p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 h-auto lg:h-[320px] flex flex-col z-10 border border-white/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[13px] text-gray-400 uppercase tracking-widest">{t('slogan_label')}</h2>
          </div>
          <p className="font-bold text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-lg">{t('slogan_desc')}</p>
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-black text-[#2F00E6]/40 uppercase tracking-[0.3em]">{t('ai_crafted')}</span>
          </div>
        </div>

        {/* Big Slogan Showcase */}
        <div className="col-span-1 lg:col-span-2 relative flex flex-col items-center group">
          <div className="bg-[#2F00E6] shadow-[0_30px_100px_rgba(47,0,230,0.4)] h-[250px] lg:h-[320px] w-full flex items-center justify-center p-8 lg:p-16 hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(47,0,230,0.5)] transition-all duration-700 z-10 rounded-[2.5rem] overflow-hidden relative ring-1 ring-white/10 group">
             <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
             
             <h3 className="text-white text-3xl lg:text-5xl font-black leading-none text-center max-w-2xl relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-['Outfit'] tracking-tighter">
               "{data?.slogan || "Global Strategy"}"
             </h3>
             
             <div className="absolute bottom-8 right-10 opacity-20">
               <Sparkles size={40} className="text-white animate-pulse" />
             </div>
          </div>
        </div>

      </div>
      <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-black text-[#0D0066] dark:text-white mb-8 font-['Outfit'] flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#2F00E6]" />
          Social Media Pack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Instagram Post Mockup */}
          <div className="glass-card p-6 rounded-[2.5rem] border border-white/20 shadow-xl group hover:-translate-y-2 transition-all duration-500">
            <div className="aspect-square bg-gray-50 dark:bg-black/20 rounded-2xl mb-6 overflow-hidden relative flex items-center justify-center border border-gray-100 dark:border-white/5">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#2F00E6] p-0.5">
                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img src={data.logos?.[0]?.url} alt="Profile" className="w-[70%] h-[70%] object-contain" />
                   </div>
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400">@{(data.brand_name || data.name || "brand").toLowerCase().replace(/\s+/g, '')}</span>
              </div>
              <img src={data.logos?.[0]?.url} alt="Instagram Post" className="w-[60%] h-[60%] object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instagram Square</span>
              <button 
                onClick={() => handleDownloadLogo(data.logos?.[0]?.url)} 
                className="p-2 bg-[#2F00E6]/5 hover:bg-[#2F00E6] text-[#2F00E6] hover:text-white rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Twitter / X Mockup */}
          <div className="glass-card p-6 rounded-[2.5rem] border border-white/20 shadow-xl group hover:-translate-y-2 transition-all duration-500">
            <div className="aspect-[16/9] bg-gray-50 dark:bg-black/20 rounded-2xl mb-6 overflow-hidden relative flex flex-col border border-gray-100 dark:border-white/5">
              <div className="h-[60%] w-full" style={{ backgroundColor: data.colors?.primary }}></div>
              <div className="flex-1 bg-white dark:bg-gray-900 p-4 relative">
                <div className="absolute -top-8 left-4 w-16 h-16 rounded-full border-4 border-white dark:border-gray-900 bg-white flex items-center justify-center overflow-hidden shadow-lg">
                  <img src={data.logos?.[0]?.url} alt="Profile X" className="w-[70%] h-[70%] object-contain" />
                </div>
                <div className="mt-8">
                  <div className="h-2 w-24 bg-gray-100 dark:bg-white/10 rounded-full mb-2"></div>
                  <div className="h-1.5 w-16 bg-gray-50 dark:bg-white/5 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">X / Twitter Pack</span>
              <button 
                onClick={() => handleDownloadLogo(data.logos?.[0]?.url)} 
                className="p-2 bg-[#2F00E6]/5 hover:bg-[#2F00E6] text-[#2F00E6] hover:text-white rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LinkedIn Mockup */}
          <div className="glass-card p-6 rounded-[2.5rem] border border-white/20 shadow-xl group hover:-translate-y-2 transition-all duration-500">
            <div className="aspect-[1.91/1] bg-gray-50 dark:bg-black/20 rounded-2xl mb-6 overflow-hidden relative border border-gray-100 dark:border-white/5 flex items-center justify-center">
               <div className="w-full h-full opacity-10 absolute" style={{ 
                 backgroundImage: `radial-gradient(circle at 2px 2px, ${data.colors?.primary} 1px, transparent 0)`,
                 backgroundSize: '20px 20px'
               }}></div>
               <div className="bg-white p-6 rounded-2xl shadow-2xl relative z-10 scale-75 group-hover:scale-90 transition-transform duration-700 border border-gray-50">
                  <img src={data.logos?.[0]?.url} alt="LinkedIn" className="w-24 h-24 object-contain" />
               </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LinkedIn Banner</span>
              <button 
                onClick={() => handleDownloadLogo(data.logos?.[0]?.url)} 
                className="p-2 bg-[#2F00E6]/5 hover:bg-[#2F00E6] text-[#2F00E6] hover:text-white rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Brand Board for PDF Export */}
      <div className="fixed top-[-10000px] left-[-10000px] pointer-events-none">
        <BrandBoard ref={boardRef} data={data} t={t} />
      </div>

    </div>
  );
};

export default BrandResults;
