import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Composant de protection des routes authentifiées.
 * Redirige vers /login si aucune session n'est active.
 */
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
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
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
