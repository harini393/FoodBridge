import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from './firebase/auth';
import { db } from './firebase/firestore';
import { UserProfile, UserRole, NgoApplication } from '@/types/auth';

export interface RegisterParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'donor' | 'volunteer' | 'ngo';
  // NGO-specific fields
  organizationName?: string;
  registrationNumber?: string;
  officialAddress?: string;
}

/**
 * Maps Firebase Auth error codes to user-friendly accessible messages.
 */
export const formatAuthError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/invalid-email':
        return 'The email address entered is not valid.';
      case 'auth/operation-not-allowed':
        return 'Email/password authentication is not enabled in Firebase project settings.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact the platform administrator.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials and try again.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connectivity.';
      default:
        return (error as { message?: string }).message || 'An authentication error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Registers a new user (Donor, Volunteer, or NGO Officer).
 * Strict rule: Public admin registration is prohibited and rejected immediately.
 */
export const registerUser = async (
  params: RegisterParams
): Promise<{ user: User; profile: UserProfile }> => {
  // Guard against any attempt to self-assign the admin role
  const permittedPublicRoles: UserRole[] = ['donor', 'volunteer', 'ngo'];
  if (!permittedPublicRoles.includes(params.role)) {
    throw new Error(
      'Unauthorized: Administrator accounts cannot be created through public registration. Admin accounts are strictly owner-provisioned.'
    );
  }

  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please configure your Firebase environment variables.');
  }
  if (!db) {
    throw new Error('Cloud Firestore is not initialized. Please configure your Firebase environment variables.');
  }

  // 1. Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    params.email.trim(),
    params.password
  );
  const user = userCredential.user;

  // 2. Set Firebase Auth display name
  await updateProfile(user, {
    displayName: params.fullName.trim(),
  });

  const now = new Date().toISOString();

  // 3. Prepare UserProfile document
  // NGO accounts MUST start as 'pending' until approved by an administrator
  const initialStatus = params.role === 'ngo' ? 'pending' : 'active';

  const profile: UserProfile = {
    uid: user.uid,
    email: params.email.toLowerCase().trim(),
    fullName: params.fullName.trim(),
    phone: params.phone.trim(),
    role: params.role,
    accountStatus: initialStatus,
    createdAt: now,
    updatedAt: now,
  };

  if (params.role === 'ngo') {
    profile.organizationName = params.organizationName?.trim() || '';
  }

  // 4. Save to Firestore users/{uid}
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, profile);

  // 5. If NGO, create corresponding ngoApplications record with 'pending' status
  if (params.role === 'ngo') {
    const applicationId = `app_${user.uid}`;
    const applicationDocRef = doc(db, 'ngoApplications', applicationId);

    const ngoApplication: NgoApplication = {
      id: applicationId,
      officerUid: user.uid,
      organizationName: params.organizationName?.trim() || 'Organization',
      registrationNumber: params.registrationNumber?.trim() || 'N/A',
      contactPhone: params.phone.trim(),
      officialAddress: params.officialAddress?.trim() || '',
      documentReferences: [],
      status: 'pending',
      submittedAt: now,
      updatedAt: now,
    };

    await setDoc(applicationDocRef, ngoApplication);
  }

  return { user, profile };
};

/**
 * Signs in an existing user with email and password and loads their Firestore profile.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile | null }> => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please configure your Firebase environment variables.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  let profile: UserProfile | null = null;
  if (db) {
    profile = await getUserProfile(user.uid);
  }

  return { user, profile };
};

/**
 * Signs out the current authenticated user.
 */
export const logoutUser = async (): Promise<void> => {
  if (!auth) return;
  await signOut(auth);
};

/**
 * Fetches the user profile document from Firestore.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as UserProfile;
};
