import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
                  type={showPassword ? "text" : "password"} 
                  placeholder="Mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-[55px] pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-white/40 text-sm font-medium">Ou continuer avec</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="flex-1 bg-white hover:bg-gray-100 text-gray-900 sm:text-base text-sm font-semibold py-3 px-2 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                className="flex-1 bg-[#24292e] hover:bg-[#1b1f23] text-white sm:text-base text-sm font-semibold py-3 px-2 rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.293 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

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
