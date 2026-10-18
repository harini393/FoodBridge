import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { app } from './app';
import { isEmulatorEnabled } from './config';

let storage: FirebaseStorage | null = null;

if (app) {
  try {
    storage = getStorage(app);
    if (isEmulatorEnabled()) {
      const host = import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_HOST || 'localhost';
      const port = Number(import.meta.env.VITE_FIREBASE_STORAGE_EMULATOR_PORT) || 9199;
      connectStorageEmulator(storage, host, port);
    }
  } catch (error) {
    console.error('Error initializing Firebase Storage:', error);
  }
}

export { storage };
