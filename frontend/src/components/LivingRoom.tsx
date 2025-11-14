import React, { useState, useEffect } from 'react';
import { Artifact } from '../../types';
import { getArtifacts } from '../services/storageService';

export const LivingRoom: React.FC = () => {
  const [tops, setTops] = useState<Artifact[]>([]);
  const [bottoms, setBottoms] = useState<Artifact[]>([]);
  const [selectedTop, setSelectedTop] = useState<Artifact | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<Artifact | null>(null);

  useEffect(() => {
    const allArtifacts = getArtifacts();
    setTops(allArtifacts.filter(item => item.category === 'Tops'));
    setBottoms(allArtifacts.filter(item => item.category === 'Bottoms'));
  }, []);

  return (
    <div className="p-8 h-full flex flex-col md:flex-row gap-8">
      {/* --- Outfit Display --- */}
      <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Outfit</h2>
        <div className="w-full aspect-w-3 aspect-h-4">
          <div className="w-full h-64 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
            {selectedTop ? (
              <img src={selectedTop.imageUrl} alt={selectedTop.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-500">Select a Top</span>
            )}
          </div>
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {selectedBottom ? (
              <img src={selectedBottom.imageUrl} alt={selectedBottom.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-500">Select Bottoms</span>
            )}
          </div>
        </div>
        <button className="mt-6 w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200">
          Save Outfit
        </button>
      </div>

      {/* --- Item Selection --- */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full flex flex-col gap-6 overflow-y-auto">
        {/* --- Tops --- */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Tops</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tops.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTop(item)}
                className={`w-full aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedTop?.id === item.id ? 'border-gray-800 shadow-xl scale-105' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* --- Bottoms --- */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Bottoms</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bottoms.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedBottom(item)}
                className={`w-full aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedBottom?.id === item.id ? 'border-gray-800 shadow-xl scale-105' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};