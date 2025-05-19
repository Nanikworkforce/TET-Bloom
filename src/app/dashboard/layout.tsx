"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determine if current path is for principal or teacher
  const isPrincipal = pathname.includes('/principal');
  const isTeacher = pathname.includes('/teacher');
  
  // Default to principal if neither is in the path
  const userRole = isTeacher ? "teacher" : "principal";

  // Navigation items based on role
  const principalNavItems = [
    {
      href: "/dashboard/principal",
      icon: "📊",
      label: "Overview",
    },
    {
      href: "/dashboard/principal/teachers",
      icon: "👩‍🏫",
      label: "Teachers",
    },
    {
      href: "/dashboard/principal/observations",
      icon: "👁️",
      label: "Observations",
    },
    {
      href: "/dashboard/principal/feedback",
      icon: "💬",
      label: "Feedback",
    },
    {
      href: "/dashboard/principal/reports",
      icon: "📝",
      label: "Reports",
    },
    {
      href: "/dashboard/principal/settings",
      icon: "⚙️",
      label: "Settings",
    },
  ];
  
  const teacherNavItems = [
    {
      href: "/dashboard/teacher",
      icon: "📊",
      label: "Overview",
    },
    {
      href: "/dashboard/teacher/observations",
      icon: "👁️",
      label: "Observations",
    },
    {
      href: "/dashboard/teacher/feedback",
      icon: "💬",
      label: "Feedback",
    },
    {
      href: "/dashboard/teacher/development",
      icon: "🎓",
      label: "Development",
    },
    {
      href: "/dashboard/teacher/lesson-plans",
      icon: "📝",
      label: "Lesson Plans",
    },
    {
      href: "/dashboard/teacher/settings",
      icon: "⚙️",
      label: "Settings",
    },
  ];
  
  const navItems = userRole === "teacher" ? teacherNavItems : principalNavItems;

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
            <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
            
            {/* Role switcher (for demo purposes) */}
            <div className="mr-4">
              <select 
                className="px-2 py-1 border rounded-md text-sm"
                defaultValue={userRole}
                onChange={(e) => {
                  const newRole = e.target.value;
                  window.location.href = `/dashboard/${newRole}`;
                }}
              >
                <option value="principal">Principal</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {userRole === "principal" ? "P" : "T"}
              </div>
              <span className="font-medium">{userRole === "principal" ? "Principal" : "Ms. Chen"}</span>
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
                  {userRole === "principal" ? "P" : "T"}
                </div>
                <div>
                  <div className="font-medium">{userRole === "principal" ? "Principal" : "Ms. Chen"}</div>
                  <div className="text-xs text-gray-500">{userRole === "principal" ? "Administrator" : "Mathematics Teacher"}</div>
                </div>
              </div>
              
              {/* Role switcher in mobile menu */}
              <div className="mb-6">
                <select 
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  defaultValue={userRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    window.location.href = `/dashboard/${newRole}`;
                  }}
                >
                  <option value="principal">Principal View</option>
                  <option value="teacher">Teacher View</option>
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