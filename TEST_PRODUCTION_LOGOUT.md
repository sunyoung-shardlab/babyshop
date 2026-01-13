# Production 로그아웃 타임아웃 테스트 가이드

## 현상 분석

- ✅ Product 정보: 정상 표시
- ❌ 로그아웃: 10초 타임아웃

→ **Supabase 환경 변수는 정상!**
→ **다른 원인 추정 필요**

---

## 🔬 테스트 1: localStorage 세션 확인

### A. Production에서 localStorage 확인

```javascript
// https://babyshop-xi.vercel.app 접속
// F12 → Console

// 1. Supabase 세션 확인
const authKey = 'sb-cnumxvxxyxexzzyeinjr-auth-token';
const session = localStorage.getItem(authKey);
console.log('📦 Supabase Session:', session ? JSON.parse(session) : 'null');

// 2. 모든 localStorage 확인
console.log('📦 All localStorage:', { ...localStorage });
```

**기대 결과:**
```javascript
{
  access_token: "eyJhbGci...",
  refresh_token: "...",
  expires_at: 1736812800, // 미래 시간
  user: { id: "...", email: "..." }
}
```

**문제 상황:**
```javascript
// 1. 토큰 만료
{ expires_at: 1736700000 } // 과거 시간 ← ❌

// 2. 토큰 손상
{ access_token: "undefined" } // ← ❌

// 3. refresh_token 없음
{ access_token: "...", refresh_token: null } // ← ❌
```

---

## 🔬 테스트 2: localStorage 강제 정리 후 재로그인

```javascript
// F12 → Console

// 1. 강제 로그아웃 (localStorage 정리)
localStorage.clear();
console.log('✅ localStorage cleared');

// 2. 새로고침
location.reload();

// 3. 다시 로그인
// 4. 로그아웃 테스트
```

**예상 결과:**
- ✅ 재로그인 후 로그아웃이 133ms로 정상 작동
- ❌ 여전히 타임아웃 → 다른 원인

---

## 🔬 테스트 3: 직접 Auth API 호출 (SDK 우회)

Production 콘솔에서 직접 테스트:

```javascript
// F12 → Console

const SUPABASE_URL = 'https://cnumxvxxyxexzzyeinjr.supabase.co';
const session = JSON.parse(localStorage.getItem('sb-cnumxvxxyxexzzyeinjr-auth-token'));

// 직접 logout API 호출 (SDK 우회)
fetch(`${SUPABASE_URL}/auth/v1/logout`, {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('✅ Logout response:', res.status, res.statusText);
  return res.text();
})
.then(text => console.log('Response body:', text))
.catch(err => console.error('❌ Logout error:', err));
```

**기대 결과:**
- ✅ 200 OK: 정상 로그아웃 (SDK 문제)
- ❌ 401 Unauthorized: 토큰 문제
- ❌ 타임아웃: 네트워크/API 문제

---

## 🔬 테스트 4: Network 탭에서 요청 확인

```javascript
// 1. F12 → Network 탭
// 2. "로그아웃" 버튼 클릭
// 3. 다음 요청 찾기:

POST https://cnumxvxxyxexzzyeinjr.supabase.co/auth/v1/logout
```

**확인 사항:**
1. **요청이 전송되는가?**
   - ✅ Yes: 요청은 보내지지만 응답이 안 옴
   - ❌ No: 요청 자체가 안 보내짐

2. **응답 시간**
   - ✅ 100-500ms: 정상
   - ❌ 10,000ms+: 타임아웃

3. **응답 상태**
   - ✅ 204 No Content: 정상 로그아웃
   - ❌ 401: 토큰 문제
   - ❌ (pending): 응답 없음

4. **Request Headers**
   ```
   apikey: eyJhbGci...
   Authorization: Bearer eyJhbGci...
   ```

5. **Request Payload**
   ```json
   { "scope": "global" }
   ```

---

## 🔬 테스트 5: 로그인 상태별 테스트

### A. 비로그인 상태에서 테스트

```javascript
// 1. localStorage.clear()
// 2. 새로고침
// 3. 제품 페이지 확인 → ✅ 정상 표시되어야 함
```

### B. 로그인 후 즉시 로그아웃

```javascript
// 1. 로그인
// 2. 로그인 완료 후 즉시 로그아웃 버튼 클릭
// 3. 시간 측정
```

