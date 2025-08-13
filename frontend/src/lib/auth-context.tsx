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
const ENFORCE_AUTH = process.env.NEXT_PUBLIC_ENFORCE_AUTH === 'true';
console.log('ENFORCE_AUTH value:', process.env.NEXT_PUBLIC_ENFORCE_AUTH, 'ENFORCE_AUTH:', ENFORCE_AUTH);


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

  // Helper function for retry with exponential backoff
  const retryWithBackoff = async <T,>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return await fn();
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt === maxRetries) {
          console.error('All retry attempts exhausted');
          throw lastError;
        }
      }
    }
    
    throw lastError;
  };

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
     console.log('Starting Supabase authentication...');
     try {
       // Attempt Supabase authentication with retry mechanism
       const result = await retryWithBackoff(async () => {
         console.log('Calling supabase.auth.signInWithPassword...');
         
         // Add timeout to prevent hanging - increased to 30 seconds for better network tolerance
         const authPromise = supabase.auth.signInWithPassword({
           email,
           password,
         });
         
         const timeoutPromise = new Promise((_, reject) => {
           setTimeout(() => reject(new Error('Authentication timeout')), 30000);
         });
         
         return await Promise.race([authPromise, timeoutPromise]) as any;
       }, 2, 2000); // 2 retries, starting with 2 second delay
       
       console.log('Supabase auth response received:', { data: !!result?.data, error: !!result?.error });
       
       const { data, error } = result;

      if (error) {
        // If Supabase auth fails, try Django backend as fallback
        console.log('Supabase auth failed, trying Django backend fallback...');
        try {
          const response = await retryWithBackoff(async () => {
            return await fetch('http://127.0.0.1:8000/api/auth/login/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });
          }, 2, 1000); // 2 retries, starting with 1 second delay
          
          if (response.ok) {
            const userData = await response.json();
            console.log('Django user data received:', userData);
            
            // Map Django roles to frontend routes
            const mapDjangoRole = (role: string) => {
              const normalizedRole = role?.toLowerCase().replace(/\s+/g, '_');
              console.log('Mapping role:', role, '→', normalizedRole);
              
              switch (normalizedRole) {
                case 'super_user':
                case 'super user':
                  return 'super_user';
                case 'administrator':
                case 'admin':
                  return 'administrator';
                case 'teacher':
                  return 'teacher';
                default:
                  console.warn('Unknown role:', role, 'defaulting to teacher');
                  return 'teacher';
              }
            };
            
            const mappedRole = mapDjangoRole(userData.role);
            
            // Create a mock user profile for Django users
            const profile: UserProfile = {
              id: userData.id || `django-${email}`,
              email: email,
              fullName: userData.name || 'Django User',
              role: mappedRole as UserRole,
            };
            
            console.log('Final profile:', profile);
            
            setState({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Redirect based on role
            console.log('Redirecting based on role:', profile.role);
            if (profile.role === 'super_user') {
              console.log('Redirecting to /super');
              router.push('/super');
            } else if (profile.role === 'administrator') {
              console.log('Redirecting to /administrator');
              router.push('/administrator');
            } else if (profile.role === 'teacher') {
              console.log('Redirecting to /teacher');
              router.push('/teacher');
            } else {
              console.log('Redirecting to / (default)');
              router.push('/');
            }
            
            return { error: null };
          }
        } catch (backendError) {
          console.error('Django backend auth also failed:', backendError);
        }
        
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
           console.log('Redirecting user with role:', profile.role);
           if (profile.role === 'super_user') {
             console.log('Redirecting to /super');
             try {
               router.push('/super');
               // Fallback to window.location if router doesn't work
               setTimeout(() => {
                 if (window.location.pathname !== '/super') {
                   console.log('Router redirect failed, using window.location');
                   window.location.href = '/super';
                 }
               }, 1000);
             } catch (error) {
               console.error('Router redirect error:', error);
               window.location.href = '/super';
             }
           } else if (profile.role === 'administrator') {
             console.log('Redirecting to /administrator');
             try {
               router.push('/administrator');
               setTimeout(() => {
                 if (window.location.pathname !== '/administrator') {
                   window.location.href = '/administrator';
                 }
               }, 1000);
             } catch (error) {
               console.error('Router redirect error:', error);
               window.location.href = '/administrator';
             }
           } else if (profile.role === 'teacher') {
             console.log('Redirecting to /teacher');
             try {
               router.push('/teacher');
               setTimeout(() => {
                 if (window.location.pathname !== '/teacher') {
                   window.location.href = '/teacher';
                 }
               }, 1000);
             } catch (error) {
               console.error('Router redirect error:', error);
               window.location.href = '/teacher';
             }
           } else {
             console.log('Redirecting to / (default)');
             try {
               router.push('/');
               setTimeout(() => {
                 if (window.location.pathname !== '/') {
                   window.location.href = '/';
                 }
               }, 1000);
             } catch (error) {
               console.error('Router redirect error:', error);
               window.location.href = '/';
             }
           }
        }
      }

      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      
      // If we get a timeout or any other error, try Django backend as fallback
      let errorMessage = 'Authentication failed';
      
      if (err instanceof Error && (err.message.includes('timeout') || err.message.includes('Authentication timeout'))) {
        console.log('Authentication timeout occurred, trying Django backend fallback...');
        errorMessage = 'Authentication service timed out. Attempting fallback authentication...';
      } else if (err instanceof Error && err.message.includes('fetch')) {
        console.log('Network error during Supabase auth, trying Django backend fallback...');
        errorMessage = 'Network connection issue. Attempting alternative authentication...';
      } else {
        console.log('Supabase auth threw an error, trying Django backend fallback...');
        errorMessage = 'Primary authentication failed. Attempting fallback authentication...';
      }
      
      console.log('Error context:', errorMessage);
      
      try {
        const response = await retryWithBackoff(async () => {
          return await fetch('http://127.0.0.1:8000/api/auth/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
        }, 2, 1000); // 2 retries, starting with 1 second delay
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Django user data received:', userData);
          
          // Map Django roles to frontend routes
          const mapDjangoRole = (role: string) => {
            const normalizedRole = role?.toLowerCase().replace(/\s+/g, '_');
            console.log('Mapping role:', role, '→', normalizedRole);
            
            switch (normalizedRole) {
              case 'super_user':
              case 'super user':
                return 'super_user';
              case 'administrator':
              case 'admin':
                return 'administrator';
              case 'teacher':
                return 'teacher';
              default:
                console.warn('Unknown role:', role, 'defaulting to teacher');
                return 'teacher';
            }
          };
          
          const mappedRole = mapDjangoRole(userData.role);
          
          // Create a mock user profile for Django users
          const profile: UserProfile = {
            id: userData.id || `django-${email}`,
            email: email,
            fullName: userData.name || 'Django User',
            role: mappedRole as UserRole,
          };
          
          console.log('Final profile:', profile);
          
          setState({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Redirect based on role
          console.log('Redirecting based on role:', profile.role);
          if (profile.role === 'super_user') {
            console.log('Redirecting to /super');
            router.push('/super');
          } else if (profile.role === 'administrator') {
            console.log('Redirecting to /administrator');
            router.push('/administrator');
          } else if (profile.role === 'teacher') {
            console.log('Redirecting to /teacher');
            router.push('/teacher');
          } else {
            console.log('Redirecting to / (default)');
            router.push('/');
          }
          
          return { error: null };
        }
      } catch (backendError) {
        console.error('Django backend auth also failed:', backendError);
        
        // Both authentication methods failed, provide comprehensive error message
        const finalError = new Error(
          'Authentication failed: Both primary and fallback authentication services are unavailable. ' +
          'Please check your network connection and try again later.'
        );
        
        // Add context about the original errors
        (finalError as any).originalError = err;
        (finalError as any).backendError = backendError;
        
        return { error: finalError };
      }
      
      // If we reach here, Django fallback failed but didn't throw
      const fallbackError = new Error(
        'Authentication failed: Invalid credentials or service unavailable. Please check your email and password.'
      );
      (fallbackError as any).originalError = err;
      
      return { error: fallbackError };
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