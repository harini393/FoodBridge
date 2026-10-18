export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const placeholderValues = [
  'your-api-key-here',
  'your-project-id.firebaseapp.com',
  'your-project-id',
  'your-project-id.appspot.com',
  'your-messaging-sender-id',
  'your-app-id',
  '',
];

export const isFirebaseConfigured = (): boolean => {
  const { apiKey, projectId, appId } = firebaseConfig;
  if (!apiKey || placeholderValues.includes(apiKey)) return false;
  if (!projectId || placeholderValues.includes(projectId)) return false;
  if (!appId || placeholderValues.includes(appId)) return false;
  return true;
};

export const getMissingFirebaseKeys = (): string[] => {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey || placeholderValues.includes(firebaseConfig.apiKey)) {
    missing.push('VITE_FIREBASE_API_KEY');
  }
  if (!firebaseConfig.authDomain || placeholderValues.includes(firebaseConfig.authDomain)) {
    missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  }
  if (!firebaseConfig.projectId || placeholderValues.includes(firebaseConfig.projectId)) {
    missing.push('VITE_FIREBASE_PROJECT_ID');
  }
  if (!firebaseConfig.appId || placeholderValues.includes(firebaseConfig.appId)) {
    missing.push('VITE_FIREBASE_APP_ID');
  }
  return missing;
};

export const isEmulatorEnabled = (): boolean => {
  return import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
};
