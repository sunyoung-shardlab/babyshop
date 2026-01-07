
import React from 'react';
import { Product, Page } from '../types';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartProps {
  items: { product: Product; quantity: number }[];
  onNavigate: (page: Page) => void;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onNavigate, onRemove, onUpdateQuantity }) => {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfaf7]">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 border-b border-gray-100 z-10">
        <button onClick={() => window.history.back()} className="p-1 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">장바구니</h2>
      </div>

      <div className="flex-1 p-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-500 mb-2">장바구니가 비어있습니다</p>
            <p className="text-xs text-gray-400 mb-6">아이를 위한 건강한 간식을 채워보세요.</p>
            <button 
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-burgundy text-white rounded-xl font-bold shadow-md transform active:scale-95 transition"
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1 pr-8">{item.product.name}</h3>
                    <p className="text-burgundy font-bold text-base mt-1">RM {item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50 overflow-hidden scale-90 origin-left">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="px-2 py-1 hover:bg-white transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="px-2 py-1 hover:bg-white transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-gray-400">Total: RM {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(item.product.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div className="mt-8 p-6 bg-burgundy/5 rounded-3xl space-y-4 border border-burgundy/10">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">총 상품 금액</span>
                 <span className="font-bold text-gray-800">RM {subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">배송비 (K-Global)</span>
                 <span className="font-bold text-gray-800">RM {deliveryFee.toFixed(2)}</span>
               </div>
               <div className="pt-4 border-t border-burgundy/10 flex justify-between items-center">
                 <span className="font-bold text-gray-800">결제 예정 금액</span>
                 <span className="text-xl font-black text-burgundy">RM {(subtotal + deliveryFee).toFixed(2)}</span>
               </div>
            </div>

            <div className="py-4 text-center">
               <p className="text-[10px] text-gray-400">말레이시아 전역 평균 7~10일 내 배송 완료됩니다.</p>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-5 z-20">
          <button 
            className="w-full py-4 bg-burgundy text-white rounded-2xl font-bold shadow-xl transform active:scale-[0.98] transition"
            onClick={() => alert('결제 게이트웨이 연동 중입니다.')}
          >
            RM {(subtotal + deliveryFee).toFixed(2)} 결제하기
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
