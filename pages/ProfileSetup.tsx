
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    babyAge: 6,
    gender: 'boy',
    needsHalal: true,
    personality: 'active',
  });

  const handleFinish = () => {
    navigate('/welcome-coupon');
  };

  return (
    <div className="p-8 space-y-10">
      <div className="space-y-2">
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#800020]' : 'bg-gray-200'}`}></div>
          ))}
        </div>
        <h1 className="text-2xl font-bold hand-drawn-font">아기에 대해 알려주세요</h1>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="font-bold text-gray-700">아이는 몇 개월인가요? (개월)</label>
            <div className="grid grid-cols-4 gap-3">
              {[6, 12, 18, 24, 30].map(m => (
                <button 
                  key={m}
                  onClick={() => setProfile({...profile, babyAge: m})}
                  className={`py-3 rounded-xl border-2 font-bold ${profile.babyAge === m ? 'border-[#800020] bg-pink-50 text-[#800020]' : 'border-gray-100'}`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="font-bold text-gray-700">성별</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setProfile({...profile, gender: 'boy'})}
                className={`flex-1 py-4 rounded-xl border-2 font-bold ${profile.gender === 'boy' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100'}`}
              >
                남아
              </button>
              <button 
                onClick={() => setProfile({...profile, gender: 'girl'})}
                className={`flex-1 py-4 rounded-xl border-2 font-bold ${profile.gender === 'girl' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-100'}`}
              >
                여아
              </button>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold">다음</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="font-bold text-gray-700">식이 선호도</label>
            <div className="p-4 border-2 rounded-2xl flex items-center justify-between">
              <span className="font-medium text-gray-600">엄격한 할랄 인증만</span>
              <input 
                type="checkbox" 
                checked={profile.needsHalal}
                onChange={(e) => setProfile({...profile, needsHalal: e.target.checked})}
                className="w-6 h-6 accent-[#800020]"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="font-bold text-gray-700">아이의 성격</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {id: 'active', label: '활발한 블루', color: 'blue'},
                {id: 'calm', label: '차분한 핑크', color: 'pink'},
                {id: 'smiley', label: '웃음 많은 옐로우', color: 'yellow'},
                {id: 'shy', label: '수줍은 오렌지', color: 'orange'}
              ].map(p => (
                <button 
                  key={p.id}
                  onClick={() => setProfile({...profile, personality: p.id})}
                  className={`py-4 rounded-xl border-2 text-xs font-bold ${profile.personality === p.id ? `border-[#800020] bg-[#800020]/5` : 'border-gray-100'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 border py-4 rounded-2xl font-bold">이전</button>
            <button onClick={handleFinish} className="flex-[2] bg-[#800020] text-white py-4 rounded-2xl font-bold">완료</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSetup;
