
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
          <Route path="/mypage" element={<div className="p-10 text-center"><h1 className="text-2xl font-bold hand-drawn-font">My Page</h1><p className="mt-4 text-gray-500">Points: {user?.points || 0}P</p><div className="mt-8 space-y-4">{user?.isLoggedIn && <button onClick={() => window.location.hash = '#/review/1'} className="block w-full border p-4 rounded-xl">Write Review for snack</button>}</div></div>} />
          <Route path="/likes" element={<div className="p-10 text-center text-gray-400">No liked items yet.</div>} />
          <Route path="/products" element={<div className="p-10 text-center text-gray-400">Full catalog coming soon!</div>} />
          <Route path="/welcome-coupon" element={
            <div className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 bg-[#800020] text-white rounded-full flex items-center justify-center text-3xl font-bold animate-bounce">10%</div>
              <h1 className="text-2xl font-bold">Welcome Coupon!</h1>
              <p className="text-sm text-gray-500">You've successfully signed up. A 10% discount coupon has been added to your account.</p>
              <button onClick={() => window.location.hash = '#/'} className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-xl">Start Shopping</button>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
