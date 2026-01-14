import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 읽기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수 로깅 (디버깅용)
console.log('🔑 Environment Variables:');
console.log('  VITE_SUPABASE_URL:', supabaseUrl);
console.log('  VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined');
console.log('  All env keys:', Object.keys(import.meta.env));

// Supabase 클라이언트 초기화 상태
let supabaseClient: SupabaseClient | null = null;
let initializationError: Error | null = null;
let isInitialized = false;

/**
 * Supabase 클라이언트 초기화 (에러 핸들링 포함)
 */
function initializeSupabase(): SupabaseClient | null {
  if (isInitialized) {
    return supabaseClient;
  }

  // 환경 변수 검증
  if (!supabaseUrl || !supabaseAnonKey) {
    const error = new Error('Supabase 환경 변수가 설정되지 않았습니다.');
    console.warn('⚠️', error.message);
    initializationError = error;
    isInitialized = true;
    return null;
  }

  try {
    // Supabase 클라이언트 생성 (세션 영속성 설정 추가)
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,        // 세션을 localStorage에 저장
        autoRefreshToken: true,       // 자동으로 토큰 갱신
        detectSessionInUrl: true,     // URL에서 세션 감지 (OAuth 리다이렉트용)
        storage: window.localStorage, // 명시적으로 localStorage 사용
      }
    });

    isInitialized = true;
    console.log('✅ Supabase initialized successfully (persistSession: true)');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Supabase initialization failed:', error);
    initializationError = error as Error;
    isInitialized = true;
    return null;
  }
}

// Supabase 클라이언트 export (lazy initialization)
export const supabase = initializeSupabase();
export const getSupabaseError = () => initializationError;

/**
 * Timeout wrapper for async operations
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Retry logic for critical operations
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // 마지막 시도에서만 에러 로그
      if (attempt === maxRetries) {
        console.warn(`⚠️ Operation failed after ${maxRetries} attempts`);
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}

/**
 * 안전한 세션 가져오기 (timeout + retry 포함)
 */
export const getSafeSession = async () => {
  if (!supabase) {
    // 조용히 처리 (경고만)
    return { data: { session: null }, error: initializationError };
  }

  try {
    const result = await withTimeout(
      withRetry(() => supabase.auth.getSession(), 2),
      15000,  // 5초 → 15초로 증가
      'getSession'
    );
    return result;
  } catch (error) {
    // getSession 실패는 심각하지 않음 (onAuthStateChange가 백업)
    // 개발 환경에서만 로그
    if (import.meta.env.DEV) {
      console.info('ℹ️ getSession timeout (using fallback mechanism)');
    }
    return { data: { session: null }, error: error as Error };
  }
};

// 일반 회원가입 (이메일/비밀번호)
export const signUpWithEmail = async (email: string, password: string, username: string) => {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  
  if (error) throw error;
  return data;
};

// 일반 로그인 (이메일/비밀번호)
export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// 구글 로그인
export const signInWithGoogle = async () => {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  if (error) throw error;
  return data;
};

// 로그아웃 (보안을 위해 항상 scope: 'global' 사용)
export const signOut = async () => {
  console.log('🔍 [signOut] Starting...');
  
  if (!supabase) {
    console.error('❌ [signOut] Supabase not initialized');
    throw new Error('Supabase not initialized');
  }

  console.log('🔍 [signOut] Calling supabase.auth.signOut() with scope: global (secure)...');
  const startTime = Date.now();
  
  try {
    // scope: 'global' → 모든 기기에서 로그아웃 + 서버에서 refresh_token 삭제 (보안!)
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    const duration = Date.now() - startTime;
    
    if (error) {
      console.error('❌ [signOut] Error:', error);
      
      // 403 session_not_found는 이미 로그아웃된 상태이므로 무시
      if (error.message?.includes('session_not_found') || error.status === 403) {
        console.warn('⚠️ [signOut] Session already invalid (403). Proceeding with local cleanup...');
        return; // 에러를 throw하지 않고 정상 처리
      }
      
      throw error;
    }
    
    console.log(`✅ [signOut] Success! (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ [signOut] Failed after ${duration}ms:`, error);
    
    // 403 session_not_found는 이미 로그아웃된 상태
    if (error.message?.includes('session_not_found') || error.status === 403) {
      console.warn('⚠️ [signOut] Session already invalid (403). Proceeding with local cleanup...');
      return; // 에러를 throw하지 않고 정상 처리
    }
    
    throw error;
  }
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// 현재 세션 디버그 정보
export const debugCurrentSession = async () => {
  if (!supabase) {
    console.log('🔍 [debugSession] Supabase not initialized');
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ [debugSession] Error getting session:', error);
      return null;
    }
    
    if (session) {
      console.log('🔍 [debugSession] Current session:', {
        user_id: session.user.id,
        email: session.user.email,
        access_token: session.access_token.substring(0, 20) + '...',
        refresh_token: session.refresh_token?.substring(0, 20) + '...',
        expires_at: new Date(session.expires_at! * 1000).toISOString(),
      });
    } else {
      console.log('🔍 [debugSession] No active session');
    }
    
    return session;
  } catch (error) {
    console.error('❌ [debugSession] Exception:', error);
    return null;
  }
};

// 세션 감지
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!supabase) {
    console.warn('⚠️ Supabase not initialized, auth state changes will not be detected');
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
};

// 아이디 유효성 검사 (5자 이상 영문, 숫자)
export const validateUsername = (username: string): { valid: boolean; message?: string } => {
  if (username.length < 5) {
    return { valid: false, message: '아이디는 5자 이상이어야 합니다.' };
  }
  
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(username)) {
    return { valid: false, message: '아이디는 영문과 숫자만 사용 가능합니다.' };
  }
  
  return { valid: true };
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: '비밀번호는 6자 이상이어야 합니다.' };
  }
  
  return { valid: true };
};

// 비밀번호 확인
export const validatePasswordMatch = (password: string, confirmPassword: string): { valid: boolean; message?: string } => {
  if (password !== confirmPassword) {
    return { valid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  
  return { valid: true };
};
