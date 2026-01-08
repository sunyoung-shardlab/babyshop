import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <ShoppingBag className="w-24 h-24 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-400">장바구니가 비어있습니다</h2>
        <p className="text-gray-500">쇼핑을 시작해보세요!</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-[#800020] text-white rounded-2xl font-bold hover:bg-[#600018] transition-colors"
        >
          쇼핑 계속하기
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold hand-drawn-font text-[#800020] mb-6">
          장바구니 ({getTotalItems()}개)
        </h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex gap-4"
            >
              {/* 상품 이미지 */}
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-xl"
              />

              {/* 상품 정보 */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#800020]">
                    RM {item.product.price.toFixed(2)}
                  </span>
                  {item.product.originalPrice > item.product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      RM {item.product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* 수량 조절 & 삭제 */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 border rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.maxOrder}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">소계</p>
                  <p className="text-lg font-bold text-[#800020]">
                    RM {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 합계 */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">상품 금액</span>
            <span className="text-lg">RM {getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-600">배송비</span>
            <span className="text-lg text-green-600">무료</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">총 결제금액</span>
              <span className="text-2xl font-bold text-[#800020]">
                RM {getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleCheckout}
            className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#600018] transition-colors"
          >
            결제하기 (RM {getTotalPrice().toFixed(2)})
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white text-[#800020] py-4 rounded-2xl font-bold border-2 border-[#800020] hover:bg-gray-50 transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
