export enum Room {
  ONBOARDING,
  LIVING_ROOM,
  CLOSET,
  MIRROR,
}

export type UserImages = {
  headshot: { mimeType: string; data: string } | null;
  fullBody: { mimeType: string; data: string } | null;
};

export enum ClothingCategory {
  TOP = 'Top',
  BOTTOM = 'Bottom',
  SHOES = 'Shoes',
  ACCESSORY = 'Accessory',
}

export type ClothingItem = {
  id: string;
  name: string;
  image: { mimeType: string; data: string };
  category: ClothingCategory;
};

export type Outfit = {
  id: string;
  image: string; // base64 string
  items: ClothingItem[];
};