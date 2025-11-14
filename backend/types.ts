export enum ClothingCategory {
  TOP = 'Top',
  BOTTOM = 'Bottom',
  SHOES = 'Shoes',
  ACCESSORY = 'Accessory',
}

export type ImagePayload = { mimeType: string; data: string };

export type UserImagesPayload = {
  headshot: ImagePayload | null;
  fullBody: ImagePayload | null;
};

export type ClothingItemPayload = {
  id: string;
  name: string;
  image: ImagePayload;
  category: ClothingCategory;
};
