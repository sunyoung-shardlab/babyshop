
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_TIPS, COLORS } from '../constants';
import { ArrowRight, Star, Clock, Tag } from 'lucide-react';
import { Product } from '../types';
import { getTimeDealProducts, getRegularProducts } from '../services/productService';
import OnboardingFlow from '../components/OnboardingFlow';
import { CountdownTimer } from '../components/CountdownTimer';

const Home: React.FC = () => {
  const [timeDealProducts, setTimeDealProducts] = useState<Product[]>([]);
  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const [timeDeals, regular] = await Promise.all([
          getTimeDealProducts(),
          getRegularProducts()
        ]);
        setTimeDealProducts(timeDeals);
        setRegularProducts(regular);
      } catch (error) {
        console.error('제품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <OnboardingFlow />
      <div className="space-y-8 animate-fadeIn bg-[#FAFAFC] min-h-screen">
      {/* Hero Section */}
      <section className="p-6 bg-white space-y-4 rounded-b-3xl shadow-sm">
        <div className="space-y-2">
          <p className="text-xs text-[#FF5C02] font-bold tracking-widest uppercase">프리미엄 한국 품질</p>
          <h1 className="text-3xl font-bold leading-tight text-[#1C1C1C]">
            품질과 가격 <br />
            <span className="text-[#FF5C02]">타협 없이</span>
          </h1>
          <p className="text-sm text-[#555770]">최고의 한국 육아용품을 현지 최저가로 만나보세요.</p>
        </div>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 bg-[#FF5C02] text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-[#FF7022] transition-colors"
        >
          핫딜 둘러보기 <ArrowRight size={16} />
        </Link>
      </section>

      {/* Time-Limited Deals */}
      <section className="px-6 space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-bold flex items-center gap-2 text-[#1C1C1C]">
            <Clock size={20} className="text-[#FF5C02]" /> 한정 특가
          </h2>
          <span className="text-xs text-[#8F90A6]">주간 업데이트</span>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-64 h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {timeDealProducts.map(product => {
              const discountRate = product.original_price && product.price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;
              
              return (
                <Link key={product.id} to={`/product/${product.id}`} className="flex-shrink-0 w-64 border border-[#E7EBEF] rounded-lg overflow-hidden bg-white group shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.thumbnail_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                    {discountRate > 0 && (
                      <div className="absolute top-2 left-2 bg-[#FF5C02] text-white px-3 py-1 text-xs rounded-full font-bold shadow-md">
                        {discountRate}% 할인
                      </div>
                    )}
                    {product.category && (
                      <div className="absolute top-2 right-2 bg-white/90 text-[#555770] px-2 py-0.5 text-[10px] rounded font-medium">
                        #{product.category}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm line-clamp-1 text-[#1C1C1C]">{product.name}</h3>
                    
                    {/* 가격 정보 */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[#FF5C02] font-bold text-lg">RM {product.price.toFixed(2)}</span>
                        {product.original_price && (
                          <span className="text-xs text-[#8F90A6] line-through">RM {product.original_price.toFixed(2)}</span>
                        )}
                      </div>
                      
                      {/* 종료 기한 */}
                      {product.sale_end_date && (
                        <CountdownTimer endDate={product.sale_end_date} />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Regular Selection */}
      <section className="px-6 space-y-4">
        <h2 className="text-xl font-bold text-[#1C1C1C]">상시 판매</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {regularProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="space-y-2 group">
                <div className="aspect-square rounded-lg overflow-hidden border border-[#E7EBEF] bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <img src={product.thumbnail_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-medium text-xs line-clamp-2 h-8 text-[#1C1C1C]">{product.name}</h3>
                  <p className="text-[#FF5C02] font-bold text-sm">RM {product.price.toFixed(2)}</p>
                  {product.is_halal && (
                    <span className="inline-block bg-[#E3FFF1] text-[#06C270] text-[8px] px-2 py-0.5 rounded font-bold uppercase">할랄 인증</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Content Tips */}
      <section className="px-6 space-y-4">
        <h2 className="text-xl font-bold text-[#1C1C1C]">육아 팁</h2>
        <div className="space-y-3">
          {MOCK_TIPS.map(tip => (
            <div key={tip.id} className="flex gap-3 items-center p-4 border border-[#E7EBEF] rounded-lg bg-white shadow-sm">
              <img src={tip.thumbnail} className="w-20 h-20 object-cover rounded-lg" alt={tip.title} />
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-sm leading-snug text-[#1C1C1C]">{tip.title}</h4>
                <p className="text-[10px] text-[#8F90A6] uppercase tracking-wider">{tip.targetMonths}개월 이유식</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Referral Banner */}
      <section className="px-6 pb-6">
        <div className="bg-gradient-to-br from-[#FF5C02] to-[#FF8800] p-6 rounded-2xl text-white space-y-3 text-center shadow-lg">
          <h3 className="text-lg font-bold">엄마 친구들을 초대하세요!</h3>
          <p className="text-xs opacity-90">친구가 가입하면 10% 할인. 친구도 5% 추가 할인!</p>
          <button className="bg-white text-[#FF5C02] px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#FFF8E5] transition-colors">
            초대 링크 복사
          </button>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
