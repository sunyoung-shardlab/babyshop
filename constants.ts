
import { Product, ContentTip } from './types';

export const COLORS = {
  primary: '#800020', // Burgundy/Burgundy-ish
  secondary: '#2F4F4F', // Dark Green
  kraft: '#F4F1EA',
  redAccent: '#EF4444',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pure Eat Organic Tteok-ppung (Original)',
    price: 18.50, // Approx MYR
    originalPrice: 35.00,
    image: 'https://picsum.photos/seed/baby1/400/400',
    category: 'Snacks',
    description: '100% Organic rice snack from Korea. Melt-in-mouth texture perfect for babies starting solids.',
    isHalal: true,
    stock: 8,
    maxOrder: 5,
    type: 'A'
  },
  {
    id: '2',
    name: 'Premium Bamboo Fiber Baby Romper',
    price: 45.00,
    originalPrice: 89.00,
    image: 'https://picsum.photos/seed/baby2/400/400',
    category: 'Apparel',
    description: 'Ultra-soft bamboo fiber clothing. Breathable and hypoallergenic for sensitive skin.',
    isHalal: false,
    stock: 15,
    maxOrder: 3,
    type: 'B',
    deadline: '2026-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Organic Strawberry Puff',
    price: 22.00,
    originalPrice: 40.00,
    image: 'https://picsum.photos/seed/baby3/400/400',
    category: 'Snacks',
    description: 'Tasty strawberry flavored organic puffs. No added sugar or artificial preservatives.',
    isHalal: true,
    stock: 5,
    maxOrder: 5,
    type: 'A'
  }
];

export const MOCK_TIPS: ContentTip[] = [
  {
    id: 'c1',
    title: 'How to start weaning at 6 months',
    thumbnail: 'https://picsum.photos/seed/tip1/400/250',
    description: 'A guide to introducing solids safely.',
    targetMonths: 6
  },
  {
    id: 'c2',
    title: 'Best snacks for finger dexterity',
    thumbnail: 'https://picsum.photos/seed/tip2/400/250',
    description: 'Help your baby develop fine motor skills.',
    targetMonths: 10
  }
];
