import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const paymentKey = searchParams.get('paymentKey');

  useEffect(() => {
    // 결제 성공 시 장바구니 비우기
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-[#E7EBEF] text-center space-y-6">
          {/* 성공 아이콘 */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[#E3FFF1] rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-16 h-16 text-[#06C270]" />
            </div>
          </div>

          {/* 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1C1C1C]">
              결제 성공!
            </h1>
            <p className="text-[#555770]">
              주문이 완료되었습니다.
            </p>
          </div>

          {/* 주문 정보 */}
          <div className="bg-[#F2F2F5] rounded-lg p-6 space-y-3 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-[#8F90A6]">주문번호</span>
              <span className="font-mono font-bold text-[#1C1C1C]">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8F90A6]">결제금액</span>
              <span className="font-bold text-[#FF5C02]">
                RM {amount ? Number(amount).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="text-sm text-[#8F90A6] space-y-2">
            <p>• 주문 내역은 마이페이지에서 확인하실 수 있습니다.</p>
            <p>• 상품은 4-5 영업일 내에 배송됩니다.</p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate('/mypage')}
              className="w-full bg-[#FF5C02] text-white py-4 rounded-lg font-bold hover:bg-[#FF7022] transition-colors"
            >
              주문 내역 보기
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-[#FF5C02] py-4 rounded-lg font-bold border-2 border-[#FF5C02] hover:bg-[#FFF8E5] transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
