# 환경 변수와 보안 완벽 가이드

## 🔑 Supabase Anon Key는 왜 공개해도 되나요?

### 결론부터: **괜찮습니다!** ✅

Supabase Anon Key는 **의도적으로 공개되도록 설계**되었습니다.

---

## 📊 Supabase 보안 모델

### 두 가지 키의 차이

| 키 종류 | 노출 | 용도 | 보안 |
|---------|------|------|------|
| **Anon Key** (공개 키) | ✅ 공개 가능 | 클라이언트에서 사용 | RLS로 보호 |
| **Secret Key** (비밀 키) | ❌ 절대 비공개 | 서버에서만 사용 | 모든 권한 |

---

## 🛡️ 실제 보안은 어떻게 지켜지나요?

### Row Level Security (RLS)

Anon Key로 접근해도, **실제 데이터 접근은 RLS 정책**으로 제어됩니다.

**예시:**

```sql
-- users 테이블: 본인 데이터만 조회 가능
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- products 테이블: 모두 조회 가능, 수정 불가
CREATE POLICY "Anyone can view products"
ON products FOR SELECT
TO anon
USING (true);

-- orders 테이블: 본인 주문만 조회/생성
CREATE POLICY "Users can manage own orders"
ON orders
USING (auth.uid() = user_id);
```

**결과:**
- Anon Key로 접근해도 → RLS가 권한 체크
- 본인 데이터만 접근 가능
- 다른 사용자 데이터는 볼 수 없음

---

## 🔍 Vite 환경 변수의 작동 원리

### `VITE_` 접두사의 의미

```env
# ✅ 클라이언트에 노출됨 (의도적)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# ❌ 클라이언트에 노출 안 됨 (서버 전용)
SECRET_API_KEY=xxx
DATABASE_PASSWORD=xxx
```

**Vite 빌드 시:**
```javascript
// 빌드 전 (코드)
const url = import.meta.env.VITE_SUPABASE_URL;

// 빌드 후 (번들)
const url = "https://cnumxvxxyxexzzyeinjr.supabase.co";
```

→ 환경 변수 값이 **코드에 직접 삽입**됨
→ 브라우저에서 볼 수 있음
→ **이것이 정상입니다!**

---

## ⚠️ 진짜 위험한 것들

### ❌ 절대 공개하면 안 되는 것:

1. **Supabase Secret Key**
   ```env
   # ❌ 절대 클라이언트에 포함 금지!
   SUPABASE_SECRET_KEY=eyJhbGci...
   ```
   - 모든 권한 가짐
   - RLS 우회 가능
   - 서버에서만 사용

2. **Google OAuth Client Secret**
   ```env
   # ❌ 절대 클라이언트에 포함 금지!
   GOOGLE_CLIENT_SECRET=GOCSPX-...
   ```
   - 다른 사람이 Google 인증 가로챌 수 있음

3. **결제 Secret Key**
   ```env
   # ❌ 절대 클라이언트에 포함 금지!
   TOSS_SECRET_KEY=test_sk_...
   ```
   - 다른 사람이 결제 조작 가능

4. **데이터베이스 비밀번호**
   ```env
   # ❌ 절대 클라이언트에 포함 금지!
   DATABASE_PASSWORD=mypassword123
   ```

---

## ✅ 공개해도 되는 것들

### 클라이언트에서 사용하도록 설계된 공개 키:

1. **Supabase Anon Key** ✅
   - RLS로 보호됨
   - 클라이언트 전용

2. **Google OAuth Client ID** ✅
   - 공개 식별자
   - Secret이 아니면 안전

3. **Toss Payments Client Key** ✅
   - 테스트/실제 Client Key
   - 결제 UI용 공개 키

4. **Firebase Config** ✅
   - apiKey, authDomain 등
   - 공개 설정값

---

## 🔐 보안 계층 구조

```
┌─────────────────────────────────────┐
│  클라이언트 (브라우저)                │
│  - Anon Key 사용 ✅                  │
│  - 누구나 볼 수 있음                  │
│  - 실제 권한은 없음                   │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Supabase (Row Level Security)      │
│  - 로그인 사용자 확인                 │
│  - RLS 정책으로 권한 체크             │
│  - 본인 데이터만 접근 허용            │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  PostgreSQL 데이터베이스             │
│  - Secret Key로만 직접 접근 가능      │
│  - RLS 없이 모든 데이터 접근          │
└─────────────────────────────────────┘
```

---

## 🧪 테스트: Anon Key로 뭘 할 수 있을까?

### 예시 1: 다른 사람 데이터 조회 시도

