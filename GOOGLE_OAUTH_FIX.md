# 구글 로그인 문제 해결 가이드

## 🔍 문제 진단

구글 로그인이 작동하지 않는 경우 다음을 확인하세요:

### 1단계: 브라우저 콘솔 에러 확인

**F12** 또는 **Cmd+Option+I** (Mac)로 개발자 도구를 열고 Console 탭에서 에러 확인:

**가능한 에러 메시지:**

#### A. "redirect_uri_mismatch"
```
Error: redirect_uri_mismatch
```
**원인:** Google Cloud Console에 Redirect URI가 추가되지 않음

**해결방법:** → 2단계로 이동

#### B. "Google provider is not enabled"
```
Error: Provider 'google' is not enabled
```
**원인:** Supabase에서 Google Provider가 활성화되지 않음

**해결방법:** → 3단계로 이동

#### C. "Invalid client_id"
```
Error: Invalid OAuth client
```
**원인:** Google OAuth Client ID가 잘못됨

**해결방법:** → 4단계로 이동

---

## 2단계: Google Cloud Console - Redirect URI 추가

### ✅ 필수 설정

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) 접속

2. OAuth 2.0 Client ID 찾기
   - 생성한 Client ID 찾기 (이름: 예 - "Web client 1")
   - **편집** (연필 아이콘) 클릭

3. **승인된 리디렉션 URI** 섹션에 다음 URI 추가:

**필수 URI (Supabase 콜백):**
```
https://cnumxvxxyxexzzyeinjr.supabase.co/auth/v1/callback
```

**로컬 개발용 (선택사항):**
```
http://localhost:3000
http://127.0.0.1:3000
```

4. **저장** 클릭

⏰ **주의:** 설정이 적용되는 데 **최대 5분** 소요될 수 있습니다.

---

## 3단계: Supabase Dashboard - Google Provider 활성화

### ✅ 설정 확인

1. [Supabase Dashboard - Authentication](https://supabase.com/dashboard/project/cnumxvxxyxexzzyeinjr/auth/providers) 접속

2. **Google** Provider 찾기

3. **Enable Sign in with Google** 토글 확인
   - OFF (회색) → ON (녹색)으로 변경

4. Google OAuth 정보 입력:
   - **Client ID (for OAuth):** Google Cloud Console에서 복사한 Client ID 붙여넣기
   - **Client Secret (for OAuth):** Google Cloud Console에서 복사한 Client Secret 붙여넣기

5. **Save** 클릭

---

## 4단계: 코드 확인

### authService.ts 확인

파일이 제대로 설정되어 있는지 확인:

```typescript
// services/authService.ts
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/#/`,
    },
  });
  
  if (error) throw error;
  return data;
};
```

---

## 5단계: 캐시 삭제 & 재시작

### A. 브라우저 캐시 삭제

**Chrome/Edge:**
1. Cmd+Shift+Delete (Mac) 또는 Ctrl+Shift+Delete (Windows)
2. "쿠키 및 기타 사이트 데이터" 선택
3. "인터넷 사용 기록 삭제" 클릭

**또는 시크릿 모드:**
- Cmd+Shift+N (Mac)
- Ctrl+Shift+N (Windows)

### B. 개발 서버 재시작

```bash
# 터미널에서
# 1. 서버 중지 (Ctrl+C)
# 2. 재시작
npm run dev
```

---

## 🧪 테스트

### 1. 로그인 페이지 접속

```
http://127.0.0.1:3000/#/login
```

### 2. "구글로 계속하기" 버튼 클릭

### 3. 예상 흐름:

#### ✅ 정상 작동 시:
```
1. 구글 로그인 팝업/페이지 열림
2. 구글 계정 선택
3. 권한 허용
4. 앱으로 리디렉션
5. 로그인 완료!
```

#### ❌ 여전히 안 될 경우:
- F12 → Console 탭에서 에러 메시지 복사
- Network 탭에서 실패한 요청 확인

---

## 🔍 상세 디버깅

### 콘솔에서 수동 테스트

브라우저 콘솔 (F12)에서:

```javascript
// Supabase 클라이언트 확인
console.log(window.supabase);

// Google OAuth 시도
const { data, error } = await window.supabase.auth.signInWithOAuth({
  provider: 'google'
});
console.log('Data:', data);
console.log('Error:', error);
```

---

## ⚠️ 일반적인 문제들

### 문제 1: "Google hasn't verified this app"

**증상:** Google 로그인 시 경고 화면

**해결:**
- 테스트 중이므로 "Continue" 또는 "계속" 클릭
- 실제 운영 시에는 Google 앱 검증 필요

### 문제 2: "This app is blocked"

**증상:** 앱이 차단되었다는 메시지

**원인:** Google Cloud Console에서 OAuth 동의 화면 미설정

**해결:**
1. Google Cloud Console → APIs & Services → OAuth consent screen
2. User Type: External 선택
3. 필수 정보 입력
4. Test users에 본인 이메일 추가

### 문제 3: 로컬호스트에서만 안 됨

**증상:** 배포 환경에서는 되는데 로컬에서만 안 됨

**해결:** Redirect URI에 로컬호스트 추가
```
http://localhost:3000
http://127.0.0.1:3000
```

---

## 📞 여전히 안 될 경우

### 체크리스트:

- [ ] Google Cloud Console에 Redirect URI 추가했나요?
- [ ] Supabase에서 Google Provider를 활성화했나요?
- [ ] Client ID와 Secret이 정확한가요?
- [ ] 브라우저 캐시를 삭제했나요?
- [ ] 개발 서버를 재시작했나요?
- [ ] 5분 정도 기다렸나요? (설정 반영 시간)

### 에러 로그 수집:

```javascript
// 브라우저 콘솔에서 실행
localStorage.getItem('supabase.auth.token')
// 결과 복사

// 네트워크 탭에서
// auth/v1/authorize 요청 확인
// Response 탭의 에러 메시지 확인
```

---

## ✅ 빠른 체크

현재 설정이 올바른지 한 번에 확인:

```bash
# 1. Supabase URL 확인
echo $VITE_SUPABASE_URL

# 2. Redirect URI 형식
# 정답: https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**Supabase Dashboard에서:**
- Authentication → Providers → Google
- Enable 상태가 **ON (녹색)** 인지 확인
- Client ID가 올바르게 입력되었는지 확인

**Google Cloud Console에서:**
- Credentials → OAuth 2.0 Client IDs
- 승인된 리디렉션 URI에 `https://cnumxvxxyxexzzyeinjr.supabase.co/auth/v1/callback` 있는지 확인

---

모든 설정을 확인했는데도 안 되면, 브라우저 콘솔의 에러 메시지를 알려주세요!
