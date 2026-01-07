
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import ReviewEditor from './pages/ReviewEditor';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const mockLogin = () => {
    setUser({
      id: 'u1',
      name: 'Sarah',
      email: 'sarah@example.com',
      babyAgeMonths: 12,
      babyGender: 'girl',
      halalRequired: true,
      interests: ['Snacks', 'Apparel'],
      points: 100,
      membershipTier: 'Sprout',
      isLoggedIn: true
    });
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail user={user} />} />
          <Route path="/login" element={<Login onLogin={mockLogin} />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/review/:id" element={<ReviewEditor />} />
          {/* Mock MyPage/Likes routes for navigation */}
          <Route path="/mypage" element={<div className="p-10 text-center"><h1 className="text-2xl font-bold hand-drawn-font">마이페이지</h1><p className="mt-4 text-gray-500">포인트: {user?.points || 0}P</p><div className="mt-8 space-y-4">{user?.isLoggedIn && <button onClick={() => window.location.hash = '#/review/1'} className="block w-full border p-4 rounded-xl">간식 리뷰 작성하기</button>}</div></div>} />
          <Route path="/likes" element={<div className="p-10 text-center text-gray-400">찜한 상품이 없습니다.</div>} />
          <Route path="/products" element={<div className="p-10 text-center text-gray-400">전체 카탈로그 준비 중입니다!</div>} />
          <Route path="/welcome-coupon" element={
            <div className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-[#800020] text-white rounded-full flex items-center justify-center text-3xl font-bold animate-bounce">10%</div>
              <h1 className="text-2xl font-bold">환영 쿠폰!</h1>
              <p className="text-sm text-gray-500">가입이 완료되었습니다. 10% 할인 쿠폰이 계정에 추가되었습니다.</p>
              <button onClick={() => window.location.hash = '#/'} className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-xl">쇼핑 시작하기</button>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
