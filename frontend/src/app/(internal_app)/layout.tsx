"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { baseUrl } from "@/lib/api";
import { 
  LayoutDashboard, 
  Users, 
  UsersRound, 
  Eye, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface TeacherData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  grade: string;
  years_of_experience: number;
}

interface AdministratorData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

function NavItem({ href, icon: Icon, label, active, onClick, disabled }: NavItemProps) {
  return (
    <Link
      href={disabled ? "#" : href}
      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
        active 
          ? "text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100"
        }" 
        style={active ? {
          background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)',
          boxShadow: '0 10px 25px rgba(132, 84, 124, 0.25)'
        } : {}} 
          : disabled
            ? "text-gray-400 cursor-not-allowed"

      }`}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          onClick();
        }
      }}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
    >
      <div className={`p-1.5 rounded-xl transition-all duration-300 ${
        active 
          ? "bg-white/20" 
          : "bg-gray-100"
        }" 
        style={active ? {backgroundColor: 'rgba(255, 255, 255, 0.2)'} : {}}
      }`}>
        <Icon size={18} />
      </div>
      <span className="font-medium">{label}</span>
      {!disabled && (
        <ChevronRight 
          size={14} 
          className={`ml-auto transition-all duration-300 ${
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
          }`} 
        />
      )}
    </Link>
  );
}

const adminNav = [
  {
    label: "Dashboard",
    href: "/administrator",
    icon: LayoutDashboard,
  },
  {
    label: "Teachers",
    href: "/administrator/teachers",
    icon: Users,
  },
  {
    label: "Observation Groups",
    href: "/administrator/groups",
    icon: UsersRound,
  },
  {
    label: "Observations",
    href: "/administrator/observations",
    icon: Eye,
  },
  {
    label: "Settings",
    href: "/administrator/settings",
    icon: Settings,
  },
  {
    label: "Help & Docs",
    href: "/administrator/help",
    icon: HelpCircle,
  },
];

const superUserNav = [
  {
    label: "Dashboard",
    href: "/super",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    href: "/super/users",
    icon: Users,
  },
  {
    label: "Observation Groups",
    href: "/super/groups",
    icon: UsersRound,
  },
  {
    label: "System Settings",
    href: "/super/settings",
    icon: Settings,
  },
  {
    label: "Help & Docs",
    href: "/super/help",
    icon: HelpCircle,
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [administratorData, setAdministratorData] = useState<AdministratorData | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSuperUser = user?.role === "SUPER_USER" as any;

  // Determine if current path is for administrator or teacher
  const isAdministrator = pathname.includes('/administrator');
  const isTeacher = pathname.includes('/teacher');

  // Fetch teacher or administrator data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        if (isTeacher) {
          // Fetch teacher data
          const allTeachersResponse = await fetch(`${baseUrl}/teachers/`);
          if (allTeachersResponse.ok) {
            const allTeachers = await allTeachersResponse.json();
            
            const teacherRecord = allTeachers.find((teacher: TeacherData) => 
              teacher.user.email === user.email || teacher.user.id === user.id
            );
            
            if (teacherRecord) {
              const individualResponse = await fetch(`${baseUrl}/teachers/${teacherRecord.id}/`);
              if (individualResponse.ok) {
                const teacherDetails = await individualResponse.json();
                setTeacherData(teacherDetails);
              } else {
                setTeacherData(teacherRecord);
              }
            }
          }
        } else if (isAdministrator) {
          // Fetch administrator data
          const allAdminsResponse = await fetch(`${baseUrl}/administrators/`);
          if (allAdminsResponse.ok) {
            const allAdministrators = await allAdminsResponse.json();
            
            const adminRecord = allAdministrators.find((admin: AdministratorData) => 
              admin.user.email === user.email || admin.user.id === user.id
            );
            
            if (adminRecord) {
              const individualResponse = await fetch(`${baseUrl}/administrators/${adminRecord.id}/`);
              if (individualResponse.ok) {
                const adminDetails = await individualResponse.json();
                setAdministratorData(adminDetails);
              } else {
                setAdministratorData(adminRecord);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user?.id, user?.email, isTeacher, isAdministrator]);
  
  // Determine the role based on the path
  const userRole = isTeacher 
    ? "teacher" 
    : isAdministrator 
      ? "administrator" 
      : "super";

  // Get display name based on role and data
  const getDisplayName = () => {
    if (userRole === "teacher") {
      if (teacherData?.user?.name) {
        return teacherData.user.name;
      }
      if (user?.fullName) {
        return user.fullName;
      }
      return "Teacher";
    } else if (userRole === "administrator") {
      if (administratorData?.user?.name) {
        return administratorData.user.name;
      }
      if (user?.fullName) {
        return user.fullName;
      }
      return "Administrator";
    }
    return "Super User";
  };

  // Navigation items based on role
  const administratorNavItems = [
    {
      href: "/administrator",
      icon: LayoutDashboard,
      label: "Overview",
    },
    {
      href: "/administrator/groups",
      icon: UsersRound,
      label: "Observation Groups",
    },
    {
      href: "/administrator/observations",
      icon: Eye,
      label: "Observations",
    },
    {
      href: "/administrator/lesson-plans",
      icon: FileText,
      label: "Lesson Plans",
    },
    {
      href: "/administrator/settings",
      icon: Settings,
      label: "Settings",
    },
  ];
  
  
  const teacherNavItems = [
    {
      href: "/teacher",
      icon: LayoutDashboard,
      label: "Overview",
    },
    {
      href: "/teacher/observations",
      icon: Eye,
      label: "Observations",
    },
    {
      href: "/teacher/feedback",
      icon: FileText,
      label: "Feedback",
    },
    {
      href: "/teacher/lesson-plans",
      icon: FileText,
      label: "Lesson Plans",
    },
    {
      href: "/teacher/settings",
      icon: Settings,
      label: "Settings",
      disabled: true,
    },
    {
      href: "/teacher/help",
      icon: HelpCircle,
      label: "Help & Docs",
    },
  ];
  
  const navItems = userRole === "teacher" 
    ? teacherNavItems 
    : userRole === "administrator" 
      ? administratorNavItems
      : superUserNav;

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'linear-gradient(135deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 50%, rgba(132, 84, 124, 0.03) 100%)'}}>
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold" style={{color: '#84547c'}}>TET</span>
              <span className="text-2xl font-semibold text-gray-800 ml-1">Bloom</span>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          {/* User menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Role switcher */}
            <div className="relative">
              <select 
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                defaultValue={userRole}
                onChange={(e) => {
                  const newRole = e.target.value;
                  window.location.href = `/${newRole}`;
                }}
              >
                <option value="administrator">Administrator</option>
                <option value="teacher">Teacher</option>
                <option value="super">Super User</option>
              </select>
            </div> 
            
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
                userRole === "administrator" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                  : userRole === "teacher" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                    : "bg-gradient-to-r from-purple-500 to-pink-600"
              }`}>
                {userRole === "administrator" ? "A" : userRole === "teacher" ? "T" : "S"}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                {getDisplayName()}
                </div>
                <div className="text-xs text-gray-500">
                  {userRole === "administrator" 
                    ? "Administrator" 
                    : userRole === "teacher" 
                      ? "Teacher" 
                      : "Super User"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Modern Sidebar - Desktop */}
        <aside className="hidden md:block w-72 bg-white/40 backdrop-blur-xl border-r border-white/20 p-6 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Sidebar Header */}
          <div className="mb-8">
            <div className="rounded-2xl p-4 text-white" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-xl">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dashboard</h3>
                  <p className="text-blue-100 text-sm">
                    {userRole === "administrator" 
                      ? "Administrator Panel" 
                      : userRole === "teacher" 
                        ? "Teacher Portal" 
                        : "Super User Console"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mb-8">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                disabled={false}
              />
            ))}
          </nav>
          
          {/* Logout Section */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <NavItem
              href="/logout"
              icon={LogOut}
              label="Sign Out"
              active={false}
            />
          </div>
        </aside>

        {/* Modern Mobile navigation overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white/95 backdrop-blur-xl w-80 h-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold" style={{color: '#84547c'}}>TET</span>
                    <span className="text-xl font-semibold text-gray-800 ml-1">Bloom</span>
                  </div>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              
              {/* User info in mobile menu */}
              <div className="rounded-2xl p-4 text-white mb-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <div className="w-6 h-6 flex items-center justify-center font-bold">
                  {userRole === "administrator" ? "A" : userRole === "teacher" ? "T" : "S"}
                </div>
                  </div>
                  <div>
                    <div className="font-semibold">{getDisplayName()}</div>
                    <div className="text-blue-100 text-sm">
                    {userRole === "administrator" 
                      ? "Administrator" 
                      : userRole === "teacher" 
                        ? "Teacher" 
                        : "Super User"}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Role switcher in mobile menu */}
              <div className="mb-6">
                <select 
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-sm font-medium"
                  defaultValue={userRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    window.location.href = `/${newRole}`;
                  }}
                >
                  <option value="administrator">Administrator View</option>
                  <option value="teacher">Teacher View</option>
                  <option value="super">Super User View</option>
                </select>
              </div>
              
              <nav className="flex flex-col gap-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h4>
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={pathname === item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    disabled={false}
                  />
                ))}
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <NavItem
                    href="/logout"
                    icon={LogOut}
                    label="Sign Out"
                    active={false}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 