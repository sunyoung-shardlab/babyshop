# Vercel 배포 문제 해결 가이드

## 🚨 화면이 안 나오는 문제

### 1단계: Vercel Dashboard에서 배포 상태 확인

**현재 열린 Vercel Dashboard에서:**

1. **프로젝트 찾기:** `babyshop` 프로젝트 클릭
2. **Deployments 탭** 확인
3. 최신 배포 상태:
   - ✅ **Ready** (녹색) - 배포 성공
   - ❌ **Failed** (빨간색) - 빌드 실패
   - 🔄 **Building** (노란색) - 빌드 중

---

## ✅ 해결 방법

### A. 배포 상태가 "Ready"인데 화면 안 나올 때

**원인:** 환경 변수 미설정으로 앱 실행 실패

**해결 순서:**

#### 1️⃣ 환경 변수 설정

Vercel Dashboard에서:
1. 프로젝트 클릭 → **Settings** 탭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭
3. 다음 변수들 추가:

**필수 환경 변수:**

```
Name: VITE_SUPABASE_URL
Value: https://cnumxvxxyxexzzyeinjr.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_plu9g4Kg4EGgxDtvyWyxXQ_azfbaKgh
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_TOSS_CLIENT_KEY
Value: test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **실제 운영 시:** Toss Test Key를 실제 키로 변경하세요!

#### 2️⃣ 재배포

환경 변수 추가 후:
1. **Deployments** 탭으로 이동
2. 최신 배포 찾기
3. 오른쪽 **⋮** (점 3개) 클릭
4. **Redeploy** 클릭
5. **Redeploy** 버튼 다시 클릭 (확인)

⏰ 재배포 소요 시간: **약 1-2분**

---

### B. 배포 상태가 "Failed"일 때

**원인:** 빌드 에러

**해결 순서:**

#### 1️⃣ 빌드 로그 확인

1. **Deployments** 탭에서 실패한 배포 클릭
2. **Building** 섹션 클릭
3. 에러 메시지 확인

**일반적인 에러:**

##### 에러 1: TypeScript 에러
```
Type error: Property 'xxx' does not exist
```

**해결:** 로컬에서 타입 체크
```bash
npx tsc --noEmit
```

##### 에러 2: 모듈을 찾을 수 없음
```
Cannot find module '@tosspayments/payment-sdk'
```

**해결:** package.json에 의존성 추가 확인
```bash
npm install
git add package.json package-lock.json
git commit -m "fix: add missing dependencies"
git push
```

##### 에러 3: 환경 변수 참조 에러
```
ReferenceError: process is not defined
```

**해결:** `import.meta.env` 사용 확인

#### 2️⃣ 로컬에서 빌드 테스트

```bash
# 프로덕션 빌드 테스트
npm run build

# 빌드 결과 확인
npm run preview
```

에러 없이 빌드되면 → 다시 커밋 & 푸시

---

## 🔍 상세 진단

### 현재 배포 URL 확인

Vercel Dashboard → 프로젝트 → **Visit** 버튼

**예상 URL:**
```
https://babyshop-xxxx.vercel.app
```

### 브라우저 콘솔 확인

1. 배포된 사이트 접속
2. **F12** (개발자 도구)
3. **Console** 탭 확인

**일반적인 에러:**

#### 에러 A: "Supabase URL is undefined"
```
Error: Supabase 환경 변수가 설정되지 않았습니다
```

**해결:** → 환경 변수 설정 (위 1️⃣ 참고)

#### 에러 B: "Failed to load resource: 404"
```
GET https://xxx.vercel.app/assets/index-xxx.js 404
```

**원인:** Vite 빌드 설정 문제

**해결:** `vite.config.ts` 확인
```typescript
export default defineConfig({
  base: '/', // 기본값 확인
  // ...
})
```

#### 에러 C: 빈 화면 (에러 없음)
```
(에러 메시지 없음)
```

**원인:** React Router Hash 모드 문제

**확인:** URL에 `/#/` 추가해보기
```
https://babyshop-xxxx.vercel.app/#/
```

---

## 📝 체크리스트

배포 전 확인사항:

- [ ] 로컬에서 `npm run build` 성공
- [ ] 로컬에서 `npm run preview` 정상 작동
- [ ] Git에 푸시 완료
- [ ] Vercel 환경 변수 설정 완료
- [ ] Vercel 배포 상태 "Ready"
- [ ] 브라우저에서 사이트 접속 확인

---

## 🛠️ 빠른 해결 (Step by Step)

### 지금 바로 따라하기:

#### Step 1: 환경 변수 확인
Vercel Dashboard (현재 열린 창) → babyshop → Settings → Environment Variables

**3개 변수 있나요?**
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_TOSS_CLIENT_KEY

**없으면:** 위 값들 복사해서 추가

#### Step 2: 재배포
Deployments → 최신 배포 → ⋮ → Redeploy

#### Step 3: 1-2분 대기

#### Step 4: Visit 버튼 클릭
또는 URL 직접 접속: `https://babyshop-xxxx.vercel.app/#/`

---

## 🆘 여전히 안 될 때

### 디버깅 정보 수집:

1. **Vercel 빌드 로그:**
   - Deployments → 실패한 배포 → Building 섹션
   - 에러 메시지 전체 복사

2. **브라우저 콘솔:**
   - 배포된 사이트에서 F12
   - Console 탭의 에러 메시지 복사

3. **Network 탭:**
   - F12 → Network 탭
   - 빨간색으로 표시된 실패한 요청 확인

---

## 💡 자주 묻는 질문

### Q1: 로컬에서는 되는데 Vercel에서 안 돼요
**A:** 환경 변수가 Vercel에 설정되지 않았을 가능성 높음

### Q2: 환경 변수 추가했는데도 안 돼요
**A:** 재배포(Redeploy) 필수! 환경 변수만 추가하면 적용 안 됨

### Q3: 빈 화면만 나와요
**A:** URL 끝에 `/#/` 추가해보세요 (React Router Hash 모드)

### Q4: Vercel 프로젝트가 없어요
**A:** GitHub 연동부터:
1. Vercel Dashboard → Add New → Project
2. Import Git Repository → babyshop 선택
3. Deploy 클릭

---

## 📊 배포 후 확인사항

### 정상 작동 확인:

- [ ] 홈 화면 로딩
- [ ] 상품 클릭 → 상세 페이지
- [ ] 로그인 페이지 접속
- [ ] 장바구니 기능 (로그인 후)
- [ ] 결제 플로우 (테스트 카드)

### 주의사항:

⚠️ **구글 로그인:**
- Google Cloud Console의 Redirect URI에 Vercel 도메인 추가 필요
- 예: `https://babyshop-xxxx.vercel.app`

⚠️ **Supabase 설정:**
- Supabase Dashboard → Authentication → URL Configuration
- Site URL에 Vercel 도메인 추가

---

## 🎯 최종 확인

모든 설정 완료 후:

```bash
# 로컬에서 마지막 확인
npm run build
npm run preview

# 문제 없으면 배포 상태 확인
# Vercel Dashboard에서 "Ready" 확인
# 실제 사이트 접속하여 동작 확인
```

성공! 🎉
