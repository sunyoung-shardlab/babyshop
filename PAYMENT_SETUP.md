# 토스페이먼츠 결제 시스템 설정 가이드

## 🎯 구현 완료 사항

### ✅ 기능 목록

1. **장바구니 시스템**
   - 상품 추가/삭제
   - 수량 조절
   - 로컬 스토리지 저장
   - 실시간 개수 표시 (헤더 배지)

2. **상품 상세 페이지**
   - 수량 선택
   - 장바구니 담기
   - 바로 결제하기

3. **주문서 페이지**
   - 배송 정보 입력
   - 주문 상품 확인
   - 결제 금액 계산

4. **토스페이먼츠 결제**
   - 카드 결제
   - 결제 성공/실패 처리

5. **결제 결과 페이지**
   - 결제 성공 화면
   - 결제 실패 화면
   - 장바구니로 돌아가기

---

## 🔑 토스페이먼츠 설정

### 1단계: 토스페이먼츠 가입

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com/) 접속
2. 회원가입 및 로그인
3. 내 개발 정보 → API 키 발급

### 2단계: API 키 설정

**개발 환경 (테스트):**

현재 `.env` 파일에 테스트 키가 설정되어 있습니다:

```env
VITE_TOSS_CLIENT_KEY=your-test-key-here
```

**운영 환경 (실제 결제):**

```env
# 실제 클라이언트 키로 교체
VITE_TOSS_CLIENT_KEY=live_ck_your_actual_key_here
```

⚠️ **주의:** 운영 키는 절대 Git에 커밋하지 마세요!

### 3단계: Vercel 배포 시 환경 변수 설정

Vercel Dashboard → Project → Settings → Environment Variables:

```
Name: VITE_TOSS_CLIENT_KEY
Value: live_ck_your_actual_key_here
Environment: Production ✅
```

---

## 📱 사용자 흐름

### 흐름 1: 상품 상세 → 장바구니 → 결제

```
상품 상세 페이지
    ↓ (수량 선택 + 장바구니 담기)
장바구니 페이지
    ↓ (결제하기)
주문서 페이지
    ↓ (배송 정보 입력 + 결제하기)
토스페이먼츠 결제 창
    ↓ (결제 완료/실패)
결제 성공/실패 페이지
    ↓ (확인)
장바구니 페이지
```

### 흐름 2: 상품 상세 → 바로 결제

```
상품 상세 페이지
    ↓ (수량 선택 + 결제하기)
주문서 페이지
    ↓ (배송 정보 입력 + 결제하기)
토스페이먼츠 결제 창
    ↓ (결제 완료/실패)
결제 성공/실패 페이지
    ↓ (확인)
장바구니 페이지
```

---

## 🔧 파일 구조

```
babyshop/
├── contexts/
│   └── CartContext.tsx          # 장바구니 상태 관리
├── pages/
│   ├── Cart.tsx                 # 장바구니 페이지
│   ├── Checkout.tsx             # 주문서 페이지
│   ├── PaymentSuccess.tsx       # 결제 성공 페이지
│   ├── PaymentFail.tsx          # 결제 실패 페이지
│   └── ProductDetail.tsx        # 상품 상세 (수정됨)
├── components/
│   └── Layout.tsx               # 장바구니 배지 추가
└── App.tsx                      # 라우팅 설정
```

---

## 🧪 테스트 방법

### 1. 개발 서버 실행

```bash
npm run dev
```

### 2. 테스트 시나리오

#### 시나리오 A: 장바구니 사용

1. 홈 화면 → 상품 클릭
2. 수량 선택 (예: 3개)
3. "장바구니" 버튼 클릭
4. 헤더의 장바구니 아이콘 (숫자 배지 확인)
5. 장바구니 페이지로 이동
6. 수량 조절 테스트 (+/- 버튼)
7. 상품 삭제 테스트 (휴지통 버튼)
8. "결제하기" 버튼 클릭
9. 배송 정보 입력
10. "결제하기" 버튼 클릭
11. 토스페이먼츠 테스트 결제 진행

