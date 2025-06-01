"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function AdministratorDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h1>
          <p className="text-gray-600">Manage teacher observations, feedback, and school performance</p>
        </div>
      </div>

      {/* Informative Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Teacher Observations Card */}
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
              📅
            </div>
            <h3 className="text-lg font-semibold">Teacher Observations</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">{dashboardStats.observations.total}</span>
              <span className="text-sm text-gray-500">Total Active</span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Scheduled:</span>
                <span className="font-medium text-blue-600">{dashboardStats.observations.scheduled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Feedback:</span>
                <span className="font-medium text-orange-600">{dashboardStats.observations.pendingFeedback}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Week:</span>
                <span className="font-medium text-green-600">{dashboardStats.observations.thisWeek}</span>
              </div>
            </div>
          </div>
          
          <Link href="/administrator/observations">
            <Button className="w-full rounded-full">View Observations</Button>
          </Link>
        </Card>
        
        {/* Lesson Plans Card */}
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center">
              📚
            </div>
            <h3 className="text-lg font-semibold">Lesson Plans</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">{dashboardStats.lessonPlans.total}</span>
              <span className="text-sm text-gray-500">Total Submitted</span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Review:</span>
                <span className="font-medium text-yellow-600">{dashboardStats.lessonPlans.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Need Revision:</span>
                <span className="font-medium text-red-600">{dashboardStats.lessonPlans.needsRevision}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due This Week:</span>
                <span className="font-medium text-blue-600">{dashboardStats.lessonPlans.dueThisWeek}</span>
              </div>
            </div>
          </div>
          
          <Link href="/administrator/lesson-plans">
            <Button className="w-full rounded-full">Manage Lesson Plans</Button>
          </Link>
        </Card>
        
        {/* Feedback Management Card */}
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
              💬
            </div>
            <h3 className="text-lg font-semibold">Feedback Management</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-800">{dashboardStats.feedback.pending}</span>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{dashboardStats.feedback.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overdue:</span>
                <span className="font-medium text-red-600">{dashboardStats.feedback.overdueCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-medium text-blue-600">{dashboardStats.feedback.averageResponseTime}</span>
              </div>
            </div>
          </div>
          
          <Link href="/administrator/feedback">
            <Button className="w-full rounded-full">Manage Feedback</Button>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <Card className="border shadow-sm">
          <div className="divide-y">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Observation scheduled with Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Mathematics • 5th Grade • Feb 28, 2023</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium">Scheduled</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Feedback provided to David Wilson</p>
                  <p className="text-sm text-gray-600">History • 9th Grade • Feb 24, 2023</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium">Completed</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Observation rescheduled with Michael Chen</p>
                  <p className="text-sm text-gray-600">Science • 7th Grade • Updated to Mar 1, 2023</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-medium">Rescheduled</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 