import React, { useState, useCallback } from 'react';
import Icon from './Icon';
import { motion } from 'framer-motion';

interface ImageDropzoneProps {
  onImageDrop: (file: File, base64: string) => void;
  isUploading: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageDrop, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageDrop(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative mb-6">
      <label
        htmlFor="file-dropzone"
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging ? 'border-gray-800 bg-gray-50' : 'border-gray-300 bg-white'
        } ${isUploading ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full"
              />
              <p className="mt-4 text-sm font-medium text-gray-700">Uploading & Classifying...</p>
            </>
          ) : (
            <>
              <Icon name="upload" className="w-10 h-10 mb-3 text-gray-500" />
              <p className="mb-2 text-sm text-gray-700 font-semibold">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, or GIF</p>
            </>
          )}
        </div>
        <input id="file-dropzone" type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={isUploading} />
      </label>
    </div>
  );
};

export default ImageDropzone;