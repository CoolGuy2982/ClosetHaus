import React from 'react';
import { Room } from '../types';
import Icon from './Icon';

interface LivingRoomProps {
  setRoom: (room: Room) => void;
}

const RoomLink: React.FC<{
    icon: 'closet' | 'mirror';
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="group text-left p-8 bg-white/50 rounded-xl border border-haus-border hover:border-haus-accent hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-xl"
    >
        <div className="flex items-center justify-center w-16 h-16 bg-haus-foreground rounded-lg mb-6 group-hover:bg-haus-accent transition-colors duration-300">
            <Icon name={icon} className="w-8 h-8 text-haus-accent group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-2xl font-bold text-haus-text">{title}</h3>
        <p className="mt-2 text-haus-text-light">{description}</p>
        <div className="mt-6 text-haus-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Enter Room &rarr;
        </div>
    </button>
);


const LivingRoom: React.FC<LivingRoomProps> = ({ setRoom }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto">
        <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-haus-text">ClosetHaus</h1>
            <p className="text-xl text-haus-text-light mt-3">Your digital home of style.</p>
        </header>

        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
            <RoomLink
                icon="closet"
                title="The Closet"
                description="Manage your clothes, shoes, and accessories. Upload new items to your digital wardrobe."
                onClick={() => setRoom(Room.CLOSET)}
            />
            <RoomLink
                icon="mirror"
                title="The Mirror Room"
                description="Try on outfits, mix and match items, and see your new look instantly with AI."
                onClick={() => setRoom(Room.MIRROR)}
            />
        </div>
        <footer className="mt-16 text-center text-haus-text-light">
            <p>Navigate your home by selecting a room.</p>
        </footer>
    </div>
  );
};

export default LivingRoom;