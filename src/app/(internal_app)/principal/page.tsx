"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrincipalDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Principal Dashboard</h1>
          <p className="text-gray-600">Manage teacher observations, feedback, and school performance</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <h3 className="text-lg font-semibold mb-2">Teacher Observations</h3>
          <p className="text-gray-600 mb-4">Schedule, view, and manage teacher observations</p>
          <Link href="/principal/observations">
            <Button className="w-full rounded-full">View Observations</Button>
          </Link>
        </Card>
        
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <h3 className="text-lg font-semibold mb-2">Feedback Management</h3>
          <p className="text-gray-600 mb-4">Review and provide feedback for completed observations</p>
          <Link href="/principal/feedback">
            <Button className="w-full rounded-full">Manage Feedback</Button>
          </Link>
        </Card>
        
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p className="text-gray-600 mb-4">Configure your account and application preferences</p>
          <Link href="/principal/settings">
            <Button className="w-full rounded-full">Open Settings</Button>
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