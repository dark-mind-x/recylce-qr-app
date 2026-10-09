import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { CheckCircle2, MapPin, Truck, Loader2, Recycle, Award } from 'lucide-react';

export default function ScanPage({ addPoints }) {
  const [scanState, setScanState] = useState('idle');
  const [product, setProduct] = useState(null);
  const [locationResult, setLocationResult] = useState(null);

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
    <div className="flex flex-col h-full space-y-6">
      {scanState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-6 animate-in fade-in duration-500">
          <div className="w-full max-w-[280px] rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-400 bg-black relative">
            <Scanner onScan={handleScan} formats={['qr_code']} components={{ audio: false, finder: true }} styles={{ container: { width: '100%', aspectRatio: '1/1' } }} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Scan Product Label</h2>
            <p className="text-gray-500 text-sm mt-1">Point your camera at the packaging QR</p>
          </div>
        </div>
      )}

      {scanState === 'scanned' && product && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-md border relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-full animate-bounce"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></div>
              <div><h2 className="text-2xl font-black text-gray-800">Scanned!</h2><p className="text-emerald-600 font-medium text-sm">Product data retrieved</p></div>
            </div>
            <div className="space-y-3 relative z-10">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Product</p><p className="text-lg font-bold text-gray-800">{product.name}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Material</p><p className="font-bold text-gray-800">{product.plasticType}</p></div>
                <div className={`p-3 rounded-xl border ${product.recyclable ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p><p className={`font-bold ${product.recyclable ? 'text-emerald-700' : 'text-red-700'}`}>{product.recyclable ? 'Recyclable' : 'Non-Recyclable'}</p></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Process</p><p className="text-sm text-gray-700">{product.process}</p></div>
            </div>
          </div>
          <button onClick={handleRecycle} disabled={!product.recyclable} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg">
            <Recycle className="w-6 h-6" /> Recycle Now
          </button>
        </div>
      )}

      {scanState === 'locating' && (
        <div className="flex-1 flex flex-col items-center justify-center mt-20 animate-in fade-in">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Calculating route...</h3>
        </div>
      )}

      {scanState === 'result' && locationResult && (
        <div className="space-y-6 mt-8 animate-in slide-in-from-bottom-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full shadow-md bg-gray-50">{locationResult.icon}</div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">{locationResult.type === 'nearby' ? 'Station Found!' : 'Pickup Scheduled!'}</h2>
              <p className="text-gray-600 font-medium bg-gray-50 p-3 rounded-xl">{locationResult.message}</p>
            </div>
          </div>
          <button onClick={handleConfirm} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl">Confirm Action</button>
        </div>
      )}

      {scanState === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 animate-in zoom-in-50">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner"><Award className="w-12 h-12 text-yellow-600" /></div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">+50 Points!</h2>
          <p className="text-gray-500 text-center mb-8 px-4">Action verified. Your eco-points are saved.</p>
          <button onClick={() => { setScanState('idle'); setProduct(null); setLocationResult(null); }} className="bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-full border">Scan Another Item</button>
        </div>
      )}
    </div>
  );
}
