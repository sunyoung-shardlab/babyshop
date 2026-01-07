
import React, { useState, useEffect } from 'react';
import { PRODUCTS, TIPS } from '../constants';
import { Page, Product } from '../types';
import { ChevronRight, Heart, BellRing, Sparkles, Zap } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page, product?: Product) => void;
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ onNavigate, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'tips'>('all');
  const [timeLeft, setTimeLeft] = useState('05:24:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const parts = prev.split(':').map(Number);
        let sec = parts[2] - 1;
        let min = parts[1];
        let hr = parts[0];
        if (sec < 0) { sec = 59; min -= 1; }
        if (min < 0) { min = 59; hr -= 1; }
        if (hr < 0) return '00:00:00';
        return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      {/* Hero Section with Spline */}
      <section className="relative h-96 w-full overflow-hidden bg-gray-50 border-b border-gray-100">
        <iframe 
          src='https://my.spline.design/100followersfocus-Fx8ph9RE4YH3TfnGXYmhE746/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="absolute inset-0 grayscale-[0.2]"
        ></iframe>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute bottom-10 left-6 text-white pointer-events-none drop-shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-burgundy text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New Season</span>
          </div>
          <h2 className="text-3xl font-black mb-1 leading-tight">Premium Korean<br/>Baby Snacks</h2>
          <p className="text-sm opacity-90 font-medium">안전하고 정직하게, 우리 아이의 첫 간식</p>
        </div>
      </section>

      {/* Push Notification Banner */}
      {!isLoggedIn && (
        <div className="mx-5 mt-6 p-4 bg-white rounded-2xl border border-burgundy/10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-burgundy/5 rounded-full flex items-center justify-center">
              <BellRing className="text-burgundy" size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800">첫 구매 시 5% 추가 할인!</p>
              <p className="text-[9px] text-gray-400">푸시 알림 켜고 혜택을 놓치지 마세요</p>
            </div>
          </div>
          <button className="text-[10px] bg-burgundy text-white px-4 py-1.5 rounded-full font-bold shadow-md transform active:scale-95 transition">알림 받기</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex px-5 mt-8 gap-8 border-b border-gray-100 sticky top-0 bg-[#fcfaf7]/80 backdrop-blur-md z-30 overflow-x-auto scrollbar-hide">
        {(['all', 'hot', 'tips'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-black transition-all whitespace-nowrap ${
              activeTab === tab ? 'text-burgundy border-b-[3px] border-burgundy' : 'text-gray-400'
            }`}
          >
            {tab === 'all' ? '전체 상품' : tab === 'hot' ? '주간 핫딜' : '육아 꿀팁'}
          </button>
        ))}
      </div>

      <div className="p-5 pb-10">
        {activeTab === 'all' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {PRODUCTS.map(product => (
              <div 
                key={product.id} 
                onClick={() => onNavigate('product-detail', product)}
                className="group flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-sm mb-3">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold backdrop-blur-md ${product.type === 'limited' ? 'bg-red-500/80 text-white' : 'bg-white/80 text-gray-800'}`}>
                      {product.type === 'limited' ? 'HOT DEAL' : 'BEST'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-burgundy font-black text-sm">RM {product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 font-bold">₩{product.krPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hot' && (
          <div className="space-y-6">
             <div className="p-5 bg-burgundy rounded-[32px] text-white shadow-xl shadow-burgundy/20 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               <div className="relative z-10 flex justify-between items-center mb-6">
                 <div>
                   <h3 className="font-black text-xl flex items-center gap-2">
                     <Zap size={20} className="fill-yellow-400 text-yellow-400" />
                     WEEKLY HOT DEAL
                   </h3>
                   <p className="text-[10px] opacity-80 mt-1 font-medium">최대 60% 할인된 가격으로 만나보세요</p>
                 </div>
                 <div className="text-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl">
                   <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Ending in</p>
                   <p className="text-sm font-black font-mono tracking-tighter">{timeLeft}</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 {PRODUCTS.filter(p => p.type === 'limited').map(product => (
                    <div key={product.id} onClick={() => onNavigate('product-detail', product)} className="bg-white p-2.5 rounded-2xl cursor-pointer hover:shadow-lg transition">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                        <img src={product.image} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-tl-lg">
                          SAVE 40%
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-burgundy font-black text-xs mt-1">RM {product.price}</p>
                    </div>
                 ))}
               </div>
             </div>
             
             <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-black text-gray-800">Coming Soon Next Week</h3>
                 <Sparkles size={16} className="text-yellow-500" />
               </div>
               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                 {[1,2,3].map(i => (
                   <div key={i} className="min-w-[140px] flex flex-col">
                      <div className="aspect-[4/5] bg-gray-100 rounded-2xl flex items-center justify-center grayscale opacity-40 mb-2 border border-dashed border-gray-300">
                        <span className="text-[10px] font-black text-gray-400 tracking-tighter">PRE-RELEASE</span>
                      </div>
                      <div className="h-2 w-2/3 bg-gray-100 rounded-full mb-1"></div>
                      <div className="h-2 w-1/3 bg-gray-100 rounded-full"></div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="p-5 bg-craft rounded-3xl border border-burgundy/5 flex flex-col gap-2 mb-6">
              <h3 className="font-black text-burgundy">Weekly Parenting Pick</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">말레이시아 덥고 습한 날씨, 우리 아이 간식 보관은 어떻게 해야 할까요? 현지 맘들의 꿀팁을 확인하세요.</p>
            </div>
            {TIPS.map(tip => (
              <div key={tip.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex gap-4 items-center shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-xl shrink-0">🍼</div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{tip.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-400 font-medium">By {tip.author}</span>
                    <div className="flex items-center gap-1">
                      <Heart size={10} className="text-red-400 fill-red-400" />
                      <span className="text-[9px] font-bold text-gray-500">{tip.likes}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
