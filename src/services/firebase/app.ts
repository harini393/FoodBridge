import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
  }
} else {
  // In development/testing when env vars are pending, don't crash the UI
  if (import.meta.env.DEV) {
    console.info(
      '[FoodBridge] Firebase configuration variables are pending. Fill in .env.local based on .env.example to connect a live Firebase project.'
    );
  }
}

export { app };
