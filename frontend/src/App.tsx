import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getLocalUser, setOnboardingStatus } from './services/storageService';
import { ClosetRoom } from './components/ClosetRoom';
import { MirrorRoom } from './components/MirrorRoom';
import { LivingRoom } from './components/LivingRoom';
import { Onboarding } from './components/Onboarding';

type View = 'onboarding' | 'closet' | 'mirror' | 'livingroom';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('closet');

  useEffect(() => {
    const localUser = getLocalUser();
    setUser(localUser);

    if (localUser.hasOnboarded) {
      setView('closet');
    } else {
      setView('onboarding');
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardingStatus(true);
    setUser((prev) => (prev ? { ...prev, hasOnboarded: true } : getLocalUser()));
    setView('closet');
  };

  const renderView = () => {
    switch (view) {
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'closet':
        return <ClosetRoom />;
      case 'mirror':
        return <MirrorRoom />;
      case 'livingroom':
        return <LivingRoom />;
      default:
        return <ClosetRoom />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {user && user.hasOnboarded && (
        <nav className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">
          <div className="font-bold text-xl text-gray-800">CH</div>
          <div className="flex flex-col gap-6 mt-12">
            <button
              onClick={() => setView('closet')}
              title="Closet"
              className={`p-3 rounded-lg transition-all ${
                view === 'closet' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v2m0 0v1m0-1H9m3 0h3m-3 18v-2m0 0v-1m0 1H9m3 0h3" /></svg>
            </button>
            <button
              onClick={() => setView('mirror')}
              title="Magic Mirror"
              className={`p-3 rounded-lg transition-all ${
                view === 'mirror' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-6.857 2.143L12 21l-2.143-6.857L3 12l6.857-2.143L12 3z" /></svg>
            </button>
            <button
              onClick={() => setView('livingroom')}
              title="Living Room (Outfits)"
              className={`p-3 rounded-lg transition-all ${
                view === 'livingroom' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
          </div>
        </nav>
      )}
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;