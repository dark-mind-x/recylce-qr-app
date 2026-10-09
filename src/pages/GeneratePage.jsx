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
      <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900 transition-colors">
        <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-1">
          <QrCode className="w-5 h-5" /> Factory QR Generator
        </h2>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">Create product labels for the manufacturing unit.</p>
      </div>

      <div className="space-y-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-800 dark:text-white outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Plastic Type</label>
          <select value={formData.plasticType} onChange={(e) => setFormData({...formData, plasticType: e.target.value})} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-800 dark:text-white outline-none">
            {plasticTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <input type="checkbox" id="recyclable" checked={formData.recyclable} onChange={(e) => setFormData({...formData, recyclable: e.target.checked})} className="w-5 h-5 accent-emerald-600 rounded" />
          <label htmlFor="recyclable" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Is Recyclable?</label>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Recycling Process Details</label>
          <textarea value={formData.process} onChange={(e) => setFormData({...formData, process: e.target.value})} className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-800 dark:text-white outline-none min-h-[80px]" />
        </div>
        <button onClick={handleGenerate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
          <QrCode className="w-5 h-5" /> Generate QR Code
        </button>
      </div>

      {qrUrl && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700 flex flex-col items-center gap-4 animate-in zoom-in duration-300 transition-colors">
          <h3 className="font-bold text-gray-700 dark:text-gray-200">Generated Tag</h3>
          <div className="p-2 border-4 border-emerald-500 rounded-xl bg-white"><img src={qrUrl} alt="QR" className="w-48 h-48 object-contain" /></div>
          <button onClick={handleDownload} className="w-full bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
            <Download className="w-5 h-5" /> Download for Factory
          </button>
        </div>
      )}
    </div>
  );
}
