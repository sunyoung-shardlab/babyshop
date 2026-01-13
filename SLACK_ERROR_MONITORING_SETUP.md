# 🚨 Slack 에러 모니터링 설정 가이드

로그아웃 에러 등 중요한 버그를 Slack으로 실시간 알림 받는 방법입니다.

---

## 📱 1단계: Slack Incoming Webhook 생성

### **1. Slack App 생성**
1. https://api.slack.com/apps 접속
2. **"Create New App"** 클릭
3. **"From scratch"** 선택
4. App 이름: `Baby Shop Error Monitor`
5. Workspace 선택 → **"Create App"**

### **2. Incoming Webhook 활성화**
1. 왼쪽 메뉴에서 **"Incoming Webhooks"** 클릭
2. **"Activate Incoming Webhooks"** → ON
3. 아래 **"Add New Webhook to Workspace"** 클릭
4. 알림 받을 채널 선택 (예: `#errors`, `#alerts`)
5. **"Allow"** 클릭

### **3. Webhook URL 복사**
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```
↑ 이 URL을 복사하세요!

---

## 🔑 2단계: 환경변수 설정

### **로컬 개발 환경 (.env.local)**

`.env.local` 파일에 추가:
```bash
# Slack Error Monitoring
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

### **Vercel (프로덕션)**

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 새 변수 추가:
   - **Name**: `VITE_SLACK_WEBHOOK_URL`
   - **Value**: `https://hooks.slack.com/services/...`
   - **Environment**: Production, Preview, Development 모두 체크
4. **Save** → **Redeploy**

---

## 🧪 3단계: 테스트

### **로컬에서 테스트:**

1. `.env.local`에 Webhook URL 추가
2. 개발 서버 재시작:
   ```bash
   npm run dev
   ```
3. 로그인 → 마이페이지 → 로그아웃 시도
4. Slack 채널 확인!

### **에러 발생 시 Slack 알림 예시:**

```
🚨 에러 발생
타입: LOGOUT_FAILED
유저: user@example.com
에러: Logout timeout after 10s
시간: 2026-01-14T12:34:56.000Z
```

---

## 🛠️ 추가 권장 툴

### **1. Sentry (무료 플랜 제공)**
- **장점**: 
  - 자동 에러 캡처
  - 스택 트레이스 자동 수집
  - 사용자 세션 정보
  - 에러 그룹화
  - Slack 연동 기본 제공
- **설치**:
  ```bash
  npm install @sentry/react
  ```
- **설정**:
  ```typescript
  import * as Sentry from "@sentry/react";
  
  Sentry.init({
    dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
  ```
- **가격**: 5,000 errors/month 무료

### **2. LogRocket (세션 리플레이)**
- **장점**:
  - 사용자 화면 녹화
  - 에러 발생 전 10분 세션 저장
  - 네트워크 요청 기록
- **가격**: 1,000 sessions/month 무료

### **3. Bugsnag**
- **장점**:
  - 실시간 에러 알림
  - 에러 우선순위 자동 설정
  - Slack 연동 쉬움
- **가격**: 7,500 errors/month 무료

---

## 📊 현재 구현된 에러 모니터링

### **코드 위치: `contexts/AuthContext.tsx`**

```typescript
const sendErrorToMonitoring = async (errorData: {
  type: string;
  error: string;
  user: string;
  timestamp: string;
}) => {
  const slackWebhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;
  
  if (slackWebhookUrl) {
    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 *${errorData.type}*`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*🚨 에러 발생*\n*타입:* ${errorData.type}\n*유저:* ${errorData.user}\n*에러:* ${errorData.error}\n*시간:* ${errorData.timestamp}`
            }
          }
        ]
      })
    });
  }
};
```

### **에러 발생 시:**
```typescript
catch (error) {
  console.error('❌ Logout failed:', error);
  
  // Slack 알림 전송
  sendErrorToMonitoring({
    type: 'LOGOUT_FAILED',
    error: error.message,
    user: user?.email,
    timestamp: new Date().toISOString(),
  });
  
  // 사용자 알림
  alert('로그아웃 중 오류가 발생했습니다.');
  
  // ⚠️ 화면 유지 (리다이렉트 X, 로컬 로그아웃 X)
}
```

---

## 🎯 권장 설정 (프로덕션)

**무료 조합:**
1. **Slack Webhook** (기본 알림) ← 지금 구현됨 ✅
2. **Sentry** (상세 에러 트래킹) ← 추가 권장
3. **Vercel Analytics** (성능 모니터링) ← 기본 제공

**유료 고려 시:**
- **LogRocket** ($99/month) - 사용자 세션 리플레이
- **Datadog** - 종합 모니터링

---

## 🚀 다음 단계

1. ✅ Slack Webhook URL 발급
2. ✅ `.env.local`에 추가
3. ✅ Vercel 환경변수 설정
4. 🔄 Sentry 추가 고려
5. 🔄 에러 타입 추가 (결제 실패, 장바구니 오류 등)

---

## 📞 문제 발생 시

Slack 알림이 안 오면:
1. Webhook URL 확인 (`https://hooks.slack.com/services/...`)
2. 환경변수 이름 확인 (`VITE_SLACK_WEBHOOK_URL`)
3. 서버 재시작 확인
4. 네트워크 탭에서 POST 요청 확인
5. Slack 채널 확인 (올바른 채널?)

테스트 코드:
```typescript
fetch('https://hooks.slack.com/services/...', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '테스트 메시지' })
});
```
