import React, { useEffect, useState } from 'react';
import BottomSheet from './BottomSheet';
import OnboardingCarousel from './OnboardingCarousel';
import { useAuth } from '../contexts/AuthContext';

const OnboardingFlow: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    // 비로그인 상태일 때만 매번 표시
    if (!authLoading && !isLoggedIn) {
      // 약간의 딜레이 후 표시 (부드러운 UX)
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
  }, [isLoggedIn, authLoading]);

  const handleComplete = () => {
    setShowOnboarding(false);
  };

  const handleClose = () => {
    setShowOnboarding(false);
  };

  return (
    <BottomSheet isOpen={showOnboarding} onClose={handleClose}>
      <OnboardingCarousel onComplete={handleComplete} onClose={handleClose} />
    </BottomSheet>
  );
};

export default OnboardingFlow;
