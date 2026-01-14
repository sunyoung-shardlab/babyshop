import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ContentDetail from './pages/ContentDetail';
import Products from './pages/Products';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import ReviewEditor from './pages/ReviewEditor';
import MyPage from './pages/MyPage';
import Cart from './pages/Cart';
import Likes from './pages/Likes';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Lazy load Checkout (Toss Payments SDK 필요)
const Checkout = lazy(() => import('./pages/Checkout'));

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5C02] mx-auto"></div>
          <p className="mt-4 text-[#8F90A6]">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/review/:id" element={<ReviewEditor />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5C02]"></div></div>}>
              <Checkout />
            </Suspense>
          } />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/welcome-coupon" element={
            <div className="p-10 flex flex-col items-center text-center space-y-6 bg-[#FAFAFC] min-h-screen">
              <div className="w-24 h-24 bg-[#FF5C02] text-white rounded-full flex items-center justify-center text-3xl font-bold animate-bounce">10%</div>
              <h1 className="text-2xl font-bold text-[#1C1C1C]">환영 쿠폰!</h1>
              <p className="text-sm text-[#555770]">가입이 완료되었습니다. 10% 할인 쿠폰이 계정에 추가되었습니다.</p>
              <button onClick={() => window.location.hash = '#/'} className="w-full bg-[#FF5C02] text-white py-4 rounded-lg font-bold shadow-xl hover:bg-[#FF7022] transition-colors">쇼핑 시작하기</button>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
