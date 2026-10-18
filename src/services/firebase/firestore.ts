import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { app } from './app';
import { isEmulatorEnabled } from './config';

let db: Firestore | null = null;

if (app) {
  try {
    db = getFirestore(app);
    if (isEmulatorEnabled()) {
      const host = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || 'localhost';
      const port = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT) || 8080;
      connectFirestoreEmulator(db, host, port);
    }
  } catch (error) {
    console.error('Error initializing Cloud Firestore:', error);
  }
}

export { db };
