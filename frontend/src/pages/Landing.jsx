import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const Landing = () => {
  const navigate = useNavigate();
  // State to trigger animation classes properly on mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);


  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#020617] font-sans selection:bg-[#2F00E6] selection:text-white overflow-hidden relative">
      <SEO 
        title="Identité de Marque augmentée par l'IA"
        description="Propulsez votre identité visuelle avec l'intelligence artificielle de pointe. Générez des logos, slogans et palettes de couleurs en quelques secondes."
      />

      
      {/* Premium Background Effects */}
      <div className="noise-bg"></div>
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2F00E6]/10 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#5CA8FF]/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '-5s' }}></div>
      <div className="absolute top-[40%] left-[20%] w-[25%] h-[25%] bg-purple-500/5 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '-2s' }}></div>

      {/* Left side - Content */}
      <div className={`w-full lg:w-[45%] px-8 lg:pl-[100px] lg:pr-14 py-20 lg:py-0 flex flex-col justify-center relative z-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        
        <div className="reveal active mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F00E6]/5 border border-[#2F00E6]/10 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-[#2F00E6]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[#2F00E6]">Tech Nova Challenge 2</span>
        </div>

        <h1 className="flex items-baseline mb-6 lg:mb-10 font-['Outfit'] relative">
          <span className="text-[50px] sm:text-[65px] md:text-[85px] lg:text-[115px] font-black leading-[0.85] text-[#13009E] dark:text-white tracking-tighter drop-shadow-sm flex-shrink-0">Brand</span>
          <span className="w-4 h-4 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-[#2F00E6] mx-1.5 sm:mx-2.5 lg:mx-3 translate-y-[-5px] lg:translate-y-[-12px] shadow-[0_10px_25px_rgba(47,0,230,0.4)] animate-levitate rounded-sm flex-shrink-0"></span>
          <span className="text-[50px] sm:text-[65px] md:text-[85px] lg:text-[115px] font-black leading-[0.85] text-[#2F00E6] lg:text-transparent lg:bg-clip-text lg:bg-gradient-to-r lg:from-[#2F00E6] lg:to-[#5CA8FF] tracking-tighter drop-shadow-md flex-shrink-0">AI</span>
        </h1>

        <p className="text-[26px] sm:text-[30px] lg:text-[38px] text-gray-800 dark:text-gray-200 font-bold mb-14 lg:mb-20 leading-[1.1] max-w-[580px] relative">
          Propulsez votre identité visuelle avec <span className="text-[#2F00E6] underline decoration-4 decoration-[#2F00E6]/20 underline-offset-8">l'intelligence artificielle</span> de pointe.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={() => navigate('/generate')}
            className="group relative bg-[#2F00E6] hover:bg-[#1200AB] text-white text-[22px] lg:text-[28px] font-black py-4 px-10 lg:px-14 rounded-2xl w-full sm:w-max flex items-center justify-center gap-4 lg:gap-6 shadow-[0_20px_50px_rgba(47,0,230,0.3)] transition-all hover:scale-105 active:scale-95 duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative z-10">Commencer</span>
            <ChevronRight className="relative z-10 w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
          </button>
          
          <div className="flex -space-x-3 items-center">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#020617] bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <span className="ml-4 text-xs font-bold text-gray-500 dark:text-gray-400">+500 créateurs</span>
          </div>
        </div>
      </div>
      
      {/* Right side - Infinite Vertical Scroll Showcase */}
      <div className="w-full lg:w-[55%] min-h-[500px] lg:h-[100dvh] relative overflow-hidden flex flex-col lg:flex-row gap-5 p-5 lg:p-0 bg-gray-50/50 dark:bg-transparent">
        
        {/* Decorative dynamic background mesh for mobile */}
        <div className="absolute inset-0 mesh-gradient opacity-30 lg:hidden pointer-events-none"></div>

        {/* Mobile View: Horizontal scrolling rows */}
        <div className="lg:hidden w-full flex flex-col gap-8 overflow-hidden py-10 relative z-20">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-5 animate-marquee-left hover:pause w-max pb-4">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <div className="w-[80vw] sm:w-[350px] shrink-0 glass-card p-6 rounded-3xl shadow-xl">
                    <p className="font-extrabold text-[10px] text-gray-400 mb-4 uppercase tracking-[0.2em]">Logo principal</p>
                    <div className="flex items-center justify-center py-6">
                      <div className="flex relative items-center">
                        <div className="w-6 h-6 bg-[#6699FF] rotate-45 absolute -left-3 -top-2 opacity-50"></div>
                        <div className="w-6 h-6 bg-[#1800E5] rotate-45 relative shadow-xl"></div>
                        <span className="font-black text-[#0D0066] dark:text-white text-[24px] ml-4">HackNova</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-[80vw] sm:w-[350px] shrink-0 bg-[#2F00E6] p-8 rounded-3xl shadow-2xl text-white">
                    <p className="text-[9px] font-black mb-6 text-white/60 uppercase tracking-widest">Slogan</p>
                    <h2 className="text-[28px] font-black leading-tight tracking-tighter">Design simplifié.<br/>Résultat amplifié.</h2>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-5 animate-marquee-right hover:pause w-max pb-4">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  <div className="w-[80vw] sm:w-[350px] shrink-0 glass-card flex flex-col rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6">
                      <p className="font-extrabold text-[10px] text-gray-400 uppercase tracking-[0.2em]">Brand palette</p>
                    </div>
                    <div className="flex h-20">
                      <div className="flex-1 bg-[#2F00E6]"></div>
                      <div className="w-1/2 bg-black"></div>
                      <div className="flex-1 bg-[#0D0066]"></div>
                      <div className="flex-1 bg-[#5CA8FF]"></div>
                    </div>
                  </div>
                  <div className="w-[80vw] sm:w-[350px] shrink-0 bg-[#020617] p-8 rounded-3xl shadow-2xl text-white">
                    <h2 className="text-xl font-black text-[#5CA8FF] mb-2 uppercase">Vision & Mission</h2>
                    <p className="text-sm opacity-70">Simplifier l'avenir du design grâce à l'IA.</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View: Vertical Columns (Visible on LG up) */}
        <div className="hidden lg:flex flex-1 gap-5 overflow-hidden h-full lg:h-[100dvh] cursor-grab active:cursor-grabbing">
          
          {/* Column 1 - Scroll Down */}
          <div className="flex-1 flex flex-col gap-5 animate-scroll-down hover:pause">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {/* Card 1: Logo HackNova */}
                <div className="glass-card p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <p className="font-extrabold text-[13px] text-gray-400 mb-6 uppercase tracking-widest">Logo principal</p>
                  <div className="flex items-center justify-center py-10">
                    <div className="flex relative items-center group-hover:scale-110 transition-transform duration-500">
                      <div className="w-8 h-8 bg-[#6699FF] rotate-45 absolute -left-4 -top-3 shadow-sm blur-[1px] opacity-50"></div>
                      <div className="w-8 h-8 bg-[#1800E5] rotate-45 relative shadow-xl"></div>
                      <span className="font-black text-[#0D0066] dark:text-white text-[32px] tracking-tighter ml-6">HackNova</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Slogan */}
                <div className="bg-[#2F00E6] p-10 rounded-[2rem] shadow-2xl text-white flex flex-col relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                   <p className="text-[11px] font-black mb-8 text-white/60 uppercase tracking-[0.2em]">Slogan stratégique</p>
                   <div className="my-auto">
                     <h2 className="text-[38px] lg:text-[42px] font-black leading-tight tracking-tighter">Design simplifié.<br/><span className="text-white/80">Résultat amplifié.</span></h2>
                   </div>
                </div>

                {/* Card 5: Semantic Colors */}
                <div className="glass-card p-8 rounded-[2rem] shadow-xl group">
                   <p className="font-extrabold text-[13px] text-gray-400 mb-6 uppercase tracking-widest">Couleurs sémantiques</p>
                   <div className="grid grid-cols-4 gap-2 h-20 rounded-xl overflow-hidden mt-4">
                     {["#EF4444", "#10B981", "#F59E0B", "#3B82F6"].map((color, idx) => (
                       <div key={idx} style={{backgroundColor: color}} className="w-full h-full"></div>
                     ))}
                   </div>
                </div>

                {/* Card 7: Patterns */}
                <div className="bg-[#020617] rounded-[2.5rem] relative overflow-hidden min-h-[220px] shadow-2xl flex items-center justify-center group pointer-events-auto">
                  <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: `linear-gradient(135deg, #2F00E6 25%, transparent 25%), linear-gradient(225deg, #2F00E6 25%, transparent 25%), linear-gradient(45deg, #2F00E6 25%, transparent 25%), linear-gradient(315deg, #2F00E6 25%, transparent 25%)`,
                    backgroundPosition: '15px 0, 15px 0, 0 0, 0 0',
                    backgroundSize: '30px 30px'
                  }}></div>
                  <h2 className="text-[32px] font-black text-white relative z-10 text-center uppercase tracking-tighter leading-none">Shape &<br/>Pattern</h2>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Column 2 - Scroll Up */}
          <div className="flex-1 flex flex-col gap-5 animate-scroll-up hover:pause">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {/* Card 2: Brand Palette */}
                <div className="glass-card flex flex-col rounded-[2rem] shadow-xl overflow-hidden group">
                  <div className="p-8 pb-4">
                    <p className="font-extrabold text-[13px] text-gray-400 mb-2 uppercase tracking-widest">Brand palette</p>
                  </div>
                  <div className="flex flex-col h-40">
                    <div className="flex-1 flex">
                      <div className="w-1/2 bg-[#2F00E6]"></div>
                      <div className="w-1/2 bg-black"></div>
                    </div>
                    <div className="flex-1 flex">
                      <div className="w-1/2 bg-[#0D0066]"></div>
                      <div className="w-1/2 bg-[#5CA8FF]"></div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Vision & Mission */}
                <div className="bg-[#020617] p-10 rounded-[2rem] shadow-2xl text-white flex flex-col group">
                   <div className="flex flex-col gap-8">
                     <div>
                       <h3 className="text-[28px] font-black text-[#5CA8FF] leading-none mb-2">Vision</h3>
                       <p className="text-[14px] text-white/70 font-medium">Simplifier l'avenir du design grâce à l'IA.</p>
                     </div>
                     <div>
                       <h3 className="text-[28px] font-black text-[#5CA8FF] leading-none mb-2">Mission</h3>
                       <p className="text-[14px] text-white/70 font-medium">Rendre le branding professionnel accessible.</p>
                     </div>
                   </div>
                </div>

                {/* Card 6: Voice & Ton */}
                <div className="glass-card p-8 rounded-[2rem] shadow-xl group">
                   <p className="font-extrabold text-[13px] text-gray-400 mb-6 uppercase tracking-widest">Voix & Ton</p>
                   <div className="space-y-3">
                     <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                       <p className="font-black text-[#2F00E6] text-[12px] uppercase">Amical</p>
                     </div>
                     <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                       <p className="font-black text-[#2F00E6] text-[12px] uppercase">Informatif</p>
                     </div>
                   </div>
                </div>

                {/* Card 8: Merci */}
                <div className="bg-gradient-to-br from-[#2F00E6] to-[#0D0066] p-10 rounded-[2rem] shadow-2xl text-white flex flex-col items-center justify-center relative overflow-hidden group">
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                   <h2 className="text-[42px] font-black tracking-tighter mb-4 group-hover:scale-110 transition-transform">Merci!</h2>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section - Visible on Scroll */}
      <div className="absolute bottom-10 left-8 lg:left-[100px] z-30 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.5em]">
            TECH NOVA CHALLENGE 2026 • BINÔME 35
          </p>
          <p className="text-[10px] font-black text-[#2F00E6] dark:text-[#5CA8FF] uppercase tracking-[0.2em]">
            EMMANUEL TOHOUEGNON & ANGE HLEKPE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
