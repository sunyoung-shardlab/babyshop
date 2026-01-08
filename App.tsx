import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import ReviewEditor from './pages/ReviewEditor';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import { User } from './types';
import { getCurrentUser, onAuthStateChange, signOut } from './services/authService';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 사용자 확인
    getCurrentUser().then(user => {
      setAuthUser(user);
      if (user) {
        // Supabase 사용자를 앱 User 타입으로 변환
        setUser({
          id: user.id,
          name: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          babyAgeMonths: 12,
          babyGender: 'girl',
          halalRequired: false,
          interests: [],
          points: 100,
          membershipTier: 'Sprout',
          isLoggedIn: true
        });
      }
      setLoading(false);
    });

    // 인증 상태 변화 감지
    const { data: { subscription } } = onAuthStateChange((user) => {
      setAuthUser(user);
      if (user) {
        setUser({
          id: user.id,
          name: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          babyAgeMonths: 12,
          babyGender: 'girl',
          halalRequired: false,
          interests: [],
          points: 100,
          membershipTier: 'Sprout',
          isLoggedIn: true
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (authUser: any) => {
    setAuthUser(authUser);
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        babyAgeMonths: 12,
        babyGender: 'girl',
        halalRequired: false,
        interests: [],
        points: 100,
        membershipTier: 'Sprout',
        isLoggedIn: true
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthUser(null);
      window.location.hash = '#/';
    } catch (error: any) {
      alert('로그아웃에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFBF7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800020] mx-auto"></div>
          <p className="mt-4 text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/review/:id" element={<ReviewEditor />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />
          {/* Mock MyPage/Likes routes for navigation */}
          <Route path="/mypage" element={
            <div className="p-10 text-center">
              <h1 className="text-2xl font-bold hand-drawn-font">마이페이지</h1>
              <p className="mt-4 text-gray-500">포인트: {user?.points || 0}P</p>
              <p className="mt-2 text-sm text-gray-400">{user?.email}</p>
              <div className="mt-8 space-y-4">
                {user?.isLoggedIn && (
                  <>
                    <button 
                      onClick={() => window.location.hash = '#/review/1'} 
                      className="block w-full border p-4 rounded-xl hover:bg-gray-50"
                    >
                      간식 리뷰 작성하기
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full bg-red-500 text-white p-4 rounded-xl hover:bg-red-600"
                    >
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            </div>
          } />
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
    </CartProvider>
  );
};

export default App;
