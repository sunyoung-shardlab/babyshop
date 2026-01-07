
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, COLORS } from '../constants';
// Added Clock to the imports from lucide-react
import { ChevronLeft, Share2, Info, AlertTriangle, ShoppingCart, Clock } from 'lucide-react';
import { User } from '../types';

interface ProductDetailProps {
  user: User | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) return <div className="p-10 text-center">상품을 찾을 수 없습니다</div>;

  const isGuest = !user?.isLoggedIn;

  return (
    <div className="animate-fadeIn">
      {/* Top Bar */}
      <div className="p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-10 max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/80 backdrop-blur rounded-full">
          <ChevronLeft size={20} />
        </button>
        <button className="p-2 bg-white/80 backdrop-blur rounded-full">
          <Share2 size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Info Container */}
      <div className={`p-6 space-y-6 bg-white rounded-t-3xl -mt-6 relative z-10 ${isGuest ? 'overflow-hidden min-h-[500px]' : ''}`}>
        
        {isGuest && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md p-10 text-center">
             <div className="kraft-paper p-8 rounded-2xl shadow-xl border border-dashed border-[#800020] space-y-4">
                <h3 className="text-xl font-bold hand-drawn-font">회원 특가!</h3>
                <p className="text-sm text-gray-600">가입하시면 상세 정보와 특별 혜택을 확인하실 수 있습니다.</p>
                <Link to="/login" className="block w-full bg-[#800020] text-white py-3 rounded-xl font-bold">
                  3초만에 가입하기
                </Link>
                <p className="text-[10px] text-gray-400">10% 환영 쿠폰 즉시 발급</p>
             </div>
          </div>
        )}

        <div className={isGuest ? 'blurred-guest' : 'space-y-6'}>
          {/* Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
              {product.isHalal && (
                <span className="flex-shrink-0 bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold">HALAL</span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#800020]">RM {product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-400 line-through">RM {product.originalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Urgent Tags */}
          <div className="space-y-2">
            {product.stock < 10 && (
              <div className="flex items-center gap-2 text-orange-600 text-sm font-bold bg-orange-50 p-2 rounded-lg">
                <AlertTriangle size={16} /> 재고 {product.stock}개만 남았습니다!
              </div>
            )}
            {product.type === 'B' && (
              <div className="flex items-center gap-2 text-[#800020] text-sm font-bold bg-pink-50 p-2 rounded-lg">
                <Clock size={16} /> 특가 종료까지: 02일 14시간 22분
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4 border-y">
            <span className="font-bold">수량</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-full flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.maxOrder, quantity + 1))}
                className="w-10 h-10 border rounded-full flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 text-right">1인당 최대 {product.maxOrder}개</p>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Info size={18} /> 상품 정보
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">배송지</span>
              <span className="font-bold text-gray-700">쿠알라룸푸르 창고</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">배송 예상</span>
              <span className="font-bold text-gray-700">4-5 영업일</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {!isGuest && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur border-t z-50">
          <div className="flex gap-4">
            <button className="flex-1 border-2 border-[#800020] text-[#800020] py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <ShoppingCart size={20} /> 장바구니
            </button>
            <button className="flex-[2] bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-xl">
              바로 구매
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
