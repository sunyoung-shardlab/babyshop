
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  description: string;
  isHalal: boolean;
  stock: number;
  maxOrder: number;
  type: 'A' | 'B'; // A: Regular, B: Time-limited
  deadline?: string;
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
