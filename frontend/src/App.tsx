import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Room, UserImages, ClothingItem, Outfit } from './types';
import Onboarding from './components/Onboarding';
import LivingRoom from './components/LivingRoom';
import ClosetRoom from './components/ClosetRoom';
import MirrorRoom from './components/MirrorRoom';
import * as db from './services/db';

const useScreenHeight = () => {
  useLayoutEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setHeight);
    setHeight();
    return () => window.removeEventListener('resize', setHeight);
  }, []);
};


const App: React.FC = () => {
  useScreenHeight();
  const [room, setRoom] = useState<Room>(Room.ONBOARDING);
  const [userImages, setUserImages] = useState<UserImages>({ headshot: null, fullBody: null });
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initDB();
        const storedUserImages = await db.getItem<UserImages>('userImages', 'userData');
        if (storedUserImages?.fullBody && storedUserImages?.headshot) {
          setUserImages(storedUserImages);
          setRoom(Room.LIVING_ROOM);
        }
        
        const storedClothing = await db.getItem<ClothingItem[]>('clothingItems', 'items');
        if (storedClothing) {
            setClothingItems(storedClothing);
        }

        const storedOutfits = await db.getItem<Outfit[]>('savedOutfits', 'items');
        if (storedOutfits) {
            setSavedOutfits(storedOutfits);
        }
      } catch (error) {
        console.error("Failed to load data from database:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if(isInitialized && userImages.fullBody && userImages.headshot) {
        db.setItem('userImages', 'userData', userImages).catch(err => console.error("Failed to save user images:", err));
    }
  }, [userImages, isInitialized]);

  useEffect(() => {
    if(isInitialized) {
        db.setItem('clothingItems', 'items', clothingItems).catch(err => console.error("Failed to save clothing items:", err));
    }
  }, [clothingItems, isInitialized]);

   useEffect(() => {
    if(isInitialized) {
        db.setItem('savedOutfits', 'items', savedOutfits).catch(err => console.error("Failed to save outfits:", err));
    }
  }, [savedOutfits, isInitialized]);


  const renderRoom = () => {
    if (!isInitialized) {
        return <div className="flex items-center justify-center h-screen bg-haus-bg text-haus-text">Loading ClosetHaus...</div>;
    }

    switch (room) {
      case Room.ONBOARDING:
        return <Onboarding setUserImages={setUserImages} setRoom={setRoom} />;
      case Room.LIVING_ROOM:
        return <LivingRoom setRoom={setRoom} />;
      case Room.CLOSET:
        return <ClosetRoom setRoom={setRoom} clothingItems={clothingItems} setClothingItems={setClothingItems} savedOutfits={savedOutfits} />;
      case Room.MIRROR:
        return <MirrorRoom setRoom={setRoom} clothingItems={clothingItems} userImages={userImages} savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} />;
      default:
        return <LivingRoom setRoom={setRoom} />;
    }
  };

  return (
    <main className="bg-haus-bg h-[var(--app-height,100vh)] font-sans text-haus-text overflow-hidden">
      {renderRoom()}
    </main>
  );
};

export default App;