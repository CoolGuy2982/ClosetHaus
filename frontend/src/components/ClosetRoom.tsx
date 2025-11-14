import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getArtifacts, saveArtifact } from '../services/storageService';
import { Artifact } from '../../types';
import Icon from './Icon';
import ImageDropzone from './ImageDropzone';
import { classifyImage } from '../services/apiService';

type Filter = 'All' | 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories' | 'Full Body';

export const ClosetRoom: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userArtifacts = getArtifacts();
      setArtifacts(userArtifacts);
    } catch (err) {
      console.error('Error fetching artifacts:', err);
      setError('Failed to load closet. Please refresh.');
    }
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredArtifacts(artifacts);
    } else {
      setFilteredArtifacts(
        artifacts.filter((item) => item.category === activeFilter)
      );
    }
  }, [activeFilter, artifacts]);

  const handleImageUpload = useCallback(
    async (file: File, base64: string) => {
      setIsUploading(true);
      setError(null);

      try {
        const classificationJson = await classifyImage(file);
        let artifactData;
        try {
          artifactData = JSON.parse(classificationJson);
        } catch (parseError) {
          console.error('Error parsing classification JSON:', parseError);
          console.error('Received string:', classificationJson);
          throw new Error('The AI returned an invalid format. Please try again.');
        }

        const newArtifact: Omit<Artifact, 'id'> = {
          ...artifactData,
          imageUrl: base64,
          userId: 'local-user',
          createdAt: new Date().toISOString(),
        };

        saveArtifact(newArtifact);
        setArtifacts(getArtifacts());
        
      } catch (err) {
        console.error('Error in upload process:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred during upload.');
        }
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const filters: Filter[] = [
    'All',
    'Tops',
    'Bottoms',
    'Outerwear',
    'Footwear',
    'Accessories',
    'Full Body',
  ];

  return (
    <motion.div
      className="p-4 md:p-8 h-full overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Closet</h1>

      <ImageDropzone
        onImageDrop={handleImageUpload}
        isUploading={isUploading}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter by</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
                activeFilter === filter
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredArtifacts.map((artifact) => (
          <motion.div
            key={artifact.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white group"
            whileHover={{ scale: 1.03, shadow: 'md' }}
            layout
          >
            <img
              src={artifact.imageUrl}
              alt={artifact.name}
              className="w-full h-48 object-cover object-center"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate" title={artifact.name}>
                {artifact.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{artifact.category}</p>
              <p className="text-xs text-gray-400 mt-1">{artifact.decade} • {artifact.style}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {artifacts.length === 0 && !isUploading && (
        <div className="text-center py-12 text-gray-500">
          <Icon name="Archive" className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">Your closet is empty</h3>
          <p className="mt-1 text-sm">
            Drop an image above to start archiving your collection.
          </p>
        </div>
      )}
    </motion.div>
  );
};