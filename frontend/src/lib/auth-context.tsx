"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';
import { AuthState, UserProfile, UserRole } from './types';

// Toggle authentication enforcement via environment variable.
// When NEXT_PUBLIC_ENFORCE_AUTH is set to the string "true" authentication
// will be required. For any other value (including when undefined) auth is
// considered disabled. This makes local development & QA easier while still
// allowing production to enable it through the env variable.
const ENFORCE_AUTH = process.env.NEXT_PUBLIC_ENFORCE_AUTH === 'false';

// ---------------------------------------------------------------------------
// Mock-user utilities – these are only used when ENFORCE_AUTH === false
// ---------------------------------------------------------------------------
// A very small mock user directory that allows us to "log in" as each role
// without talking to Supabase. Feel free to extend this list or adjust the
// details (emails, names, etc.) as required.

const MOCK_USERS: Record<string, UserProfile> = {
  'super@example.com': {
    id: 'mock-super',
    email: 'super@example.com',
    role: 'super_user',
    fullName: 'Mock Super User',
  },
  'leader@example.com': {
    id: 'mock-leader',
    email: 'leader@example.com',
    role: 'administrator',
    fullName: 'Mock Administrator',
  },
  'teacher@example.com': {
    id: 'mock-teacher',
    email: 'teacher@example.com',
    role: 'teacher',
    fullName: 'Mock Teacher',
  },
};

// Local-storage key that persists the mock user between refreshes so that the
// UX is the same as with a real authenticated session.
const LS_MOCK_USER_KEY = 'tet-bloom:mockUser';

interface AuthContextProps extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Fetch user profile data after authentication
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      return null;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // --------------------------------------------------
      // When auth enforcement is turned off we try to load
      // a mock user from localStorage (if it exists) and
      // skip any Supabase calls entirely.
      // --------------------------------------------------
      if (!ENFORCE_AUTH) {
        try {
          const stored = typeof window !== 'undefined' ? localStorage.getItem(LS_MOCK_USER_KEY) : null;
          if (stored) {
            const parsed = JSON.parse(stored) as UserProfile;
            setState({ user: parsed, isAuthenticated: true, isLoading: false });
          } else {
            setState({ ...initialState, isLoading: false });
          }
        } catch (err) {
          console.error('Error loading mock user from localStorage', err);
          setState({ ...initialState, isLoading: false });
        }
        return; // Skip Supabase logic completely
      }

      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setState({
            ...initialState,
            isLoading: false,
          });
          return;
        }
        
        if (session) {
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            setState({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // User authenticated but no profile found
            setState({
              ...initialState,
              isLoading: false,
            });
          }
        } else {
          // No session found
          setState({
            ...initialState, 
            isLoading: false,
          });
          
          // If we're enforcing auth and not in a login-related page, redirect to login
          if (ENFORCE_AUTH && !window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/signup') && 
              window.location.pathname !== '/') {
            router.push('/login');
          }
        }
      } catch (err) {
        console.error("Error in initializeAuth:", err);
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    if (ENFORCE_AUTH) {
      // Subscribe to auth changes only when auth is enforced
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            try {
              const profile = await fetchUserProfile(session.user.id);
              if (profile) {
                setState({
                  user: profile,
                  isAuthenticated: true,
                  isLoading: false,
                });
              }
            } catch (err) {
              console.error("Error in auth state change handler:", err);
            }
          } else if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            
            // Redirect to login on sign out
            router.push('/login');
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
    // If auth isn't enforced there is no subscription to clean up.
    return () => {};
  }, [router]);

  // Sign in with email and password (or mock login when auth is disabled)
  const signIn = async (email: string, password: string) => {
    // --------------------------------------------------
    // Mock login flow – completely bypass Supabase.
    // --------------------------------------------------
    if (!ENFORCE_AUTH) {
      const mockUser = MOCK_USERS[email] ?? {
        id: `mock-${Date.now()}`,
        email,
        role: 'teacher', // default role if not found in directory
        fullName: email.split('@')[0] || 'Mock User',
      };

      setState({ user: mockUser, isAuthenticated: true, isLoading: false });

      // Persist to localStorage so refresh keeps the login-state.
      if (typeof window !== 'undefined') {
        localStorage.setItem(LS_MOCK_USER_KEY, JSON.stringify(mockUser));
      }

      // Basic role-based redirect (same paths as real auth)
      if (mockUser.role === 'super_user') {
        router.push('/super');
      } else if (mockUser.role === 'administrator') {
        router.push('/administrator');
      } else {
        router.push('/teacher');
      }

      return { error: null };
    }

    // --------------------------------------------------
    // Normal (Supabase) login path when auth enforced.
    // --------------------------------------------------
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
          });

          // Redirect based on user role
          if (profile.role === 'super_user') {
            router.push('/super');
          } else if (profile.role === 'administrator') {
            router.push('/administrator');
          } else if (profile.role === 'teacher') {
            router.push('/teacher');
          } else {
            router.push('/');
          }
        }
      }

      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: err };
    }
  };

  // Sign out
  const signOut = async () => {
    if (!ENFORCE_AUTH) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LS_MOCK_USER_KEY);
      }
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push('/login');
      return;
    }

    await supabase.auth.signOut();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push('/login');
  };

  // Update user profile
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!state.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('id', state.user.id);

    if (error) {
      throw error;
    }

    // Update local state with new profile data
    setState({
      ...state,
      user: { ...state.user, ...profile },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 