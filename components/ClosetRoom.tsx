import React, { useState, useMemo } from 'react';
import { Room, ClothingItem, ClothingCategory, Outfit } from '../types';
import Icon from './Icon';

interface ClosetRoomProps {
  setRoom: (room: Room) => void;
  clothingItems: ClothingItem[];
  setClothingItems: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
  savedOutfits: Outfit[];
}

const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = error => reject(error);
  });
};


const AddItemForm: React.FC<{ onAddItem: (item: Omit<ClothingItem, 'id'>) => void }> = ({ onAddItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<ClothingCategory>(ClothingCategory.TOP);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !imageFile) {
            alert("Please provide a name and an image for the item.");
            return;
        }
        const image = await fileToBase64(imageFile);
        onAddItem({ name, category, image });
        setName('');
        setCategory(ClothingCategory.TOP);
        setImageFile(null);
        setPreview(null);
        const fileInput = document.getElementById('item-image-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white/60 rounded-lg border border-haus-border space-y-4">
            <h3 className="font-bold text-lg">Add New Item</h3>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                 <label htmlFor="item-image-upload" className="cursor-pointer flex-shrink-0">
                    <div className="w-24 h-24 border-2 border-dashed border-haus-border rounded-lg flex items-center justify-center hover:border-haus-accent transition-colors">
                        {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-md" /> : <Icon name="upload" className="w-8 h-8 text-haus-text-light"/>}
                    </div>
                </label>
                <input id="item-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
                <div className="flex-grow space-y-2 w-full">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name (e.g., 'Blue Denim Jacket')" className="w-full p-2 border border-haus-border rounded-md focus:ring-1 focus:ring-haus-accent focus:outline-none bg-white"/>
                    <select value={category} onChange={(e) => setCategory(e.target.value as ClothingCategory)} className="w-full p-2 border border-haus-border rounded-md focus:ring-1 focus:ring-haus-accent focus:outline-none bg-white">
                        {Object.values(ClothingCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full py-2 bg-haus-accent text-white font-bold rounded-lg hover:bg-opacity-90 transition-all">Add to Closet</button>
        </form>
    )
}

const ClosetRoom: React.FC<ClosetRoomProps> = ({ setRoom, clothingItems, setClothingItems, savedOutfits }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'outfits'>('items');

  const handleAddItem = (item: Omit<ClothingItem, 'id'>) => {
    const newItem: ClothingItem = { ...item, id: Date.now().toString() };
    setClothingItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
      setClothingItems(prev => prev.filter(item => item.id !== id));
  }

  const categorizedItems = useMemo(() => {
    // Fix: Used generic type argument for reduce to ensure correct type inference for the accumulator.
    // This resolves the issue where `items` was inferred as `unknown` when using `Object.entries`.
    return clothingItems.reduce<Record<string, ClothingItem[]>>((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});
  }, [clothingItems]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => setRoom(Room.LIVING_ROOM)} className="flex items-center space-x-2 text-haus-text-light hover:text-haus-text transition-colors">
          <Icon name="back" className="w-5 h-5" />
          <span>Living Room</span>
        </button>
        <h1 className="text-4xl font-bold text-haus-text">The Closet</h1>
        <div className="w-24"></div>
      </header>

      <div className="max-w-7xl mx-auto">
        <AddItemForm onAddItem={handleAddItem} />

        <div className="my-8 border-b border-haus-border">
            <nav className="flex space-x-8">
                <button onClick={() => setActiveTab('items')} className={`py-2 px-1 font-semibold transition-colors ${activeTab === 'items' ? 'text-haus-accent border-b-2 border-haus-accent' : 'text-haus-text-light hover:text-haus-text'}`}>
                    Clothing Items ({clothingItems.length})
                </button>
                <button onClick={() => setActiveTab('outfits')} className={`py-2 px-1 font-semibold transition-colors ${activeTab === 'outfits' ? 'text-haus-accent border-b-2 border-haus-accent' : 'text-haus-text-light hover:text-haus-text'}`}>
                    Saved Outfits ({savedOutfits.length})
                </button>
            </nav>
        </div>

        {activeTab === 'items' && (
            <div className="space-y-8">
                {Object.keys(categorizedItems).length > 0 ? Object.entries(categorizedItems).map(([category, items]) => (
                    <section key={category}>
                        <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="group relative aspect-square bg-white rounded-lg border border-haus-border overflow-hidden">
                                    <img src={`data:${item.image.mimeType};base64,${item.image.data}`} alt={item.name} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id)} className="absolute top-1 right-1 bg-white/70 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon name="trash" className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )) : <p className="text-center text-haus-text-light py-10">Your closet is empty. Add some items above to get started!</p>}
            </div>
        )}
        
        {activeTab === 'outfits' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedOutfits.length > 0 ? savedOutfits.map(outfit => (
                    <div key={outfit.id} className="bg-white rounded-lg border border-haus-border overflow-hidden shadow-sm">
                        <img src={`data:image/jpeg;base64,${outfit.image}`} alt="Saved Outfit" className="w-full aspect-[3/4] object-cover" />
                         <div className="p-3">
                            <p className="font-semibold">Outfit composed of:</p>
                            <ul className="text-sm text-haus-text-light list-disc list-inside">
                                {outfit.items.map(item => <li key={item.id}>{item.name}</li>)}
                            </ul>
                        </div>
                    </div>
                )) : <p className="col-span-full text-center text-haus-text-light py-10">You haven't saved any outfits yet. Go to the Mirror Room to create one!</p>}
             </div>
        )}
      </div>
    </div>
  );
};

export default ClosetRoom;