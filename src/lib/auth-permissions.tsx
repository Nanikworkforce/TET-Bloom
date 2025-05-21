"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { UserRole } from './types';

// Define sidebar menu items by role
export const SIDEBAR_ITEMS = {
  super_user: [
    { title: 'Dashboard', href: '/super', icon: 'layout-dashboard' },
    { title: 'User Management', href: '/super/users', icon: 'users' },
    { title: 'Observation Groups', href: '/super/groups', icon: 'folder' },
    { title: 'Observations', href: '/super/observations', icon: 'clipboard-list' },
    { title: 'Reports', href: '/super/reports', icon: 'bar-chart' },
    { title: 'Settings', href: '/super/settings', icon: 'settings' },
  ],
  principal: [
    { title: 'Dashboard', href: '/principal', icon: 'layout-dashboard' },
    // { title: 'User Management', href: '/principal/users', icon: 'users' }, // This line is removed
    { title: 'Observation Groups', href: '/principal/groups', icon: 'folder' },
    { title: 'Observations', href: '/principal/observations', icon: 'clipboard-list' },
    { title: 'Reports', href: '/principal/reports', icon: 'bar-chart' },
    { title: 'Settings', href: '/principal/settings', icon: 'settings' },
  ],
  teacher: [
    { title: 'Dashboard', href: '/teacher', icon: 'layout-dashboard' },
    { title: 'My Observations', href: '/teacher/observations', icon: 'clipboard-list' },
    { title: 'My Profile', href: '/teacher/profile', icon: 'user' },
  ],
};

// Define permissions for each role
const PERMISSIONS = {
  super_user: {
    canManageUsers: true,
    canManageGroups: true,
    canViewAllObservations: true,
    canCreateObservations: true,
    canViewReports: true,
    canApproveObservations: true,
    canRequestReview: true,
    canHandleReviewRequests: true,
  },
  principal: {
    canManageUsers: false,
    canManageGroups: true,
    canViewAllObservations: false,
    canViewGroupObservations: true,
    canCreateObservations: true,
    canViewReports: true,
    canApproveObservations: false,
    canRequestReview: false,
    canHandleReviewRequests: true,
  },
  teacher: {
    canManageUsers: false,
    canManageGroups: false,
    canViewAllObservations: false,
    canViewGroupObservations: false,
    canViewOwnObservations: true,
    canCreateObservations: false,
    canViewReports: false,
    canApproveObservations: true,
    canRequestReview: true,
    canHandleReviewRequests: false,
  },
};

type PermissionType = keyof typeof PERMISSIONS.super_user;

interface AuthPermissionsContextType {
  hasPermission: (permission: PermissionType) => boolean;
  userRole: UserRole | null;
  sidebarItems: { title: string; href: string; icon: string; }[];
}

const AuthPermissionsContext = createContext<AuthPermissionsContextType | undefined>(undefined);

export const AuthPermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userRole = user?.role || null;

  // Get permission for the current user role
  const hasPermission = (permission: PermissionType): boolean => {
    if (!userRole) return false;
    return PERMISSIONS[userRole]?.[permission] || false;
  };

  // Get sidebar items for the current user role
  const sidebarItems = userRole ? SIDEBAR_ITEMS[userRole] : [];

  return (
    <AuthPermissionsContext.Provider value={{ hasPermission, userRole, sidebarItems }}>
      {children}
    </AuthPermissionsContext.Provider>
  );
};

export const useAuthPermissions = () => {
  const context = useContext(AuthPermissionsContext);
  if (context === undefined) {
    throw new Error('useAuthPermissions must be used within an AuthPermissionsProvider');
  }
  return context;
}; 