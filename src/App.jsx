import React, { useState } from 'react';
import { 
  QrCode, 
  ScanLine, 
  Award, 
  Leaf, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Download,
  Loader2,
  Recycle
} from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function EcoRecycleApp() {
  const [activeTab, setActiveTab] = useState('scan');
  const [points, setPoints] = useState(150);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans text-gray-800">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        <header className="bg-emerald-600 text-white p-4 shadow-md z-10 flex items-center justify-center gap-2 rounded-b-2xl">
          <Leaf className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wide">EcoRecycle</h1>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 p-4">
          {activeTab === 'generate' && <GenerateTab />}
          {activeTab === 'scan' && <ScanTab addPoints={(p) => setPoints(prev => prev + p)} />}
          {activeTab === 'rewards' && <RewardsTab points={points} />}
        </main>

        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-between px-6 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 rounded-t-2xl">
          <NavButton 
            icon={<ScanLine />} 
            label="Scan" 
            isActive={activeTab === 'scan'} 
            onClick={() => setActiveTab('scan')} 
          />
          <NavButton 
            icon={<QrCode />} 
            label="Generate" 
            isActive={activeTab === 'generate'} 
            onClick={() => setActiveTab('generate')} 
          />
          <NavButton 
            icon={<Award />} 
            label="Rewards" 
            isActive={activeTab === 'rewards'} 
            onClick={() => setActiveTab('rewards')} 
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-16 transition-colors duration-200 ${
        isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function GenerateTab() {
  const [formData, setFormData] = useState({
    name: '1L Pepsi Bottle',
    plasticType: 'PET',
    recyclable: true,
    process: 'Shredding and melting into fibers'
  });
  const [qrUrl, setQrUrl] = useState('');

  const plasticTypes = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'];

  const handleGenerate = () => {
    const dataString = JSON.stringify(formData);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dataString)}&margin=10`;
    setQrUrl(url);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.name.replace(/\s+/g, '-')}-QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
        <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2 mb-1">
          <QrCode className="w-5 h-5" />
          Factory QR Generator
        </h2>
        <p className="text-sm text-emerald-600">Create product labels for the manufacturing unit.</p>
      </div>

      <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="e.g., 1L Pepsi Bottle"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Plastic Type</label>
          <select 
            value={formData.plasticType}
            onChange={(e) => setFormData({...formData, plasticType: e.target.value})}
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white transition-all"
          >
            {plasticTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <input 
            type="checkbox" 
            id="recyclable"
            checked={formData.recyclable}
            onChange={(e) => setFormData({...formData, recyclable: e.target.checked})}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-500"
          />
          <label htmlFor="recyclable" className="text-sm font-semibold text-gray-700">Is Recyclable?</label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Recycling Process Details</label>
          <textarea 
            value={formData.process}
            onChange={(e) => setFormData({...formData, process: e.target.value})}
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[80px] transition-all"
            placeholder="Describe how this is recycled..."
          />
        </div>

        <button 
          onClick={handleGenerate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <QrCode className="w-5 h-5" />
          Generate QR Code
        </button>
      </div>

      {qrUrl && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
          <h3 className="font-bold text-gray-700">Generated Tag</h3>
          <div className="p-2 border-4 border-emerald-500 rounded-xl bg-white shadow-sm">
            <img src={qrUrl} alt="Generated QR" className="w-48 h-48 object-contain" />
          </div>
          <button 
            onClick={handleDownload}
            className="w-full mt-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download for Factory
          </button>
        </div>
      )}
    </div>
  );
}

function ScanTab({ addPoints }) {
  const [scanState, setScanState] = useState('idle');
  const [product, setProduct] = useState(null);
  const [locationResult, setLocationResult] = useState(null);

  const handleScan = (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      try {
        const parsedData = JSON.parse(detectedCodes[0].rawValue);
        setProduct(parsedData);
        setScanState('scanned');
      } catch (err) {
        console.error("Invalid QR format: not JSON", err);
      }
    }
  };

  const handleRecycle = () => {
    setScanState('locating');
    setTimeout(() => {
      const isNearby = Math.random() > 0.5;
      setLocationResult(isNearby ? {
        type: 'nearby',
        message: 'Station 1.2km away - Drop off recommended',
        icon: <MapPin className="w-8 h-8 text-emerald-500" />
      } : {
        type: 'far',
        message: 'Too far - Arranging Delivery Boy Pickup',
        icon: <Truck className="w-8 h-8 text-blue-500" />
      });
      setScanState('result');
    }, 2000);
  };

  const handleConfirm = () => {
    addPoints(50);
    setScanState('completed');
  };

  const resetScanner = () => {
    setScanState('idle');
    setProduct(null);
    setLocationResult(null);
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {scanState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-6">
          <div className="w-full max-w-[280px] rounded-3xl overflow-hidden shadow-xl border-4 border-emerald-400 bg-black">
            {/* The new React-native scanner replaces the tricky useEffect block */}
            <Scanner 
              onScan={handleScan}
              formats={['qr_code']}
              components={{
                audio: false,
                finder: true,
              }}
              styles={{
                container: { width: '100%', aspectRatio: '1/1' }
              }}
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Ready to Scan</h2>
            <p className="text-gray-500 text-sm mt-1">Point your camera at the recycling QR</p>
          </div>
        </div>
      )}

      {scanState === 'scanned' && product && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Recycle className="w-24 h-24" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Scanned!</h2>
                <p className="text-emerald-600 font-medium text-sm">Product data retrieved</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Product</p>
                <p className="text-lg font-bold text-gray-800">{product.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Material</p>
                  <p className="font-bold text-gray-800">{product.plasticType || product.type}</p>
                </div>
                <div className={`p-3 rounded-xl border ${product.recyclable ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                  <p className={`font-bold ${product.recyclable ? 'text-emerald-700' : 'text-red-700'}`}>
                    {product.recyclable ? 'Recyclable' : 'Non-Recyclable'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Process</p>
                <p className="text-sm text-gray-700">{product.process}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleRecycle}
            disabled={!product.recyclable}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Recycle className="w-6 h-6" />
            Recycle Now
          </button>
        </div>
      )}

      {scanState === 'locating' && (
        <div className="flex-1 flex flex-col items-center justify-center mt-20 animate-in fade-in duration-300">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Finding nearest station...</h3>
          <p className="text-gray-500 mt-2 text-center max-w-[250px]">Analyzing your location and optimizing collection route.</p>
        </div>
      )}

      {scanState === 'result' && locationResult && (
        <div className="space-y-6 mt-8 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div className={`absolute inset-0 opacity-10 ${locationResult.type === 'nearby' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
            
            <div className="relative z-10 bg-white p-4 rounded-full shadow-md">
              {locationResult.icon}
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-gray-800 mb-2">
                {locationResult.type === 'nearby' ? 'Station Found!' : 'Pickup Arranged!'}
              </h2>
              <p className="text-gray-600 font-medium bg-white/80 p-3 rounded-xl">
                {locationResult.message}
              </p>
            </div>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
          >
            Confirm Action
          </button>
        </div>
      )}

      {scanState === 'completed' && (
        <div className="flex-1 flex flex-col items-center justify-center mt-12 animate-in zoom-in-50 duration-500">
          <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
            <Award className="w-16 h-16 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">+50 Points!</h2>
          <p className="text-gray-500 text-center mb-8 px-4">
            Thank you for recycling correctly. Your points have been added to your wallet!
          </p>
          
          <button 
            onClick={resetScanner}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-sm transition-colors border border-gray-300"
          >
            Scan Another Item
          </button>
        </div>
      )}
    </div>
  );
}

