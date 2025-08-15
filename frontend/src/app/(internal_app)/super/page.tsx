"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Calendar from "@/components/ui/calendar";
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  UsersRound, 
  TrendingUp, 
  Activity,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  Sparkles
} from "lucide-react";

interface StatsData {
  total_users: number;
  total_teachers: number;
  total_administrators: number;
  total_observation_groups: number;
}

// Mock data for recent activity
const recentActivity = [
  {
    id: "1",
    action: "Created new user",
    user: "Emily Rodriguez (Teacher)",
    date: "Mar 3, 2023",
    time: "1:00 PM",
    type: "user",
    icon: Users
  },
  {
    id: "2",
    action: "Modified observation group",
    user: "Math Department",
    date: "Mar 2, 2023",
    time: "11:30 AM",
    type: "group",
    icon: UsersRound
  },
  {
    id: "3",
    action: "Imported 10 teacher accounts",
    user: "Bulk Import",
    date: "Mar 1, 2023",
    time: "9:45 AM",
    type: "import",
    icon: Activity
  },
];

// Mock calendar events
const mockEvents = [
  {
    id: "1",
    title: "Teacher Training Session",
    date: new Date(2024, new Date().getMonth(), 15),
    color: "#84547c",
    description: "Professional development workshop"
  },
  {
    id: "2",
    title: "Monthly Review Meeting",
    date: new Date(2024, new Date().getMonth(), 22),
    color: "#e4a414",
    description: "System performance review"
  },
  {
    id: "3",
    title: "New User Onboarding",
    date: new Date(2024, new Date().getMonth(), 28),
    color: "bg-purple-500",
    description: "Orientation for new staff"
  },
  {
    id: "4",
    title: "System Maintenance",
    date: new Date(2024, new Date().getMonth() + 1, 5),
    color: "bg-red-500",
    description: "Scheduled maintenance window"
  }
];

export default function SuperUserDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/total-stats/');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    { 
      label: "Total Users", 
      key: "total_users" as keyof StatsData,
      icon: Users,
      link: "/super/users",
      gradient: "rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%",
      bgColor: "rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%",
      iconColor: "#84547c"
    },
    { 
      label: "Teachers", 
      key: "total_teachers" as keyof StatsData,
      icon: GraduationCap,
      link: "/super/users?role=teacher",
      gradient: "rgba(228, 164, 20, 1) 0%, rgba(132, 84, 124, 1) 100%",
      bgColor: "rgba(228, 164, 20, 0.05) 0%, rgba(132, 84, 124, 0.05) 100%",
      iconColor: "#e4a414"
    },
    { 
      label: "Administrators", 
      key: "total_administrators" as keyof StatsData,
      icon: UserCheck,
      link: "/super/users?role=administrator",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600"
    },
    { 
      label: "Observation Groups", 
      key: "total_observation_groups" as keyof StatsData,
      icon: UsersRound,
      link: "/super/groups",
      gradient: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      iconColor: "text-orange-600"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Super User Dashboard</h1>
                  <p className="text-white/90 text-lg mt-1">System-wide management and configuration</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/super/users/create">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <Users className="mr-2 h-5 w-5" />
                  Create User
                </Button>
              </Link>
              <Link href="/super/users/import">
                <Button className="bg-transparent border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <Activity className="mr-2 h-5 w-5" />
                  Import Users
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading state
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="relative overflow-hidden bg-white border-0 shadow-xl rounded-3xl">
              <div className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 mb-4"></div>
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                </div>
                <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
              </div>
            </Card>
          ))
        ) : error ? (
          // Error state
          <div className="col-span-full">
            <Card className="p-6 border-0 shadow-xl rounded-3xl bg-gradient-to-br from-red-50 to-rose-100">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-2xl">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Stats</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Stats display
          statsConfig.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Link href={stat.link} key={index} className="block group">
                <Card className="relative overflow-hidden border-0 shadow-xl rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" style={{background: `linear-gradient(135deg, ${stat.bgColor})`}}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                          {stats?.[stat.key] || 0}
                        </p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" style={{color: '#e4a414'}} />
                          <span className="text-xs font-medium" style={{color: '#e4a414'}}>
                            Active
                          </span>
                        </div>
                      </div>
                      
                      <div className={`bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8" style={{color: stat.iconColor}} />
                      </div>
                    </div>
                    
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl" style={{background: `linear-gradient(90deg, ${stat.gradient})`}}></div>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl" style={{background: `linear-gradient(90deg, ${stat.gradient})`}}></div>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div>
          <Calendar 
            events={mockEvents} 
            onDateClick={(date) => console.log('Date clicked:', date)}
            onEventClick={(event) => console.log('Event clicked:', event)}
            className="shadow-xl max-w-md mx-auto lg:max-w-none"
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="text-white p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Activity className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                </div>
                <Link href="/super/activity" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="p-4 transition-all duration-200" 
                         onMouseEnter={(e) => {
                           e.currentTarget.style.background = 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.background = 'transparent';
                         }}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl flex-shrink-0" style={{background: 'linear-gradient(45deg, rgba(132, 84, 124, 0.2) 0%, rgba(228, 164, 20, 0.2) 100%)'}}>
                          <IconComponent className="h-4 w-4" style={{color: '#84547c'}} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                            <p className="text-xs text-gray-500 ml-2">{activity.time}</p>
                          </div>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
            <CardHeader className="text-white p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Link href="/super/users" className="block">
                <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl transition-colors" style={{backgroundColor: 'rgba(132, 84, 124, 0.2)'}}>
                      <Users className="h-5 w-5" style={{color: '#84547c'}} />
                    </div>
                    <h3 className="font-semibold text-gray-800">User Management</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Create, edit, or deactivate user accounts</p>
                  <div className="text-sm font-medium" style={{color: '#84547c'}}>
                    Manage Users →
                  </div>
                </div>
              </Link>

              <Link href="/super/groups" className="block">
                <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl transition-colors" style={{backgroundColor: 'rgba(228, 164, 20, 0.2)'}}>
                      <UsersRound className="h-5 w-5" style={{color: '#e4a414'}} />
                    </div>
                    <h3 className="font-semibold text-gray-800">Observation Groups</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Organize teachers into observation groups</p>
                  <div className="text-sm font-medium" style={{color: '#e4a414'}}>
                    Manage Groups →
                  </div>
                </div>
              </Link>

              <Link href="/super/settings" className="block">
                <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl transition-colors" style={{backgroundColor: 'rgba(132, 84, 124, 0.2)'}}>
                      <AlertCircle className="h-5 w-5" style={{color: '#84547c'}} />
                    </div>
                    <h3 className="font-semibold text-gray-800">System Settings</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Configure system-wide settings and preferences</p>
                  <div className="text-sm font-medium" style={{color: '#84547c'}}>
                    System Settings →
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 