import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, AlertCircle } from 'lucide-react';

const PaymentFail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-[#E7EBEF] text-center space-y-6">
          {/* 실패 아이콘 */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[#FFE5E5] rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-[#FF3B3B]" />
            </div>
          </div>

          {/* 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1C1C1C]">
              결제 실패
            </h1>
            <p className="text-[#555770]">
              결제 처리 중 문제가 발생했습니다.
            </p>
          </div>

          {/* 오류 정보 */}
          {(code || message) && (
            <div className="bg-[#FFE5E5] rounded-lg p-6 space-y-2 text-left border border-[#FF8080]">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF3B3B] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {code && (
                    <p className="text-sm text-[#555770]">
                      오류 코드: <span className="font-mono font-bold text-[#1C1C1C]">{code}</span>
                    </p>
                  )}
                  {message && (
                    <p className="text-sm text-[#1C1C1C] mt-1">{message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="text-sm text-[#8F90A6] space-y-2 text-left">
            <p>• 카드 한도를 확인해주세요.</p>
            <p>• 입력하신 정보가 정확한지 확인해주세요.</p>
            <p>• 문제가 계속되면 고객센터로 문의해주세요.</p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-[#FF5C02] text-white py-4 rounded-lg font-bold hover:bg-[#FF7022] transition-colors"
            >
              장바구니로 돌아가기
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

export default PaymentFail;
