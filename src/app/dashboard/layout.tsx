"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuthPermissions } from "@/lib/auth-permissions";
import { useAuth } from "@/lib/auth-context";
import * as Icons from 'lucide-react';
import { NotificationsDropdown } from "@/components/ui/notifications";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const { userRole } = useAuthPermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              {/* Mobile menu toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Icons.Menu size={20} />
              </Button>
              
              <div className="md:hidden flex items-center gap-1">
                <span className="font-bold text-primary">TET</span>
                <span className="font-semibold">Bloom</span>
              </div>
              
              {/* Page title - could be dynamic based on route */}
              <h1 className="text-lg font-semibold hidden md:block">
                {userRole === 'super_user' 
                  ? 'Admin Dashboard' 
                  : userRole === 'principal' 
                    ? 'School Leader Dashboard' 
                    : 'Teacher Dashboard'}
              </h1>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-4">
              <NotificationsDropdown />
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Icons.User size={16} />
                </div>
                <span className="font-medium text-sm">{user?.fullName || 'User'}</span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 