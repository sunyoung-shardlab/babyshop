import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  // 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [loading, isLoggedIn, navigate]);

  // 로딩 중
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5C02] mx-auto"></div>
          <p className="mt-4 text-[#8F90A6]">로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-[#FAFAFC]">
        <ShoppingBag className="w-24 h-24 text-[#C7C9D9]" />
        <h2 className="text-2xl font-bold text-[#8F90A6]">장바구니가 비어있습니다</h2>
        <p className="text-[#8F90A6]">쇼핑을 시작해보세요!</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-[#FF5C02] text-white rounded-lg font-bold hover:bg-[#FF7022] transition-colors shadow-lg"
        >
          쇼핑 계속하기
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 bg-[#FAFAFC] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-6">
          장바구니 ({getTotalItems()}개)
        </h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-[#E7EBEF] flex gap-4"
            >
              {/* 상품 이미지 */}
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* 상품 정보 */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 text-[#1C1C1C]">{item.product.name}</h3>
                <p className="text-sm text-[#8F90A6] mb-2">{item.product.category}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#FF5C02]">
                    RM {item.product.price.toFixed(2)}
                  </span>
                  {item.product.originalPrice > item.product.price && (
                    <span className="text-sm text-[#8F90A6] line-through">
                      RM {item.product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* 수량 조절 & 삭제 */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-[#C7C9D9] hover:text-[#FF3B3B] transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 border border-[#E7EBEF] rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 hover:bg-[#F2F2F5] rounded disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-[#1C1C1C]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.maxOrder}
                    className="p-1 hover:bg-[#F2F2F5] rounded disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-[#8F90A6]">소계</p>
                  <p className="text-lg font-bold text-[#FF5C02]">
                    RM {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 합계 */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md border border-[#E7EBEF]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-[#555770]">상품 금액</span>
            <span className="text-lg text-[#1C1C1C]">RM {getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-[#555770]">배송비</span>
            <span className="text-lg text-[#06C270]">무료</span>
          </div>
          <div className="border-t border-[#E7EBEF] pt-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[#1C1C1C]">총 결제금액</span>
              <span className="text-2xl font-bold text-[#FF5C02]">
                RM {getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleCheckout}
            className="w-full bg-[#FF5C02] text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-[#FF7022] transition-colors"
          >
            결제하기 (RM {getTotalPrice().toFixed(2)})
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white text-[#FF5C02] py-4 rounded-lg font-bold border-2 border-[#FF5C02] hover:bg-[#FFF8E5] transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
