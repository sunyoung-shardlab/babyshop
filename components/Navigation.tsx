
import React from 'react';
import { Home, ShoppingCart, User, MessageSquare } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ current, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: <Home />, label: '홈' },
    { id: 'cart', icon: <ShoppingCart />, label: '장바구니' },
    { id: 'review', icon: <MessageSquare />, label: '리뷰' },
    { id: 'mypage', icon: <User />, label: '마이' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around py-3 pb-6 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id as Page)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            current === tab.id ? 'text-burgundy' : 'text-gray-400'
          }`}
        >
          {tab.icon}
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;
