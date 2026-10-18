import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { app } from './app';
import { isEmulatorEnabled } from './config';

let auth: Auth | null = null;

if (app) {
  try {
    auth = getAuth(app);
    if (isEmulatorEnabled()) {
      const emulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL || 'http://localhost:9099';
      connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
    }
  } catch (error) {
    console.error('Error initializing Firebase Auth:', error);
  }
}

export { auth };
