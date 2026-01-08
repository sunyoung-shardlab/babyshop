import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 읽기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 일반 회원가입 (이메일/비밀번호)
export const signUpWithEmail = async (email: string, password: string, username: string) => {
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// 구글 로그인
export const signInWithGoogle = async () => {
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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// 세션 감지
export const onAuthStateChange = (callback: (user: any) => void) => {
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
