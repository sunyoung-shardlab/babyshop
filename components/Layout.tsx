import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, User, Heart, ShoppingCart } from 'lucide-react';
import { COLORS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  const handleCartClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#FAFAFC] shadow-xl relative">
      {/* Header */}
      <header className="p-4 border-b border-[#E7EBEF] flex justify-between items-center bg-white sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-[#FF5C02]">
          K-Baby Malaysia
        </Link>
        <Link to="/cart" onClick={handleCartClick} className="p-2 relative">
          <ShoppingCart size={24} color={COLORS.primary} />
          {isLoggedIn && cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FF3B3B] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-[#E7EBEF] flex justify-around py-2 px-4 z-50 shadow-lg">
        <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-[#FF5C02]' : 'text-[#C7C9D9]'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1 font-medium">홈</span>
        </Link>
        <Link to="/products" className={`flex flex-col items-center p-2 ${isActive('/products') ? 'text-[#FF5C02]' : 'text-[#C7C9D9]'}`}>
          <ShoppingBag size={20} />
          <span className="text-[10px] mt-1 font-medium">쇼핑</span>
        </Link>
        <Link to="/likes" className={`flex flex-col items-center p-2 ${isActive('/likes') ? 'text-[#FF5C02]' : 'text-[#C7C9D9]'}`}>
          <Heart size={20} />
          <span className="text-[10px] mt-1 font-medium">찜</span>
        </Link>
        <Link to="/mypage" className={`flex flex-col items-center p-2 ${isActive('/mypage') ? 'text-[#FF5C02]' : 'text-[#C7C9D9]'}`}>
          <User size={20} />
          <span className="text-[10px] mt-1 font-medium">마이페이지</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
