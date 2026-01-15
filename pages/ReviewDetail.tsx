import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getReviewById } from '../services/reviewService';

const ReviewDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const r = await getReviewById(id);
        setReview(r);
      } catch (e) {
        console.error('리뷰 로드 실패:', e);
        setReview(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const authorInitial = useMemo(() => {
    const name = review?.author_name || 'U';
    return String(name).trim().slice(0, 1).toUpperCase();
  }, [review?.author_name]);

  const formattedDate = useMemo(() => {
    if (!review?.created_at) return '';
    try {
      // Format like: 2026. 1. 14
      return new Date(review.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }, [review?.created_at]);

  const tags: string[] = useMemo(() => (review?.highlight_tags || []).slice(0, 3), [review?.highlight_tags]);
  const allImages = useMemo(() => review?.all_images || [], [review?.all_images]);
  const coverUrl = useMemo(
    () => review?.cover_image_url || review?.all_images?.[0]?.image_url,
    [review?.cover_image_url, review?.all_images]
  );

  const carouselImages: string[] = useMemo(() => {
    const urls = (allImages || [])
      .slice()
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img: any) => img.image_url)
      .filter(Boolean);

    if (urls.length === 0 && coverUrl) return [coverUrl];
    return Array.from(new Set(urls));
  }, [allImages, coverUrl]);

  useEffect(() => {
    // Reset to first image when review changes
    setCurrentImageIndex(0);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 bg-[#FAFAFC] min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="h-16 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-6 bg-[#FAFAFC] min-h-screen">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#555770]">
          <ChevronLeft size={18} /> 뒤로
        </button>
        <div className="mt-10 text-center text-[#555770]">리뷰를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC] min-h-screen pb-24 animate-fadeIn">
      <div className="p-4 flex items-center gap-2 max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-[#1C1C1C]">리뷰</h1>
      </div>

      <div className="px-6 max-w-md mx-auto space-y-5">
        {/* Review image carousel (cover + detail) */}
        {carouselImages.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden shadow-sm border border-[#E7EBEF] bg-white relative group"
            onTouchStart={(e) => {
              setTouchEnd(null);
              setTouchStart(e.targetTouches[0].clientX);
            }}
            onTouchMove={(e) => {
              setTouchEnd(e.targetTouches[0].clientX);
            }}
            onTouchEnd={() => {
              if (touchStart == null || touchEnd == null) return;
              const distance = touchStart - touchEnd;
              const minSwipeDistance = 50;
              if (distance > minSwipeDistance) {
                // swipe left -> next
                setCurrentImageIndex((prev) =>
                  prev === carouselImages.length - 1 ? 0 : prev + 1
                );
              } else if (distance < -minSwipeDistance) {
                // swipe right -> prev
                setCurrentImageIndex((prev) =>
                  prev === 0 ? carouselImages.length - 1 : prev - 1
                );
              }
            }}
          >
            <img
              src={carouselImages[currentImageIndex]}
              alt="리뷰 이미지"
              className="w-full aspect-square object-cover transition-opacity duration-300"
            />

            {/* Left/Right arrows */}
            {carouselImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? carouselImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="이전 이미지"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === carouselImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="다음 이미지"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Indicator: 1/3 */}
            {carouselImages.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/55 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                {currentImageIndex + 1}/{carouselImages.length}
              </div>
            )}
          </div>
        )}

        {/* Summary + author + tags */}
        <div className="bg-white rounded-2xl border border-[#E7EBEF] p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {review.author_avatar_url ? (
                <img
                  src={review.author_avatar_url}
                  alt="작성자"
                  className="w-9 h-9 rounded-full object-cover border border-[#E7EBEF]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#F2F2F5] text-[#555770] flex items-center justify-center font-bold text-sm border border-[#E7EBEF]">
                  {authorInitial}
                </div>
              )}
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#1C1C1C]">{review.author_name || '사용자'}</div>
                {formattedDate && (
                  <div className="text-[11px] text-[#8F90A6]">{formattedDate}</div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < (review.rating || 0) ? 'text-[#FF5C02] fill-[#FF5C02]' : 'text-[#C7C9D9]'}
                />
              ))}
            </div>
          </div>

          <div className="text-[#1C1C1C] font-bold text-base leading-relaxed">
            {review.summary_text || review.title || '후기'}
          </div>

          {(review.body_text || review.comment) && (
            <div className="text-sm text-[#555770] font-normal leading-relaxed whitespace-pre-line">
              {review.body_text || review.comment}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((t: string) => (
                <span key={t} className="bg-[#F2F2F5] text-[#555770] text-xs px-3 py-1 rounded-full font-bold">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* All images */}
        {allImages.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold text-[#1C1C1C]">포함 이미지</h2>
            <div className="grid grid-cols-3 gap-2">
              {allImages.map((img: any) => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-[#E7EBEF] bg-white">
                  <img src={img.image_url} alt="리뷰 이미지" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;

