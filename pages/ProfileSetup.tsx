
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
        <h1 className="text-2xl font-bold hand-drawn-font">Tell us about your baby</h1>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="font-bold text-gray-700">How old is your little one? (Months)</label>
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
            <label className="font-bold text-gray-700">Gender</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setProfile({...profile, gender: 'boy'})}
                className={`flex-1 py-4 rounded-xl border-2 font-bold ${profile.gender === 'boy' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-100'}`}
              >
                Boy
              </button>
              <button 
                onClick={() => setProfile({...profile, gender: 'girl'})}
                className={`flex-1 py-4 rounded-xl border-2 font-bold ${profile.gender === 'girl' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-100'}`}
              >
                Girl
              </button>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="font-bold text-gray-700">Dietary Preferences</label>
            <div className="p-4 border-2 rounded-2xl flex items-center justify-between">
              <span className="font-medium text-gray-600">Strict Halal Certified Only</span>
              <input 
                type="checkbox" 
                checked={profile.needsHalal}
                onChange={(e) => setProfile({...profile, needsHalal: e.target.checked})}
                className="w-6 h-6 accent-[#800020]"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="font-bold text-gray-700">Baby's Personality</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {id: 'active', label: 'Active Blue', color: 'blue'},
                {id: 'calm', label: 'Calm Pink', color: 'pink'},
                {id: 'smiley', label: 'Smiley Yellow', color: 'yellow'},
                {id: 'shy', label: 'Shy Orange', color: 'orange'}
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
            <button onClick={() => setStep(1)} className="flex-1 border py-4 rounded-2xl font-bold">Back</button>
            <button onClick={handleFinish} className="flex-[2] bg-[#800020] text-white py-4 rounded-2xl font-bold">Finish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSetup;
