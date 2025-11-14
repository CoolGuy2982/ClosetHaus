import axios from 'axios';
import { Artifact } from '../types';

// The backend API will be served from the same origin, so we can use relative paths.
const API_URL = '/api';

/**
 * Calls the backend to classify an image file.
 * @param file The image File object to classify.
 * @returns A promise that resolves to the raw JSON string from the backend.
 */
export const classifyImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post<{ classificationText: string }>(
      `${API_URL}/classify`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    // The backend now sends { classificationText: "..." }
    return response.data.classificationText;
  } catch (error) {
    console.error('Error uploading/classifying image:', error);
    throw new Error('Failed to classify image. Please try again.');
  }
};

/**
 * Calls the backend to generate a new image based on a prompt and an existing image.
 * @param prompt The text prompt for generation.
 * @param imageBase64 The base64 string of the source image.
 * @returns A promise that resolves to the base64 string of the *newly generated* image.
 */
export const generateImageWithNanoBanana = async (
  prompt: string,
  imageBase64: string
): Promise<string> => {
  try {
    const response = await axios.post<{ base64Image: string }>(
      `${API_URL}/generate`,
      {
        prompt,
        imageBase64,
      }
    );
    
    // The backend sends { base64Image: "..." }
    // We return *only* the new base64 string, prefixed for immediate use in <img>
    return `data:image/png;base64,${response.data.base64Image}`;
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};