
import { Product, ContentTip } from './types';

export const COLORS = {
  primary: '#FF5C02', // Primary Orange from Figma
  primaryLight: '#FFC9AB', // Light Orange
  secondary: '#4A4A4A', // Dark Gray
  background: '#FAFAFC', // Light Background
  backgroundLight: '#FFFFFF',
  text: '#1C1C1C',
  textSecondary: '#555770',
  textGray: '#8F90A6',
  white: '#FFFFFF',
  gray: '#C7C9D9',
  lightGray: '#F2F2F5',
  border: '#E7EBEF',
  success: '#06C270',
  error: '#FF3B3B',
  kraft: '#F4F1EA', // Keep for compatibility
  redAccent: '#EF4444', // Keep for compatibility
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '퓨어잇 유기농 떡뻥 (오리지널)',
    price: 18.50, // Approx MYR
    originalPrice: 35.00,
    image: 'https://picsum.photos/seed/baby1/400/400',
    category: 'Snacks',
    description: '100% 유기농 한국산 쌀 과자. 입에서 살살 녹는 질감으로 이유식 초기 아기에게 완벽합니다.',
    isHalal: true,
    stock: 8,
    maxOrder: 5,
    type: 'A'
  },
  {
    id: '2',
    name: '프리미엄 대나무 섬유 아기 우주복',
    price: 45.00,
    originalPrice: 89.00,
    image: 'https://picsum.photos/seed/baby2/400/400',
    category: 'Apparel',
    description: '초부드러운 대나무 섬유 의류. 통기성이 좋고 민감한 피부에 저자극적입니다.',
    isHalal: false,
    stock: 15,
    maxOrder: 3,
    type: 'B',
    deadline: '2026-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: '유기농 딸기 퍼프',
    price: 22.00,
    originalPrice: 40.00,
    image: 'https://picsum.photos/seed/baby3/400/400',
    category: 'Snacks',
    description: '맛있는 딸기 맛 유기농 퍼프. 첨가 설탕이나 인공 방부제가 없습니다.',
    isHalal: true,
    stock: 5,
    maxOrder: 5,
    type: 'A'
  }
];

export const MOCK_TIPS: ContentTip[] = [
  {
    id: 'c1',
    title: '6개월 이유식 시작하는 방법',
    thumbnail: 'https://picsum.photos/seed/tip1/400/250',
    description: '안전하게 이유식을 시작하는 가이드.',
    targetMonths: 6
  },
  {
    id: 'c2',
    title: '손가락 발달에 좋은 최고의 간식',
    thumbnail: 'https://picsum.photos/seed/tip2/400/250',
    description: '아기의 소근육 발달을 돕는 방법.',
    targetMonths: 10
  }
];
