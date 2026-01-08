import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ChevronLeft, MapPin, User, Phone } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    postcode: '',
    memo: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.');
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    // 입력 검증
    if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // 토스페이먼츠 초기화
      const tossPayments = await loadTossPayments(
        import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
      );

      // 주문 ID 생성 (실제로는 서버에서 생성)
      const orderId = `ORDER_${Date.now()}`;
      const orderName = cart.length > 1 
        ? `${cart[0].product.name} 외 ${cart.length - 1}건`
        : cart[0].product.name;

      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount: getTotalPrice(),
        orderId: orderId,
        orderName: orderName,
        customerName: orderInfo.name,
        customerMobilePhone: orderInfo.phone,
        successUrl: `${window.location.origin}/#/payment/success`,
        failUrl: `${window.location.origin}/#/payment/fail`,
      });
    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">주문/결제</h1>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* 배송 정보 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MapPin className="text-[#800020]" size={20} />
            배송 정보
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                받는 사람 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={orderInfo.name}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={orderInfo.phone}
                onChange={handleInputChange}
                placeholder="010-1234-5678"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={orderInfo.address}
                onChange={handleInputChange}
                placeholder="도로명 주소"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                상세 주소
              </label>
              <input
                type="text"
                name="detailAddress"
                value={orderInfo.detailAddress}
                onChange={handleInputChange}
                placeholder="상세 주소"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                배송 메모
              </label>
              <textarea
                name="memo"
                value={orderInfo.memo}
                onChange={handleInputChange}
                placeholder="배송 시 요청사항을 입력하세요"
                rows={3}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#800020] outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold">주문 상품 ({cart.length}개)</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 pb-3 border-b last:border-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                  <p className="text-lg font-bold text-[#800020] mt-1">
                    RM {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold">결제 금액</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>상품 금액</span>
              <span>RM {getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>배송비</span>
              <span className="text-green-600">무료</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-xl font-bold">총 결제금액</span>
              <span className="text-2xl font-bold text-[#800020]">
                RM {getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 주문 동의 */}
        <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600">
          <p>결제하기 버튼을 누르시면 주문 내용 확인 및 결제 대행 서비스 약관에 동의한 것으로 간주합니다.</p>
        </div>
      </div>

      {/* 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-4xl mx-auto">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#600018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? '처리 중...' : `RM ${getTotalPrice().toFixed(2)} 결제하기`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
