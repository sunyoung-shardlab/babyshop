import { ProductReview, ProductReviewImage } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase env not configured');
  }

  const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  return await res.json();
}

export type ReviewListItem = ProductReview & {
  cover_image_url?: string;
  all_images?: ProductReviewImage[];
};

type PublicProfile = {
  id: string;
  display_name?: string;
  avatar_url?: string;
};

export async function getProductReviews(productId: string): Promise<ReviewListItem[]> {
  const reviews = (await supabaseFetch(
    `/product_reviews?product_id=eq.${productId}&select=id,product_id,user_id,rating,title,comment,body_text,is_verified_purchase,helpful_count,created_at,updated_at,summary_text,highlight_tags,author_name,author_avatar_url&order=created_at.desc`
  )) as ProductReview[];

  if (!reviews || reviews.length === 0) return [];

  const ids = reviews.map(r => r.id);
  const idList = ids.join(',');
  const images = (await supabaseFetch(
    `/product_review_images?review_id=in.(${idList})&select=id,review_id,image_url,kind,sort_order,created_at&order=sort_order.asc`
  )) as ProductReviewImage[];

  // Fetch public profiles for author avatars/names
  const userIds = Array.from(new Set(reviews.map(r => r.user_id))).join(',');
  const profiles = (await supabaseFetch(
    `/public_profiles?id=in.(${userIds})&select=id,display_name,avatar_url`
  )) as PublicProfile[];
  const profileById = new Map<string, PublicProfile>();
  (profiles || []).forEach(p => profileById.set(p.id, p));

  const imagesByReview = new Map<string, ProductReviewImage[]>();
  (images || []).forEach(img => {
    if (!imagesByReview.has(img.review_id)) imagesByReview.set(img.review_id, []);
    imagesByReview.get(img.review_id)!.push(img);
  });

  return reviews.map(r => {
    const imgs = imagesByReview.get(r.id) || [];
    const cover =
      imgs.find(i => i.kind === 'cover')?.image_url ??
      imgs.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;

    const prof = profileById.get(r.user_id);
    const authorName = prof?.display_name || r.author_name;
    const authorAvatar = prof?.avatar_url || r.author_avatar_url;
    return {
      ...r,
      highlight_tags: (r.highlight_tags || []).slice(0, 3),
      all_images: imgs,
      cover_image_url: cover,
      author_name: authorName,
      author_avatar_url: authorAvatar,
    };
  });
}

export async function getReviewById(reviewId: string): Promise<ReviewListItem | null> {
  const rows = (await supabaseFetch(
    `/product_reviews?id=eq.${reviewId}&select=id,product_id,user_id,rating,title,comment,body_text,is_verified_purchase,helpful_count,created_at,updated_at,summary_text,highlight_tags,author_name,author_avatar_url&limit=1`
  )) as ProductReview[];

  if (!rows || rows.length === 0) return null;
  const review = rows[0];

  const images = (await supabaseFetch(
    `/product_review_images?review_id=eq.${reviewId}&select=id,review_id,image_url,kind,sort_order,created_at&order=sort_order.asc`
  )) as ProductReviewImage[];

  const profiles = (await supabaseFetch(
    `/public_profiles?id=eq.${review.user_id}&select=id,display_name,avatar_url&limit=1`
  )) as PublicProfile[];
  const prof = profiles?.[0];

  const cover =
    (images || []).find(i => i.kind === 'cover')?.image_url ??
    (images || [])[0]?.image_url;

  return {
    ...review,
    highlight_tags: (review.highlight_tags || []).slice(0, 3),
    all_images: images || [],
    cover_image_url: cover,
    author_name: prof?.display_name || review.author_name,
    author_avatar_url: prof?.avatar_url || review.author_avatar_url,
  };
}

/**
 * Get all reviews (for home page display)
 */
export async function getAllReviews(limit: number = 10): Promise<ReviewListItem[]> {
  const reviews = (await supabaseFetch(
    `/product_reviews?select=id,product_id,user_id,rating,title,comment,body_text,is_verified_purchase,helpful_count,created_at,updated_at,summary_text,highlight_tags,author_name,author_avatar_url&order=created_at.desc&limit=${limit}`
  )) as ProductReview[];

  if (!reviews || reviews.length === 0) return [];

  const ids = reviews.map(r => r.id);
  const idList = ids.join(',');
  const images = (await supabaseFetch(
    `/product_review_images?review_id=in.(${idList})&select=id,review_id,image_url,kind,sort_order,created_at&order=sort_order.asc`
  )) as ProductReviewImage[];

  // Fetch public profiles for author avatars/names
  const userIds = Array.from(new Set(reviews.map(r => r.user_id))).join(',');
  const profiles = (await supabaseFetch(
    `/public_profiles?id=in.(${userIds})&select=id,display_name,avatar_url`
  )) as PublicProfile[];
  const profileById = new Map<string, PublicProfile>();
  (profiles || []).forEach(p => profileById.set(p.id, p));

  const imagesByReview = new Map<string, ProductReviewImage[]>();
  (images || []).forEach(img => {
    if (!imagesByReview.has(img.review_id)) imagesByReview.set(img.review_id, []);
    imagesByReview.get(img.review_id)!.push(img);
  });

  return reviews.map(r => {
    const imgs = imagesByReview.get(r.id) || [];
    const cover =
      imgs.find(i => i.kind === 'cover')?.image_url ??
      imgs.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;

    const prof = profileById.get(r.user_id);
    const authorName = prof?.display_name || r.author_name;
    const authorAvatar = prof?.avatar_url || r.author_avatar_url;
    return {
      ...r,
      highlight_tags: (r.highlight_tags || []).slice(0, 3),
      all_images: imgs,
      cover_image_url: cover,
      author_name: authorName,
      author_avatar_url: authorAvatar,
    };
  });
}

