
import { Product, Membership } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: '퓨어잇 아이 떡뻥 (Halal)',
    price: 9.00,
    krPrice: 2500,
    image: 'https://picsum.photos/seed/snack1/400/400',
    type: 'regular',
    stock: 50,
    description: '100% 유기농 국산 쌀로 만든 아이들이 가장 좋아하는 영양 간식입니다.'
  },
  {
    id: '2',
    name: '[한정수량] 유기농 블루베리 퓨레',
    price: 15.00,
    krPrice: 4200,
    image: 'https://picsum.photos/seed/snack2/400/400',
    type: 'limited',
    stock: 8,
    deadline: '2026-02-01',
    description: '설탕 무첨가, 100% 생과일만 담은 프리미엄 퓨레입니다.'
  },
  {
    id: '3',
    name: '국민 육아템 밤부 원단 배냇저고리',
    price: 35.00,
    krPrice: 10000,
    image: 'https://picsum.photos/seed/cloth1/400/400',
    type: 'regular',
    stock: 100,
    description: '통기성이 뛰어난 밤부 소재로 제작되어 민감한 아기 피부에 최적입니다.'
  },
  {
    id: '4',
    name: '실리콘 무독성 치발기 세트',
    price: 25.00,
    krPrice: 7000,
    image: 'https://picsum.photos/seed/toy1/400/400',
    type: 'limited',
    stock: 5,
    deadline: '2025-05-10',
    description: '환경 호르몬 걱정 없는 안전한 실리콘 소재의 치발기입니다.'
  }
];

export const TIPS = [
  { id: 't1', title: '초보 맘을 위한 이유식 시작 가이드', author: '클레어', likes: 124 },
  { id: 't2', title: '말레이시아에서 한국 떡뻥이 인기 있는 이유', author: '육아고수', likes: 89 },
  { id: 't3', title: '우리 아이 올바른 수면 교육 방법', author: 'Dr. Kim', likes: 256 }
];

export const MEMBERSHIP_LIMITS = {
  [Membership.Sprout]: 0,
  [Membership.Flower]: 280, // Ringgit
  [Membership.Tree]: 1100,
  [Membership.Forest]: 2800
};

export const MEMBERSHIP_DISCOUNTS = {
  [Membership.Sprout]: 0,
  [Membership.Flower]: 0.03,
  [Membership.Tree]: 0.05,
  [Membership.Forest]: 0.10
};
