# Production 디버깅 가이드

## 1. Vercel 환경 변수 확인

### 방법 1: Vercel 대시보드
```
https://vercel.com/sunyoung-vyvxyzs-projects/babyshop2/settings/environment-variables
```

**필수 환경 변수:**
```bash
VITE_SUPABASE_URL=https://cnumxvxxyxexzzyeinjr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_CHANNEL/YOUR_TOKEN
```

ℹ️ **실제 값은 `.env.local` 파일 참조**

⚠️ **중요:** 환경 변수 추가/수정 후 **반드시 재배포** 필요!

---

## 2. Production 콘솔 로그 확인

### Chrome DevTools에서 확인:
```
1. https://babyshop-xi.vercel.app 접속
2. F12 → Console 탭
3. 다음 로그 확인:
```

**기대하는 로그:**
```javascript
🔑 Environment Variables:
  VITE_SUPABASE_URL: https://cnumxvxxyxexzzyeinjr.supabase.co
  VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsI...
  All env keys: [...환경 변수 목록...]
```

**만약 `undefined`가 나온다면:**
```javascript
🔑 Environment Variables:
  VITE_SUPABASE_URL: undefined  ← ❌ 문제!
  VITE_SUPABASE_ANON_KEY: undefined  ← ❌ 문제!
```

→ **해결:** Vercel 환경 변수 추가 후 재배포

---

## 3. Supabase 설정 확인

### A. 허용된 도메인 설정
```
https://supabase.com/dashboard/project/cnumxvxxyxexzzyeinjr/auth/url-configuration
```

**필요한 설정:**
```
Site URL: https://babyshop-xi.vercel.app

Redirect URLs:
- https://babyshop-xi.vercel.app/*
- https://babyshop-xi.vercel.app/#/*
- http://localhost:3000/*
```

### B. CORS 설정 확인
```
https://supabase.com/dashboard/project/cnumxvxxyxexzzyeinjr/settings/api
```

**CORS는 기본적으로 모든 도메인 허용** (따로 설정 불필요)

---

## 4. 네트워크 요청 확인

### Chrome DevTools → Network 탭:
```
1. F12 → Network 탭
2. "로그아웃" 버튼 클릭
3. Supabase 요청 확인:
```

**확인할 요청:**
```
POST https://cnumxvxxyxexzzyeinjr.supabase.co/auth/v1/logout
```

**응답 시간:**
- ✅ 정상: 100-500ms
- ⚠️ 느림: 1-3초
- ❌ 타임아웃: 10초+

**상태 코드:**
- ✅ 200 OK: 성공
- ❌ 400 Bad Request: 잘못된 요청
- ❌ 401 Unauthorized: 인증 실패
- ❌ 403 Forbidden: 권한 없음
- ❌ 404 Not Found: 엔드포인트 없음

---

## 5. 임시 디버그 코드 추가

### `contexts/AuthContext.tsx`에 추가:

```typescript
const handleSignOut = async () => {
  console.log('🚪 [handleSignOut] Starting logout...');
  
  // 🔍 환경 변수 확인
  console.log('🔍 ENV CHECK:', {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING',
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
  });
  
  try {
    if (supabase) {
      console.log('🔍 [handleSignOut] Waiting for Supabase signOut (max 10s)...');
      const startTime = Date.now();
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Logout timeout after 10s')), 10000);
      });
      
      await Promise.race([
        authSignOut(),
        timeoutPromise
      ]);
      
      const duration = Date.now() - startTime;
      console.log(`✅ [handleSignOut] Supabase signOut completed in ${duration}ms`);
    }
    
    // ... 나머지 코드 ...
  } catch (error) {
    console.error('❌ [handleSignOut] Logout failed:', error);
    // ... 에러 처리 ...
  }
};
```

---

## 6. 가장 가능성 높은 해결책

### ⭐ **Option 1: Vercel 환경 변수 재확인 + 재배포**

```bash
# 1. Vercel 대시보드에서 환경 변수 확인
https://vercel.com/sunyoung-vyvxyzs-projects/babyshop2/settings/environment-variables

# 2. 누락되었다면 추가:
VITE_SUPABASE_URL=https://cnumxvxxyxexzzyeinjr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# 3. 재배포 (자동)
git push origin main
```

### ⭐ **Option 2: Supabase 도메인 허용 추가**

```
https://supabase.com/dashboard/project/cnumxvxxyxexzzyeinjr/auth/url-configuration

Site URL: https://babyshop-xi.vercel.app
Redirect URLs: https://babyshop-xi.vercel.app/*
```

---

## 7. Slack 알림 확인

Production에서 로그아웃 실패 시 자동으로 Slack 알림이 와야 합니다:

```
🚀 PRODUCTION - 🚨 LOGOUT_FAILED

환경: 🚀 PRODUCTION
타입: LOGOUT_FAILED
유저: user@example.com
에러: Logout timeout after 10s
시간: 2026-01-13T...
URL: https://babyshop-xi.vercel.app/#/mypage
```

---

## 8. 최종 체크리스트

- [ ] Vercel 환경 변수 확인 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] 환경 변수 추가/수정 후 재배포
- [ ] Production 콘솔 로그 확인 (환경 변수 출력)
- [ ] Supabase 허용 도메인 설정 확인
- [ ] Chrome DevTools → Network 탭에서 요청 확인
- [ ] Slack 알림 수신 확인
- [ ] 로컬에서 정상 작동하는지 재확인

---

## 9. 문제 지속 시 대안

만약 위 모든 방법으로도 해결이 안 된다면:

### **Option A: 타임아웃 증가**
```typescript
// 10초 → 30초
setTimeout(() => reject(new Error('Logout timeout after 30s')), 30000);
```

### **Option B: 로컬 우선 로그아웃**
```typescript
// Supabase 로그아웃을 기다리지 않고 즉시 로컬 로그아웃
localStorage.clear();
window.location.replace('/#/');

// 백그라운드에서 Supabase 로그아웃 시도
authSignOut().catch(err => console.error('Background logout failed:', err));
```

### **Option C: Supabase 서버 상태 확인**
```
https://status.supabase.com/
```
