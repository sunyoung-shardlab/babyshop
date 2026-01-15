
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants';
import { ArrowRight, Star, Clock, Tag } from 'lucide-react';
import { Product, Content } from '../types';
import { getTimeDealProducts, getRegularProducts } from '../services/productService';
import { getAllContents } from '../services/contentService';
import { getAllReviews, ReviewListItem } from '../services/reviewService';
import OnboardingFlow from '../components/OnboardingFlow';
import { CountdownTimer } from '../components/CountdownTimer';

const Home: React.FC = () => {
  const [timeDealProducts, setTimeDealProducts] = useState<Product[]>([]);
  const [regularProducts, setRegularProducts] = useState<Product[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [timeDeals, regular, contentsList, reviewsList] = await Promise.all([
          getTimeDealProducts(),
          getRegularProducts(),
          getAllContents(),
          getAllReviews(10)
        ]);
        
        // 디버깅: 제품 태그 확인
        console.log('🏠 [Home] Time deal products:', timeDeals.map(p => ({ 
          name: p.name, 
          tags: p.tags 
        })));
        console.log('🏠 [Home] Regular products:', regular.map(p => ({ 
          name: p.name, 
          tags: p.tags 
        })));
        
        setTimeDealProducts(timeDeals);
        setRegularProducts(regular);
        setContents(contentsList);
        setReviews(reviewsList);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
                    {/* 할랄 인증 아이콘 (주간 영역 - 핫딜 태그 불필요) */}
                    {product.tags?.includes('할랄 인증') && (
                      <div className="absolute top-2 right-2">
                        <img src="https://cnumxvxxyxexzzyeinjr.supabase.co/storage/v1/object/public/product-images/halal-icon.png" alt="할랄 인증" className="w-8 h-8" />
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
                <div className="aspect-square rounded-lg overflow-hidden border border-[#E7EBEF] bg-white shadow-sm group-hover:shadow-md transition-shadow relative">
                  <img src={product.thumbnail_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                  {/* 할랄 인증 아이콘 (상시 영역) */}
                  {product.tags?.includes('할랄 인증') && (
                    <div className="absolute top-2 right-2">
                      <img src="https://cnumxvxxyxexzzyeinjr.supabase.co/storage/v1/object/public/product-images/halal-icon.png" alt="할랄 인증" className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-medium text-xs line-clamp-2 h-8 text-[#1C1C1C]">{product.name}</h3>
                  <p className="text-[#FF5C02] font-bold text-sm">RM {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="space-y-4 px-6">
        <h2 className="text-xl font-bold text-[#1C1C1C]">리뷰</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-[#E7EBEF] rounded-xl p-5 text-center text-sm text-[#8F90A6]">
            아직 리뷰가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => {
              const tags = (r.highlight_tags || []).slice(0, 3);
              const authorInitial = (r.author_name || 'U').trim().slice(0, 1).toUpperCase();
              return (
                <Link
                  key={r.id}
                  to={`/reviews/${r.id}`}
                  className="flex gap-3 p-4 bg-white border border-[#E7EBEF] rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F2F2F5] border border-[#E7EBEF] flex-shrink-0">
                    {r.cover_image_url ? (
                      <img src={r.cover_image_url} alt="리뷰 대표 이미지" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8F90A6] text-xs">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="font-bold text-sm text-[#1C1C1C] line-clamp-2">
                      {r.summary_text || r.title || '후기'}
                    </div>

                    {tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {tags.map((t) => (
                          <span key={t} className="bg-[#F2F2F5] text-[#555770] text-[10px] px-2 py-1 rounded-full font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 self-start">
                    {r.author_avatar_url ? (
                      <img
                        src={r.author_avatar_url}
                        alt="작성자"
                        className="w-9 h-9 rounded-full object-cover border border-[#E7EBEF]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#F2F2F5] text-[#555770] flex items-center justify-center font-bold text-xs border border-[#E7EBEF]">
                        {authorInitial}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Content Tips - Figma Design */}
      <section className="space-y-4" id="parenting-tips-section">
        <h2 className="text-xl font-bold text-[#1C1C1C] px-6">육아 팁</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6 no-scrollbar">
          {contents.map(content => (
            <Link
              key={content.id}
              to={`/content/${content.id}`}
              className="flex-shrink-0 w-72 group"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* Background Image */}
                <img
                  src={content.thumbnail_url}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={content.title}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-bold text-lg leading-snug line-clamp-1">{content.title}</h4>
                    <ArrowRight size={18} className="flex-shrink-0 opacity-90 group-hover:opacity-100" />
                  </div>
                  {content.subtitle && (
                    <p className="text-sm text-white/90 leading-relaxed line-clamp-2">{content.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
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
