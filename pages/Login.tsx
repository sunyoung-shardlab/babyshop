
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/profile-setup');
  };

  return (
    <div className="p-10 flex flex-col h-full justify-center space-y-12 bg-[#FDFBF7]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold hand-drawn-font text-[#800020]">다시 오신 것을 환영합니다!</h1>
        <p className="text-sm text-gray-500">로그인하여 아기를 위한 특별 혜택을 받아보세요.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border py-4 rounded-2xl font-bold shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
          구글로 계속하기
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FDFBF7] px-2 text-gray-400">또는 직접 로그인</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input 
            type="text" 
            placeholder="아이디 / 이메일" 
            className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none"
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none"
          />
          <button type="submit" className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg">
            로그인
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400">
        K-Baby가 처음이신가요? <span className="text-[#800020] font-bold cursor-pointer underline">계정 만들기</span>
      </p>
    </div>
  );
};

export default Login;
