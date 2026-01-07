
export type Page = 'onboarding' | 'home' | 'product-detail' | 'cart' | 'mypage' | 'review' | 'login';

export interface Product {
  id: string;
  name: string;
  price: number; // in RM (Ringgit)
  krPrice: number; // in KRW
  image: string;
  type: 'regular' | 'limited';
  stock: number;
  deadline?: string;
  description: string;
}

export interface UserProfile {
  id: string;
  babyAge: number; // months
  babyGender: 'boy' | 'girl';
  halalRequired: boolean;
  personality: 'active' | 'calm' | 'smiling' | 'shy';
  address: string;
  phone: string;
}

export interface Coupon {
  id: string;
  name: string;
  discount: number; // percentage
  expiryDate: string;
  isActive: boolean;
}

export enum Membership {
  Sprout = '새싹',
  Flower = '꽃',
  Tree = '나무',
  Forest = '숲'
}
