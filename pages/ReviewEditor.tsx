
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, COLORS } from '../constants';
import { Sparkles, Camera, Star } from 'lucide-react';
import { generateReviewText } from '../services/geminiService';

const ReviewEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const [rating, setRating] = useState(5);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const keywords = ["Delicious", "Soft", "Baby loves it", "Healthy", "Fast delivery", "Good price"];

  const toggleKeyword = (kw: string) => {
    if (selectedKeywords.includes(kw)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== kw));
    } else {
      setSelectedKeywords([...selectedKeywords, kw]);
    }
  };

  const handleAiGenerate = async () => {
    if (selectedKeywords.length === 0) {
      alert("Please select some keywords first!");
      return;
    }
    setIsGenerating(true);
    const text = await generateReviewText(selectedKeywords);
    setComment(text);
    setIsGenerating(false);
  };

  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-6 space-y-8 pb-32">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold hand-drawn-font">Write a Review</h1>
        <p className="text-xs text-gray-500">Earn 100 points for every review!</p>
      </div>

      <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-center border border-dashed">
        <img src={product.image} className="w-16 h-16 object-cover rounded-lg" alt={product.name} />
        <div>
          <p className="font-bold text-sm line-clamp-1">{product.name}</p>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star 
                key={s} 
                size={20} 
                className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                onClick={() => setRating(s)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-bold block">What did you like?</label>
        <div className="flex flex-wrap gap-2">
          {keywords.map(kw => (
            <button 
              key={kw}
              onClick={() => toggleKeyword(kw)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${selectedKeywords.includes(kw) ? 'bg-[#800020] text-white border-[#800020]' : 'bg-white text-gray-600'}`}
            >
              {kw}
            </button>
          ))}
        </div>
        <button 
          onClick={handleAiGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 text-[#800020] text-sm font-bold bg-pink-50 px-4 py-2 rounded-lg border border-pink-200"
        >
          <Sparkles size={16} /> {isGenerating ? 'AI Generating...' : 'Write with AI in 3s'}
        </button>
      </div>

      <div className="space-y-4">
        <label className="font-bold block">Your Feedback</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience here..."
          className="w-full h-40 p-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-[#800020]"
        />
        <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-400 border px-4 py-3 rounded-xl">
                <Camera size={20} /> <span className="text-xs font-bold">Add Photo (+100P)</span>
            </button>
            <span className="text-xs text-gray-400">{comment.length}/500</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
        <button 
            onClick={() => navigate('/mypage')}
            className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-xl"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewEditor;
