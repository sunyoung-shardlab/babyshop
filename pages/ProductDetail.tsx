import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, COLORS } from '../constants';
import { ChevronLeft, Share2, Info, AlertTriangle, ShoppingCart, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) return <div className="p-10 text-center bg-[#FAFAFC] min-h-screen">상품을 찾을 수 없습니다</div>;

  const isGuest = !isLoggedIn;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

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
      <div className="aspect-square bg-[#F2F2F5] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Info Container */}
      <div className={`p-6 space-y-6 bg-[#FAFAFC] rounded-t-3xl -mt-6 relative z-10 ${isGuest ? 'overflow-hidden min-h-[500px]' : ''}`}>
        
        {isGuest && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md p-10 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#FF5C02] space-y-4">
                <h3 className="text-xl font-bold text-[#1C1C1C]">회원 특가!</h3>
                <p className="text-sm text-[#555770]">가입하시면 상세 정보와 특별 혜택을 확인하실 수 있습니다.</p>
                <Link to="/login" className="block w-full bg-[#FF5C02] text-white py-3 rounded-lg font-bold hover:bg-[#FF7022] transition-colors">
                  3초만에 가입하기
                </Link>
                <p className="text-[10px] text-[#8F90A6]">10% 환영 쿠폰 즉시 발급</p>
             </div>
          </div>
        )}

        <div className={isGuest ? 'blurred-guest' : 'space-y-6'}>
          {/* Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold leading-tight text-[#1C1C1C]">{product.name}</h1>
              {product.isHalal && (
                <span className="flex-shrink-0 bg-[#E3FFF1] text-[#06C270] text-[10px] px-2 py-1 rounded-full font-bold">HALAL</span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#FF5C02]">RM {product.price.toFixed(2)}</span>
              <span className="text-sm text-[#8F90A6] line-through">RM {product.originalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Urgent Tags */}
          <div className="space-y-2">
            {product.stock < 10 && (
              <div className="flex items-center gap-2 text-[#FF8800] text-sm font-bold bg-[#FFF8E5] p-3 rounded-lg border border-[#FFDB43]">
                <AlertTriangle size={16} /> 재고 {product.stock}개만 남았습니다!
              </div>
            )}
            {product.type === 'B' && (
              <div className="flex items-center gap-2 text-[#FF5C02] text-sm font-bold bg-[#FFE5E5] p-3 rounded-lg border border-[#FFC9AB]">
                <Clock size={16} /> 특가 종료까지: 02일 14시간 22분
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4 border-y border-[#E7EBEF]">
            <span className="font-bold text-[#1C1C1C]">수량</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-[#E7EBEF] rounded-lg flex items-center justify-center font-bold hover:bg-[#F2F2F5] transition-colors"
              >
                -
              </button>
              <span className="font-bold text-lg text-[#1C1C1C]">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.maxOrder, quantity + 1))}
                className="w-10 h-10 border border-[#E7EBEF] rounded-lg flex items-center justify-center font-bold hover:bg-[#F2F2F5] transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-[10px] text-[#8F90A6] text-right">1인당 최대 {product.maxOrder}개</p>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2 text-[#1C1C1C]">
              <Info size={18} /> 상품 정보
            </h3>
            <p className="text-sm text-[#555770] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Delivery Info */}
          <div className="bg-white p-4 rounded-lg border border-[#E7EBEF] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8F90A6]">배송지</span>
              <span className="font-bold text-[#1C1C1C]">쿠알라룸푸르 창고</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8F90A6]">배송 예상</span>
              <span className="font-bold text-[#1C1C1C]">4-5 영업일</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {!isGuest && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-white/80 backdrop-blur border-t border-[#E7EBEF] z-50">
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border-2 border-[#FF5C02] text-[#FF5C02] py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#FFC9AB] transition-colors"
            >
              <ShoppingCart size={20} /> 장바구니
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-[2] bg-[#FF5C02] text-white py-4 rounded-lg font-bold shadow-lg hover:bg-[#FF7022] transition-colors"
            >
              결제하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
