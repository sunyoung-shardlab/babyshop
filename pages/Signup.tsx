import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, signInWithGoogle, validateUsername, validatePassword, validatePasswordMatch } from '../services/authService';
import { COLORS } from '../constants';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      alert(error.message || '구글 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    const newErrors: { [key: string]: string } = {};
    
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.valid) {
      newErrors.username = usernameValidation.message!;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = '올바른 이메일 주소를 입력해주세요.';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message!;
    }
    
    const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!passwordMatchValidation.valid) {
      newErrors.confirmPassword = passwordMatchValidation.message!;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      await signUpWithEmail(formData.email, formData.password, formData.username);
      alert('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
      navigate('/login');
    } catch (error: any) {
      alert(error.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col h-full justify-center space-y-8 bg-[#FDFBF7]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold hand-drawn-font text-[#800020]">환영합니다!</h1>
        <p className="text-sm text-gray-500">계정을 만들고 특별한 혜택을 받아보세요.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border py-4 rounded-2xl font-bold shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
          구글로 계속하기
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FDFBF7] px-2 text-gray-400">또는</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디 (5자 이상, 영문/숫자)" 
              className={`w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none ${errors.username ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1 ml-2">{errors.username}</p>}
          </div>

          <div>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일" 
              className={`w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none ${errors.email ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
          </div>
          
          <div>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 (6자 이상)" 
              className={`w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none ${errors.password ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>}
          </div>

          <div>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 확인" 
              className={`w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none ${errors.confirmPassword ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#600018] transition-colors disabled:opacity-50"
          >
            {loading ? '처리중...' : '회원가입'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400">
        이미 계정이 있으신가요?{' '}
        <span 
          onClick={() => navigate('/login')} 
          className="text-[#800020] font-bold cursor-pointer underline"
        >
          로그인하기
        </span>
      </p>
    </div>
  );
};

export default Signup;
