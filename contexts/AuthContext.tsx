import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase, getSafeSession, signOut as authSignOut } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  signIn: (authUser: AuthUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const convertAuthUserToUser = (authUser: AuthUser): User => {
    return {
      id: authUser.id,
      name: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      babyAgeMonths: 12,
      babyGender: 'girl',
      halalRequired: false,
      interests: [],
      points: 100,
      membershipTier: 'Sprout',
      isLoggedIn: true
    };
  };

  useEffect(() => {
    let mounted = true;

    // Supabase가 설정되지 않은 경우
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, skipping auth');
      setLoading(false);
      return;
    }

    // 초기 세션 확인 (timeout + retry 내장)
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await getSafeSession();
        
        if (mounted) {
          if (session?.user) {
            setAuthUser(session.user);
            setUser(convertAuthUserToUser(session.user));
            console.log('✅ Auth ready:', session.user.email);
          }
          setLoading(false);
        }
      } catch (error) {
        // 치명적 에러만 로그
        console.error('❌ Auth initialization failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { event, session }); // 디버깅용
        
        if (mounted) {
          if (session?.user) {
            console.log('✅ User state updated:', session.user.email);
            setAuthUser(session.user);
            setUser(convertAuthUserToUser(session.user));
          } else {
            console.log('❌ User signed out');
            setAuthUser(null);
            setUser(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = (authUser: AuthUser) => {
    setAuthUser(authUser);
    setUser(convertAuthUserToUser(authUser));
  };

  const handleSignOut = async () => {
    console.log('🚪 [handleSignOut] Starting logout...');
    
    try {
      // 1. Supabase 로그아웃 (타임아웃 10초)
      if (supabase) {
        console.log('🔍 [handleSignOut] Waiting for Supabase signOut (max 10s)...');
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Logout timeout after 10s')), 10000);
        });
        
        await Promise.race([
          authSignOut(),
          timeoutPromise
        ]);
        
        console.log('✅ [handleSignOut] Supabase signOut completed');
      }
      
      // 2. localStorage 정리
      localStorage.clear();
      
      // 3. 홈으로 즉시 리다이렉트 (상태 업데이트 전에!)
      console.log('✅ [handleSignOut] Logout complete! Redirecting to home...');
      window.location.replace('/#/');
      
      // 4. 로컬 상태 초기화 (리다이렉트 후에는 실행 안 됨)
      setUser(null);
      setAuthUser(null);
      
    } catch (error) {
      console.error('⚠️ [handleSignOut] Error during logout:', error);
      
      // localStorage 정리
      localStorage.clear();
      
      // 홈으로 즉시 리다이렉트
      console.log('⚠️ [handleSignOut] Force logout and redirecting to home...');
      window.location.replace('/#/');
      
      // 로컬 상태 초기화 (리다이렉트 후에는 실행 안 됨)
      setUser(null);
      setAuthUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        isLoggedIn: !!authUser,
        signIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
