import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase, getSafeSession, signOut as authSignOut } from '../services/authService';
import { User } from '../types';

// 에러 모니터링 (Slack Webhook 또는 Sentry)
const sendErrorToMonitoring = async (errorData: {
  type: string;
  error: string;
  user: string;
  timestamp: string;
}) => {
  // Slack Webhook URL (환경변수에서 가져오기)
  const slackWebhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;
  
  if (slackWebhookUrl) {
    try {
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 *${errorData.type}*`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*🚨 에러 발생*\n*타입:* ${errorData.type}\n*유저:* ${errorData.user}\n*에러:* ${errorData.error}\n*시간:* ${errorData.timestamp}`
              }
            }
          ]
        })
      });
    } catch (err) {
      console.error('Failed to send error to Slack:', err);
    }
  }
  
  // 콘솔에도 출력 (개발 환경)
  console.error('📊 [Error Monitoring]:', errorData);
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
      console.error('❌ [handleSignOut] Logout failed:', error);
      
      // 에러 로그 전송 (Slack 또는 Sentry)
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
