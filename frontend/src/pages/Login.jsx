import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
// import Turnstile from 'react-turnstile'; // Removed due to React 19 compatibility issues
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const { t } = useLanguage();

  // Check auth state on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/generate');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/generate');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Turnstile initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.turnstile) {
        window.turnstile.render('#turnstile-container', {
          sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
          callback: (token) => {
            console.log("Turnstile Verified:", token);
            setTurnstileToken(token);
          },
          theme: 'dark',
        });
      } else {
        // Turnstile script non disponible (ex: domaine non autorisé) → on débloque
        console.warn('Turnstile non disponible, accès débloqué.');
        setTurnstileToken('bypass');
      }
    }, 3000); // 3s pour laisser le temps au script de charger
    return () => clearTimeout(timer);
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg(t('email_placeholder') || "Veuillez entrer votre adresse email.");
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(t('confirm_email_msg') || "Un lien de réinitialisation a été envoyé à votre adresse email.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      let err;
      if (isSignUp) {
        const resp = await supabase.auth.signUp({ email, password });
        err = resp.error;
        if (!err) {
          if (resp.data && resp.data.session) {
            setSuccessMsg(t('account_created_msg') || "Compte créé ! Vous êtes maintenant connecté.");
          } else {
            setSuccessMsg(t('confirm_email_msg') || "Compte créé ! Veuillez consulter votre boîte mail pour confirmer votre adresse avant de vous connecter.");
          }
        }
      } else {
        const resp = await supabase.auth.signInWithPassword({ email, password });
        err = resp.error;
      }

      if (err) throw err;
    } catch (error) {
      if (error.message?.includes('Email not confirmed')) {
        setErrorMsg(t('email_not_confirmed') || "Votre email n'est pas encore confirmé.");
      } else if (error.message?.includes('Invalid Refresh Token')) {
        setErrorMsg(t('session_expired') || "Session expirée.");
      } else {
        setErrorMsg(error.message || t('auth_error') || "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/generate`
      }
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] font-['Outfit'] relative overflow-hidden p-6 dark">
      {/* Dynamic Network Background */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(47,0,230,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="noise-bg opacity-[0.03]"></div>
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2F00E6]/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5CA8FF]/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '-1.5s' }}></div>
      
      {/* Main Card */}
      <div className="w-full max-w-[480px] glass-card p-10 sm:p-14 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in-up border border-white/20">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center justify-center gap-2 mb-12 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center group-hover:rotate-[10deg] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <div className="w-5 h-5 bg-[#0D0066] rounded-md animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            BRAND<span className="text-white/40">.AI</span>
          </h1>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl text-red-400 font-bold text-xs p-5 rounded-2xl mb-8 text-center uppercase tracking-widest animate-shake">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/20 backdrop-blur-xl text-green-400 font-bold text-xs p-5 rounded-2xl mb-8 text-center uppercase tracking-widest animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-3">{t('forgot_title')}</h2>
              <p className="text-gray-400 font-bold text-sm tracking-tight italic">{t('forgot_subtitle')}</p>
            </div>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[65px] pl-6 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#2F00E6]/50 transition-all font-bold transition-all duration-500"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="group relative w-full bg-[#2F00E6] text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-2xl shadow-[0_20px_50px_rgba(47,0,230,0.3)] hover:bg-[#1200AB] active:scale-95 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10">{loading ? t('sending_btn') : t('reset_btn')}</span>
              </button>
            </form>
            <p className="text-center mt-10">
              <button onClick={resetToLogin} className="text-white/40 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all">{t('back_to_login')}</button>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-3">{isSignUp ? t('signup_welcome') : t('login_welcome')}</h2>
              <p className="text-gray-400 font-bold text-sm tracking-tight italic">{isSignUp ? t('signup_subtitle') : t('login_subtitle')}</p>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-6">
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[65px] pl-6 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#2F00E6]/50 transition-all font-black text-sm tracking-widest"
                />
              </div>

              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[65px] pl-6 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-[#2F00E6]/50 transition-all font-black text-sm tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-6 flex items-center text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {!isSignUp && (
                <div className="flex justify-end -mt-2">
                  <button type="button" onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }} className="text-[10px] font-black uppercase tracking-widest text-[#2F00E6] hover:text-[#5CA8FF] transition-colors">{t('forgot_password_link')}</button>
                </div>
              )}


              <div className="flex justify-center my-4 min-h-[65px]">
                <div id="turnstile-container"></div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`group relative w-full ${loading ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-[#2F00E6] hover:bg-[#1200AB]'} text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-2xl shadow-[0_20px_50px_rgba(47,0,230,0.3)] active:scale-95 transition-all duration-500 overflow-hidden`}
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative z-10">{loading ? t('loading_btn') : (isSignUp ? t('signup_btn') : t('login_btn'))}</span>
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">{t('or_divider')}</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="flex-1 bg-white hover:scale-105 active:scale-95 text-[#0D0066] font-black text-[10px] uppercase tracking-widest py-4 px-2 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              
              <button 
                type="button" 
                onClick={() => handleOAuth('github')}
                disabled={loading}
                className="flex-1 bg-[#24292e] hover:scale-105 active:scale-95 text-white font-black text-[10px] uppercase tracking-widest py-4 px-2 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 border border-white/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center mt-12">
              <span className="text-white/20 font-black text-[10px] uppercase tracking-widest">{isSignUp ? t('already_member') : t('not_member')}</span>
              <button onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }} className="ml-3 text-white hover:text-[#2F00E6] font-black text-[10px] uppercase tracking-[0.2em] transition-all underline decoration-[#2F00E6] decoration-2 underline-offset-4">{isSignUp ? t('login_btn') : t('signup_welcome')}</button>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
