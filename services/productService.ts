import { supabase } from './authService';
import { Product, ProductImage, ProductCategory } from '../types';

/**
 * 제품을 DB 형식에서 앱 형식으로 변환
 */
function transformProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    sku: dbProduct.sku,
    brand: dbProduct.brand,
    category: dbProduct.category,
    
    // 가격
    price: parseFloat(dbProduct.sale_price || dbProduct.price),
    original_price: dbProduct.original_price ? parseFloat(dbProduct.original_price) : undefined,
    is_on_sale: dbProduct.is_on_sale,
    sale_price: dbProduct.sale_price ? parseFloat(dbProduct.sale_price) : undefined,
    
    // 기한
    sale_start_date: dbProduct.sale_start_date,
    sale_end_date: dbProduct.sale_end_date,
    
    // 재고
    stock_quantity: dbProduct.stock_quantity,
    max_order_quantity: dbProduct.max_order_quantity,
    min_order_quantity: dbProduct.min_order_quantity,
    
    // 이미지
    thumbnail_url: dbProduct.thumbnail_url,
    
    // 설명
    short_description: dbProduct.short_description,
    description: dbProduct.description,
    description_html: dbProduct.description_html,
    
    // 배송
    shipping_departure_date: dbProduct.shipping_departure_date,
    estimated_delivery_days: dbProduct.estimated_delivery_days,
    shipping_fee: dbProduct.shipping_fee ? parseFloat(dbProduct.shipping_fee) : 0,
    is_free_shipping: dbProduct.is_free_shipping,
    
    // 속성
    weight: dbProduct.weight ? parseFloat(dbProduct.weight) : undefined,
    origin_country: dbProduct.origin_country,
    is_halal: dbProduct.is_halal,
    
    // 상태
    status: dbProduct.status,
    is_featured: dbProduct.is_featured,
    is_new: dbProduct.is_new,
    
    // 통계
    view_count: dbProduct.view_count,
    like_count: dbProduct.like_count,
    sales_count: dbProduct.sales_count,
    
    sort_order: dbProduct.sort_order,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    
    // 호환성 속성 (기존 코드용)
    originalPrice: dbProduct.original_price ? parseFloat(dbProduct.original_price) : undefined,
    image: dbProduct.thumbnail_url,
    stock: dbProduct.stock_quantity,
    maxOrder: dbProduct.max_order_quantity,
    type: dbProduct.sale_end_date ? 'B' : 'A',
    deadline: dbProduct.sale_end_date,
  };
}

/**
 * 모든 활성 제품 조회
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('제품 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 제품 조회 (ID로)
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return transformProduct(data);
  } catch (error) {
    console.error('제품 조회 실패:', error);
    return null;
  }
}

/**
 * 제품 상세 이미지 조회
 */
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('제품 이미지 조회 실패:', error);
    return [];
  }
}

/**
 * 제품 태그 조회
 */
export async function getProductTags(productId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('product_tags')
      .select('tag')
      .eq('product_id', productId);

    if (error) throw error;
    
    return (data || []).map(item => item.tag);
  } catch (error) {
    console.error('제품 태그 조회 실패:', error);
    return [];
  }
}

/**
 * 카테고리별 제품 조회
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('카테고리별 제품 조회 실패:', error);
    return [];
  }
}

/**
 * 타임딜 제품 조회 (판매 기한이 있는 제품)
 */
export async function getTimeDealProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .not('sale_end_date', 'is', null)
      .gte('sale_end_date', new Date().toISOString())
      .is('deleted_at', null)
      .order('sale_end_date', { ascending: true });

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('타임딜 제품 조회 실패:', error);
    return [];
  }
}

/**
 * 일반 제품 조회 (판매 기한 없는 제품)
 */
export async function getRegularProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .is('sale_end_date', null)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('일반 제품 조회 실패:', error);
    return [];
  }
}

/**
 * 추천 제품 조회
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .eq('is_featured', true)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .limit(10);

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('추천 제품 조회 실패:', error);
    return [];
  }
}

/**
 * 신상품 조회
 */
export async function getNewProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .eq('is_new', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('신상품 조회 실패:', error);
    return [];
  }
}

/**
 * 제품 조회수 증가
 */
export async function incrementProductView(productId: string): Promise<void> {
  try {
    await supabase.rpc('increment_product_view', { product_id: productId });
  } catch (error) {
    console.error('조회수 증가 실패:', error);
  }
}

/**
 * 모든 카테고리 조회
 */
export async function getAllCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return [];
  }
}

/**
 * 제품 검색
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .order('sort_order', { ascending: true })
      .limit(50);

    if (error) throw error;
    
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('제품 검색 실패:', error);
    return [];
  }
}
