import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-[#A2A6FF] to-[#878DFF] font-sans selection:bg-[#2A00D6] selection:text-white overflow-x-hidden">
      
      {/* Left side */}
      <div className={`w-full lg:w-[45%] px-8 lg:pl-[100px] lg:pr-14 py-20 lg:py-0 flex flex-col justify-center relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        
        {/* Decorative background glow on mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/20 rounded-full blur-3xl lg:hidden"></div>
        
        <h1 className="flex items-baseline mb-4 lg:mb-8 font-['Outfit'] relative">
          <span className="text-[70px] sm:text-[90px] lg:text-[130px] font-black leading-none text-[#1800E5] tracking-tight drop-shadow-sm">Brand</span>
          <span className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-[#1800E5] mx-2 sm:mx-3 translate-y-[-5px] lg:translate-y-[-10px] shadow-lg animate-levitate rounded-sm"></span>
          <span className="text-[70px] sm:text-[90px] lg:text-[130px] font-black leading-none text-white tracking-tight drop-shadow-md">Ai</span>
        </h1>
        <p className="text-[24px] sm:text-[28px] lg:text-[34px] text-[#1800E5] font-medium mb-12 lg:mb-16 leading-tight max-w-[550px] relative">
          Créer votre identité de marque avec l'IA
        </p>
        
        <button 
          onClick={() => navigate('/generate')}
          className="bg-[#1800E5] hover:bg-[#1200AB] text-white text-[22px] lg:text-[30px] font-medium py-4 px-10 lg:px-14 rounded-full w-full sm:w-max flex items-center justify-center gap-4 lg:gap-6 shadow-[0_15px_40px_rgba(24,0,229,0.4)] transition-all hover:scale-105 hover:shadow-[0_20px_50px_rgba(24,0,229,0.6)] duration-300 relative group overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative z-10">Commencez</span>
          <span className="relative z-10 text-3xl lg:text-4xl font-light translate-y-[-1px] lg:translate-y-[-2px] group-hover:translate-x-2 transition-transform">{'>>'}</span>
        </button>
      </div>
      
      {/* Right side - Style Guide Grid */}
      {/* Background Elements (Floating Logos & Mesh) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mesh Gradient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] mesh-gradient opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] mesh-gradient opacity-20" style={{ animationDelay: '-5s' }}></div>
        
        <div className="absolute top-[15%] left-[10%] w-32 h-32 opacity-15 blur-[1px] animate-slow-rotate animate-floating mix-blend-overlay">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
            <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="white"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="white"/>
          </svg>
        </div>
        <div className="absolute bottom-[20%] right-[15%] w-40 h-40 opacity-15 blur-[2px] animate-slow-rotate animate-floating mix-blend-overlay" style={{ animationDirection: 'reverse', animationDelay: '1s' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.28 7.53c-.52-1.99-1.39-3.48-2.88-4.48-1.49-1-3.21-1.35-5.32-.97a.4.4 0 0 0-.27.24l-.19.46v3.29c0 .24.16.44.39.49 1.15.22 1.9.7 2.4 1.54.55.93.59 1.95.14 2.88a.39.39 0 0 0 .19.53l.97.47.41.2c.2.1.4.19.59.29a.394.394 0 0 0 .56-.23c.72-1.37.89-2.91.5-4.63M16.1 1.34c-1.87-.8-3.69-.88-5.46-.3-1.77.58-3.04 1.83-3.7 3.73-.08.22.01.46.22.56l.46.19 3.12 1.29c.22.09.47 0 .57-.22.42-1.07 1.11-1.68 2.19-1.95.1-.03.21-.05.31-.05.81 0 1.58.4 2.05 1.12.56.84.55 1.84-.04 2.75a.4.4 0 0 0 .11.55l.89.6.38.25c.18.12.36.25.55.37a.39.39 0 0 0 .53-.13c1.07-1.46 1.4-3.14 1.13-5-.27-1.85-1.12-3.21-2.22-4M3.71 4.75c-1.28 1.47-1.78 3.14-1.63 5.02.16 1.88.94 3.41 2.39 4.6l.4.33 2.92 2.39a.4.4 0 0 0 .58-.08c.78-.9 1.05-1.89.87-3a.4.4 0 0 0-.32-.34c-1.32-.23-2.18-.87-2.61-2a1.64 1.64 0 0 1-.03-.1c-.41-.95-.31-1.96.28-2.81a.406.406 0 0 0-.11-.56l-1.09-.76-.46-.32a1.444 1.444 0 0 1-.3-.21.393.393 0 0 0-.54 0M1.32 12.33c-.15 2.03.35 3.84 1.56 5.4 1.21 1.56 2.83 2.5 4.86 2.82a.4.4 0 0 0 .42-.23l.18-.47v-3.38a.4.4 0 0 0-.35-.41c-1.11-.2-1.83-.69-2.31-1.5-.54-.91-.58-1.93-.11-2.88a.391.391 0 0 0-.2-.53l-3.18-1.34c-.23-.1-.49-.01-.59.22-.16.4-.27.81-.36 1.22-.14.67-.18 1.34-.14 2.01m7.48 10.33c1.87.81 3.69.88 5.46.31 1.77-.57 3.04-1.82 3.7-3.73a.4.4 0 0 0-.22-.56l-3.36-1.39a.4.4 0 0 0-.53.21c-.44 1.07-1.13 1.68-2.21 1.95-.1.02-.2.03-.3.03-.84 0-1.6-.43-2.07-1.18-.54-.83-.52-1.83.08-2.73a.4.4 0 0 0-.11-.56l-.88-.59-.38-.26c-.18-.12-.36-.24-.55-.37a.39.39 0 0 0-.53.13c-1.07 1.46-1.4 3.14-1.13 5 .27 1.86 1.12 3.22 2.22 4.02M19.98 19.33c1.3-1.47 1.8-3.14 1.65-5.02-.15-1.88-.93-3.41-2.38-4.6l-3.32-2.73a.403.403 0 0 0-.55.08c-.77.9-1.04 1.89-.86 3 .02.11.08.21.16.29.35.34.8.52 1.3.52.88 0 1.51-.43 2.03-1.25.56-.88.63-1.84.21-2.84a.406.406 0 0 1 .1-.56c.14-.1.29-.2.43-.3l.66-.46.46-.32a.39.39 0 0 1 .54.08c.55.77.94 1.62 1.2 2.53.25.92.35 1.85.3 2.79.03.11-.06.2-.17.21l-1.02-.07a.401.401 0 0 0-.4.32c-.15 1.11-.64 1.82-1.45 2.31-.91.54-1.93.58-2.89.11a.403.403 0 0 1-.2-.53l1.17-2.82a.4.4 0 0 1 .54-.23c.09.04.18.08.27.11M12 10.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" fill="white"/>
          </svg>
        </div>
      </div>

      
      {/* Right side - Style Guide Grid */}
      <div className="w-full lg:w-[55%] px-6 sm:px-10 lg:pl-[20px] lg:pr-10 py-16 lg:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-[20px] auto-rows-fr relative">
        
        {/* Row 1 */}
        <div className="bg-white/95 backdrop-blur-md p-6 lg:p-6 rounded-3xl lg:rounded-xl shadow-xl hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 flex flex-col justify-start reveal -translate-x-12 opacity-0 group" style={{transitionDelay: '0.1s'}}>
          <p className="font-extrabold text-[14px] lg:text-[13px] text-black mb-6">Logo principal</p>
          <div className="flex flex-1 items-center justify-center -mt-2 lg:-mt-4 py-8">
            <div className="flex relative mr-6 group-hover:scale-110 transition-transform duration-500">
              <div className="w-8 h-8 lg:w-7 lg:h-7 bg-[#6699FF] rotate-45 absolute -left-4 -top-3 shadow-sm"></div>
              <div className="w-8 h-8 lg:w-7 lg:h-7 bg-[#1800E5] rotate-45 absolute left-0 top-0 shadow-md"></div>
            </div>
            <span className="font-bold text-[#1456A6] text-[32px] lg:text-[28px] tracking-tight ml-4">HackNova</span>
          </div>
          <p className="text-[11px] lg:text-[9px] text-gray-400 mt-auto pt-4 font-medium">Logos / Logo primaire</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md flex flex-col md:flex-row rounded-3xl lg:rounded-xl shadow-xl hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 reveal translate-x-12 opacity-0 overflow-hidden group" style={{transitionDelay: '0.2s'}}>
          <div className="w-full md:w-[45%] lg:w-[45%] p-6 lg:p-5 flex flex-col justify-between bg-white z-10 relative">
            <div>
              <p className="font-bold text-[14px] lg:text-[13px] text-black mb-3 lg:mb-2">Brand palette</p>
              <p className="text-[12px] lg:text-[10px] text-gray-500 leading-relaxed mb-4 lg:mb-0">Notre palette utilise de la théorie des couleurs... Nous pouvons symboliser la confiance.</p>
            </div>
            <p className="text-[11px] lg:text-[9px] text-gray-400 font-medium mt-4 lg:mt-0">Couleurs / Brand palette</p>
          </div>
          <div className="w-full md:w-[55%] lg:w-[55%] flex flex-col sm:flex-row md:flex-col text-[10px] text-white">
            <div className="flex-1 flex min-h-[100px] md:min-h-0">
              <div className="w-1/2 bg-[#1800E5] p-4 lg:p-3 flex flex-col justify-between group-hover:bg-[#2000FA] transition-colors"><span className="font-bold text-[13px] lg:text-[11px] mb-2 lg:mb-0">Bleu intense</span><span className="text-[10px] lg:text-[8px] text-white/70 mt-auto">#1800E5</span></div>
              <div className="w-1/2 bg-black p-4 lg:p-3 flex flex-col justify-between hover:bg-gray-900 transition-colors"><span className="font-bold text-[13px] lg:text-[11px] mb-2 lg:mb-0">Noir</span><span className="text-[10px] lg:text-[8px] text-white/70 mt-auto">#000000</span></div>
            </div>
            <div className="flex-1 flex min-h-[100px] md:min-h-0">
              <div className="w-1/2 bg-[#0D0066] p-4 lg:p-3 flex flex-col justify-between group-hover:bg-[#11008C] transition-colors"><span className="font-bold text-[13px] lg:text-[11px] mb-2 lg:mb-0">Bleu nuit</span><span className="text-[10px] lg:text-[8px] text-white/70 mt-auto">#0D0066</span></div>
              <div className="w-1/2 bg-white text-black p-4 lg:p-3 flex flex-col justify-between hover:bg-gray-50 transition-colors"><span className="font-bold text-[13px] lg:text-[11px] mb-2 lg:mb-0">White</span><span className="text-[10px] lg:text-[8px] text-black/50 mt-auto">#FFFFFF</span></div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="bg-[#1800E5] p-8 lg:p-8 rounded-3xl lg:rounded-xl shadow-xl text-white flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(24,0,229,0.3)] active:scale-[0.98] transition-all duration-300 reveal -translate-x-12 opacity-0 relative overflow-hidden group" style={{transitionDelay: '0.1s'}}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           <p className="text-[13px] lg:text-[12px] font-bold mb-8 lg:mb-6 text-white/80 uppercase tracking-wider relative z-10 font-[Outfit]">slogan</p>
           <div className="my-auto py-8 lg:py-0 relative z-10">
             <h2 className="text-[36px] md:text-[38px] lg:text-[38px] font-black leading-tight mb-1 tracking-tight drop-shadow-md">Design simplifié.</h2>
             <h2 className="text-[36px] md:text-[38px] lg:text-[38px] font-black leading-tight tracking-tight drop-shadow-md text-white/90">Résultat amplifié.</h2>
           </div>
           <p className="text-[11px] lg:text-[9px] text-white/60 mt-auto pt-6 font-medium relative z-10">Introduction / Slogan</p>
        </div>

        <div className="bg-[#0B032D] p-8 lg:p-8 rounded-3xl lg:rounded-xl shadow-xl text-white flex flex-col hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 reveal translate-x-12 opacity-0 group" style={{transitionDelay: '0.2s'}}>
           <div className="flex flex-col sm:flex-row flex-1 gap-8 sm:gap-10 mt-2 lg:mt-4 py-4 lg:py-0">
             <div className="flex-1 group-hover:-translate-y-1 transition-transform duration-300">
               <h3 className="text-[28px] lg:text-[36px] font-black mb-3 text-[#5CA8FF]">Vision</h3>
               <p className="text-[14px] lg:text-[13px] text-white/80 pr-4 leading-relaxed font-medium">Simplifiez la vie des designers professionnels et amateurs.</p>
             </div>
             <div className="flex-1 group-hover:-translate-y-1 transition-transform duration-300 delay-75">
               <h3 className="text-[28px] lg:text-[36px] font-black mb-3 text-[#5CA8FF]">Mission</h3>
               <p className="text-[14px] lg:text-[13px] text-white/80 lg:pr-2 leading-relaxed font-medium">Fournissez des ressources de conception de qualité et partagez-les avec le monde entier.</p>
             </div>
           </div>
           <p className="text-[11px] lg:text-[9px] text-white/40 mt-auto pt-6 font-medium">Introduction / Vision & Mission</p>
        </div>


        {/* Row 3 */}
        <div className="bg-white/95 backdrop-blur-md p-6 lg:p-8 rounded-3xl lg:rounded-xl shadow-xl flex flex-col gap-6 lg:gap-4 hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 reveal -translate-x-12 opacity-0 group" style={{transitionDelay: '0.1s'}}>
           <div className="flex flex-1 flex-col md:flex-row gap-6">
              <div className="md:w-[50%] flex flex-col justify-between">
                <div>
                  <p className="font-bold text-[14px] lg:text-[13px] text-black mb-4 lg:mb-3">Couleurs sémantiques</p>
                  <p className="text-[12px] lg:text-[11px] text-gray-500 mb-4 lg:mb-4 leading-relaxed">Les couleurs sémantiques transmets le sens de l'état (UI/UX).</p>
                  <ul className="text-[11px] lg:text-[10px] text-gray-600 leading-relaxed font-medium space-y-2 lg:space-y-1 pr-1">
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Rouge pour urgence</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Vert pour un succès</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Jaune pour un avertissement</li>
                    <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Bleu informatif</li>
                  </ul>
                </div>
              </div>
              <div className="md:w-[50%] grid grid-cols-4 grid-rows-3 gap-[3px] lg:gap-[3px] h-[160px] md:h-auto mt-2 sm:mt-0 rounded-lg overflow-hidden border border-gray-100 shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                {["#EF4444", "#10B981", "#F59E0B", "#3B82F6", 
                  "#FCA5A5", "#6EE7B7", "#FCD34D", "#93C5FD", 
                  "#FEE2E2", "#D1FAE5", "#FEF3C7", "#DBEAFE"].map((color, i) => (
                  <div key={i} style={{backgroundColor: color}} className="w-full h-full flex items-end justify-center pb-1 text-[8px] lg:text-[6px] text-black/60 font-semibold opacity-90 hover:opacity-100 transition-opacity">
                    {color}
                  </div>
                ))}
              </div>
           </div>
           <p className="text-[11px] lg:text-[9px] text-gray-400 mt-auto pt-2 font-medium">Couleurs / Sémantiques</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 lg:p-8 rounded-3xl lg:rounded-xl shadow-xl flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 reveal translate-x-12 opacity-0 group" style={{transitionDelay: '0.2s'}}>
           <p className="font-bold text-[14px] lg:text-[13px] text-black mb-6 lg:mb-4">Voix & ton</p>
           <div className="flex flex-col lg:flex-row gap-6 mt-2">
             <div className="w-full lg:w-[40%]">
               <p className="text-[12px] lg:text-[11px] text-gray-500 leading-relaxed">Notre voix sera adaptée à notre usage personnel pour rassurer et guider.</p>
             </div>
             <div className="w-full lg:w-[60%] space-y-4 lg:space-y-4">
               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-[#1800E5] transition-colors">
                 <p className="font-bold text-[12px] lg:text-[11px] text-black mb-1 text-[#1800E5]">Amical</p>
                 <p className="text-[11px] lg:text-[10px] text-gray-500 leading-tight">Faites preuve de chaleur humaine et d'empathie.</p>
               </div>
               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-[#1800E5] transition-colors">
                 <p className="font-bold text-[12px] lg:text-[11px] text-black mb-1 text-[#1800E5]">Informatif</p>
                 <p className="text-[11px] lg:text-[10px] text-gray-500 leading-tight">Une communication claire et concise.</p>
               </div>
             </div>
           </div>
           <p className="text-[11px] lg:text-[9px] text-gray-400 mt-auto pt-4 font-medium border-t border-gray-100">Introduction / Voix & Ton</p>
        </div>

        {/* Row 4 */}
        <div className="bg-[#1800E5] shadow-xl rounded-3xl lg:rounded-xl relative overflow-hidden flex flex-col justify-center items-center h-auto min-h-[220px] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(24,0,229,0.3)] active:scale-[0.98] transition-all duration-300 reveal -translate-x-12 opacity-0 group" style={{transitionDelay: '0.1s'}}>
          <div className="absolute inset-0 opacity-100 group-hover:animate-pattern-move transition-opacity duration-500" style={{ 
            backgroundImage: `linear-gradient(135deg, #0D0066 25%, transparent 25%), linear-gradient(225deg, #0D0066 25%, transparent 25%), linear-gradient(45deg, #0D0066 25%, transparent 25%), linear-gradient(315deg, #0D0066 25%, transparent 25%)`,
            backgroundPosition: '15px 0, 15px 0, 0 0, 0 0',
            backgroundSize: '30px 30px'
          }}></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          <h2 className="text-[32px] lg:text-[28px] font-black text-white relative z-10 text-center uppercase tracking-tighter mix-blend-overlay group-hover:mix-blend-normal transition-all duration-500 drop-shadow-xl scale-110 group-hover:scale-100">Shape &<br/>Pattern</h2>
        </div>

        <div className="bg-gradient-to-br from-[#1800E5] to-[#0D0066] p-8 lg:p-8 rounded-3xl lg:rounded-xl shadow-xl flex flex-col justify-center items-center relative h-auto min-h-[220px] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(24,0,229,0.3)] active:scale-[0.98] transition-all duration-300 reveal translate-x-12 opacity-0 overflow-hidden group" style={{transitionDelay: '0.2s'}}>
           <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           <h2 className="text-[48px] lg:text-[42px] font-black text-white tracking-tight drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300">Merci!!</h2>
           <p className="text-[12px] lg:text-[10px] text-white/60 absolute bottom-6 lg:bottom-6 left-8 lg:left-8 text-left w-3/4 leading-tight font-medium relative z-10">Pour toute question :<br/><span className="text-white/90">infos@brand.ai</span></p>
        </div>


      </div>
    </div>
  );
};

export default Landing;
