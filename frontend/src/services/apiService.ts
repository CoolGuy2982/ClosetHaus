import axios from 'axios';
import { ClothingCategory, ClothingItem, UserImages } from '../../types';

// The backend API will be served from the same origin, so we can use relative paths.
const API_URL = '/api';

/**
 * Calls the backend to classify an image file.
 * @param file The image File object to classify.
 * @returns A promise that resolves to the classification object.
 */
export const classifyClothingItem = async (file: File): Promise<{name: string, category: ClothingCategory}> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post<{name: string, category: ClothingCategory}>(
      `${API_URL}/classify`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // The backend now sends { name: "...", category: "..." }
    return response.data;
  } catch (error) {
    console.error('Error uploading/classifying image:', error);
    throw new Error('Failed to classify image. Please try again.');
  }
};

/**
 * Calls the backend to generate a new outfit.
 * @param userImages The user's headshot and full body images.
 * @param items The array of clothing items to wear.
 * @returns A promise that resolves to the base64 string of the *newly generated* image.
 */
export const generateOutfit = async (
  userImages: UserImages,
  items: ClothingItem[]
): Promise<string> => {
  try {
    const response = await axios.post<{ base64Image: string }>(
      `${API_URL}/generate`,
      {
        userImages,
        items,
      }
    );
    
    // The backend sends { base64Image: "..." }
    // We return *only* the new base64 string, prefixed for immediate use in <img>
    return `data:image/png;base64,${response.data.base64Image}`;
    
  } catch (error) {
    console.error('Error generating image:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || 'Failed to generate image. Please try again.');
    }
    throw new Error('Failed to generate image. Please try again.');
  }
};