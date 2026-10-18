import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/auth';
import { isFirebaseConfigured } from '@/services/firebase/config';
import { getUserProfile, logoutUser } from '@/services/authService';
import { UserProfile } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
  refreshProfile: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  // Role helpers
  isDonor: boolean;
  isVolunteer: boolean;
  isNgo: boolean;
  isAdmin: boolean;
  isPendingNgo: boolean;
  isSuspended: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = useMemo(() => isFirebaseConfigured(), []);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userProfile = await getUserProfile(uid);
      setProfile(userProfile);
      return userProfile;
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Unable to load user profile. Please verify your connection.');
      return null;
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return await fetchProfile(user.uid);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      setError(null);
    } catch (err) {
      console.error('Error during sign out:', err);
    }
  };

  useEffect(() => {
    if (!auth || !isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isConfigured,
    error,
    refreshProfile,
    logout: handleLogout,
    isDonor: profile?.role === 'donor',
    isVolunteer: profile?.role === 'volunteer',
    isNgo: profile?.role === 'ngo',
    isAdmin: profile?.role === 'admin',
    isPendingNgo: profile?.role === 'ngo' && profile?.accountStatus === 'pending',
    isSuspended: profile?.accountStatus === 'suspended',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
