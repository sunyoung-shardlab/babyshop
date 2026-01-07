
import React, { useState } from 'react';
import { Product, Page } from '../types';
import { ArrowLeft, ShoppingCart, Share2, Heart, ShieldCheck } from 'lucide-react';

interface ProductDetailProps {
  product: Product | null;
  isLoggedIn: boolean;
  onLogin: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, isLoggedIn, onLogin, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) return <div className="p-10 text-center">상품 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="relative">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 py-3 flex justify-between items-center border-b border-gray-50">
        <button onClick={() => window.history.back()}><ArrowLeft size={24} /></button>
        <h2 className="text-sm font-bold line-clamp-1 max-w-[200px]">{product.name}</h2>
        <div className="flex gap-4">
          <Share2 size={20} className="text-gray-600" />
          <Heart 
            size={20} 
            className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
            onClick={() => setIsLiked(!isLiked)} 
          />
        </div>
      </div>

      {/* Main Image */}
      <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />

      {/* Login Gate for Content */}
      <div className={`relative ${!isLoggedIn ? 'min-h-[400px]' : ''}`}>
        {!isLoggedIn && (
          <div className="absolute inset-0 z-10 backdrop-blur-md flex flex-col items-center justify-center p-8 bg-white/30">
            <div className="bg-white p-6 rounded-3xl shadow-xl text-center max-w-[280px]">
              <h3 className="text-lg font-bold text-burgundy mb-2">회원 전용 상세 정보</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                3초만에 회원가입하고 상세 리뷰와 한정 핫딜 혜택을 확인하세요!
              </p>
              <button 
                onClick={onLogin}
                className="w-full py-3 bg-burgundy text-white rounded-xl font-bold shadow-md"
              >
                로그인하고 계속 보기
              </button>
            </div>
          </div>
        )}

        <div className={`p-6 ${!isLoggedIn ? 'blur-[8px]' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${product.type === 'limited' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {product.type === 'limited' ? '한정 핫딜' : '상시 구매'}
            </span>
            {product.stock < 10 && <span className="text-xs text-red-500 font-bold">재고 {product.stock}개 미만!</span>}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-burgundy">RM {product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400">(약 ₩{product.krPrice.toLocaleString()})</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl mb-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-green-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Halal Certified & Organic</p>
              <p className="text-[10px] text-gray-500">한국 프리미엄 유기농 인증 완료</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold mb-2">상품 설명</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-t border-gray-100">
              <span className="text-sm font-medium">수량 선택 (인당 최대 5개)</span>
              <div className="flex items-center border rounded-lg bg-white overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-xl font-medium border-r hover:bg-gray-50"
                >-</button>
                <span className="px-5 font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="px-3 py-1 text-xl font-medium border-l hover:bg-gray-50"
                >+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/80 backdrop-blur-md flex gap-3 z-50 shadow-lg border-t border-gray-100">
        <button className="p-4 rounded-xl border border-gray-200 text-gray-400">
          <Heart size={20} />
        </button>
        <button 
          onClick={() => onAddToCart(product, quantity)}
          className="flex-1 bg-burgundy text-white font-bold rounded-xl flex items-center justify-center gap-2 transform active:scale-[0.98] transition"
        >
          <ShoppingCart size={20} />
          <span>장바구니 담기</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
