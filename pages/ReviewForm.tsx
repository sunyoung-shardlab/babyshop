
import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Sparkles, Star, Camera } from 'lucide-react';
import { generateAIReview } from '../services/gemini';

interface ReviewFormProps {
  onNavigate: (page: Page) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onNavigate }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const keywords = ['맛있어요', '아기가 좋아해요', '부드러워요', '오래 먹어요', '성분이 좋아요', '포장이 깔끔해요'];

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

  const handleAIWrite = async () => {
    if (selectedKeywords.length === 0) {
      alert('키워드를 먼저 선택해주세요!');
      return;
    }
    setIsGenerating(true);
    const result = await generateAIReview(selectedKeywords);
    setReviewText(result);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-gray-50 z-10">
        <button onClick={() => onNavigate('home')}><ArrowLeft size={24} /></button>
        <h2 className="text-lg font-bold">리뷰 작성</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Product Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
            <img src="https://picsum.photos/seed/snack1/100/100" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400">2024.12.20 구매</p>
            <h3 className="text-sm font-bold">퓨어잇 아이 떡뻥 (Halal)</h3>
          </div>
        </div>

        {/* Rating */}
        <div className="text-center">
          <p className="text-sm font-bold mb-4">상품은 어떠셨나요?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Star 
                key={i} 
                size={32} 
                className={`${i <= rating ? 'text-burgundy fill-burgundy' : 'text-gray-200'} cursor-pointer transition`}
                onClick={() => setRating(i)}
              />
            ))}
          </div>
        </div>

        {/* AI Recommendation Buttons */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold">리뷰 키워드 선택</h4>
            <span className="text-[10px] text-gray-400">AI가 문장을 만들어드려요!</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map(k => (
              <button
                key={k}
                onClick={() => toggleKeyword(k)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                  selectedKeywords.includes(k) 
                    ? 'bg-burgundy text-white border-burgundy' 
                    : 'bg-white text-gray-500 border-gray-100 shadow-sm'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleAIWrite}
            disabled={isGenerating}
            className="w-full mt-4 py-3 bg-burgundy/5 border border-burgundy/20 text-burgundy rounded-xl flex items-center justify-center gap-2 font-bold text-sm hover:bg-burgundy/10 transition"
          >
            <Sparkles size={16} />
            {isGenerating ? 'AI가 작성 중...' : 'AI로 3초만에 리뷰 쓰기'}
          </button>
        </div>

        {/* Text Area */}
        <div>
           <textarea
             value={reviewText}
             onChange={(e) => setReviewText(e.target.value)}
             placeholder="아이의 반응이나 맛 등 상세한 리뷰를 적어주세요."
             className="w-full h-32 p-4 bg-white border border-gray-100 rounded-2xl shadow-inner text-sm focus:outline-none focus:ring-1 focus:ring-burgundy/30"
           />
        </div>

        {/* Image Upload Placeholder */}
        <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-1 cursor-pointer">
          <Camera size={24} />
          <span className="text-[10px] font-bold">사진 추가</span>
        </div>
      </div>

      <div className="p-6 mt-auto">
        <button 
          onClick={() => {
            alert('리뷰가 등록되었습니다. 100P가 적립됐어요!');
            onNavigate('home');
          }}
          className="w-full py-4 bg-burgundy text-white rounded-2xl font-bold shadow-lg"
        >
          등록 완료
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