```javascript
// 공개된 Anon Key로 시도
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', '다른_사람_ID');

// 결과: ❌ 실패!
// RLS 정책으로 차단됨
// "insufficient privileges" 에러
```

### 예시 2: 제품 정보 조회 (허용됨)

```javascript
// 공개된 Anon Key로 시도
const { data, error } = await supabase
  .from('products')
  .select('*');

// 결과: ✅ 성공!
// RLS 정책이 공개 조회 허용
// 누구나 제품 볼 수 있음
```

### 예시 3: 데이터 삭제 시도

```javascript
// 공개된 Anon Key로 시도
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', '아무_ID');

// 결과: ❌ 실패!
// RLS 정책으로 차단됨
// 본인 데이터만 수정/삭제 가능
```

---

## 💡 실전 보안 가이드

### ✅ 올바른 사용:

**클라이언트 (공개 OK):**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co      ✅
VITE_SUPABASE_ANON_KEY=eyJhbGci...             ✅
VITE_GOOGLE_CLIENT_ID=123-abc.apps.google...  ✅
VITE_TOSS_CLIENT_KEY=test_ck_...              ✅
```

**서버 (비공개 필수):**
```env
SUPABASE_SECRET_KEY=eyJhbGci...               ❌ (서버만)
GOOGLE_CLIENT_SECRET=GOCSPX-...              ❌ (서버만)
TOSS_SECRET_KEY=test_sk_...                  ❌ (서버만)
DATABASE_PASSWORD=...                        ❌ (서버만)
```

---

## 🚨 진짜 보안 문제들

### 1. RLS 정책 미설정

```sql
-- ❌ 위험: RLS 없음
CREATE TABLE sensitive_data (
  id uuid,
  secret text
);
-- 누구나 접근 가능!

-- ✅ 안전: RLS 설정
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see own data"
ON sensitive_data
USING (auth.uid() = user_id);
```

### 2. Anon 권한으로 너무 많이 허용

```sql
-- ❌ 위험: 익명 사용자가 모든 데이터 삭제 가능
CREATE POLICY "Anyone can delete"
ON orders FOR DELETE
TO anon
USING (true);

-- ✅ 안전: 본인 데이터만
CREATE POLICY "Users can delete own orders"
ON orders FOR DELETE
USING (auth.uid() = user_id);
```

### 3. Secret Key를 클라이언트에 노출

```typescript
// ❌ 절대 금지!
const supabase = createClient(
  url,
  'SECRET_KEY_HERE'  // Secret Key를 클라이언트에!
);

// ✅ 올바름
const supabase = createClient(
  url,
  'ANON_KEY_HERE'    // Anon Key 사용
);
```

---

## 📚 더 알아보기

### Supabase 공식 문서:

- [What is an anon key?](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Security Best Practices](https://supabase.com/docs/guides/platform/security-best-practices)

### 핵심 개념:

> "The anon key is safe to use in a browser if you have Row Level Security enabled"
> 
> "Your anon key is safe to expose because it has limited permissions"

---

## 🎯 요약

### Q: VITE_SUPABASE_ANON_KEY를 환경 변수로 등록해도 괜찮나요?

**A: 네! 완전히 안전합니다.** ✅

**이유:**
1. **의도된 설계** - 클라이언트에서 사용하도록 만들어짐
2. **RLS로 보호** - 실제 권한은 데이터베이스 정책이 제어
3. **제한된 권한** - Anon Key는 기본적으로 거의 권한 없음
4. **업계 표준** - Firebase, Auth0 등 모두 비슷한 방식

**진짜 위험한 것:**
- ❌ Secret Key를 클라이언트에 노출
- ❌ RLS 정책 미설정
- ❌ Anon 권한에 너무 많은 권한 부여

**안전하게 사용하는 방법:**
1. Anon Key는 클라이언트에서 사용 ✅
2. Secret Key는 절대 클라이언트에 넣지 않기 ✅
3. Supabase에서 RLS 정책 설정 ✅
4. 테이블별로 적절한 권한 부여 ✅

---

## 🛡️ 보안 체크리스트

- [ ] Anon Key만 클라이언트에서 사용
- [ ] Secret Key는 서버 전용 (또는 미사용)
- [ ] Supabase 테이블에 RLS 활성화
- [ ] 각 테이블에 적절한 정책 설정
- [ ] 민감한 데이터는 별도 보호
- [ ] 정기적인 권한 검토

---

**결론:** 
Anon Key는 공개해도 괜찮습니다. 실제 보안은 Supabase의 Row Level Security로 관리됩니다! 🔒
