# Vercel 배포 가이드

## 🎯 배포 프로세스 요약

### Git 연동 시 (현재 설정)

```
코드 수정 → Git Push → Vercel 자동 배포 ✅
```

**답변:** 네, 맞습니다! Git에 푸시해야 Vercel에 배포됩니다.

---

## 📊 배포 방식 비교

| 방식 | Git Push 필요 | 자동화 | 권장 |
|------|--------------|--------|------|
| **GitHub 연동** | ✅ 필요 | ✅ 자동 | ⭐⭐⭐⭐⭐ |
| **Vercel CLI** | ❌ 불필요 | ❌ 수동 | ⭐⭐ |

---

## 🚀 Vercel 배포 설정 (처음 한 번만)

### 1단계: Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **"Add New..." → "Project"** 클릭
3. **GitHub 연동** (이미 되어있다면 스킵)
4. **"sunyoung-shardlab/babyshop"** 저장소 선택
5. **"Import"** 클릭

### 2단계: 환경 변수 설정 ⚠️ 중요!

**프로젝트 설정 페이지에서:**

1. **"Environment Variables"** 탭 클릭
2. 다음 변수 추가:

```
Name: VITE_SUPABASE_URL
Value: https://cnumxvxxyxexzzyeinjr.supabase.co
Environment: Production, Preview, Development (모두 체크)
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: [.env 파일의 VITE_SUPABASE_ANON_KEY 값 복사]
Environment: Production, Preview, Development (모두 체크)
```

3. **"Save"** 클릭

### 3단계: 배포 설정

**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 4단계: Deploy 클릭

자동으로 빌드 & 배포가 시작됩니다!

---

## 🔄 이후 배포 프로세스

### 일상적인 배포 (자동)

```bash
# 1. 코드 수정
# 2. Git 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 3. GitHub에 푸시
git push

# 4. Vercel이 자동으로:
#    - 코드 감지
#    - 빌드 시작
#    - 테스트
#    - 배포 완료
```

**소요 시간:** 약 1-3분

---

## ⚠️ 중요: .env 파일과 배포

### ❌ 잘못된 이해:

```
"Git에 .env를 푸시하면 Vercel에서 사용된다"
→ 절대 안 됩니다! 보안 위험!
```

### ✅ 올바른 방법:

```
로컬: .env 파일 (Git에 푸시 ❌)
     ↓
GitHub: .env 없음 (.gitignore로 차단)
     ↓
Vercel: Dashboard에서 환경 변수 설정 ✅
```

---

## 🔍 배포 확인

### 1. Vercel Dashboard에서 확인

- **Deployments** 탭에서 상태 확인
- **Production**: 현재 운영 중인 버전
- **Preview**: PR이나 브랜치별 미리보기

### 2. 배포 URL

```
Production: https://babyshop-xxxx.vercel.app
Preview: https://babyshop-git-branch-xxxx.vercel.app
```

---

## 🐛 배포 실패 시 해결법

### 에러 1: "Environment variable not found"

**원인:** Vercel Dashboard에 환경 변수 미설정

**해결:**
1. Vercel Dashboard → 프로젝트 → Settings
2. Environment Variables 추가
3. Redeploy 클릭

### 에러 2: "Build failed"

**원인:** 로컬에서는 되는데 Vercel에서 안 됨

**해결:**
```bash
# 로컬에서 production 빌드 테스트
npm run build

# 빌드된 파일 로컬 미리보기
npm run preview
```

### 에러 3: "Supabase connection failed"

**원인:** 환경 변수 오타 또는 잘못된 값

**확인:**
```bash
# Vercel Dashboard → Deployments → 실패한 배포 → Logs 확인
```

---

## 🔐 보안 체크리스트

배포 전 확인:

- [ ] `.env` 파일이 `.gitignore`에 있는가?
- [ ] `.env` 파일이 Git에 커밋되지 않았는가?
- [ ] Vercel Dashboard에 환경 변수를 설정했는가?
- [ ] Secret Key는 클라이언트 코드에 없는가?
- [ ] Google OAuth는 Supabase Dashboard에만 있는가?

---

## 📱 Git 없이 배포 (비권장)

만약 정말로 Git 없이 배포하고 싶다면:

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

**하지만:**
- ❌ Git 히스토리 없음
- ❌ 팀 협업 불가
- ❌ 롤백 어려움
- ❌ 코드 리뷰 불가

**결론:** Git 연동 사용 강력 권장!

---

## 🎯 배포 베스트 프랙티스

### 1. 브랜치 전략

```
main (production)
  ↓
develop (preview)
  ↓
feature/xxx (preview)
```

### 2. 커밋 전 체크

```bash
# 로컬 테스트
npm run dev

# 빌드 테스트
npm run build

# 타입 체크
npx tsc --noEmit

# 커밋
git commit -m "..."
```

### 3. 배포 후 확인

- [ ] Production URL 접속
- [ ] 로그인 기능 테스트
- [ ] Google OAuth 테스트
- [ ] Vercel Logs 확인

---

## 📚 참고 링크

- [Vercel 환경 변수 가이드](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Git 연동](https://vercel.com/docs/concepts/git)
- [현재 GitHub 저장소](https://github.com/sunyoung-shardlab/babyshop)

---

## 💡 요약

**질문:** "git에 푸시해야지만 prod 배포가 가능하며 git에 푸시하지 않고 prod배포는 불가능한거지?"

**답변:** 

✅ **네, 맞습니다!** (Git 연동 사용 시)
- Git push → Vercel 자동 배포
- 가장 권장되는 방법
- 팀 협업, 코드 관리, 롤백 모두 용이

⚠️ **기술적으로는 Vercel CLI로 직접 배포 가능**
- 하지만 권장하지 않음
- Git 히스토리 없음
- 협업 불가

🔑 **중요:** 환경 변수는 Vercel Dashboard에서 별도 설정!
