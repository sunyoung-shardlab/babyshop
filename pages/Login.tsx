
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
        <h1 className="text-4xl font-bold hand-drawn-font text-[#800020]">Welcome Back!</h1>
        <p className="text-sm text-gray-500">Sign in to unlock exclusive deals for your baby.</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border py-4 rounded-2xl font-bold shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
          Continue with Google
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FDFBF7] px-2 text-gray-400">Or Direct Login</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input 
            type="text" 
            placeholder="ID / Email" 
            className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-[#800020] outline-none"
          />
          <button type="submit" className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg">
            Sign In
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-gray-400">
        New to K-Baby? <span className="text-[#800020] font-bold cursor-pointer underline">Create Account</span>
      </p>
    </div>
  );
};

export default Login;
