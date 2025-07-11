"use client";

import { useAuthPermissions } from '@/lib/auth-permissions';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  const { sidebarItems, userRole } = useAuthPermissions();
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  console.log('USER ROLE:', user?.role);
  console.log('USER ROLE FROM PERMISSIONS:', userRole);
  console.log('SIDEBAR ITEMS:', sidebarItems);
  console.log('CURRENT PATH:', pathname);

  // Map string icon names to actual Lucide icons
  const iconMap: Record<string, React.ElementType> = {
    'layout-dashboard': Icons.LayoutDashboard,
    'users': Icons.Users,
    'folder': Icons.Folder,
    'clipboard-list': Icons.ClipboardList,
    'bar-chart': Icons.BarChart,
    'settings': Icons.Settings,
    'user': Icons.User,
    'log-out': Icons.LogOut,
  };

  return (
    <aside className="w-64 border-r h-screen bg-white flex flex-col">
      {/* Logo and app name */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">TET</span>
          <span className="text-2xl font-semibold">Bloom</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Icons.User size={20} />
          </div>
          <div>
            <p className="font-medium">{user?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'super_user' 
                ? 'Super Admin' 
                : user?.role === 'administrator'
                ? 'Administrator'
                : 'Teacher'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = iconMap[item.icon] || Icons.Circle;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 font-normal h-10 px-3", 
                      isActive 
                        ? "bg-primary/10 text-primary font-medium hover:bg-primary/15" 
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 mt-auto border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 font-normal text-gray-700 hover:bg-gray-100"
          onClick={() => signOut()}
        >
          <Icons.LogOut size={18} />
          <span>Sign out</span>
        </Button>
      </div>
    </aside>
  );
}; 