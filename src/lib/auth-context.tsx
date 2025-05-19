"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabase';
import { AuthState, UserProfile, UserRole } from './types';

// Development mode flag - set to true to enforce authentication in development
const ENFORCE_AUTH = true;

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

    // Subscribe to auth changes
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
  }, [router]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
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
            router.push('/dashboard/super');
          } else if (profile.role === 'school_leader') {
            router.push('/dashboard/leader');
          } else if (profile.role === 'teacher') {
            router.push('/dashboard/teacher');
          } else {
            router.push('/dashboard');
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