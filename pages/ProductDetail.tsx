import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { COLORS } from '../constants';
import { ChevronLeft, Share2, Info, AlertTriangle, ShoppingCart, Clock, Package, Truck, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { getProductById, incrementProductView, getProductImages } from '../services/productService';
import { CountdownTimer } from '../components/CountdownTimer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setProductLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        
        // 상세 이미지 로드 (DB에서)
        const images = await getProductImages(id);
        
        // 이미지가 없으면 썸네일만 사용
        if (images.length === 0) {
          setProductImages([productData.thumbnail_url]);
        } else {
          setProductImages(images);
        }
        
        console.log('📸 Loaded images:', images.length);
        
        // 조회수 증가 (비동기로 실행, 에러 무시)
        if (productData) {
          incrementProductView(id).catch(console.error);
        }
      } catch (error) {
        console.error('제품 로드 실패:', error);
      } finally {
        setProductLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (productLoading) {
    return (
      <div className="p-10 text-center bg-[#FAFAFC] min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center bg-[#FAFAFC] min-h-screen">상품을 찾을 수 없습니다</div>;

  // 로딩 중에는 게스트로 취급하지 않음
  const isGuest = !loading && !isLoggedIn;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  // 스와이프 제스처 핸들러
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // 왼쪽으로 스와이프 → 다음 이미지
      setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    }
    
    if (isRightSwipe) {
      // 오른쪽으로 스와이프 → 이전 이미지
      setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    }
  };

  return (
    <div className="animate-fadeIn pb-32">
      {/* Top Bar */}
      <div className="p-4 flex justify-between items-center absolute top-0 left-0 right-0 z-10 max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/80 backdrop-blur rounded-full">
          <ChevronLeft size={20} />
        </button>
        <button className="p-2 bg-white/80 backdrop-blur rounded-full">
          <Share2 size={20} />
        </button>
      </div>

      {/* Image Gallery */}
      <div 
        className="aspect-square bg-[#F2F2F5] overflow-hidden relative group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 이미지 */}
        <img 
          src={productImages[currentImageIndex] || product.thumbnail_url} 
          alt={product.name} 
          className="w-full h-full object-cover transition-opacity duration-300" 
        />
        
        {/* 할인 배지 */}
        {product.original_price && product.price && (
          <div className="absolute top-4 left-4 bg-[#FF5C02] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% 할인
          </div>
        )}
        
        {/* 좌우 네비게이션 버튼 (이미지 2개 이상일 때만) */}
        {productImages.length > 1 && (
          <>
            {/* 이전 버튼 */}
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="이전 이미지"
            >
              <svg className="w-6 h-6 text-[#1C1C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* 다음 버튼 */}
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="다음 이미지"
            >
              <svg className="w-6 h-6 text-[#1C1C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* 이미지 인디케이터 */}
        {productImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur px-3 py-2 rounded-full">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/60'
                }`}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        )}
        
        {/* 이미지 카운터 */}
        {productImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentImageIndex + 1} / {productImages.length}
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className={`p-6 space-y-6 bg-[#FAFAFC] rounded-t-3xl -mt-6 relative z-10 ${isGuest ? 'overflow-hidden min-h-[500px]' : 'pb-8'}`}>
        
        {isGuest && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md p-10 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#FF5C02] space-y-4">
                <h3 className="text-xl font-bold text-[#1C1C1C]">회원 특가!</h3>
                <p className="text-sm text-[#555770]">가입하시면 상세 정보와 특별 혜택을 확인하실 수 있습니다.</p>
                <Link to="/login" className="block w-full bg-[#FF5C02] text-white py-3 rounded-lg font-bold hover:bg-[#FF7022] transition-colors">
                  3초만에 가입하기
                </Link>
                <p className="text-[10px] text-[#8F90A6]">10% 환영 쿠폰 즉시 발급</p>
             </div>
          </div>
        )}

        <div className={isGuest ? 'blurred-guest' : 'space-y-6'}>
          {/* Header */}
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-3">
              <h1 className="text-2xl font-bold leading-tight text-[#1C1C1C]">{product.name}</h1>
              {product.is_halal && (
                <span className="flex-shrink-0 bg-[#E3FFF1] text-[#06C270] text-[10px] px-2 py-1 rounded-full font-bold">HALAL</span>
              )}
            </div>
            
            {/* 제품 태그 */}
            {product.category && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-[#F2F2F5] text-[#555770] px-3 py-1 rounded-full text-xs font-medium">
                  <Tag size={12} /> {product.category}
                </span>
              </div>
            )}
            
            {/* 가격 */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#FF5C02]">RM {product.price.toFixed(2)}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-[#8F90A6] line-through">RM {product.original_price.toFixed(2)}</span>
                    <span className="text-sm text-[#FF5C02] font-bold">
                      ({Math.round(((product.original_price - product.price) / product.original_price) * 100)}% 절약)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Urgent Tags */}
          <div className="space-y-2">
            {product.stock_quantity < 10 && (
              <div className="flex items-center gap-2 text-[#FF8800] text-sm font-bold bg-[#FFF8E5] p-3 rounded-lg border border-[#FFDB43]">
                <AlertTriangle size={16} /> 재고 {product.stock_quantity}개만 남았습니다!
              </div>
            )}
            {product.sale_end_date && (
              <div className="flex items-center gap-2 text-[#FF5C02] text-sm font-bold bg-[#FFE5E5] p-3 rounded-lg border border-[#FFC9AB]">
                <Clock size={16} /> 
                <CountdownTimer endDate={product.sale_end_date} />
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between py-4 border-y border-[#E7EBEF]">
              <span className="font-bold text-[#1C1C1C]">수량</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-[#E7EBEF] rounded-lg flex items-center justify-center font-bold hover:bg-[#F2F2F5] transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-lg text-[#1C1C1C]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.max_order_quantity || 99, quantity + 1))}
                  className="w-10 h-10 border border-[#E7EBEF] rounded-lg flex items-center justify-center font-bold hover:bg-[#F2F2F5] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            {product.max_order_quantity && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F90A6]">1인당 최대 구매 개수</span>
                <span className="text-[#FF5C02] font-bold">{product.max_order_quantity}개</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2 text-[#1C1C1C]">
              <Info size={18} /> 상품 정보
            </h3>
            <p className="text-sm text-[#555770] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Delivery Info */}
          <div className="bg-white p-4 rounded-lg border border-[#E7EBEF] space-y-3">
            <h4 className="font-bold text-sm flex items-center gap-2 text-[#1C1C1C]">
              <Truck size={16} /> 배송 정보
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8F90A6]">배송 출발일</span>
                <span className="font-bold text-[#1C1C1C]">
                  {product.shipping_departure_date 
                    ? new Date(product.shipping_departure_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
                    : '주문 후 1일 이내'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8F90A6]">배송 예상 소요 시간</span>
                <span className="font-bold text-[#1C1C1C]">
                  {product.estimated_delivery_days ? `${product.estimated_delivery_days}일` : '3-5 영업일'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8F90A6]">배송비</span>
                <span className="font-bold text-[#FF5C02]">
                  {product.is_free_shipping ? '무료 배송' : `RM ${(product.shipping_fee || 5).toFixed(2)}`}
                </span>
              </div>
              {product.origin_country && (
                <div className="flex justify-between">
                  <span className="text-[#8F90A6]">원산지</span>
                  <span className="font-bold text-[#1C1C1C]">{product.origin_country}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {!isGuest && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-[#E7EBEF] z-50 shadow-lg">
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border-2 border-[#FF5C02] text-[#FF5C02] py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#FFC9AB] transition-colors"
            >
              <ShoppingCart size={20} /> 장바구니
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-[2] bg-[#FF5C02] text-white py-4 rounded-lg font-bold shadow-lg hover:bg-[#FF7022] transition-colors"
            >
              결제하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
