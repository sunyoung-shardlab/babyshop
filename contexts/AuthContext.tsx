import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { getCurrentUser, onAuthStateChange, signOut } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  signIn: (authUser: AuthUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const convertAuthUserToUser = (authUser: AuthUser): User => {
    return {
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
    };
  };

  useEffect(() => {
    // 초기 사용자 확인
    getCurrentUser().then(authUser => {
      if (authUser) {
        setAuthUser(authUser);
        setUser(convertAuthUserToUser(authUser));
      }
      setLoading(false);
    });

    // 인증 상태 변화 감지
    const { data: { subscription } } = onAuthStateChange((authUser) => {
      if (authUser) {
        setAuthUser(authUser);
        setUser(convertAuthUserToUser(authUser));
      } else {
        setAuthUser(null);
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = (authUser: AuthUser) => {
    setAuthUser(authUser);
    setUser(convertAuthUserToUser(authUser));
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setAuthUser(null);
    window.location.hash = '#/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authUser,
        loading,
        isLoggedIn: !!authUser,
        signIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
