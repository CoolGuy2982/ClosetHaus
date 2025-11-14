import React, { useState, useCallback } from 'react';
import Icon from './Icon';

interface ImageDropzoneProps {
  label: string;
  description: string;
  preview: string | null;
  onUpload: (file: File) => void;
  className?: string;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ label, description, preview, onUpload, className = '' }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };
    
    const id = `dropzone-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`border border-haus-border rounded-lg p-4 text-center transition-colors hover:border-haus-accent relative ${isDragging ? 'border-haus-accent bg-haus-accent/10' : ''} ${className}`}>
            <label 
                htmlFor={id} 
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {preview ? (
                    <img src={preview} alt={label} className="w-full h-full object-cover rounded-md" />
                ) : (
                    <>
                        <div className={`w-16 h-16 rounded-full ${isDragging ? 'bg-haus-accent/20' : 'bg-haus-foreground'} flex items-center justify-center mb-4 transition-colors`}>
                            <Icon name="upload" className={`w-8 h-8 ${isDragging ? 'text-haus-accent' : 'text-haus-text-light'} transition-colors`} />
                        </div>
                        <h3 className="font-semibold text-md text-haus-text">{label}</h3>
                        <p className="text-xs text-haus-text-light mt-1">{description}</p>
                    </>
                )}
            </label>
            <input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </div>
    );
};

export default ImageDropzone;
