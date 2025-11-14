/**
 * Defines the structure for a local user profile.
 */
export interface User {
  id: string;
  email: string | null;
  name: string;
  createdAt: string;
  hasOnboarded: boolean;
}

/**
 * Defines the structure for a clothing artifact.
 * This is created from the backend classification + frontend data.
 */
export interface Artifact {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories' | 'Full Body' | string;
  decade: string;
  style: string;
  description: string;
  imageUrl: string; // base64 string
  userId: string;
  createdAt: string;
}