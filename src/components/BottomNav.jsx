import React from 'react';
import { ScanLine, QrCode, Award } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'scan', label: 'Scan', icon: ScanLine },
    { id: 'generate', label: 'Generate', icon: QrCode },
    { id: 'rewards', label: 'Rewards', icon: Award }
  ];

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900 px-6 pb-6 pt-2 shrink-0 transition-colors duration-300">
      <nav className="w-full bg-white dark:bg-gray-800 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-[24px] z-20 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="relative flex w-full">
          
          <div 
            className="absolute top-0 left-0 h-full flex justify-center items-start transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-0"
            style={{ 
              width: `${100 / tabs.length}%`, 
              transform: `translateX(${activeIndex * 100}%)` 
            }}
          >
            <div className="w-16 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
          </div>

          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 flex flex-col items-center pt-0 pb-1 group z-10"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="relative flex items-center justify-center w-16 h-8 mb-1">
                  <Icon 
                    className={`relative z-10 w-5 h-5 transition-all duration-500 ${
                      isActive 
                        ? 'text-white scale-110 drop-shadow-sm' 
                        : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200'
                    }`} 
                  />
                </div>
                <span 
                  className={`text-[10px] font-bold tracking-wide transition-all duration-500 ${
                    isActive ? 'text-emerald-700 dark:text-emerald-300 opacity-100' : 'text-gray-400 opacity-70 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
