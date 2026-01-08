
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
    image: '/images/tteok-ppeong.png',
    category: 'Snacks',
    description: '100% 유기농 한국산 쌀 과자. 입에서 살살 녹는 질감으로 이유식 초기 아기에게 완벽합니다.',
    isHalal: true,
    stock: 8,
    maxOrder: 5,
    type: 'A'
  },
  {
    id: '2',
    name: '부드러운 아기 소고기 육포',
    price: 25.00,
    originalPrice: 30.00,
    image: '/images/beef-jerky.png',
    category: 'Snacks',
    description: '부드럽고 짜지 않은 아기 전용 소고기 육포. 고단백 영양 간식입니다.',
    isHalal: true,
    stock: 15,
    maxOrder: 5,
    type: 'B',
    deadline: '2026-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: '프리미엄 동결건조 요거트 큐브',
    price: 22.00,
    originalPrice: 40.00,
    image: '/images/yogurt-cubes.png',
    category: 'Snacks',
    description: '입안에서 사르르 녹는 동결건조 요거트. 4가지 유산균이 살아있습니다.',
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
