import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, AlertCircle } from 'lucide-react';

const PaymentFail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center space-y-6">
          {/* 실패 아이콘 */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* 메시지 */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold hand-drawn-font text-[#800020]">
              결제 실패
            </h1>
            <p className="text-gray-600">
              결제 처리 중 문제가 발생했습니다.
            </p>
          </div>

          {/* 오류 정보 */}
          {(code || message) && (
            <div className="bg-red-50 rounded-2xl p-6 space-y-2 text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {code && (
                    <p className="text-sm text-gray-600">
                      오류 코드: <span className="font-mono font-bold">{code}</span>
                    </p>
                  )}
                  {message && (
                    <p className="text-sm text-gray-700 mt-1">{message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="text-sm text-gray-500 space-y-2 text-left">
            <p>• 카드 한도를 확인해주세요.</p>
            <p>• 입력하신 정보가 정확한지 확인해주세요.</p>
            <p>• 문제가 계속되면 고객센터로 문의해주세요.</p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate('/cart')}
              className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold hover:bg-[#600018] transition-colors"
            >
              장바구니로 돌아가기
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-[#800020] py-4 rounded-2xl font-bold border-2 border-[#800020] hover:bg-gray-50 transition-colors"
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
