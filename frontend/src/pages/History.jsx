import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('brandHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout votre historique ?')) {
      localStorage.removeItem('brandHistory');
      setHistory([]);
    }
  };

  const viewResult = (item) => {
    localStorage.setItem('brandResult', JSON.stringify(item));
    navigate('/results');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in-up lg:px-10 pb-10 pt-8">
      
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#0D0066] font-['Outfit']">Historique des générations</h1>
          <p className="text-gray-500 text-sm mt-1">Retrouvez toutes vos anciennes créations ici.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-full font-semibold hover:bg-red-100 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" /> Vider
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Aucun historique</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md">Vous n'avez pas encore généré d'identité de marque. Laissez l'IA faire la magie pour vous !</p>
          <button 
            onClick={() => navigate('/generate')}
            className="bg-[#2A00D6] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1A00B8] transition-colors"
          >
            Générer une marque
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-[320px] hover:-translate-y-1"
              onClick={() => viewResult(item)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Preview */}
              <div className="h-[140px] w-full bg-gray-50 overflow-hidden relative">
                {item.logos && item.logos.length > 0 ? (
                  <img src={item.logos[0].url} alt="Logo preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-[#2A00D6]/10" />
                )}
                
                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md text-gray-700 shadow-sm">
                  {new Date(item.date).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Data Preview */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Nom de la marque (corrigé) */}
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-2 font-['Outfit']">
                  {item.brand_name || 'Marque sans nom'}
                </h3>
                
                {/* Colors Mini Palette */}
                <div className="flex gap-2 mb-4 h-6">
                  {item.colors && Object.values(item.colors).map((hex, i) => (
                    <div key={i} className="w-10 h-full rounded-sm shadow-inner" style={{ backgroundColor: hex }} title={hex} />
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 italic line-clamp-2 mt-auto">
                  "{item.slogan}"
                </p>
                
                {/* Action button */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[#2A00D6] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Voir en détail</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default History;
