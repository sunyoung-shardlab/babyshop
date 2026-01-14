import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Content } from '../types';
import { getUserLikedContents } from '../services/contentService';

const Likes: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [likedContents, setLikedContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLikedContents = async () => {
      if (!isLoggedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contents = await getUserLikedContents(user.id);
        setLikedContents(contents);
      } catch (error) {
        console.error('찜한 컨텐츠 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLikedContents();
  }, [isLoggedIn, user]);

  const handleGoToContents = () => {
    navigate('/');
    // 홈으로 이동 후 육아 팁 섹션으로 스크롤
    setTimeout(() => {
      const tipsSection = document.querySelector('[data-section="content-tips"]');
      if (tipsSection) {
        tipsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5C02] mx-auto mb-4"></div>
          <p className="text-[#8F90A6]">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 비로그인 또는 찜한 컨텐츠가 없는 경우
  if (!isLoggedIn || likedContents.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 bg-[#F2F2F5] rounded-full flex items-center justify-center mx-auto">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#8F90A6" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#1C1C1C]">
              {!isLoggedIn ? '로그인이 필요합니다' : '저장된 컨텐츠가 없습니다'}
            </h2>
            <p className="text-sm text-[#8F90A6]">
              {!isLoggedIn 
                ? '로그인하고 관심있는 육아 팁을 저장해보세요' 
                : '지금 컨텐츠를 둘러보세요'}
            </p>
          </div>
          <button
            onClick={!isLoggedIn ? () => navigate('/login') : handleGoToContents}
            className="w-full py-3 px-4 rounded-lg font-bold bg-[#FF5C02] text-white hover:bg-[#E54D00] transition-colors"
          >
            {!isLoggedIn ? '로그인하기' : '컨텐츠 보러가기'}
          </button>
        </div>
      </div>
    );
  }

  // 찜한 컨텐츠 목록
  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-6">
      <div className="bg-white border-b border-[#E7EBEF] px-6 py-4">
        <h1 className="text-xl font-bold text-[#1C1C1C]">저장한 컨텐츠</h1>
        <p className="text-xs text-[#8F90A6] mt-1">{likedContents.length}개의 컨텐츠</p>
      </div>

      <div className="px-6 pt-6 space-y-3">
        {likedContents.map(content => (
          <Link 
            key={content.id} 
            to={`/content/${content.id}`}
            className="flex gap-3 items-center p-4 border border-[#E7EBEF] rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <img 
              src={content.thumbnail_url} 
              className="w-20 h-20 object-cover rounded-lg" 
              alt={content.title} 
            />
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-sm leading-snug text-[#1C1C1C]">
                {content.title}
              </h4>
              {content.subtitle && (
                <p className="text-xs text-[#8F90A6]">{content.subtitle}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-[#8F90A6] pt-1">
                <span>조회 {content.view_count}</span>
                <span>좋아요 {content.like_count}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Likes;
