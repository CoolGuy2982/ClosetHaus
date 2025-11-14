import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';

// --- IMPORT CHANGE ---
// Import the new apiService instead of geminiService
import { generateImageWithNanoBanana } from '../services/apiService';
// --- END IMPORT CHANGE ---

export const MirrorRoom: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- FULL FUNCTION ---
  // This function IS updated to use the new `apiService`.
  const handleGenerate = async () => {
    if (!prompt || !baseImage) {
      setError('Please provide a base image and a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // --- LOGIC CHANGE ---
      // Call the new apiService, which calls our backend
      const newImageBase64 = await generateImageWithNanoBanana(prompt, baseImage);
      // --- END LOGIC CHANGE ---

      setGeneratedImage(newImageBase64);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- FULL FUNCTION ---
  // This function is unchanged in its logic, but shown in full as requested.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImage(reader.result as string);
        setGeneratedImage(null); // Clear previous generation
      };
      reader.readAsDataURL(file);
    }
  };

  // --- FULL FUNCTION ---
  // This function is unchanged in its logic, but shown in full as requested.
  return (
    <motion.div
      className="p-4 md:p-8 h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Magic Mirror</h1>
      <p className="text-gray-600 mb-6">
        Upload an image of your clothing and describe a new style. The Magic
        Mirror will generate a new version for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* --- Input Column --- */}
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="base-image-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              1. Upload Base Image
            </label>
            <input
              id="base-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-100 file:text-gray-700
                hover:file:bg-gray-200 transition-colors"
            />
          </div>

          {baseImage && (
            <motion.div 
              className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={baseImage}
                alt="Base"
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}

          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              2. Describe the change
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'make this jacket bright red', 'change the style to cyberpunk', 'add floral embroidery'"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt || !baseImage}
            className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Generating...
              </>
            ) : (
              <>
                <Icon name="Sparkles" className="w-5 h-5 mr-2" />
                Generate
              </>
            )}
          </button>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* --- Output Column --- */}
        <div className="w-full aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full mb-4"
              />
              <p className="text-gray-700 font-medium">Generating your image...</p>
            </div>
          )}
          {!generatedImage && !isLoading && (
            <div className="text-center text-gray-500 p-8">
              <Icon name="Wand" className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Your new style will appear here</h3>
              <p className="mt-1 text-sm">
                Upload an image and write a prompt to get started.
              </p>
            </div>
          )}
          {generatedImage && (
            <motion.img
              key={generatedImage}
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};