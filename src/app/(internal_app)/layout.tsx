"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import React from "react";
import { NotificationsDropdown } from "@/components/ui/notifications";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
        active 
          ? "bg-primary text-white shadow-md" 
          : "text-gray-600 hover:bg-primary/10 hover:text-primary"
      }`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

const adminNav = [
  {
    label: "Dashboard",
    href: "/school-leader",
    icon: "📊",
  },
  {
    label: "Teachers",
    href: "/school-leader/teachers",
    icon: "👩‍🏫",
  },
  {
    label: "Observations",
    href: "/school-leader/observations",
    icon: "👁️",
  },
  {
    label: "Feedback",
    href: "/school-leader/feedback",
    icon: "💬",
  },
  {
    label: "Reports",
    href: "/school-leader/reports",
    icon: "📝",
  },
  {
    label: "Settings",
    href: "/school-leader/settings",
    icon: "⚙️",
  },
  {
    label: "Help & Docs",
    href: "/school-leader/help",
    icon: "❓",
  },
];

const superUserNav = [
  {
    label: "Dashboard",
    href: "/super",
    icon: "📊",
  },
  {
    label: "User Management",
    href: "/super/users",
    icon: "👥",
  },
  {
    label: "Observation Groups",
    href: "/super/groups",
    icon: "👪",
  },
  {
    label: "System Settings",
    href: "/super/settings",
    icon: "⚙️",
  },
  {
    label: "Help & Docs",
    href: "/super/help",
    icon: "❓",
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // Determine if current path is for school-leader or teacher
  const isSchoolLeader = pathname.includes('/school-leader');
  const isTeacher = pathname.includes('/teacher');
  const isSuperUser = pathname.includes('/super');
  
  // Default to school-leader if neither is in the path
  const userRole = isTeacher ? "teacher" : isSchoolLeader ? "school-leader" : "super";

  // Navigation items based on role
  const schoolLeaderNavItems = [
    {
      href: "/school-leader",
      icon: "📊",
      label: "Overview",
    },
    {
      href: "/school-leader/teachers",
      icon: "👩‍🏫",
      label: "Teachers",
    },
    {
      href: "/school-leader/observations",
      icon: "👁️",
      label: "Observations",
    },
    {
      href: "/school-leader/feedback",
      icon: "💬",
      label: "Feedback",
    },
    {
      href: "/school-leader/reports",
      icon: "📝",
      label: "Reports",
    },
    {
      href: "/school-leader/settings",
      icon: "⚙️",
      label: "Settings",
    },
    {
      href: "/school-leader/help",
      icon: "❓",
      label: "Help & Docs",
    },
  ];
  
  const teacherNavItems = [
    {
      href: "/teacher",
      icon: "📊",
      label: "Overview",
    },
    {
      href: "/teacher/observations",
      icon: "👁️",
      label: "Observations",
    },
    {
      href: "/teacher/feedback",
      icon: "💬",
      label: "Feedback",
    },
    {
      href: "/teacher/development",
      icon: "🎓",
      label: "Development",
    },
    {
      href: "/teacher/lesson-plans",
      icon: "📝",
      label: "Lesson Plans",
    },
    {
      href: "/teacher/settings",
      icon: "⚙️",
      label: "Settings",
    },
    {
      href: "/teacher/help",
      icon: "❓",
      label: "Help & Docs",
    },
  ];
  
  const navItems = userRole === "teacher" ? teacherNavItems : isSchoolLeader ? adminNav : superUserNav;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">TET</span>
            <span className="text-2xl font-semibold">Bloom</span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
          
          {/* User menu */}
          <div className="hidden md:flex items-center gap-4">
            <NotificationsDropdown />
            
            {/* Role switcher (for demo purposes) */}
            {/* <div className="mr-4">
              <select 
                className="px-2 py-1 border rounded-md text-sm"
                defaultValue={userRole}
                onChange={(e) => {
                  const newRole = e.target.value;
                  window.location.href = `/${newRole}`;
                }}
              >
                <option value="school-leader">School Leader</option>
                <option value="teacher">Teacher</option>
              </select>
            </div> */}
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {userRole === "school-leader" ? "SL" : userRole === "teacher" ? "T" : "S"}
              </div>
              <span className="font-medium">{userRole === "school-leader" ? "School Leader" : userRole === "teacher" ? "Ms. Chen" : "Super User"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 border-r bg-white p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </nav>
          
          <div className="mt-8 pt-4 border-t">
            <NavItem
              href="/logout"
              icon="🚪"
              label="Log out"
              active={false}
            />
          </div>
        </aside>

        {/* Mobile navigation overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">TET</span>
                  <span className="text-xl font-semibold">Bloom</span>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ✕
                </button>
              </div>
              
              {/* User info in mobile menu */}
              <div className="flex items-center gap-2 mb-6 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {userRole === "school-leader" ? "SL" : userRole === "teacher" ? "T" : "S"}
                </div>
                <div>
                  <div className="font-medium">{userRole === "school-leader" ? "School Leader" : userRole === "teacher" ? "Ms. Chen" : "Super User"}</div>
                  <div className="text-xs text-gray-500">{userRole === "school-leader" ? "Administrator" : userRole === "teacher" ? "Mathematics Teacher" : "Super User"}</div>
                </div>
              </div>
              
              {/* Role switcher in mobile menu */}
              <div className="mb-6">
                <select 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  defaultValue={userRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    window.location.href = `/${newRole}`;
                  }}
                >
                  <option value="school-leader">School Leader View</option>
                  <option value="teacher">Teacher View</option>
                  <option value="super">Super User View</option>
                </select>
              </div>
              
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
                
                <div className="mt-8 pt-4 border-t">
                  <NavItem
                    href="/logout"
                    icon="🚪"
                    label="Log out"
                    active={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 