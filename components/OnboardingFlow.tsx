import React, { useEffect, useState } from 'react';
import BottomSheet from './BottomSheet';
import OnboardingCarousel from './OnboardingCarousel';

const ONBOARDING_KEY = 'babyshop_onboarding_completed';

const OnboardingFlow: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // 최초 진입 체크
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    
    if (!hasCompletedOnboarding) {
      // 약간의 딜레이 후 표시 (부드러운 UX)
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  return (
    <BottomSheet isOpen={showOnboarding} onClose={handleClose}>
      <OnboardingCarousel onComplete={handleComplete} onClose={handleClose} />
    </BottomSheet>
  );
};

export default OnboardingFlow;
