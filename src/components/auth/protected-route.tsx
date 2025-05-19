"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading anymore and the user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // If authenticated but not allowed for this route based on role, redirect to appropriate dashboard
    if (!isLoading && isAuthenticated && user && allowedRoles && !allowedRoles.includes(user.role)) {
      console.log(`User role ${user.role} not allowed for this route, redirecting`);
      
      if (user.role === 'super_user') {
        router.push('/dashboard/super');
      } else if (user.role === 'school_leader') {
        router.push('/dashboard/leader');
      } else if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    // Return null or a message as we're redirecting anyway
    return null;
  }

  // If role restriction is applied, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
}; 