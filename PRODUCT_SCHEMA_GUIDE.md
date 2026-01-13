# 📦 제품 데이터베이스 스키마 가이드

## 🎯 개요

K-Baby Malaysia 쇼핑몰의 제품 데이터베이스 스키마입니다.

---

## 📋 테이블 구조

### 1️⃣ **`products`** - 제품 기본 정보

| 컬럼명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| `id` | UUID | 제품 고유 ID | ✅ |
| `name` | TEXT | 제품명 | ✅ |
| `sku` | TEXT | 제품 코드 | ❌ |
| `brand` | TEXT | 브랜드 | ❌ |
| `category` | TEXT | 카테고리 | ✅ |
| **가격 정보** | | | |
| `price` | DECIMAL | 판매 가격 | ✅ |
| `original_price` | DECIMAL | 정가 (할인 전) | ❌ |
| `is_on_sale` | BOOLEAN | 할인 여부 | ✅ |
| `sale_price` | DECIMAL | 할인된 가격 | ❌ |
| **판매 기한** | | | |
| `sale_start_date` | TIMESTAMPTZ | 판매 시작일 | ❌ |
| `sale_end_date` | TIMESTAMPTZ | 판매 종료일 (NULL=기한없음) | ❌ |
| **재고 & 주문** | | | |
| `stock_quantity` | INTEGER | 재고 수량 | ✅ |
| `max_order_quantity` | INTEGER | 1인당 최대 구매 개수 | ✅ |
| `min_order_quantity` | INTEGER | 최소 구매 개수 | ❌ |
| **이미지** | | | |
| `thumbnail_url` | TEXT | 대표 이미지 (썸네일) | ✅ |
| **설명** | | | |
| `short_description` | TEXT | 짧은 설명 | ❌ |
| `description` | TEXT | 상세 설명 (텍스트) | ❌ |
| `description_html` | TEXT | 상세 설명 (HTML) | ❌ |
| **배송 정보** | | | |
| `shipping_departure_date` | DATE | 배송 출발일 | ❌ |
| `estimated_delivery_days` | INTEGER | 배송 예상 소요 시간 (일) | ❌ |
| `shipping_fee` | DECIMAL | 배송비 | ❌ |
| `is_free_shipping` | BOOLEAN | 무료 배송 여부 | ❌ |
| **제품 속성** | | | |
| `weight` | DECIMAL | 무게 (kg) | ❌ |
| `origin_country` | TEXT | 원산지 | ❌ |
| `is_halal` | BOOLEAN | 할랄 인증 | ✅ |
| **판매 상태** | | | |
| `status` | TEXT | active/inactive/out_of_stock/discontinued | ✅ |
| `is_featured` | BOOLEAN | 추천 상품 여부 | ❌ |
| `is_new` | BOOLEAN | 신상품 여부 | ❌ |
| **통계** | | | |
| `view_count` | INTEGER | 조회수 | ❌ |
| `like_count` | INTEGER | 좋아요 수 | ❌ |
| `sales_count` | INTEGER | 판매 수량 | ❌ |

### 2️⃣ **`product_images`** - 상세 이미지들

| 컬럼명 | 설명 |
|--------|------|
| `product_id` | 제품 ID (외래키) |
| `image_url` | 이미지 URL |
| `alt_text` | 이미지 설명 |
| `sort_order` | 정렬 순서 |

### 3️⃣ **`product_categories`** - 카테고리

| 컬럼명 | 설명 |
|--------|------|
| `name` | 카테고리명 |
| `name_ko` | 한국어 이름 |
| `name_en` | 영어 이름 |
| `slug` | URL용 슬러그 |
| `parent_id` | 상위 카테고리 |

### 4️⃣ **`product_tags`** - 태그

| 컬럼명 | 설명 |
|--------|------|
| `product_id` | 제품 ID |
| `tag` | 태그명 |

### 5️⃣ **`product_reviews`** - 리뷰

| 컬럼명 | 설명 |
|--------|------|
| `product_id` | 제품 ID |
| `user_id` | 사용자 ID |
| `rating` | 평점 (1-5) |
| `comment` | 리뷰 내용 |
| `images` | 리뷰 이미지들 |

### 6️⃣ **`product_likes`** - 찜하기

| 컬럼명 | 설명 |
|--------|------|
| `product_id` | 제품 ID |
| `user_id` | 사용자 ID |

---

## 🚀 설치 방법

### **Step 1: Supabase Dashboard 접속**

