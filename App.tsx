
import React, { useState, useEffect } from 'react';
import { Room, UserImages, ClothingItem, Outfit } from './types';
import Onboarding from './components/Onboarding';
import LivingRoom from './components/LivingRoom';
import ClosetRoom from './components/ClosetRoom';
import MirrorRoom from './components/MirrorRoom';

const App: React.FC = () => {
  const [room, setRoom] = useState<Room>(Room.ONBOARDING);
  const [userImages, setUserImages] = useState<UserImages>({ headshot: null, fullBody: null });
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage for user images to skip onboarding
    const storedUserImages = localStorage.getItem('userImages');
    if (storedUserImages) {
      setUserImages(JSON.parse(storedUserImages));
      setRoom(Room.LIVING_ROOM);
    }
    const storedClothing = localStorage.getItem('clothingItems');
    if (storedClothing) {
        setClothingItems(JSON.parse(storedClothing));
    }
     const storedOutfits = localStorage.getItem('savedOutfits');
    if (storedOutfits) {
        setSavedOutfits(JSON.parse(storedOutfits));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if(isInitialized && userImages.fullBody && userImages.headshot) {
        localStorage.setItem('userImages', JSON.stringify(userImages));
    }
  }, [userImages, isInitialized]);

  useEffect(() => {
    if(isInitialized) {
        localStorage.setItem('clothingItems', JSON.stringify(clothingItems));
    }
  }, [clothingItems, isInitialized]);

   useEffect(() => {
    if(isInitialized) {
        localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
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
    <main className="bg-haus-bg min-h-screen font-sans text-haus-text">
      {renderRoom()}
    </main>
  );
};

export default App;
