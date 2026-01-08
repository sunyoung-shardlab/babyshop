# Supabase 설정 가이드

## 1. 구글 OAuth 설정

### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** → **Credentials** 이동
4. **Create Credentials** → **OAuth 2.0 Client ID** 선택
5. Application type: **Web application** 선택
6. **승인된 리디렉션 URI (Authorized redirect URIs)** 추가:
   ```
   https://cnumxvxxyxexzzyeinjr.supabase.co/auth/v1/callback
   ```
   
   개발용 (선택사항):
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
7. **Client ID**와 **Client Secret** 복사

### Supabase 설정

1. [Supabase Dashboard](https://supabase.com/dashboard/project/cnumxvxxyxexzzyeinjr/auth/providers) 접속
2. **Authentication** → **Providers** 이동
3. **Google** 찾아서 클릭
4. **Enable Sign in with Google** 토글을 ON으로 설정
5. 다음 정보 입력:
   - **Client ID (for OAuth)**: Google Cloud Console에서 복사한 Client ID 붙여넣기
   - **Client Secret (for OAuth)**: Google Cloud Console에서 복사한 Client Secret 붙여넣기
6. **Save** 클릭

## 2. 이메일 인증 설정

### Supabase Email Settings

1. **Authentication** → **Email Templates** 이동
2. 기본 템플릿 확인 (필요시 커스터마이징)
3. **Settings** → **Auth** 이동
4. **Enable Email Confirmations** 확인

### 개발 중 이메일 확인 (선택사항)

개발 중에는 이메일 확인을 비활성화할 수 있습니다:
1. **Settings** → **Auth** 이동
2. **Enable email confirmations** 체크 해제

## 3. 현재 프로젝트 설정

프로젝트 설정은 `.env` 파일에 저장되어 있습니다.
- **Project URL**: Supabase Dashboard에서 확인
- **Anon Key**: Supabase Dashboard → Settings → API에서 확인
- **Secret Key**: 서버 사이드에서만 사용 (클라이언트 코드에 포함 금지)

## 4. 로그인 기능

### 일반 로그인 (이메일/비밀번호)
- 아이디: 5자 이상 영문, 숫자 (현재는 이메일로만 로그인)
- 비밀번호: 6자 이상
- 회원가입 시 비밀번호 확인 필수

### 구글 로그인
- 구글 OAuth를 통한 소셜 로그인
- 별도 비밀번호 불필요
- 프로필 정보 자동 동기화

## 5. 테스트

### 개발 서버 실행
```bash
npm run dev
```

### 로그인 테스트
1. 회원가입: `http://localhost:5173/#/signup`
2. 로그인: `http://localhost:5173/#/login`
3. 마이페이지에서 로그아웃 테스트

## 6. 주의사항

⚠️ **Secret Key는 클라이언트에서 사용하지 마세요!**
- 현재 코드에서는 Anon Key만 사용
- Secret Key는 서버 사이드에서만 사용

⚠️ **구글 OAuth 설정 필수**
- 구글 로그인 버튼을 사용하려면 Google OAuth 설정 필수
- 설정 전까지는 일반 이메일 로그인만 사용 가능
