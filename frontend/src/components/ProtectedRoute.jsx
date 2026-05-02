import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Composant de protection des routes authentifiées.
 * Redirige vers /login si aucune session n'est active.
 */
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(
    window.location.hash.includes('access_token=') || 
    window.location.hash.includes('error_description=') ||
    window.location.search.includes('code=') ||
    window.location.search.includes('error_description=')
  );

  useEffect(() => {
    // Log l'URL pour voir s'il y a une erreur renvoyée par Supabase
    if (window.location.hash || window.location.search) {
      console.log("🔍 URL au retour OAuth :", window.location.href);
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("🔍 Résultat getSession:", session ? "Session trouvée" : "Pas de session", error ? `Erreur: ${error.message}` : "");
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔍 onAuthStateChange event:", event, session ? "Session active" : "Pas de session");
      setSession(session);
      if (session) setIsProcessingOAuth(false);
    });

    // Éviter de rester bloqué si l'OAuth échoue et efface le hash
    const handleHashChange = () => {
      if (!window.location.hash.includes('access_token=')) {
        setIsProcessingOAuth(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Timeout de sécurité au cas où l'événement hashchange ne se déclenche pas
    const timeout = setTimeout(() => {
      setIsProcessingOAuth(false);
    }, 8000);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timeout);
    };
  }, []);

  // Affichage pendant le chargement (évite le flash de contenu)
  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] dark:bg-[#0F172A] transition-colors duration-300">
        <div className="w-8 h-8 border-4 border-[#2F00E6] dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    // Attendre si Supabase est en train de traiter le retour OAuth
    if (isProcessingOAuth) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] dark:bg-[#0F172A] transition-colors duration-300">
          <div className="w-8 h-8 border-4 border-[#2F00E6] dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
