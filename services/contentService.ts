import { supabase } from './authService';
import { Content } from '../types';

// Supabase REST API 헬퍼 (AbortError 방지)
function supabaseFetch(endpoint: string, options?: RequestInit) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // localStorage에서 직접 세션 토큰 가져오기 (AbortError 방지)
  let token = supabaseAnonKey;
  try {
    // Supabase localStorage 키 형식: sb-<project-ref>-auth-token
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (projectRef) {
      const storageKey = `sb-${projectRef}-auth-token`;
      const authStorage = localStorage.getItem(storageKey);
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        if (authData?.access_token) {
          token = authData.access_token;
        }
      }
    }
  } catch (e) {
    // Fallback to anon key
  }
  
  return fetch(`${supabaseUrl}/rest/v1${endpoint}`, {
    ...options,
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options?.headers,
    },
  }).then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    // DELETE 요청은 빈 응답일 수 있음
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  });
}

/**
 * 모든 발행된 컨텐츠 조회 (노출도 순서)
 */
export async function getAllContents(): Promise<Content[]> {
  try {
    const data = await supabaseFetch('/contents?status=eq.published&order=sort_order.asc,published_at.desc');
    return data || [];
  } catch (error) {
    console.error('❌ 컨텐츠 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 컨텐츠 조회 (ID로)
 */
export async function getContentById(id: string): Promise<Content | null> {
  try {
    const data = await supabaseFetch(`/contents?id=eq.${id}&status=eq.published&limit=1`);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('❌ 컨텐츠 조회 실패:', error);
    return null;
  }
}

/**
 * 컨텐츠 좋아요 추가
 */
export async function likeContent(contentId: string, userId: string): Promise<boolean> {
  try {
    // 1. 좋아요 추가
    await supabaseFetch('/content_likes', {
      method: 'POST',
      body: JSON.stringify({ content_id: contentId, user_id: userId }),
    });
    
    // 2. 좋아요 수 증가
    await supabase.rpc('increment_content_like', { content_id: contentId });
    
    return true;
  } catch (error) {
    console.error('❌ 좋아요 추가 실패:', error);
    return false;
  }
}

/**
 * 컨텐츠 좋아요 취소
 */
export async function unlikeContent(contentId: string, userId: string): Promise<boolean> {
  try {
    // 1. 좋아요 삭제
    await supabaseFetch(`/content_likes?content_id=eq.${contentId}&user_id=eq.${userId}`, {
      method: 'DELETE',
    });
    
    // 2. 좋아요 수 감소
    await supabase.rpc('decrement_content_like', { content_id: contentId });
    
    return true;
  } catch (error) {
    console.error('❌ 좋아요 취소 실패:', error);
    return false;
  }
}

/**
 * 사용자가 좋아요한 컨텐츠 ID 목록 조회
 */
export async function getUserLikedContentIds(userId: string): Promise<string[]> {
  try {
    const data = await supabaseFetch(`/content_likes?user_id=eq.${userId}&select=content_id`);
    return (data || []).map((item: any) => item.content_id);
  } catch (error) {
    console.error('❌ 좋아요 목록 조회 실패:', error);
    return [];
  }
}

/**
 * 컨텐츠 조회수 증가
 */
export async function incrementContentView(contentId: string): Promise<void> {
  try {
    await supabase.rpc('increment_content_view', { content_id: contentId });
  } catch (error) {
    console.error('조회수 증가 실패:', error);
  }
}

/**
 * 사용자가 좋아요한 컨텐츠 목록 조회
 */
export async function getUserLikedContents(userId: string): Promise<Content[]> {
  try {
    // 1. 좋아요한 컨텐츠 ID 목록 가져오기
    const likes = await supabaseFetch(`/content_likes?user_id=eq.${userId}&select=content_id`);
    
    if (!likes || likes.length === 0) return [];

    const contentIds = likes.map((like: any) => like.content_id);

    // 2. 컨텐츠 정보 가져오기
    const contents = await supabaseFetch(`/contents?id=in.(${contentIds.join(',')})&status=eq.published&order=sort_order.asc`);
    
    return contents || [];
  } catch (error) {
    console.error('❌ 좋아요한 컨텐츠 조회 실패:', error);
    return [];
  }
}
