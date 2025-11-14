const DB_NAME = 'ClosetHausDB';
const DB_VERSION = 1;

const STORES = {
  USER_IMAGES: 'userImages',
  CLOTHING_ITEMS: 'clothingItems',
  SAVED_OUTFITS: 'savedOutfits',
};

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORES.USER_IMAGES)) {
        dbInstance.createObjectStore(STORES.USER_IMAGES);
      }
      if (!dbInstance.objectStoreNames.contains(STORES.CLOTHING_ITEMS)) {
        dbInstance.createObjectStore(STORES.CLOTHING_ITEMS);
      }
      if (!dbInstance.objectStoreNames.contains(STORES.SAVED_OUTFITS)) {
        dbInstance.createObjectStore(STORES.SAVED_OUTFITS);
      }
    };
  });
};

export const setItem = <T>(storeName: string, key: string, value: T): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const db = await initDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value, key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Error setting item:', request.error);
      reject(request.error);
    };
  });
};

export const getItem = <T>(storeName: string, key: string): Promise<T | null> => {
    return new Promise(async (resolve, reject) => {
        const db = await initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            console.error('Error getting item:', request.error);
            reject(request.error);
        };
    });
};