#### 시나리오 B: 바로 결제

1. 홈 화면 → 상품 클릭
2. 수량 선택
3. "결제하기" 버튼 클릭
4. 배송 정보 입력
5. 결제 진행

### 3. 토스페이먼츠 테스트 카드

**테스트 카드 번호:**
- 일반 결제: `4570-0000-0000-0000`
- 3D Secure: `4000-0000-0000-0000`

**유효기간:** 아무거나 (미래 날짜)
**CVC:** 아무거나 (3자리)

---

## 🎨 주요 기능 설명

### 장바구니 Context

- **상태 관리:** React Context API 사용
- **로컬 스토리지:** 새로고침해도 장바구니 유지
- **함수들:**
  - `addToCart(product, quantity)` - 상품 추가
  - `removeFromCart(productId)` - 상품 삭제
  - `updateQuantity(productId, quantity)` - 수량 변경
  - `clearCart()` - 장바구니 비우기
  - `getTotalPrice()` - 총 금액 계산
  - `getTotalItems()` - 총 상품 개수

### 토스페이먼츠 연동

**결제 요청:**
```typescript
const tossPayments = await loadTossPayments(clientKey);

await tossPayments.requestPayment('카드', {
  amount: 금액,
  orderId: 주문번호,
  orderName: 상품명,
  customerName: 구매자명,
  successUrl: 성공URL,
  failUrl: 실패URL,
});
```

**리다이렉트 URL:**
- 성공: `/#/payment/success?orderId=xxx&amount=xxx`
- 실패: `/#/payment/fail?code=xxx&message=xxx`

---

## ⚠️ 주의사항

### 보안

1. **클라이언트 키만 사용**
   - ✅ Client Key: 클라이언트에서 사용 가능
   - ❌ Secret Key: 서버에서만 사용 (절대 클라이언트 노출 금지)

2. **환경 변수 관리**
   - `.env` 파일은 Git에 커밋하지 않음
   - 운영 키는 Vercel Dashboard에서 설정

### 실제 운영 시 필요한 작업

1. **서버 구현 필요:**
   - 주문 정보 저장
   - 결제 검증 (Webhook)
   - 재고 관리
   - 주문 상태 업데이트

2. **추가 기능:**
   - 배송지 관리 (여러 주소 저장)
   - 주문 내역 조회
   - 쿠폰/할인 적용
   - 포인트 적립/사용

---

## 📚 참고 자료

- [토스페이먼츠 개발 가이드](https://docs.tosspayments.com/)
- [결제 위젯 SDK](https://docs.tosspayments.com/reference/widget-sdk)
- [테스트 카드 정보](https://docs.tosspayments.com/guides/test-card)

---

## 🐛 문제 해결

### 문제 1: 결제 창이 안 뜨는 경우

**원인:** 환경 변수 미설정

**해결:**
```bash
# .env 파일 확인
cat .env

# VITE_TOSS_CLIENT_KEY가 있는지 확인
# 없으면 추가:
echo "VITE_TOSS_CLIENT_KEY=your-test-key" >> .env

# 개발 서버 재시작
npm run dev
```

### 문제 2: 장바구니가 비어있다고 나오는 경우

**원인:** CartProvider가 App에 적용되지 않음

**확인:** `App.tsx`에서 `<CartProvider>`로 감싸져 있는지 확인

### 문제 3: 결제 후 장바구니가 안 비워지는 경우

**원인:** 결제 성공 페이지에서 `clearCart()` 호출 안 됨

**확인:** `PaymentSuccess.tsx` 파일 확인

---

## ✨ 개선 아이디어

- [ ] 찜하기 기능과 연동
- [ ] 장바구니 상품 수량 실시간 유효성 검사 (재고)
- [ ] 쿠폰 적용 기능
- [ ] 다양한 결제 수단 (계좌이체, 간편결제 등)
- [ ] 배송지 주소록 관리
- [ ] 주문 내역 페이지
- [ ] 결제 취소/환불 기능