function RewardsTab({ points }) {
  const maxPoints = 500;
  const progressPercentage = Math.min((points / maxPoints) * 100, 100);

  let BadgeIcon = Leaf;
  let badgeName = "Seedling";
  let badgeColor = "text-green-500";
  let badgeBg = "bg-green-100";

  if (points >= 150 && points < 300) {
    BadgeIcon = Award;
    badgeName = "Eco Warrior";
    badgeColor = "text-emerald-500";
    badgeBg = "bg-emerald-100";
  } else if (points >= 300) {
    BadgeIcon = CheckCircle2;
    badgeName = "Planet Savior";
    badgeColor = "text-blue-500";
    badgeBg = "bg-blue-100";
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <Leaf className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-10" />
        <h2 className="text-emerald-100 font-medium mb-1">Total Rewards</h2>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-black tracking-tight">{points}</span>
          <span className="text-emerald-200 mb-1 font-bold">pts</span>
        </div>
        
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-sm font-medium text-emerald-100">
            <span>Next milestone: {maxPoints} pts</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-emerald-900/40 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${badgeBg}`}>
          <BadgeIcon className={`w-8 h-8 ${badgeColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Current Rank</p>
          <h3 className="text-xl font-bold text-gray-800">{badgeName}</h3>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">Recent Activity</h3>
        <div className="space-y-3">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <Recycle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Recycled 1L Pepsi</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <span className="font-bold text-emerald-600">+50</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between opacity-70">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <Recycle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Recycled Cardboard Box</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            <span className="font-bold text-emerald-600">+100</span>
          </div>

        </div>
      </div>

    </div>
  );
}
