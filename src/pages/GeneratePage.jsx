import React, { useState } from 'react';
import { QrCode, Download } from 'lucide-react';

export default function GeneratePage() {
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
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dataString)}&margin=10`);
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
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
        <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2 mb-1">
          <QrCode className="w-5 h-5" /> Factory QR Generator
        </h2>
        <p className="text-sm text-emerald-600">Create product labels for the manufacturing unit.</p>
      </div>

      <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-1 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Plastic Type</label>
          <select value={formData.plasticType} onChange={(e) => setFormData({...formData, plasticType: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-1 focus:ring-emerald-500 outline-none bg-white">
            {plasticTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <input type="checkbox" id="recyclable" checked={formData.recyclable} onChange={(e) => setFormData({...formData, recyclable: e.target.checked})} className="w-5 h-5 accent-emerald-600 rounded" />
          <label htmlFor="recyclable" className="text-sm font-semibold text-gray-700">Is Recyclable?</label>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Recycling Process Details</label>
          <textarea value={formData.process} onChange={(e) => setFormData({...formData, process: e.target.value})} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-1 focus:ring-emerald-500 outline-none min-h-[80px]" />
        </div>
        <button onClick={handleGenerate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" /> Generate QR Code
        </button>
      </div>

      {qrUrl && (
        <div className="bg-white p-6 rounded-2xl shadow-md border flex flex-col items-center gap-4 animate-in zoom-in duration-300">
          <h3 className="font-bold text-gray-700">Generated Tag</h3>
          <div className="p-2 border-4 border-emerald-500 rounded-xl bg-white"><img src={qrUrl} alt="QR" className="w-48 h-48 object-contain" /></div>
          <button onClick={handleDownload} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download for Factory
          </button>
        </div>
      )}
    </div>
  );
}
