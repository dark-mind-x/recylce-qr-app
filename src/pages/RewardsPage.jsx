import React from 'react';
import { Leaf } from 'lucide-react';
import { TIERS } from '../constants/tiers';

export default function RewardsPage({ points, isGuest, openAuth }) {
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {isGuest && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 flex items-center justify-between transition-colors">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">Guest Session</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">Save progress permanently</p>
          </div>
          <button onClick={openAuth} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow">Save Points</button>
        </div>
      )}

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-900 dark:to-emerald-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-colors">
        <Leaf className="absolute -right-6 -bottom-6 w-32 h-32 text-white opacity-10" />
        <h2 className="text-emerald-100 font-medium mb-1">Total Rewards</h2>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-black tracking-tight">{points}</span>
          <span className="text-emerald-200 mb-1 font-bold">pts</span>
        </div>
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-sm font-medium text-emerald-100">
            <span>{nextTier ? `Next: ${nextTier.name}` : 'Max Tier Achieved'}</span>
            <span>{nextTier ? `${nextTier.min - points} pts left` : '100%'}</span>
          </div>
          <div className="w-full bg-emerald-900/40 rounded-full h-3 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
        <div className={`p-4 rounded-2xl ${activeTier.bg}`}><ActiveIcon className={`w-8 h-8 ${activeTier.color}`} /></div>
        <div><p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Current Rank</p><h3 className="text-xl font-bold text-gray-800 dark:text-white">{activeTier.name}</h3></div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 px-1">Rank Progression</h3>
        <div className="space-y-2.5">
          {TIERS.map((tier) => {
            const isUnlocked = points >= tier.min;
            const TierIcon = tier.icon;
            return (
              <div key={tier.name} className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${isUnlocked ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-900/60 shadow-sm' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isUnlocked ? tier.bg : 'bg-gray-200 dark:bg-gray-700'}`}><TierIcon className={`w-4 h-4 ${isUnlocked ? tier.color : 'text-gray-400'}`} /></div>
                  <div><p className="font-bold text-xs text-gray-800 dark:text-white">{tier.name}</p><p className="text-[10px] text-gray-500 dark:text-gray-400">{tier.min} pts required</p></div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isUnlocked ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>{isUnlocked ? 'Unlocked' : 'Locked'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
