import React, { useState } from 'react';
import { Room, ClothingItem, UserImages, ClothingCategory, Outfit } from '../../types';
import { generateOutfit } from '../services/apiService'; // <-- CHANGED IMPORT
import Icon from './Icon';

interface MirrorRoomProps {
  setRoom: (room: Room) => void;
  clothingItems: ClothingItem[];
  userImages: UserImages;
  savedOutfits: Outfit[];
  setSavedOutfits: React.Dispatch<React.SetStateAction<Outfit[]>>;
}

const CategoryIcons: Record<ClothingCategory, 'shirt' | 'pants' | 'shoe' | 'diamond'> = {
    [ClothingCategory.TOP]: 'shirt',
    [ClothingCategory.BOTTOM]: 'pants',
    [ClothingCategory.SHOES]: 'shoe',
    [ClothingCategory.ACCESSORY]: 'diamond',
};

const MirrorRoom: React.FC<MirrorRoomProps> = ({ setRoom, clothingItems, userImages, savedOutfits, setSavedOutfits }) => {
    const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<'mirror' | 'selection'>('mirror');

    const toggleItemSelection = (item: ClothingItem) => {
        setSelectedItems(prev => {
            const filtered = prev.filter(i => i.category !== item.category);
            const isAlreadySelected = prev.some(i => i.id === item.id);
            return isAlreadySelected ? filtered : [...filtered, item];
        });
    };

    const handleGenerate = async () => {
        if (selectedItems.length === 0) {
            setError("Please select at least one item to try on.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            // This now calls our new apiService, which calls the backend
            const image = await generateOutfit(userImages, selectedItems);
            setGeneratedImage(image);
        } catch (err: any)
        {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveOutfit = () => {
        if (!generatedImage) return;
        const newOutfit: Outfit = {
            id: Date.now().toString(),
            image: generatedImage,
            items: selectedItems,
        };
        setSavedOutfits(prev => [newOutfit, ...prev]);
        setGeneratedImage(null);
        setSelectedItems([]);
    };

    const ClothingSelector = (
        <div className="space-y-4">
            {Object.values(ClothingCategory).map(category => (
                <div key={category}>
                    <h3 className="font-semibold flex items-center space-x-2"><Icon name={CategoryIcons[category]} className="w-5 h-5" /><span>{category}</span></h3>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {clothingItems.filter(item => item.category === category).map(item => (
                            <button key={item.id} onClick={() => toggleItemSelection(item)} className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedItems.some(i => i.id === item.id) ? 'border-haus-accent' : 'border-transparent'}`}>
                                <img src={`data:${item.image.mimeType};base64,${item.image.data}`} alt={item.name} className="w-full h-full object-cover" />
                                {selectedItems.some(i => i.id === item.id) && (
                                    <div className="absolute inset-0 bg-haus-accent/70 flex items-center justify-center">
                                        <Icon name="check" className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="relative flex flex-col h-screen bg-haus-bg">
            {/* --- Mobile: Selection View (Overlay) --- */}
            <div className={`absolute inset-0 z-10 bg-haus-bg flex-col ${mobileView === 'selection' ? 'flex' : 'hidden'} lg:hidden`}>
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-haus-border bg-white/50 backdrop-blur-sm">
                    <h1 className="text-xl font-bold text-haus-text">Choose Your Outfit</h1>
                    <button onClick={() => setMobileView('mirror')} className="px-4 py-2 bg-haus-accent text-white font-bold rounded-lg hover:bg-opacity-90 transition-all">
                        Done
                    </button>
                </header>
                <div className="flex-grow p-4 overflow-y-auto">
                    {ClothingSelector}
                </div>
            </div>

            {/* --- Main View (Desktop and Mobile Mirror phase) --- */}
            <div className="flex flex-col h-full">
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-haus-border bg-white/50 backdrop-blur-sm">
                    <button onClick={() => setRoom(Room.LIVING_ROOM)} className="flex items-center space-x-2 text-haus-text-light hover:text-haus-text transition-colors">
                        <Icon name="back" className="w-5 h-5" />
                        <span className="hidden sm:inline">Living Room</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-haus-text">Mirror Room</h1>
                    <div className="w-24 hidden sm:block"></div>
                </header>

                <div className="flex-grow flex flex-col lg:grid lg:grid-cols-12 gap-4 p-4 overflow-hidden">
                    {/* Left Panel: Desktop Clothing Items */}
                    <div className="hidden lg:flex flex-col lg:col-span-3 bg-white/50 rounded-lg border border-haus-border p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Select Items</h2>
                        {ClothingSelector}
                    </div>

                    {/* Center Panel: The Mirror */}
                    <div className="lg:col-span-6 bg-haus-foreground rounded-lg border border-haus-border flex items-center justify-center p-4 flex-grow">
                        <div className="w-full h-full max-w-md aspect-[3/4] bg-white rounded-lg shadow-inner flex items-center justify-center relative">
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white rounded-lg">
                                <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="mt-4 font-semibold">Creating your look...</p>
                                </div>
                            )}
                            {/* --- THIS IS THE FIX --- */}
                            {!isLoading && (generatedImage ? 
                                <img src={generatedImage} alt="Generated Outfit" className="w-full h-full object-contain rounded-lg"/> :
                                userImages.fullBody && <img src={`data:${userImages.fullBody.mimeType};base64,${userImages.fullBody.data}`} alt="User" className="w-full h-full object-contain rounded-lg opacity-50" />
                            )}
                            {/* --- END OF FIX --- */}
                            {!isLoading && !generatedImage && (
                                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                                <p className="text-haus-text-light">Select items from your closet and click 'Generate Outfit' to see the magic happen.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Actions */}
                    <div className="lg:col-span-3 bg-white/50 rounded-lg border border-haus-border p-4 flex flex-col overflow-hidden flex-shrink-0 lg:flex-shrink-1">
                        <h2 className="text-xl font-bold mb-4">Your Outfit</h2>
                        <ul className="space-y-2 mb-4 flex-grow overflow-y-auto">
                        {selectedItems.length > 0 ? selectedItems.map(item => (
                                <li key={item.id} className="flex items-center space-x-3 p-2 bg-haus-foreground rounded-md">
                                    <img src={`data:${item.image.mimeType};base64,${item.image.data}`} alt={item.name} className="w-12 h-12 object-cover rounded"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className="text-xs text-haus-text-light">{item.category}</p>
                                    </div>
                                </li>
                            )) : <p className="text-haus-text-light text-sm">No items selected.</p>}
                        </ul>
                        {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md my-2">{error}</p>}
                        
                        <div className="flex-shrink-0 space-y-3 pt-2">
                            {generatedImage && (
                                <button onClick={handleSaveOutfit} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all flex items-center justify-center space-x-2">
                                    <Icon name="save" className="w-5 h-5"/>
                                    <span>Save Outfit</span>
                                </button>
                            )}
                             <button onClick={() => setMobileView('selection')} className="lg:hidden w-full py-3 border-2 border-haus-accent text-haus-accent font-bold rounded-lg hover:bg-haus-accent/10 transition-all">
                                {selectedItems.length > 0 ? 'Change Items' : 'Choose Items'}
                            </button>
                            <button onClick={handleGenerate} disabled={isLoading || selectedItems.length === 0} className="w-full py-3 bg-haus-accent text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-haus-border disabled:cursor-not-allowed">
                                {isLoading ? 'Generating...' : 'Generate Outfit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MirrorRoom;