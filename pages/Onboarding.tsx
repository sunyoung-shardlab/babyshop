
import React from 'react';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col h-screen bg-[#fcfaf7]">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 mb-6 bg-burgundy rounded-full flex items-center justify-center text-white text-4xl">
          🍼
        </div>
        <h1 className="text-3xl font-bold text-burgundy mb-4 leading-tight">
          퀄리티와 가격<br/>모두 타협하지 마세요.
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          한국 아기용품 트렌드를 한눈에!<br/>
          매주 업데이트되는 핫딜을 만나보세요.
        </p>
        
        <div className="space-y-4 w-full">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <span className="text-2xl">✨</span>
            <p className="text-sm font-medium text-left">회원가입 즉시 5% 웰컴 쿠폰!!</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <span className="text-2xl">📈</span>
            <p className="text-sm font-medium text-left">구매할수록 커지는 멤버십 혜택</p>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <button 
          onClick={onStart}
          className="w-full py-4 bg-burgundy text-white rounded-2xl font-bold shadow-lg text-lg transform transition active:scale-95"
        >
          3초만에 시작하기
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
