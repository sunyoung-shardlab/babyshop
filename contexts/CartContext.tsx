import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { supabase, getCurrentUser } from '../services/authService';
import { MOCK_PRODUCTS } from '../constants';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 사용자 ID 추적
  useEffect(() => {
    const initUser = async () => {
      try {
        // Supabase가 설정되지 않은 경우 로컬 스토리지 사용
        if (!supabase) {
          console.warn('⚠️ Supabase not configured, using localStorage only');
          loadCartFromLocalStorage();
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        setCurrentUserId(userId);
        
        if (userId) {
          await loadCartFromDB(userId);
        } else {
          loadCartFromLocalStorage();
        }
      } catch (error) {
        console.error('Cart init error:', error);
        loadCartFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // Supabase가 없으면 subscription 설정 안 함
    if (!supabase) return;

    // Auth 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const userId = session?.user?.id || null;
      setCurrentUserId(userId);

      if (userId) {
        await loadCartFromDB(userId);
      } else {
        loadCartFromLocalStorage();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // DB에서 장바구니 로드
  const loadCartFromDB = async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('장바구니 로드 오류:', error);
        loadCartFromLocalStorage(); // Fallback to local storage
        return;
      }

      if (data) {
        const cartItems: CartItem[] = data.map(item => {
          const product = MOCK_PRODUCTS.find(p => p.id === item.product_id);
          return product ? { product, quantity: item.quantity } : null;
        }).filter(Boolean) as CartItem[];

        setCart(cartItems);
      }
    } catch (error) {
      console.error('장바구니 로드 실패:', error);
      loadCartFromLocalStorage(); // Fallback to local storage
    }
  };

  // 로컬 스토리지에서 장바구니 로드
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    setCart(savedCart ? JSON.parse(savedCart) : []);
  };

  // 장바구니 변경 시 저장
  useEffect(() => {
    if (loading) return;

    if (currentUserId) {
      syncCartToDB(currentUserId);
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, currentUserId, loading]);

  // DB와 동기화
  const syncCartToDB = async (userId: string) => {
    if (!userId) return;

    try {
      // 기존 장바구니 삭제
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      // 새로운 장바구니 저장
      if (cart.length > 0) {
        const cartData = cart.map(item => ({
          user_id: userId,
          product_id: item.product.id,
          quantity: item.quantity,
        }));

        const { error } = await supabase
          .from('cart_items')
          .insert(cartData);

        if (error) {
          console.error('장바구니 저장 오류:', error);
        }
      }
    } catch (error) {
      console.error('장바구니 동기화 실패:', error);
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // 이미 있으면 수량 증가
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.maxOrder) }
            : item
        );
      } else {
        // 새로운 상품 추가
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.maxOrder) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
