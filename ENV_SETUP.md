# 환경 변수 설정 가이드

## 🔐 환경 변수란?

환경 변수는 민감한 정보(API 키, 비밀번호 등)를 코드에서 분리하여 안전하게 관리하는 방법입니다.

## 📁 파일 구조

```
babyshop/
├── .env                # 실제 키 값 (Git에 업로드 안 됨) ❌
├── .env.example        # 템플릿 파일 (Git에 업로드됨) ✅
├── .gitignore          # .env를 Git에서 제외
└── services/
    └── authService.ts  # 환경 변수 사용
```

## 🔑 현재 키 관리 방식

### 1. Supabase 공개 키 (Anon Key)
**저장 위치:** `.env` 파일
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**사용 방법:** `authService.ts`에서 읽어옴
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**보안 수준:** 
- 공개 키이므로 클라이언트에서 사용 가능
- `.env` 파일은 Git에 업로드되지 않음 (`.gitignore`로 차단)

### 2. Supabase Secret Key
**저장 위치:** 사용 안 함 ✅
- 서버 전용 키이므로 클라이언트 코드에 절대 포함하면 안 됨
- Supabase Dashboard에만 존재

### 3. Google OAuth Client ID/Secret
**저장 위치:** Supabase Dashboard ✅
- 클라이언트 코드에 노출되지 않음
- Supabase 서버에서 OAuth 인증 처리
- 우리 앱은 Supabase SDK를 통해 간접적으로만 사용

## 🚀 작동 원리

### Vite 환경 변수 규칙

1. **파일명:** `.env`
2. **접두사:** `VITE_` (Vite에서 필수)
3. **읽기 방법:** `import.meta.env.VITE_변수명`

### 예시

**.env 파일:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

**코드에서 사용:**
```typescript
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## ⚙️ 설정 방법 (새로운 팀원용)

1. `.env.example` 파일을 복사:
   ```bash
   cp .env.example .env
   ```

2. `.env` 파일을 열고 실제 키 값 입력:
   ```env
   VITE_SUPABASE_URL=https://cnumxvxxyxexzzyeinjr.supabase.co
   VITE_SUPABASE_ANON_KEY=실제키값입력
   ```

3. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

## 🛡️ 보안 모범 사례

### ✅ 좋은 예시
- `.env` 파일에 민감한 정보 저장
- `.gitignore`에 `.env` 추가
- `.env.example`로 필요한 변수 문서화
- `VITE_` 접두사로 클라이언트 노출 제어

### ❌ 나쁜 예시
- 코드에 키 직접 하드코딩
- `.env` 파일을 Git에 커밋
- Secret Key를 클라이언트에 노출
- 환경 변수 없이 배포

## 📊 키 노출 위험도

| 키 종류 | 위치 | 노출 가능? | 위험도 |
|---------|------|-----------|--------|
| Supabase Anon Key | `.env` (클라이언트) | 🟡 가능 | 낮음 (공개 키) |
| Supabase Secret Key | 서버만 | ❌ 불가 | 높음 (비공개) |
| Google OAuth ID | Supabase Dashboard | 🟡 가능 | 낮음 (공개 가능) |
| Google OAuth Secret | Supabase Dashboard | ❌ 불가 | 높음 (비공개) |
| 사용자 비밀번호 | 데이터베이스 (해시) | ❌ 불가 | 매우 높음 |

## 🔄 배포 시 주의사항

배포 플랫폼(Vercel, Netlify 등)에서 환경 변수를 별도로 설정해야 합니다:

1. 플랫폼 대시보드에서 "Environment Variables" 설정
2. `.env` 파일의 내용을 그대로 입력
3. 배포 후 환경 변수가 제대로 적용되었는지 확인

## 🆘 문제 해결

### 환경 변수를 읽을 수 없어요
- `VITE_` 접두사가 있는지 확인
- 개발 서버를 재시작했는지 확인
- `.env` 파일이 프로젝트 루트에 있는지 확인

### Git에 .env가 업로드됐어요
```bash
# Git에서 제거 (파일은 유지)
git rm --cached .env
git commit -m "Remove .env from git"
git push
```

## 📚 참고 자료

- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase 보안 가이드](https://supabase.com/docs/guides/api/api-keys)
