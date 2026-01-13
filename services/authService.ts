import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 읽기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    // Supabase 클라이언트 생성
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // 네트워크 timeout 설정
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'babyshop-web',
        },
      },
    });

    isInitialized = true;
    console.log('✅ Supabase initialized successfully');
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
      5000,
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

// 로그아웃
export const signOut = async () => {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
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
