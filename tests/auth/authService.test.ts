import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, formatAuthError } from '@/services/authService';

// Mock Firebase Auth and Firestore
vi.mock('@/services/firebase/auth', () => ({
  auth: { currentUser: null },
}));

vi.mock('@/services/firebase/firestore', () => ({
  db: {},
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({
    user: { uid: 'test-user-123', email: 'test@example.com' },
  }),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({
    user: { uid: 'test-user-123', email: 'test@example.com' },
  }),
  signOut: vi.fn().mockResolvedValue(undefined),
  updateProfile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((_db, collection, id) => ({ collection, id })),
  setDoc: vi.fn().mockResolvedValue(undefined),
  getDoc: vi.fn(),
}));

describe('authService - Registration & Security Guardrails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('strictly blocks public admin registration attempts', async () => {
    // Attempt to register with role 'admin'
    await expect(
      registerUser({
        email: 'attacker@example.com',
        password: 'password123',
        fullName: 'Mallory Attacker',
        phone: '+919999999999',
        role: 'admin' as unknown as 'donor',
      })
    ).rejects.toThrow(/Administrator accounts cannot be created through public registration/i);
  });

  it('registers donor with accountStatus="active"', async () => {
    const { profile } = await registerUser({
      email: 'donor@example.com',
      password: 'securePassword123',
      fullName: 'Alice Donor',
      phone: '+919876543210',
      role: 'donor',
    });

    expect(profile.role).toBe('donor');
    expect(profile.accountStatus).toBe('active');
    expect(profile.email).toBe('donor@example.com');
  });

  it('registers volunteer with accountStatus="active"', async () => {
    const { profile } = await registerUser({
      email: 'volunteer@example.com',
      password: 'securePassword123',
      fullName: 'Bob Volunteer',
      phone: '+919876543211',
      role: 'volunteer',
    });

    expect(profile.role).toBe('volunteer');
    expect(profile.accountStatus).toBe('active');
  });

  it('registers NGO officer with accountStatus="pending" and stores organization details', async () => {
    const { profile } = await registerUser({
      email: 'ngo@example.com',
      password: 'securePassword123',
      fullName: 'Officer Dave',
      phone: '+919876543212',
      role: 'ngo',
      organizationName: 'City Food Bank',
      registrationNumber: 'NGO-88990',
      officialAddress: '123 Charity Lane',
    });

    expect(profile.role).toBe('ngo');
    expect(profile.accountStatus).toBe('pending');
    expect(profile.organizationName).toBe('City Food Bank');
  });

  describe('formatAuthError', () => {
    it('translates common Firebase error codes into user-friendly messages', () => {
      expect(formatAuthError({ code: 'auth/email-already-in-use' })).toMatch(
        /an account with this email address already exists/i
      );
      expect(formatAuthError({ code: 'auth/wrong-password' })).toMatch(
        /invalid email or password/i
      );
      expect(formatAuthError({ code: 'auth/user-not-found' })).toMatch(
        /invalid email or password/i
      );
      expect(formatAuthError({ code: 'auth/weak-password' })).toMatch(
        /password is too weak/i
      );
      expect(formatAuthError({ code: 'auth/user-disabled' })).toMatch(
        /this account has been disabled/i
      );
    });

    it('falls back safely for unknown errors', () => {
      expect(formatAuthError(new Error('Custom network issue'))).toBe('Custom network issue');
      expect(formatAuthError('unknown')).toMatch(/an unexpected error occurred/i);
    });
  });
});