### C. 로그인 후 시간이 지난 후 로그아웃

```javascript
// 1. 로그인
// 2. 5분 대기
// 3. 로그아웃 버튼 클릭
// 4. 시간 측정
```

---

## 🛠️ 해결 방법 (테스트 결과별)

### **Case 1: localStorage 세션 손상**

**증상:**
- `expires_at`이 과거
- `refresh_token`이 null
- 토큰이 `undefined`

**해결:**
```typescript
// contexts/AuthContext.tsx
const handleSignOut = async () => {
  try {
    // 1. 세션 유효성 검사
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.warn('⚠️ No active session. Clearing localStorage...');
      localStorage.clear();
      window.location.replace('/#/');
      return;
    }
    
    // 2. 정상 로그아웃
    await authSignOut();
    localStorage.clear();
    window.location.replace('/#/');
  } catch (error) {
    // ...
  }
};
```

---

### **Case 2: SDK signOut() 버그**

**증상:**
- 직접 API 호출은 빠름 (100ms)
- SDK signOut()은 타임아웃 (10s)

**해결:**
```typescript
// services/authService.ts
export const signOut = async () => {
  // Supabase SDK 대신 직접 API 호출
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  
  const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ scope: 'global' })
  });
  
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }
};
```

---

### **Case 3: refresh_token 삭제 시 문제**

**증상:**
- `scope: 'global'`에서 타임아웃
- `scope: 'local'`은 빠름

**해결:**
```typescript
// scope을 'local'로 변경
await supabase.auth.signOut({ scope: 'local' });
```

**차이점:**
```typescript
// scope: 'global' (기본값)
// → 모든 기기에서 로그아웃
// → refresh_token 삭제 (DB 작업)
// → 느릴 수 있음

// scope: 'local'
// → 현재 기기만 로그아웃
// → localStorage만 정리
// → 빠름
```

---

### **Case 4: Supabase Auth API 문제**

**증상:**
- 직접 API 호출도 타임아웃
- Supabase Status Page 확인

**확인:**
```
https://status.supabase.com/
```

**해결:**
- Supabase 서버 문제 → 복구 대기
- 또는 임시로 로컬 로그아웃만 처리

---

## 📊 체크리스트

- [ ] **테스트 1:** localStorage 세션 확인
- [ ] **테스트 2:** localStorage 정리 후 재로그인
- [ ] **테스트 3:** 직접 Auth API 호출
- [ ] **테스트 4:** Network 탭에서 요청 확인
- [ ] **테스트 5:** 로그인 상태별 테스트

---

## 🎯 추천 테스트 순서

1. **localStorage 확인** (가장 쉬움)
2. **localStorage 정리 후 재로그인** (빠른 해결)
3. **직접 API 호출** (SDK 문제 확인)
4. **Network 탭 확인** (정확한 원인 파악)

---

## 💡 가장 가능성 높은 원인

**1위:** Production localStorage에 손상된 세션 존재 (70%)
**2위:** SDK의 `signOut({ scope: 'global' })` 문제 (20%)
**3위:** refresh_token 삭제 시 DB 작업 지연 (10%)

---

## 🚀 임시 해결책 (지금 바로 적용)

가장 빠른 해결책:

```typescript
// contexts/AuthContext.tsx
const handleSignOut = async () => {
  if (!confirm('로그아웃 하시겠습니까?')) return;

  try {
    // 1. scope을 'local'로 변경 (빠른 로그아웃)
    if (supabase) {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Logout timeout after 3s')), 3000);
      });
      
      await Promise.race([
        supabase.auth.signOut({ scope: 'local' }), // ← 'global' → 'local'
        timeoutPromise
      ]);
    }
    
    // 2. localStorage 정리
    localStorage.clear();
    
    // 3. 리다이렉트
    window.location.replace('/#/');
    
  } catch (error) {
    console.error('❌ Logout failed:', error);
    
    // 실패해도 강제 로컬 로그아웃
    localStorage.clear();
    window.location.replace('/#/');
  }
};
```

**변경 사항:**
- `scope: 'global'` → `scope: 'local'`
- 타임아웃 10초 → 3초
- 에러 시에도 강제 로컬 로그아웃

이렇게 하면 Production에서도 빠르게 작동할 것입니다!
