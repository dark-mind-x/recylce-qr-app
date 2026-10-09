import React, { useState, useEffect } from 'react';
import { Leaf, User, Sun, Moon } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import { TIERS } from './constants/tiers';

import BottomNav from './components/BottomNav';
import AuthModal from './components/AuthModal';
import LevelUpModal from './components/LevelUpModal';
import ScanPage from './pages/ScanPage';
import GeneratePage from './pages/GeneratePage';
import RewardsPage from './pages/RewardsPage';

export default function ReplastIQApp() {
  const [activeTab, setActiveTab] = useState('scan');
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [unlockedTier, setUnlockedTier] = useState(null);
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('replastiq_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('replastiq_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setPoints(userDoc.data().points || 0);
        } else {
          await setDoc(userRef, { points: 0, isAnonymous: currentUser.isAnonymous });
          setPoints(0);
        }
      } else {
        signInAnonymously(auth).catch((err) => console.error("Guest login failed:", err));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddPoints = async (earnedPoints) => {
    if (!user) return;
    
    const oldPoints = points;
    const newTotal = oldPoints + earnedPoints;
    
    const oldTier = TIERS.find(t => oldPoints >= t.min && oldPoints < t.max) || TIERS[TIERS.length - 1];
    const newTier = TIERS.find(t => newTotal >= t.min && newTotal < t.max) || TIERS[TIERS.length - 1];

    if (oldTier.name !== newTier.name && newTotal > oldPoints) {
      setUnlockedTier(newTier);
    }

    setPoints(newTotal);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { points: newTotal }, { merge: true });
    } catch (error) {
      console.error("Error saving points:", error);
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} h-[100dvh] bg-gray-900 flex justify-center font-sans text-gray-800`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
        
        <header className="bg-emerald-600 dark:bg-emerald-800 text-white p-4 shadow-md z-10 flex items-center justify-between rounded-b-2xl shrink-0 transition-all duration-300">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-wide">ReplastIQ</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="bg-emerald-700/80 hover:bg-emerald-800 p-2 rounded-full text-white backdrop-blur-sm border border-emerald-400/30 transition-all active:scale-95"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setShowAuthModal(true)} 
              className="flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-emerald-400/30 transition-all active:scale-95"
            >
              <User className="w-4 h-4" />
              {user?.isAnonymous ? 'Guest' : (user?.email?.split('@')[0] || 'Account')}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-2 bg-gray-50/50 dark:bg-gray-900 transition-colors duration-300">
          {activeTab === 'generate' && <GeneratePage />}
          {activeTab === 'scan' && <ScanPage points={points} user={user} openAuth={() => setShowAuthModal(true)} addPoints={handleAddPoints} />}
          {activeTab === 'rewards' && <RewardsPage points={points} isGuest={user?.isAnonymous} openAuth={() => setShowAuthModal(true)} />}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {showAuthModal && <AuthModal currentUser={user} currentPoints={points} onClose={() => setShowAuthModal(false)} />}
        {unlockedTier && <LevelUpModal tier={unlockedTier} onClose={() => setUnlockedTier(null)} />}
        
      </div>
    </div>
  );
}
