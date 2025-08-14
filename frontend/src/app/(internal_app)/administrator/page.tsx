"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { baseUrl } from "@/lib/api";
import { useState, useEffect } from "react";
import { 
  Eye, 
  FileText, 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  BarChart3,
  Target,
  Activity,
  Sparkles,
  Star,
  Award
} from "lucide-react";

// Mock data for dashboard statistics
const dashboardStats = {
  observations: {
    total: 12,
    scheduled: 5,
    completed: 4,
    pendingFeedback: 3,
    thisWeek: 2,
    nextWeek: 3
  },
  lessonPlans: {
    total: 18,
    pending: 6,
    approved: 8,
    needsRevision: 4,
    overdue: 2,
    dueThisWeek: 4
  },
  feedback: {
    pending: 7,
    completed: 15,
    awaitingApproval: 3,
    averageResponseTime: "2.5 days",
    overdueCount: 2
  },
  teachers: {
    total: 24,
    activeThisMonth: 18,
    highPerformers: 6,
    needsSupport: 2
  }
};

interface AdminData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdministratorDashboard() {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch individual administrator data from backend
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.id) return;

      try {
        // First, get all administrators to find the admin record that matches the user
        const allAdminsResponse = await fetch(`${baseUrl}/administrators/`);
        if (allAdminsResponse.ok) {
          const allAdmins = await allAdminsResponse.json();
          console.log('All administrators:', allAdmins);
          
          // Find the administrator record that matches the current user
          const adminRecord = allAdmins.find((admin: AdminData) => 
            admin.user.email === user.email || admin.user.id === user.id
          );
          
          if (adminRecord) {
            console.log('Found administrator record:', adminRecord);
            
            // Now fetch individual administrator details using the specific endpoint
            const individualResponse = await fetch(`${baseUrl}/administrators/${adminRecord.id}/`);
            if (individualResponse.ok) {
              const adminDetails = await individualResponse.json();
              console.log('Individual administrator details:', adminDetails);
              setAdminData(adminDetails);
            } else {
              console.error('Failed to fetch individual administrator details:', individualResponse.status);
              // Fallback to the admin record we found
              setAdminData(adminRecord);
            }
          } else {
            console.log('Administrator record not found for user:', user.email);
          }
        } else {
          console.error('Failed to fetch administrators list:', allAdminsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching administrator data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user?.id, user?.email]);
  
  // Get administrator's name from API data or fallback to auth data
  const getAdminName = () => {
    if (adminData?.user?.name) {
      const firstName = adminData.user.name.split(' ')[0];
      return firstName;
    }
    
    if (user?.fullName) {
      const firstName = user.fullName.split(' ')[0];
      return firstName;
    }
    
    return "Administrator";
  };

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Welcome, {getAdminName()}!</h1>
                  <p className="text-emerald-100 text-lg mt-1">Manage teacher observations, feedback, and school performance</p>
                  {loading && (
                    <p className="text-emerald-200 text-sm mt-1">Loading administrator details...</p>
                  )}
                </div>
              </div>
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{dashboardStats.observations.total}</div>
                  <div className="text-emerald-100 text-sm">Observations</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{dashboardStats.teachers.total}</div>
                  <div className="text-emerald-100 text-sm">Teachers</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{dashboardStats.lessonPlans.total}</div>
                  <div className="text-emerald-100 text-sm">Lesson Plans</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{dashboardStats.feedback.pending}</div>
                  <div className="text-emerald-100 text-sm">Pending</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/administrator/observations/schedule">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Schedule Observation
                </Button>
              </Link>
              <Link href="/administrator/observations/t-tess">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  T-TESS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teacher Observations Card */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Eye className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">Teacher Observations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{dashboardStats.observations.total}</div>
                <p className="text-gray-600">Total Active Observations</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-100 rounded-2xl">
                  <div className="text-xl font-bold text-blue-600">{dashboardStats.observations.scheduled}</div>
                  <div className="text-xs text-blue-700">Scheduled</div>
                </div>
                <div className="text-center p-3 bg-orange-100 rounded-2xl">
                  <div className="text-xl font-bold text-orange-600">{dashboardStats.observations.pendingFeedback}</div>
                  <div className="text-xs text-orange-700">Pending</div>
                </div>
                <div className="text-center p-3 bg-green-100 rounded-2xl">
                  <div className="text-xl font-bold text-green-600">{dashboardStats.observations.thisWeek}</div>
                  <div className="text-xs text-green-700">This Week</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Next Week</span>
                  </div>
                  <span className="font-semibold text-blue-600">{dashboardStats.observations.nextWeek}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold text-green-600">{dashboardStats.observations.completed}</span>
                </div>
              </div>
              
              <Link href="/administrator/observations">
                <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105">
                  <Eye className="mr-2 h-4 w-4" />
                  View All Observations
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Lesson Plans Card */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">Lesson Plans</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{dashboardStats.lessonPlans.total}</div>
                <p className="text-gray-600">Total Submitted Plans</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-100 rounded-2xl">
                  <div className="text-xl font-bold text-yellow-600">{dashboardStats.lessonPlans.pending}</div>
                  <div className="text-xs text-yellow-700">Pending</div>
                </div>
                <div className="text-center p-3 bg-red-100 rounded-2xl">
                  <div className="text-xl font-bold text-red-600">{dashboardStats.lessonPlans.needsRevision}</div>
                  <div className="text-xs text-red-700">Revisions</div>
                </div>
                <div className="text-center p-3 bg-green-100 rounded-2xl">
                  <div className="text-xl font-bold text-green-600">{dashboardStats.lessonPlans.approved}</div>
                  <div className="text-xs text-green-700">Approved</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Due This Week</span>
                  </div>
                  <span className="font-semibold text-blue-600">{dashboardStats.lessonPlans.dueThisWeek}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-gray-600">Overdue</span>
                  </div>
                  <span className="font-semibold text-red-600">{dashboardStats.lessonPlans.overdue}</span>
                </div>
              </div>
              
              <Link href="/administrator/lesson-plans">
                <Button className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Lesson Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Recent Activity */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-100 border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <div className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-xl flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Observation scheduled with Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Mathematics • 5th Grade • Feb 28, 2023</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-xl flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Feedback provided to David Wilson</p>
                      <p className="text-sm text-gray-600">History • 9th Grade • Feb 24, 2023</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-2 rounded-xl flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Observation rescheduled with Michael Chen</p>
                      <p className="text-sm text-gray-600">Science • 7th Grade • Updated to Mar 1, 2023</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Rescheduled
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-xl flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Lesson plan approved for Emily Rodriguez</p>
                      <p className="text-sm text-gray-600">English Literature • 10th Grade • Feb 22, 2023</p>
                    </div>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-100 border-t">
            <Link href="/administrator/activity">
              <Button variant="outline" className="w-full rounded-2xl hover:bg-white/80 transition-all duration-300">
                <Activity className="mr-2 h-4 w-4" />
                View All Activity
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 