1. https://supabase.com 로그인
2. 프로젝트 선택: `cnumxvxxyxexzzyeinjr`
3. 좌측 메뉴에서 **SQL Editor** 클릭

### **Step 2: 스키마 실행**

1. **New Query** 클릭
2. `supabase-products-schema.sql` 파일 내용 복사
3. 붙여넣기 후 **Run** 클릭 ▶️

### **Step 3: 확인**

```sql
-- 테이블 생성 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'product%';

-- 초기 데이터 확인
SELECT * FROM products;
SELECT * FROM product_categories;
```

---

## 📝 초기 데이터

스키마 실행 시 자동으로 삽입됩니다:

### **제품 3개**
- 퓨어잇 유기농 떡뻥 (오리지널)
- 부드러운 아기 소고기 육포
- 프리미엄 동결건조 요거트 큐브

### **카테고리 8개**
- Snacks (간식)
- Meals (이유식/식사)
- Drinks (음료)
- Diapers (기저귀)
- Bath (목욕용품)
- Toys (장난감)
- Clothing (의류)
- Books (책/교구)

---

## 🔧 사용 예시 (코드)

### **모든 제품 조회**

```typescript
import { getAllProducts } from './services/productService';

const products = await getAllProducts();
```

### **특정 제품 조회**

```typescript
import { getProductById } from './services/productService';

const product = await getProductById('00000000-0000-0000-0000-000000000001');
```

### **타임딜 제품 조회**

```typescript
import { getTimeDealProducts } from './services/productService';

const timeDeals = await getTimeDealProducts();
```

### **카테고리별 제품**

```typescript
import { getProductsByCategory } from './services/productService';

const snacks = await getProductsByCategory('Snacks');
```

---

## ⚠️ 주의사항

### **기존 데이터 호환성**

기존 코드에서 사용하던 속성들은 호환성을 위해 유지됩니다:

```typescript
product.image         // = thumbnail_url
product.stock         // = stock_quantity
product.maxOrder      // = max_order_quantity
product.originalPrice // = original_price
product.type          // 'A' or 'B' (자동 변환)
product.deadline      // = sale_end_date
```

### **외래키 변경**

`cart_items`와 `order_items`의 `product_id`가 **TEXT → UUID**로 변경됩니다.
- 기존 장바구니 데이터는 삭제될 수 있습니다
- 프로덕션 환경에서는 마이그레이션 스크립트 필요

---

## 📊 제공되는 API 함수

| 함수명 | 설명 |
|--------|------|
| `getAllProducts()` | 모든 활성 제품 |
| `getProductById(id)` | 특정 제품 조회 |
| `getProductsByCategory(category)` | 카테고리별 제품 |
| `getTimeDealProducts()` | 타임딜 제품 |
| `getRegularProducts()` | 일반 제품 |
| `getFeaturedProducts()` | 추천 제품 |
| `getNewProducts()` | 신상품 |
| `getProductImages(productId)` | 제품 상세 이미지 |
| `getProductTags(productId)` | 제품 태그 |
| `incrementProductView(productId)` | 조회수 증가 |
| `searchProducts(query)` | 제품 검색 |
| `getAllCategories()` | 모든 카테고리 |

---

## 🎨 다음 단계

스키마 적용 후:

1. ✅ **기존 페이지 업데이트**
   - `Home.tsx`, `Products.tsx`, `ProductDetail.tsx` 등
   - `MOCK_PRODUCTS` → DB 조회로 변경

2. ✅ **관리자 페이지 추가**
   - 제품 CRUD (Create, Read, Update, Delete)
   - 카테고리 관리
   - 재고 관리

3. ✅ **고급 기능**
   - 제품 검색
   - 필터링 (가격, 카테고리, 할랄 등)
   - 정렬 (인기순, 신상품순, 가격순)

---

## 🆘 문제 해결

### **에러: relation "products" does not exist**
→ 스키마가 아직 실행되지 않았습니다. Step 2를 다시 수행하세요.

### **에러: column "product_id" cannot be cast to type uuid**
→ 기존 `cart_items` 데이터를 삭제하세요:
```sql
DELETE FROM cart_items;
```

### **환경 변수 확인**
`.env.local` 파일에 Supabase 키가 있는지 확인:
```
VITE_SUPABASE_URL=https://cnumxvxxyxexzzyeinjr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 📞 지원

문제가 있으면 에러 메시지와 함께 알려주세요! 🚀
