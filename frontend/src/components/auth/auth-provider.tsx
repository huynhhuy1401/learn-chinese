'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '@/types/domain';

interface AuthContextValue {
  loading: boolean;
  session: Session | null;
  user: SupabaseUser | null;
  /** Convenience shape already used by the backend User resolver. */
  authUser: AuthUser | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  loading: true,
  session: null,
  user: null,
  authUser: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  const user = session?.user ?? null;
  const authUser: AuthUser | null = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email ?? '',
      name: (user.user_metadata?.name as string) ?? (user.email ?? '').split('@')[0],
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    session,
    user,
    authUser,
    signOut,
  }), [loading, session, user, authUser, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Hook returning the current auth state, with optional redirect-to-login when
 * no session is present. Replaces the per-page `supabase.auth.getSession()` +
 * redirect boilerplate that was duplicated across dashboard/flashcards/etc.
 */
export function useRequireAuth(redirectTo = '/login') {
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!auth.loading && !auth.session) {
      router.replace(redirectTo);
    }
  }, [auth.loading, auth.session, router, redirectTo]);
  return auth;
}