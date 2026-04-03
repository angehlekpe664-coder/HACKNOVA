import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createFallbackSupabase = () => {
  const sessionResult = { data: { session: null }, error: null };

  const auth = {
    getSession: async () => sessionResult,
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),
    signInWithPassword: async () => ({
      data: null,
      error: new Error('Supabase n\'est pas configuré.'),
    }),
    signUp: async () => ({
      data: null,
      error: new Error('Supabase n\'est pas configuré.'),
    }),
    resetPasswordForEmail: async () => ({
      data: null,
      error: new Error('Supabase n\'est pas configuré.'),
    }),
    signInWithOAuth: async () => ({
      data: null,
      error: new Error('Supabase n\'est pas configuré.'),
    }),
    signOut: async () => ({ error: null }),
  };

  return { auth };
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabase();
