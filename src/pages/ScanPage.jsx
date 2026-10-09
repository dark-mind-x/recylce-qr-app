import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle2, MapPin, Truck, Loader2, Recycle, Award, ChevronRight } from 'lucide-react';
import { TIERS } from '../constants/tiers';

export default function ScanPage({ points, user, openAuth, addPoints }) {
  const [scanState, setScanState] = useState('idle');
  const [product, setProduct] = useState(null);
  const [locationResult, setLocationResult] = useState(null);

  // Calculate current tier and progress
  const currentTierIndex = TIERS.findIndex((tier) => points >= tier.min && points < tier.max);
  const activeTier = TIERS[currentTierIndex] || TIERS[TIERS.length - 1];
  const nextTier = TIERS[currentTierIndex + 1];

  let progress = 100;
  if (nextTier) {
    const tierRange = nextTier.min - activeTier.min;
    const currentProgress = points - activeTier.min;
    progress = Math.min(Math.round((currentProgress / tierRange) * 100), 100);
  }

  const ActiveIcon = activeTier.icon;

  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      try {
        setProduct(JSON.parse(detectedCodes[0].rawValue));
        setScanState('scanned');
      } catch (err) {
        console.error("Scanned data is not valid JSON:", err);
      }
    }
  };

  const handleRecycle = () => {
    setScanState('locating');
    setTimeout(() => {
      const isNearby = Math.random() > 0.5;
      setLocationResult(isNearby ? {
        type: 'nearby', message: 'Station 1.2km away - Drop off recommended', icon: <MapPin className="w-8 h-8 text-emerald-500" />
      } : {
        type: 'far', message: 'Too far - Arranging Delivery Boy Pickup', icon: <Truck className="w-8 h-8 text-blue-500" />
      });
      setScanState('result');
    }, 1800);
  };

  const handleConfirm = () => { addPoints(50); setScanState('completed'); };

  return (
    <div className="flex flex-col h-full space-y-4">
      
      {/* QUICK-STATS HEADER CARD */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden shrink-0">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-white/20 backdrop-blur-sm`}>
              <ActiveIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Current Rank</p>
              <h3 className="text-sm font-bold leading-tight">{activeTier.name}</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black tracking-tight">{points}</span>
            <span className="text-xs font-semibold text-emerald-200 ml-1">pts</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-emerald-100">
            <span>{nextTier ? `Next: ${nextTier.name}` : 'Max Tier'}</span>
            <span>{nextTier ? `${nextTier.min - points} pts to level up` : 'Unlocked All'}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Guest Warning Pill if applicable */}
        {user?.isAnonymous && (
          <button 
            onClick={openAuth} 
            className="mt-3 w-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl flex items-center justify-between transition-all"
          >
            <span>Guest session: Save your points permanently</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SCANNER STATES */}
      {scanState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
          <div className="w-full max-w-[240px] rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-400 bg-black relative">
            <Scanner onScan={handleScan} formats={['qr_code']} components={{ audio: false, finder: true }} styles={{ container: { width: '100%', aspectRatio: '1/1' } }} />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800">Scan Product Label</h2>
            <p className="text-gray-500 text-xs mt-0.5">Point your camera at the packaging QR</p>
          </div>
        </div>
      )}

      {scanState === 'scanned' && product && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-white p-5 rounded-2xl shadow-md border relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-full animate-bounce"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div>
              <div><h2 className="text-xl font-black text-gray-800">Scanned!</h2><p className="text-emerald-600 font-medium text-xs">Product data retrieved</p></div>
            </div>
            <div className="space-y-2.5 relative z-10 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Product</p><p className="text-sm font-bold text-gray-800">{product.name}</p></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Material</p><p className="font-bold text-gray-800">{product.plasticType}</p></div>
                <div className={`p-2.5 rounded-xl border ${product.recyclable ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Status</p><p className={`font-bold ${product.recyclable ? 'text-emerald-700' : 'text-red-700'}`}>{product.recyclable ? 'Recyclable' : 'Non-Recyclable'}</p></div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Process</p><p className="text-xs text-gray-700">{product.process}</p></div>
            </div>
          </div>
          <button onClick={handleRecycle} disabled={!product.recyclable} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-base">
            <Recycle className="w-5 h-5" /> Recycle Now
          </button>
        </div>
      )}

      {scanState === 'locating' && (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 animate-in fade-in">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-3" />
          <h3 className="text-lg font-bold text-gray-800">Calculating route...</h3>
        </div>
      )}

      {scanState === 'result' && locationResult && (
        <div className="space-y-4 mt-4 animate-in slide-in-from-bottom-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full shadow-md bg-gray-50">{locationResult.icon}</div>
            <div>
              <h2 className="text-xl font-black text-gray-800 mb-1">{locationResult.type === 'nearby' ? 'Station Found!' : 'Pickup Scheduled!'}</h2>
              <p className="text-xs text-gray-600 font-medium bg-gray-50 p-2.5 rounded-xl">{locationResult.message}</p>
            </div>
          </div>
          <button onClick={handleConfirm} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">Confirm Action</button>
        </div>
      )}

      {scanState === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center mt-6 animate-in zoom-in-50">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 shadow-inner"><Award className="w-10 h-10 text-yellow-600" /></div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">+50 Points!</h2>
          <p className="text-gray-500 text-xs text-center mb-6 px-4">Action verified. Your eco-points are saved.</p>
          <button onClick={() => { setScanState('idle'); setProduct(null); setLocationResult(null); }} className="bg-gray-100 text-gray-800 font-bold py-2.5 px-6 rounded-full border text-xs">Scan Another Item</button>
        </div>
      )}
    </div>
  );
}
