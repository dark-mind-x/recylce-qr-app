import React, { useState } from 'react';
import { User, LogOut, Loader2, X } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { db, auth } from '../firebase';

export default function AuthModal({ currentUser, currentPoints, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          points: currentPoints,
          email: cred.user.email,
          isAnonymous: false
        }, { merge: true });
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', cred.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          points: currentPoints,
          email: cred.user.email,
          isAnonymous: false
        }, { merge: true });
      }
      
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {!currentUser?.isAnonymous ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Account Profile</h2>
              <p className="text-sm text-gray-500 mt-1">{currentUser?.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3 px-4 rounded-xl hover:bg-red-100 transition-colors active:scale-95">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6 mt-2">
              <h2 className="text-xl font-bold text-gray-800">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {isLogin ? 'Sign in to access your synchronized points' : 'Register now to save your guest points permanently'}
              </p>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4 font-medium">{error}</div>}

            <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558l3.793 2.987z"/>
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4 opacity-60">
              <div className="flex-1 h-px bg-gray-400"></div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or email</span>
              <div className="flex-1 h-px bg-gray-400"></div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="name@example.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLogin ? 'Sign In with Email' : 'Register with Email'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs text-emerald-600 font-semibold hover:underline">
                {isLogin ? "Don't have an account? Sign up" : 'Already registered? Log in'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
