import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Content } from '../types';
import { 
  getContentById, 
  likeContent, 
  unlikeContent, 
  getUserLikedContentIds,
  incrementContentView 
} from '../services/contentService';

const ContentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getContentById(id);
        
        if (data) {
          setContent(data);
          
          // 조회수 증가
          incrementContentView(id);
          
          // 로그인 유저의 경우 좋아요 여부 확인
          if (isLoggedIn && user) {
            const likedIds = await getUserLikedContentIds(user.id);
            setIsLiked(likedIds.includes(id));
          }
        }
      } catch (error) {
        console.error('컨텐츠 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id, isLoggedIn, user]);

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (!content || !user) return;

    try {
      if (isLiked) {
        // 좋아요 취소
        const success = await unlikeContent(content.id, user.id);
        if (success) {
          setIsLiked(false);
          setContent({ ...content, like_count: content.like_count - 1 });
        }
      } else {
        // 좋아요 추가
        const success = await likeContent(content.id, user.id);
        if (success) {
          setIsLiked(true);
          setContent({ ...content, like_count: content.like_count + 1 });
        }
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleLoginRedirect = () => {
    // 현재 페이지 URL을 저장하고 로그인 페이지로 이동
    const currentPath = location.pathname;
    console.log('💾 Saving redirect path:', currentPath);
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    navigate('/login');
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

  if (!content) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8F90A6] mb-4">컨텐츠를 찾을 수 없습니다.</p>
          <button 
            onClick={() => navigate('/')} 
            className="text-[#FF5C02] font-medium"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      {/* 헤더 */}
      <header className="bg-white border-b border-[#E7EBEF] sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} className="text-[#1C1C1C]" />
          </button>
          <h1 className="text-lg font-bold text-[#1C1C1C]">육아 팁</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 대표 이미지 */}
      <div className="w-full aspect-video bg-gray-200">
        <img 
          src={content.thumbnail_url} 
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 컨텐츠 내용 */}
      <div className="bg-white">
        <div className="px-6 py-6 space-y-4">
          {/* 제목 */}
          <div>
            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">{content.title}</h2>
            {content.subtitle && (
              <p className="text-[#8F90A6] text-base">{content.subtitle}</p>
            )}
          </div>

          {/* 날짜 & 통계 */}
          <div className="flex items-center gap-4 text-xs text-[#8F90A6] pb-4 border-b border-[#E7EBEF]">
            {content.published_at && (
              <span>{new Date(content.published_at).toLocaleDateString('ko-KR')}</span>
            )}
            <span>조회 {content.view_count}</span>
            <span>좋아요 {content.like_count}</span>
          </div>

          {/* 본문 HTML */}
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content_html }}
          />
        </div>

        {/* 좋아요 버튼 */}
        <div className="px-6 py-6 border-t border-[#E7EBEF]">
          <button
            onClick={handleLikeClick}
            className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
              isLiked 
                ? 'bg-[#FF5C02] text-white' 
                : 'bg-[#F2F2F5] text-[#555770] hover:bg-[#E7EBEF]'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'white' : 'none'} />
            {isLiked ? '저장됨' : '저장하기'}
          </button>
        </div>
      </div>

      {/* 로그인 팝업 */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-[#1C1C1C] text-center">
              로그인이 필요합니다
            </h3>
            <p className="text-sm text-[#8F90A6] text-center">
              로그인 하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 py-3 px-4 rounded-lg font-bold bg-[#F2F2F5] text-[#555770] hover:bg-[#E7EBEF]"
              >
                아니오
              </button>
              <button
                onClick={handleLoginRedirect}
                className="flex-1 py-3 px-4 rounded-lg font-bold bg-[#FF5C02] text-white hover:bg-[#E54D00]"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetail;
