import { ClothingItem, UserImages, ClothingCategory } from '../types';

const API_BASE_URL = '/api';

export const classifyClothingItem = async (image: { mimeType: string; data: string }): Promise<{name: string, category: ClothingCategory}> => {
    try {
        const response = await fetch(`${API_BASE_URL}/classify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error classifying item:", error);
        throw new Error("Failed to connect to the classification service. Is the backend running?");
    }
};


export const generateOutfit = async (
  userImages: UserImages,
  items: ClothingItem[]
): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-outfit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userImages, items }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.image; // The backend returns { image: 'base64...' }
        
    } catch (error) {
        console.error("Error generating outfit:", error);
        throw new Error("Failed to connect to the outfit generation service. Is the backend running?");
    }
};