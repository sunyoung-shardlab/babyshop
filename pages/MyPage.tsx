
import React, { useState } from 'react';
import { Membership, Page } from '../types';
import { Settings, ChevronRight, Gift, History, CreditCard } from 'lucide-react';

interface MyPageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onNavigate: (page: Page) => void;
}

const MyPage: React.FC<MyPageProps> = ({ isLoggedIn, onLogin, onNavigate }) => {
  const [profile, setProfile] = useState({
    name: '클레어',
    level: Membership.Sprout,
    points: 100,
    babyAge: 14,
    babyPersonality: '얌전한 핑크'
  });

  if (!isLoggedIn) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">로그인 후 혜택을 확인하세요!</h2>
        <button onClick={onLogin} className="w-full py-4 bg-burgundy text-white rounded-xl font-bold">로그인 하기</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-xl font-bold">마이 페이지</h1>
        <Settings size={20} className="text-gray-400" />
      </div>

      {/* Profile Card */}
      <div className="p-6">
        <div className="bg-burgundy rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">상위 5% 엄마</span>
                <h2 className="text-2xl font-bold mt-1">{profile.name} 님</h2>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🌱</div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-xs mb-2">
                <span>{profile.level} 등급</span>
                <span>다음 등급까지 180P</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '35.7%' }}></div>
              </div>
              <p className="text-[10px] mt-2 opacity-80">
                ⚠️ 24일 뒤에 50P가 소멸될 예정이에요.
              </p>
            </div>
          </div>
          {/* Abstract background shape */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <CreditCard size={20} />, label: '주문내역' },
          { icon: <Gift size={20} />, label: '쿠폰함', val: '3' },
          { icon: <History size={20} />, label: '포인트' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 py-4 bg-white rounded-2xl border border-gray-50 shadow-sm cursor-pointer">
            <div className="text-burgundy">{item.icon}</div>
            <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
            {item.val && <span className="text-xs font-black text-burgundy">{item.val}</span>}
          </div>
        ))}
      </div>

      {/* Baby Info */}
      <div className="px-6 mb-8">
        <h3 className="font-bold mb-4 text-gray-800">우리 아이 프로필</h3>
        <div className="bg-craft/30 border border-craft rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">💖</div>
            <div>
              <p className="text-sm font-bold">{profile.babyAge}개월 ({profile.babyPersonality})</p>
              <p className="text-xs text-gray-500 mt-1">맞춤 상품 추천이 활성화 되었습니다.</p>
            </div>
            <ChevronRight className="ml-auto text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* List Menus */}
      <div className="px-6 space-y-2 pb-10">
        {['친구 초대하고 10% 할인받기', '리뷰 작성하고 포인트 쌓기', '멤버십 등급 혜택 안내', '공지사항'].map((menu, i) => (
          <button key={i} className="w-full flex justify-between items-center py-4 px-2 hover:bg-gray-50 rounded-xl transition">
            <span className={`text-sm ${i === 0 ? 'font-bold text-burgundy' : 'text-gray-700'}`}>{menu}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
