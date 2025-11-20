// context/AuthContext.tsx
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
  const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

  if (error) {
    alert(error.message);
    throw error; // 👈 esto hace que el catch del register lo atrape
  }

  // Si llegamos acá, el registro fue exitoso
  console.log("✅ signUp data:", data);
  alert("Cuenta creada exitosamente ✅");
};

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error; // 👈 lanzamos el error para que lo atrape el try/catch del login
    }

    console.log("✅ signIn data:", data);
    // La sesión se actualiza automáticamente por el listener onAuthStateChange
    } catch (error) {
      console.log("❌ Error en signIn:", error);
      throw error; // 👈 re-lanzamos para que LoginScreen lo atrape
    } finally {
      setLoading(false); // 👈 siempre se ejecuta, haya error o no
    }
  };



  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un <AuthProvider>');
  return context;
};

export { AuthContext };
