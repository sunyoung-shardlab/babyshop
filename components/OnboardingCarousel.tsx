import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
  onClose: () => void;
}

const slides = [
  {
    id: 1,
    title: '퀄리티와 가격',
    subtitle: '모두 타협하지 마세요',
    description: '최고의 한국 육아용품을 현지 최저가로 만나보세요',
    emoji: '✨',
    showPrev: false,
    showNext: true,
    showCTA: false,
  },
  {
    id: 2,
    title: '한국 아이용품',
    subtitle: '트렌드를 한눈에',
    description: '인기 많은 한국 제품들을 큐레이션해서 소개합니다',
    emoji: '🎯',
    showPrev: true,
    showNext: true,
    showCTA: false,
  },
  {
    id: 3,
    title: '매주 업데이트',
    subtitle: '되는 핫딜',
    description: '한정 수량, 한정 기간 특가 상품을 놓치지 마세요',
    emoji: '🔥',
    showPrev: true,
    showNext: true,
    showCTA: false,
  },
  {
    id: 4,
    title: '구매할수록',
    subtitle: '커지는 혜택',
    description: '포인트 적립, 등급별 할인, 친구 초대 쿠폰까지',
    emoji: '🎁',
    showPrev: false,
    showNext: false,
    showCTA: true,
  },
];

const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStart = () => {
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600"
      >
        <X size={24} />
      </button>

      {/* Slides */}
      <div className="px-6 pt-8 pb-6">
        {/* Emoji */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            {slide.emoji}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {slide.title}
          </h2>
          <h3 className="text-2xl font-bold text-[#FF5C02] mb-4">
            {slide.subtitle}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {slide.description}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-[#FF5C02]'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {slide.showPrev && (
            <button
              onClick={handlePrev}
              className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} />
              이전
            </button>
          )}
          
          {slide.showNext && (
            <button
              onClick={handleNext}
              className={`py-4 px-6 bg-[#FF5C02] text-white rounded-xl font-bold hover:bg-[#FF7022] transition-colors flex items-center justify-center gap-2 ${
                slide.showPrev ? 'flex-[2]' : 'flex-1'
              }`}
            >
              다음
              <ChevronRight size={20} />
            </button>
          )}

          {slide.showCTA && (
            <button
              onClick={handleStart}
              className="flex-1 py-4 px-6 bg-[#FF5C02] text-white rounded-xl font-bold hover:bg-[#FF7022] transition-colors shadow-lg"
            >
              지금 시작하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
