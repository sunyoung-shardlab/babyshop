-- ============================================
-- 제품 관련 테이블 스키마
-- ============================================

-- 1. products 테이블 (제품 기본 정보)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 기본 정보
  name TEXT NOT NULL,
  sku TEXT UNIQUE, -- 제품 코드
  brand TEXT,
  category TEXT NOT NULL,
  
  -- 가격 정보
  price DECIMAL(10, 2) NOT NULL, -- 판매 가격 (할인 적용 후)
  original_price DECIMAL(10, 2), -- 정가 (할인 전)
  is_on_sale BOOLEAN DEFAULT false, -- 할인 여부
  
  -- 판매 기한
  sale_start_date TIMESTAMPTZ, -- 판매 시작일
  sale_end_date TIMESTAMPTZ, -- 판매 종료일 (NULL = 기한 없음)
  
  -- 재고 & 주문 제한
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  max_order_quantity INTEGER DEFAULT 10, -- 1인당 최대 구매 개수
  min_order_quantity INTEGER DEFAULT 1, -- 최소 구매 개수
  
  -- 이미지
  thumbnail_url TEXT NOT NULL, -- 대표 이미지 (썸네일)
  
  -- 설명
  short_description TEXT, -- 짧은 설명 (목록용)
  description TEXT, -- 상세 설명 (텍스트)
  description_html TEXT, -- 상세 설명 (HTML 지원)
  
  -- 배송 정보
  shipping_departure_date DATE, -- 배송 출발일
  estimated_delivery_days INTEGER, -- 배송 예상 소요 시간 (일)
  shipping_fee DECIMAL(10, 2) DEFAULT 0, -- 배송비
  is_free_shipping BOOLEAN DEFAULT false, -- 무료 배송 여부
  
  -- 제품 속성
  weight DECIMAL(10, 2), -- 무게 (kg)
  origin_country TEXT, -- 원산지
  is_halal BOOLEAN DEFAULT false, -- 할랄 인증
  
  -- 판매 상태
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  is_featured BOOLEAN DEFAULT false, -- 추천 상품
  is_new BOOLEAN DEFAULT false, -- 신상품
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  
  -- 정렬 & 노출
  sort_order INTEGER DEFAULT 0, -- 노출도 rank (0=최우선 노출, 오름차순 정렬)
  
  -- 메타 정보
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);

-- 2. product_images 테이블 (상세 이미지들)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. product_categories 테이블 (카테고리 관리)
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_ko TEXT, -- 한국어 이름
  name_en TEXT, -- 영어 이름
  slug TEXT UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id), -- 상위 카테고리
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. product_tags 테이블 (태그)
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0, -- 태그 노출 순서 (낮을수록 앞에)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, tag)
);

-- 5. product_reviews 테이블 (리뷰)
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  comment TEXT,
  body_text TEXT CHECK (body_text IS NULL OR char_length(body_text) <= 200), -- 후기 본문 (200자 이내)
  images TEXT[], -- 리뷰 이미지 URL 배열
  summary_text TEXT, -- AI 1줄 요약 후기
  summary_model TEXT, -- 요약에 사용된 모델
  summary_generated_at TIMESTAMPTZ, -- 요약 생성 시각
  highlight_tags TEXT[] DEFAULT '{}'::text[] CHECK (coalesce(array_length(highlight_tags, 1), 0) <= 3), -- 대표 태그들 (최대 3개)
  author_name TEXT, -- 작성자 표시명 (스냅샷)
  author_avatar_url TEXT, -- 작성자 썸네일 (스냅샷)
  is_verified_purchase BOOLEAN DEFAULT false, -- 구매 인증 여부
  helpful_count INTEGER DEFAULT 0, -- 도움됨 수
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5-1. product_review_images 테이블 (리뷰 이미지: 대표 1장 + 상세 최대 6장)
CREATE TABLE IF NOT EXISTS product_review_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('cover', 'detail')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. product_likes 테이블 (찜하기)
CREATE TABLE IF NOT EXISTS product_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- ============================================
-- 인덱스 생성
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sale_end_date ON products(sale_end_date);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_product_id ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_highlight_tags_gin ON product_reviews USING GIN (highlight_tags);
CREATE INDEX IF NOT EXISTS idx_product_review_images_review_id ON product_review_images(review_id);
CREATE INDEX IF NOT EXISTS idx_product_likes_product_id ON product_likes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_likes_user_id ON product_likes(user_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

-- products: 모든 사용자 조회 가능
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" 
  ON products FOR SELECT 
  USING (status = 'active' AND deleted_at IS NULL);

-- product_images: 모든 사용자 조회 가능
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view product images" ON product_images;
CREATE POLICY "Anyone can view product images" 
  ON product_images FOR SELECT 
  USING (true);

-- product_categories: 모든 사용자 조회 가능
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view categories" ON product_categories;
CREATE POLICY "Anyone can view categories" 
  ON product_categories FOR SELECT 
  USING (is_active = true);

-- product_tags: 모든 사용자 조회 가능
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view tags" ON product_tags;
CREATE POLICY "Anyone can view tags" 
  ON product_tags FOR SELECT 
  USING (true);

-- product_reviews: 모든 사용자 조회, 작성자만 수정/삭제
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews" ON product_reviews;
CREATE POLICY "Anyone can view reviews" 
  ON product_reviews FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can insert own reviews" ON product_reviews;
CREATE POLICY "Users can insert own reviews" 
  ON product_reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON product_reviews;
CREATE POLICY "Users can update own reviews" 
  ON product_reviews FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON product_reviews;
CREATE POLICY "Users can delete own reviews" 
  ON product_reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- product_review_images: 모든 사용자 조회, 리뷰 작성자만 관리
ALTER TABLE product_review_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view review images" ON product_review_images;
CREATE POLICY "Anyone can view review images"
  ON product_review_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can manage own review images" ON product_review_images;
CREATE POLICY "Users can manage own review images"
  ON product_review_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM product_reviews pr
      WHERE pr.id = product_review_images.review_id
        AND pr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM product_reviews pr
      WHERE pr.id = product_review_images.review_id
        AND pr.user_id = auth.uid()
    )
  );

