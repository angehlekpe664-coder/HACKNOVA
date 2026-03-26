import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Download, Bookmark } from 'lucide-react';

const BrandResults = () => {
  const [data, setData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('brandResult');
    if (saved) {
      const parsedData = JSON.parse(saved);
      setData(parsedData);
      
      // Save to History safely
      try {
        let history = [];
        const rawHistory = localStorage.getItem('brandHistory');
        if (rawHistory) {
          history = JSON.parse(rawHistory);
          if (!Array.isArray(history)) history = [];
        }
        
        const isAlreadyInHistory = history.find(h => h && h.slogan && h.slogan === parsedData.slogan);
        if (!isAlreadyInHistory && parsedData.slogan) {
          history.unshift({ ...parsedData, date: new Date().toISOString() });
          localStorage.setItem('brandHistory', JSON.stringify(history));
        }
      } catch(e) {
        console.error("Format d'historique invalide, réinitialisation", e);
        localStorage.setItem('brandHistory', JSON.stringify([{ ...parsedData, date: new Date().toISOString() }]));
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
        a.download = `brand_kit_${(data.brand_name || "ma_marque").toLowerCase().replace(/\s+/g, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Erreur lors de la génération du ZIP.");
      }
    } catch (err) {
      console.error('ZIP Download failed:', err);
      alert("Une erreur est survenue lors du téléchargement.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!data) return <div className="p-10 text-xl font-bold animate-pulse text-[#2A00D6]">Chargement de votre identité...</div>;

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in-up lg:px-10 pb-10">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#0D0066] font-['Outfit']">Votre Identité de Marque</h1>
          <p className="text-gray-500 text-sm mt-1">Générée avec succès par l'IA.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-[#1700E5] text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#0D0066] transition-all shadow-[0_4px_15px_rgba(23,0,229,0.2)] text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {isDownloading ? 'Préparation...' : 'Télécharger Kit ZIP'}
          </button>
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 text-[#2A00D6] bg-[#2A00D6]/10 px-4 py-2 rounded-full font-semibold hover:bg-[#2A00D6]/20 transition-colors text-sm"
          >
            <Bookmark className="w-4 h-4" /> Voir mon historique
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Logos */}
        <div className="bg-white p-5 shadow-sm border border-gray-100 h-auto lg:h-[320px] flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full group relative rounded-xl">
          <h2 className="font-extrabold text-[15px] text-black border-b border-gray-100 pb-2 mb-2">Logo généré par IA</h2>
          <div className="flex-1 border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative rounded-lg">
             {data.logos && data.logos.length > 0 ? (
               <>
                 <img 
                   key={data.logos[0].id} 
                   src={data.logos[0].url} 
                   alt="Generated Brand Logo" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <button 
                   onClick={() => handleDownloadLogo(data.logos[0].url)}
                   disabled={isDownloading}
                   className="absolute bottom-3 right-3 bg-black/70 hover:bg-black backdrop-blur-md text-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 disabled:opacity-50"
                   title="Télécharger le logo"
                 >
                   <Download className="w-5 h-5" />
                 </button>
               </>
             ) : (
               <span className="text-gray-400">Aucun logo trouvé</span>
             )}
          </div>
        </div>
        
        {/* Palette des couleurs */}
        <div className="bg-white p-5 shadow-sm border border-gray-100 h-[320px] flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full rounded-xl" style={{animationDelay: '0.1s'}}>
          <h2 className="font-extrabold text-[15px] text-black border-b border-gray-100 pb-2 mb-4 flex justify-between items-center">
            Palette de couleurs <span className="text-[#00A7D6] bg-[#00A7D6]/10 px-2 py-1 rounded-md text-[10px] animate-pulse">✨ AI-Powered</span>
          </h2>
          <div className="flex-1 flex overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <div className="w-[45%] flex items-center justify-center text-xs font-medium mix-blend-difference text-white" style={{ backgroundColor: data.colors?.background || '#FFFFFF' }}>Fond</div>
              <div className="w-[55%] flex flex-wrap">
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-bold text-white shadow-inner transition-colors hover:brightness-110" style={{ backgroundColor: data.colors?.primary || '#2F00E6' }}>{data.colors?.primary || '#2F00E6'}</div>
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-bold text-white shadow-inner transition-colors hover:brightness-110" style={{ backgroundColor: data.colors?.secondary || '#0D0066' }}>{data.colors?.secondary || '#0D0066'}</div>
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-bold text-white shadow-inner transition-colors hover:brightness-125" style={{ backgroundColor: data.colors?.accent || '#00A7D6' }}>{data.colors?.accent || '#00A7D6'}</div>
                <div className="w-1/2 h-1/2 flex items-center justify-center text-[11px] font-bold text-black shadow-inner bg-gray-100" style={{ backgroundColor: data.colors?.background || '#F3F4F6' }}>App</div>
              </div>
          </div>
        </div>
        
        {/* Typographies */}
        <div className="bg-white p-5 shadow-sm border border-gray-100 h-[320px] flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full rounded-xl" style={{animationDelay: '0.2s'}}>
          <h2 className="font-extrabold text-[15px] text-black border-b border-gray-100 pb-2 mb-4">Typographies</h2>
          <div className="flex-1 flex flex-col justify-center bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h1 className="text-4xl text-black font-black tracking-tighter mb-3 truncate" style={{ fontFamily: data.typography?.heading }}>
              Aa
            </h1>
            <p className="text-[13px] font-bold text-[#2A00D6] mb-4">Titre: {data.typography?.heading}</p>
            
            <p className="text-[15px] text-gray-800 leading-relaxed font-sans border-l-2 border-[#2A00D6] pl-3 mb-2" style={{ fontFamily: data.typography?.body }}>
              Héritage, simplicité et élégance.
            </p>
            <p className="text-[12px] font-medium text-gray-500 pl-3">Corps: {data.typography?.body}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 relative" style={{animationDelay: '0.3s'}}>
        {/* Slogan Label */}
        <div className="bg-white p-5 shadow-sm border border-gray-100 h-auto lg:h-[280px] flex flex-col z-10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-xl">
          <h2 className="font-extrabold text-[15px] text-black mb-2 border-b border-gray-100 pb-2">Slogan officiel</h2>
          <p className="text-sm text-gray-500 mb-2 leading-relaxed">Votre message de marque principal, optimisé pour l'impact marketing.</p>
          <div className="hidden lg:flex flex-col mt-auto text-[11px] text-gray-400 font-medium">
            <span>Rédigé par Intelligence Artificielle.</span>
          </div>
        </div>

        {/* Dotted Line connector (Desktop only) */}
        <div className="hidden lg:block absolute top-[140px] left-[32%] w-[5%] border-t-2 border-dotted border-[#00A7D6] z-0 animate-pulse"></div>

        {/* Slogan Content */}
        <div className="col-span-1 lg:col-span-2 relative flex flex-col items-center group">
          <div className="bg-gradient-to-br from-[#1700E5] via-[#2A00D6] to-[#0A0066] shadow-[0_15px_40px_rgba(23,0,229,0.3)] h-[200px] lg:h-[280px] w-full flex items-center justify-center p-6 lg:p-12 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(23,0,229,0.4)] transition-all duration-300 z-10 rounded-xl overflow-hidden relative ring-1 ring-white/10">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             <h3 className="text-white text-[18px] lg:text-[28px] font-black leading-tight text-center max-w-[550px] relative z-10 drop-shadow-xl font-['Outfit']">
               "{data.slogan}"
             </h3>
          </div>
        </div>

      </div>

    </div>
  );
};

export default BrandResults;
