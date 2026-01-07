
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Heart, Menu } from 'lucide-react';
import { COLORS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center bg-[#FDFBF7] sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold hand-drawn-font text-[#800020]">
          K-Baby Malaysia
        </Link>
        <button className="p-2">
          <Menu size={24} color={COLORS.primary} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-2 px-4 z-50">
        <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-[#800020]' : 'text-gray-400'}`}>
          <Home size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </Link>
        <Link to="/products" className={`flex flex-col items-center p-2 ${isActive('/products') ? 'text-[#800020]' : 'text-gray-400'}`}>
          <ShoppingBag size={20} />
          <span className="text-[10px] mt-1">Shop</span>
        </Link>
        <Link to="/likes" className={`flex flex-col items-center p-2 ${isActive('/likes') ? 'text-[#800020]' : 'text-gray-400'}`}>
          <Heart size={20} />
          <span className="text-[10px] mt-1">Likes</span>
        </Link>
        <Link to="/mypage" className={`flex flex-col items-center p-2 ${isActive('/mypage') ? 'text-[#800020]' : 'text-gray-400'}`}>
          <User size={20} />
          <span className="text-[10px] mt-1">Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
