import React, { useState, useCallback } from 'react';
import { Room, UserImages } from '../types';
import ImageDropzone from './ImageDropzone';

interface OnboardingProps {
  setUserImages: React.Dispatch<React.SetStateAction<UserImages>>;
  setRoom: (room: Room) => void;
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


const Onboarding: React.FC<OnboardingProps> = ({ setUserImages, setRoom }) => {
    const [headshot, setHeadshot] = useState<string | null>(null);
    const [fullBody, setFullBody] = useState<string | null>(null);

    const handleUpload = useCallback(async (type: 'headshot' | 'fullBody', file: File) => {
        const { mimeType, data } = await fileToBase64(file);
        if (type === 'headshot') {
            setHeadshot(data);
            setUserImages(prev => ({ ...prev, headshot: { mimeType, data } }));
        } else {
            setFullBody(data);
            setUserImages(prev => ({ ...prev, fullBody: { mimeType, data } }));
        }
    }, [setUserImages]);
    
    const canContinue = headshot && fullBody;

    return (
        <div className="h-full flex items-center justify-center bg-haus-bg p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="w-full max-w-4xl bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-haus-border">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-haus-text">Welcome to ClosetHaus</h1>
                    <p className="text-lg text-haus-text-light mt-2">Let's create your digital avatar. Upload two photos to get started.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <ImageDropzone 
                        onUpload={(file) => handleUpload('headshot', file)}
                        label="Upload Headshot"
                        description="Front-facing, neutral expression"
                        preview={headshot ? `data:image/jpeg;base64,${headshot}` : null}
                    />
                     <ImageDropzone 
                        onUpload={(file) => handleUpload('fullBody', file)}
                        label="Upload Full Body Photo"
                        description="Standing pose, clear view"
                        preview={fullBody ? `data:image/jpeg;base64,${fullBody}` : null}
                     />
                </div>

                <div className="text-center">
                    <button 
                        onClick={() => setRoom(Room.LIVING_ROOM)}
                        disabled={!canContinue}
                        className="px-10 py-3 bg-haus-accent text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-all disabled:bg-haus-border disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        Enter ClosetHaus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;