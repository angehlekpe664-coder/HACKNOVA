import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Veuillez entrer votre adresse email.");
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
      setSuccessMsg("Un lien de réinitialisation a été envoyé à votre adresse email.");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    let err;
    if (isSignUp) {
      const resp = await supabase.auth.signUp({ email, password });
      err = resp.error;
      if (!err) {
        if (resp.data.session) {
          setSuccessMsg("Compte créé ! Vous êtes maintenant connecté.");
        } else {
          setSuccessMsg("Compte créé ! Veuillez consulter votre boîte mail pour confirmer votre adresse avant de vous connecter.");
        }
      }
    } else {
      const resp = await supabase.auth.signInWithPassword({ email, password });
      err = resp.error;
    }

    if (err) {
      if (err.message.includes('Email not confirmed')) {
        setErrorMsg("Votre email n'est pas encore confirmé. Vérifiez votre boîte de réception.");
      } else {
        setErrorMsg(err.message);
      }
    }
    setLoading(false);
  };

  const resetToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1800E5] via-[#0D0066] to-[#0A0042] font-sans relative overflow-hidden p-4">
      
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5CA8FF] rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00A7D6] rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Main Card */}
      <div className="w-full max-w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-12 rounded-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative z-10 animate-fade-in-up">
        
        {/* Brand Logo */}
        <div 
          className="flex items-baseline justify-center mb-8 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <span className="text-[40px] font-black leading-none text-white tracking-tighter transition-transform group-hover:-translate-x-1">Brand</span>
          <span className="w-2.5 h-2.5 bg-[#5CA8FF] mx-1 rounded-sm shadow-[0_0_15px_rgba(92,168,255,0.8)] animate-levitate group-hover:scale-125 transition-transform"></span>
          <span className="text-[40px] font-black leading-none text-[#5CA8FF] tracking-tighter transition-transform group-hover:translate-x-1">Ai</span>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 backdrop-blur-md text-white font-medium text-sm p-4 rounded-xl mb-6 text-center leading-relaxed">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/20 border border-green-400/40 backdrop-blur-md text-white font-medium text-sm p-4 rounded-xl mb-6 text-center leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Forgot Password Form */}
        {isForgotPassword ? (
          <>
            <h2 className="text-3xl font-bold text-white text-center mb-2">Mot de passe oublié</h2>
            <p className="text-white/60 text-center mb-8 text-sm">Entrez votre email pour recevoir un lien de réinitialisation.</p>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="Adresse email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[55px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all font-medium"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1800E5] hover:bg-[#2A00D6] disabled:opacity-50 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_10px_25px_rgba(24,0,229,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Envoi...' : 'Envoyer le lien'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            <p className="text-center text-white/50 text-sm mt-8">
              <button onClick={resetToLogin} className="text-white hover:text-[#5CA8FF] font-semibold transition-colors">← Retour à la connexion</button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white text-center mb-2">{isSignUp ? 'Créer un compte' : 'Bon retour !'}</h2>
            <p className="text-white/60 text-center mb-8 text-sm">{isSignUp ? 'Inscrivez-vous pour continuer.' : 'Entrez vos identifiants pour continuer.'}</p>

            <form onSubmit={handleAuth} className="flex flex-col gap-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="Adresse email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[55px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[55px] pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all font-medium"
                />
              </div>

              {!isSignUp && (
                <div className="flex justify-end mb-2">
                  <button type="button" onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }} className="text-xs text-[#5CA8FF] hover:text-white transition-colors">Mot de passe oublié ?</button>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1800E5] hover:bg-[#2A00D6] disabled:opacity-50 text-white font-bold text-lg py-4 rounded-2xl shadow-[0_10px_25px_rgba(24,0,229,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden mt-2"
              >
                {!loading && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                <span className="relative z-10">{loading ? 'Chargement...' : (isSignUp ? 'S\'inscrire' : 'Se connecter')}</span>
                {!loading && <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-8">
              {isSignUp ? 'Déjà un compte ?' : 'Nouveau sur Brand.Ai ?'} <button onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }} className="text-white hover:text-[#5CA8FF] font-semibold transition-colors">{isSignUp ? 'Se connecter' : 'Créer un compte'}</button>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