-- product_likes: 사용자별 관리
ALTER TABLE product_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own likes" ON product_likes;
CREATE POLICY "Users can view own likes" 
  ON product_likes FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own likes" ON product_likes;
CREATE POLICY "Users can manage own likes" 
  ON product_likes 
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 트리거: updated_at 자동 업데이트
-- ============================================

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 뷰: 제품 통계 정보
-- ============================================

CREATE OR REPLACE VIEW product_stats AS
SELECT 
  p.id,
  p.name,
  COUNT(DISTINCT pr.id) as review_count,
  COALESCE(AVG(pr.rating), 0) as avg_rating,
  COUNT(DISTINCT pl.id) as like_count,
  p.view_count,
  p.sales_count
FROM products p
LEFT JOIN product_reviews pr ON p.id = pr.product_id
LEFT JOIN product_likes pl ON p.id = pl.product_id
GROUP BY p.id, p.name, p.view_count, p.sales_count;

-- ============================================
-- 함수: 제품 조회수 증가
-- ============================================

CREATE OR REPLACE FUNCTION increment_product_view(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET view_count = view_count + 1 
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- cart_items 테이블 수정 (기존 테이블 업데이트)
-- ============================================

-- product_id를 UUID로 변경하고 외래키 추가
-- 주의: 기존 데이터가 있다면 먼저 백업 필요!
ALTER TABLE cart_items 
  DROP CONSTRAINT IF EXISTS fk_cart_product;

-- 기존 TEXT 타입을 UUID로 변경
ALTER TABLE cart_items 
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- 외래키 제약 추가
ALTER TABLE cart_items 
  ADD CONSTRAINT fk_cart_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- ============================================
-- order_items 테이블 수정 (기존 테이블 업데이트)
-- ============================================

-- product_id를 UUID로 변경하고 외래키 추가
ALTER TABLE order_items 
  DROP CONSTRAINT IF EXISTS fk_order_product;

-- 기존 TEXT 타입을 UUID로 변경
ALTER TABLE order_items 
  ALTER COLUMN product_id TYPE UUID USING product_id::UUID;

-- 외래키 제약 추가
ALTER TABLE order_items 
  ADD CONSTRAINT fk_order_product 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

-- ============================================
-- 초기 카테고리 데이터
-- ============================================

INSERT INTO product_categories (name, name_ko, name_en, slug, sort_order) VALUES
  ('Snacks', '간식', 'Snacks', 'snacks', 1),
  ('Meals', '이유식/식사', 'Meals', 'meals', 2),
  ('Drinks', '음료', 'Drinks', 'drinks', 3),
  ('Diapers', '기저귀', 'Diapers', 'diapers', 4),
  ('Bath', '목욕용품', 'Bath Products', 'bath', 5),
  ('Toys', '장난감', 'Toys', 'toys', 6),
  ('Clothing', '의류', 'Clothing', 'clothing', 7),
  ('Books', '책/교구', 'Books & Learning', 'books', 8)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- MOCK 데이터를 DB로 마이그레이션
-- ============================================

-- 기존 MOCK_PRODUCTS 3개 제품 삽입
INSERT INTO products (
  id, name, price, original_price, is_on_sale,
  thumbnail_url, category, description, is_halal, 
  stock_quantity, max_order_quantity, status, sale_end_date
) VALUES
  (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '퓨어잇 유기농 떡뻥 (오리지널)',
    18.50, 35.00, true,
    '/images/tteok-ppeong.png',
    'Snacks',
    '100% 유기농 한국산 쌀 과자. 입에서 살살 녹는 질감으로 이유식 초기 아기에게 완벽합니다.',
    true,
    8, 5, 'active', NULL
  ),
  (
    '00000000-0000-0000-0000-000000000002'::UUID,
    '부드러운 아기 소고기 육포',
    25.00, 30.00, true,
    '/images/beef-jerky.png',
    'Snacks',
    '부드럽고 짜지 않은 아기 전용 소고기 육포. 고단백 영양 간식입니다.',
    true,
    15, 5, 'active', '2026-02-01T00:00:00Z'::TIMESTAMPTZ
  ),
  (
    '00000000-0000-0000-0000-000000000003'::UUID,
    '프리미엄 동결건조 요거트 큐브',
    22.00, 40.00, true,
    '/images/yogurt-cubes.png',
    'Snacks',
    '입안에서 사르르 녹는 동결건조 요거트. 4가지 유산균이 살아있습니다.',
    true,
    5, 5, 'active', NULL
  )
ON CONFLICT (id) DO NOTHING;

-- 각 제품에 태그 추가
-- 태그 종류: '할랄 인증', '핫딜'
-- sort_order: 1=할랄 인증(먼저), 2=핫딜(나중)
INSERT INTO product_tags (product_id, tag, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001'::UUID, '할랄 인증', 1),
  ('00000000-0000-0000-0000-000000000002'::UUID, '할랄 인증', 1),
  ('00000000-0000-0000-0000-000000000002'::UUID, '핫딜', 2),
  ('00000000-0000-0000-0000-000000000003'::UUID, '할랄 인증', 1)
ON CONFLICT (product_id, tag) DO NOTHING;
