"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { UserRole } from './types';

// Define sidebar menu items by role
export const SIDEBAR_ITEMS = {
  super_user: [
    { title: 'Dashboard', href: '/dashboard/super', icon: 'layout-dashboard' },
    { title: 'User Management', href: '/dashboard/super/users', icon: 'users' },
    { title: 'Observation Groups', href: '/dashboard/super/groups', icon: 'folder' },
    { title: 'Observations', href: '/dashboard/super/observations', icon: 'clipboard-list' },
    { title: 'Reports', href: '/dashboard/super/reports', icon: 'bar-chart' },
    { title: 'Settings', href: '/dashboard/super/settings', icon: 'settings' },
  ],
  school_leader: [
    { title: 'Dashboard', href: '/dashboard/leader', icon: 'layout-dashboard' },
    { title: 'Observation Groups', href: '/dashboard/leader/groups', icon: 'folder' },
    { title: 'Observations', href: '/dashboard/leader/observations', icon: 'clipboard-list' },
    { title: 'Reports', href: '/dashboard/leader/reports', icon: 'bar-chart' },
    { title: 'Settings', href: '/dashboard/leader/settings', icon: 'settings' },
  ],
  teacher: [
    { title: 'Dashboard', href: '/dashboard/teacher', icon: 'layout-dashboard' },
    { title: 'My Observations', href: '/dashboard/teacher/observations', icon: 'clipboard-list' },
    { title: 'My Profile', href: '/dashboard/teacher/profile', icon: 'user' },
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
  school_leader: {
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