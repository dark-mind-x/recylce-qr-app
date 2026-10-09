import React from 'react';
import { X } from 'lucide-react';

export default function LevelUpModal({ tier, onClose }) {
  const TierIcon = tier.icon;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative text-center animate-in zoom-in-95 duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-300/30 to-transparent opacity-50"></div>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="relative z-10">
          <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner ${tier.bg} animate-bounce`}>
            <TierIcon className={`w-14 h-14 ${tier.color}`} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Level Up!</h2>
          <p className="text-gray-500 mb-8 px-2 leading-relaxed">
            Congratulations! Your eco-efforts have promoted you to the rank of <strong className={tier.color}>{tier.name}</strong>.
          </p>
          <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
            Claim New Rank
          </button>
        </div>
      </div>
    </div>
  );
}
