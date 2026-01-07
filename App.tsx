
import React, { useState } from 'react';
import { Page, Product } from './types';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import MyPage from './pages/MyPage';
import ReviewForm from './pages/ReviewForm';
import Cart from './pages/Cart';
import Onboarding from './pages/Onboarding';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('onboarding');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);

  const navigate = (page: Page, product?: Product) => {
    if (product) setSelectedProduct(product);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    alert('장바구니에 담겼습니다!');
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <Onboarding onStart={() => navigate('home')} />;
      case 'home':
        return <Home onNavigate={navigate} isLoggedIn={isLoggedIn} />;
      case 'product-detail':
        return <ProductDetail 
                  product={selectedProduct} 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => navigate('login')} 
                  onAddToCart={addToCart}
                />;
      case 'mypage':
        return <MyPage isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} onNavigate={navigate} />;
      case 'cart':
        return <Cart 
                  items={cartItems} 
                  onNavigate={navigate} 
                  onRemove={removeFromCart} 
                  onUpdateQuantity={updateCartQuantity} 
                />;
      case 'review':
        return <ReviewForm onNavigate={navigate} />;
      case 'login':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-burgundy">간편 로그인</h2>
            <p className="text-sm text-gray-500 mb-8">로그인하시면 프리미엄 혜택과<br/>맞춤 정보를 확인하실 수 있습니다.</p>
            <button 
              onClick={() => { setIsLoggedIn(true); navigate('home'); }}
              className="w-full py-4 bg-burgundy text-white rounded-2xl font-bold shadow-lg transform active:scale-[0.98] transition"
            >
              Google로 시작하기
            </button>
            <button 
              onClick={() => navigate('home')}
              className="mt-4 text-gray-400 text-sm font-medium"
            >
              나중에 할게요
            </button>
          </div>
        );
      default:
        return <Home onNavigate={navigate} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fcfaf7] shadow-2xl relative overflow-x-hidden border-x border-gray-100">
      <div className={currentPage === 'onboarding' ? '' : 'pb-24'}>
        {renderPage()}
      </div>
      {currentPage !== 'onboarding' && <Navigation current={currentPage} onNavigate={navigate} />}
    </div>
  );
};

export default App;
