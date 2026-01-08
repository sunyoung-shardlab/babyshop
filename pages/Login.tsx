import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle, validateUsername, validatePassword } from '../services/authService';
import { COLORS } from '../constants';

const Login: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      alert(error.message || '구글 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = '아이디 또는 이메일을 입력해주세요.';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      // 이메일 형식인지 확인
      const isEmail = formData.emailOrUsername.includes('@');
      
      if (!isEmail) {
        // 아이디로 로그인 시도 시 - 실제로는 이메일이 필요하므로 에러 메시지 표시
        newErrors.emailOrUsername = '이메일 주소를 입력해주세요.';
        setErrors(newErrors);
        setLoading(false);
        return;
      }
      
      const { user } = await signInWithEmail(formData.emailOrUsername, formData.password);
      onLogin(user);
      navigate('/profile-setup');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert(error.message || '로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col h-full justify-center space-y-12 bg-[#FDFBF7]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold hand-drawn-font text-[#800020]">다시 오신 것을 환영합니다!</h1>
        <p className="text-sm text-gray-500">로그인하여 아기를 위한 특별 혜택을 받아보세요.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border py-4 rounded-2xl font-bold shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
          구글로 계속하기
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FDFBF7] px-2 text-gray-400">또는 직접 로그인</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <input 
              type="text" 
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="이메일" 
              className={`w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none ${errors.emailOrUsername ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.emailOrUsername && <p className="text-red-500 text-xs mt-1 ml-2">{errors.emailOrUsername}</p>}
          </div>

          <div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호" 
              className={`w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none ${errors.password ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#600018] transition-colors disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400">
        K-Baby가 처음이신가요?{' '}
        <span 
          onClick={() => navigate('/signup')} 
          className="text-[#800020] font-bold cursor-pointer underline"
        >
          계정 만들기
        </span>
      </p>
    </div>
  );
};

export default Login;
