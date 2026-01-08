import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Package, Heart, LogOut } from 'lucide-react';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, signOut } = useAuth();

  // 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20">
      {/* 프로필 헤더 */}
      <div className="bg-white p-6 border-b border-[#E7EBEF]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#FF5C02] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1C1C1C]">{user.name}</h2>
            <p className="text-sm text-[#8F90A6]">{user.email}</p>
          </div>
        </div>

        {/* 포인트 */}
        <div className="mt-4 p-4 bg-[#FFF8E5] rounded-lg border border-[#FFDB43]">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#555770]">보유 포인트</span>
            <span className="text-2xl font-bold text-[#FF5C02]">{user.points}P</span>
          </div>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => navigate('/orders')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-[#E7EBEF] hover:bg-[#F2F2F5] transition-colors"
        >
          <Package className="text-[#FF5C02]" size={24} />
          <div className="flex-1 text-left">
            <h3 className="font-bold text-[#1C1C1C]">주문 내역</h3>
            <p className="text-sm text-[#8F90A6]">주문한 상품을 확인하세요</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/likes')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-[#E7EBEF] hover:bg-[#F2F2F5] transition-colors"
        >
          <Heart className="text-[#FF5C02]" size={24} />
          <div className="flex-1 text-left">
            <h3 className="font-bold text-[#1C1C1C]">찜한 상품</h3>
            <p className="text-sm text-[#8F90A6]">관심 상품을 확인하세요</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/review/1')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-[#E7EBEF] hover:bg-[#F2F2F5] transition-colors"
        >
          <UserIcon className="text-[#FF5C02]" size={24} />
          <div className="flex-1 text-left">
            <h3 className="font-bold text-[#1C1C1C]">리뷰 작성</h3>
            <p className="text-sm text-[#8F90A6]">구매한 상품 리뷰를 남겨주세요</p>
          </div>
        </button>
      </div>

      {/* 로그아웃 */}
      <div className="px-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white text-[#FF3B3B] rounded-lg border-2 border-[#FF3B3B] hover:bg-[#FFE5E5] transition-colors font-bold"
        >
          <LogOut size={20} />
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
