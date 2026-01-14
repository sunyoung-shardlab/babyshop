
export interface Product {
  id: string;
  
  // 기본 정보
  name: string;
  sku?: string;
  brand?: string;
  category: string;
  
  // 가격 정보
  price: number; // 판매 가격 (할인 적용 후)
  original_price?: number; // 정가 (할인 전)
  is_on_sale: boolean; // 할인 여부
  
  // 판매 기한
  sale_start_date?: string;
  sale_end_date?: string; // NULL = 기한 없음
  
  // 재고 & 주문 제한
  stock_quantity: number;
  max_order_quantity: number;
  min_order_quantity?: number;
  
  // 이미지
  thumbnail_url: string; // 대표 이미지
  images?: ProductImage[]; // 상세 이미지들
  
  // 설명
  short_description?: string;
  description: string; // 상세 설명
  description_html?: string;
  
  // 배송 정보
  shipping_departure_date?: string; // 배송 출발일
  estimated_delivery_days?: number; // 배송 예상 소요 시간 (일)
  shipping_fee?: number;
  is_free_shipping?: boolean;
  
  // 제품 속성
  weight?: number;
  origin_country?: string;
  is_halal: boolean;
  
  // 판매 상태
  status: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  is_featured?: boolean;
  is_new?: boolean;
  
  // 통계
  view_count?: number;
  like_count?: number;
  sales_count?: number;
  
  // 기타
  tags?: string[];
  sort_order?: number;
  
  // 메타
  created_at?: string;
  updated_at?: string;
  
  // 호환성 (기존 코드용)
  originalPrice?: number; // = original_price
  image?: string; // = thumbnail_url
  stock?: number; // = stock_quantity
  maxOrder?: number; // = max_order_quantity
  type?: 'A' | 'B'; // deprecated
  deadline?: string; // = sale_end_date
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_thumbnail: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  name_ko?: string;
  name_en?: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductLike {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  babyAgeMonths: number;
  babyGender: 'boy' | 'girl';
  halalRequired: boolean;
  interests: string[];
  points: number;
  membershipTier: 'Sprout' | 'Flower' | 'Tree' | 'Forest';
  isLoggedIn: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  date: string;
}

export interface ContentTip {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  targetMonths: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
