import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase, getSafeSession, signOut as authSignOut } from '../services/authService';
import { User } from '../types';

// 에러 모니터링 (Vercel Serverless Function → Slack)
const sendErrorToMonitoring = async (errorData: {
  type: string;
  error: string;
  user: string;
  timestamp: string;
}) => {
  // 환경 구분
  const environment = import.meta.env.MODE; // 'development' 또는 'production'
  const isProd = import.meta.env.PROD;
  const envLabel = isProd ? 'PRODUCTION' : 'DEVELOPMENT';
  
  try {
    // Vercel Serverless Function 호출 (CORS 문제 해결)
    await fetch('/api/send-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...errorData,
        environment,
        url: window.location.href,
      })
    });
    
    console.log(`✅ Error sent to monitoring (${envLabel})`);
  } catch (err) {
    console.error('❌ Failed to send error to monitoring:', err);
  }
  
  // 콘솔에도 출력
  console.error(`📊 [Error Monitoring - ${envLabel}]:`, errorData);
};

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
            // 🔍 추가: 서버에서 세션 유효성 검증 (낡은 세션 자동 정리)
            try {
              console.log('🔍 Validating session on server...');
              const { data, error: userError } = await supabase.auth.getUser();
              
              if (userError || !data.user) {
                console.warn('⚠️ Session mismatch detected! localStorage has stale session.');
                console.warn('→ Clearing localStorage and starting fresh...');
                localStorage.clear();
                setAuthUser(null);
                setUser(null);
                setLoading(false);
                return;
              }
              
              console.log('✅ Session validated on server');
            } catch (validationError) {
              console.warn('⚠️ Session validation failed (network issue?), keeping local session:', validationError);
              // 네트워크 오류는 무시하고 로컬 세션 유지
            }
            
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
      // 1. Supabase 로그아웃 (타임아웃 3초)
      if (supabase) {
        console.log('🔍 [handleSignOut] Waiting for Supabase signOut (max 3s)...');
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Logout timeout after 3s')), 3000);
        });
        
        try {
          // scope: 'global' → 서버에서 refresh_token 삭제 (보안!)
          await Promise.race([
            authSignOut(), // 내부적으로 scope: 'global' 사용
            timeoutPromise
          ]);
          
          console.log('✅ [handleSignOut] Supabase signOut completed (refresh_token deleted from server)');
        } catch (signOutError: any) {
          // 타임아웃 발생
          if (signOutError?.message?.includes('timeout')) {
            console.error('❌ [handleSignOut] Timeout! Server might be slow or unavailable.');
            
            // Slack 알림 전송
            sendErrorToMonitoring({
              type: 'LOGOUT_TIMEOUT',
              error: 'Supabase signOut timeout after 3s',
              user: user?.email || 'unknown',
              timestamp: new Date().toISOString(),
            });
            
            // 실제 에러로 throw (로컬 로그아웃 하지 않음)
            throw signOutError;
          }
          
          // 403 session_not_found는 이미 authService.ts에서 처리됨 (정상 return)
          // 따라서 여기에 도달하면 다른 심각한 에러
          console.error('❌ [handleSignOut] Unexpected error:', signOutError);
          throw signOutError;
        }
      }
      
      // 2. localStorage 정리
      console.log('🔍 [handleSignOut] Clearing localStorage...');
      localStorage.clear();
      
      // 3. 홈으로 즉시 리다이렉트 (상태 업데이트 전에!)
      console.log('✅ [handleSignOut] Logout complete! Redirecting to home...');
      window.location.replace('/#/');
      
      // 4. 로컬 상태 초기화 (리다이렉트 후에는 실행 안 됨)
      setUser(null);
      setAuthUser(null);
      
    } catch (error) {
      console.error('❌ [handleSignOut] Logout failed:', error);
      
      // 에러 로그 전송 (Slack)
      sendErrorToMonitoring({
        type: 'LOGOUT_FAILED',
        error: error instanceof Error ? error.message : String(error),
        user: user?.email || 'unknown',
        timestamp: new Date().toISOString(),
      });
      
      // 사용자에게 알림
      alert('로그아웃 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
      
      // ⚠️ 화면 유지 (리다이렉트 하지 않음!)
      // ⚠️ 로컬 로그아웃도 하지 않음! (서버 로그아웃 실패했으므로)
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
