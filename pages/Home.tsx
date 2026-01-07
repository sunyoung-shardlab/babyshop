
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_TIPS, COLORS } from '../constants';
import { ArrowRight, Star, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="p-6 bg-[#F4F1EA] space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-[#800020] font-bold tracking-widest uppercase">프리미엄 한국 품질</p>
          <h1 className="text-3xl font-bold hand-drawn-font leading-tight">
            품질과 가격 <br />
            <span className="red-underline">타협 없이</span>
          </h1>
          <p className="text-sm text-gray-600">최고의 한국 육아용품을 현지 최저가로 만나보세요.</p>
        </div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 bg-[#800020] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg"
        >
          핫딜 둘러보기 <ArrowRight size={16} />
        </Link>
      </section>

      {/* Time-Limited Deals */}
      <section className="px-6 space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock size={20} className="text-[#800020]" /> 한정 특가
          </h2>
          <span className="text-xs text-gray-500">주간 업데이트</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {MOCK_PRODUCTS.filter(p => p.type === 'B').map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="flex-shrink-0 w-64 border rounded-2xl overflow-hidden bg-white group">
              <div className="relative aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 left-2 bg-[#800020] text-white px-2 py-1 text-[10px] rounded font-bold">
                  핫딜
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[#800020] font-bold">RM {product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 line-through">RM {product.originalPrice.toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Regular Selection */}
      <section className="px-6 space-y-4">
        <h2 className="text-xl font-bold">상시 판매</h2>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_PRODUCTS.filter(p => p.type === 'A').map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="space-y-2 group">
              <div className="aspect-square rounded-2xl overflow-hidden border bg-gray-50">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-medium text-xs line-clamp-2 h-8">{product.name}</h3>
                <p className="text-[#800020] font-bold text-sm">RM {product.price.toFixed(2)}</p>
                {product.isHalal && (
                  <span className="inline-block bg-green-100 text-green-700 text-[8px] px-1 rounded font-bold uppercase">할랄 인증</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Content Tips */}
      <section className="px-6 space-y-4">
        <h2 className="text-xl font-bold">육아 팁</h2>
        <div className="space-y-3">
          {MOCK_TIPS.map(tip => (
            <div key={tip.id} className="flex gap-3 items-center p-3 border rounded-xl bg-gray-50">
              <img src={tip.thumbnail} className="w-20 h-20 object-cover rounded-lg" alt={tip.title} />
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-sm leading-snug">{tip.title}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{tip.targetMonths}개월 이유식</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Referral Banner */}
      <section className="px-6">
        <div className="bg-[#2F4F4F] p-6 rounded-3xl text-white space-y-3 text-center">
          <h3 className="text-lg font-bold">엄마 친구들을 초대하세요!</h3>
          <p className="text-xs opacity-90">친구가 가입하면 10% 할인. 친구도 5% 추가 할인!</p>
          <button className="bg-white text-[#2F4F4F] px-6 py-2 rounded-full text-xs font-bold shadow-md">
            초대 링크 복사
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
