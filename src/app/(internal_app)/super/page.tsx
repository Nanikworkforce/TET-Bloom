import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const stats = [
  { 
    label: "Total Users", 
    value: 68, 
    change: "+5", 
    changeType: "positive",
    icon: "👥",
    link: "/super/users"
  },
  { 
    label: "Teachers", 
    value: 45, 
    change: "+3", 
    changeType: "positive",
    icon: "👩‍🏫",
    link: "/super/users?role=teacher"
  },
  { 
    label: "School Leaders", 
    value: 12, 
    change: "+1", 
    changeType: "positive",
    icon: "👨‍💼",
    link: "/super/users?role=school-leader"
  },
  { 
    label: "Observation Groups", 
    value: 8, 
    change: "+2", 
    changeType: "positive",
    icon: "👥",
    link: "/super/groups"
  },
];

const recentActivity = [
  {
    id: "1",
    action: "Created new user",
    user: "Emily Rodriguez (Teacher)",
    date: "Mar 3, 2023",
    time: "1:00 PM"
  },
  {
    id: "2",
    action: "Modified observation group",
    user: "Math Department",
    date: "Mar 2, 2023",
    time: "11:30 AM"
  },
  {
    id: "3",
    action: "Imported 10 teacher accounts",
    user: "Bulk Import",
    date: "Mar 1, 2023",
    time: "9:45 AM"
  },
];

export default function SuperUserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Super User Dashboard</h1>
          <p className="text-gray-600">System-wide management and configuration</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/super/users/create">
            <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
              <span className="mr-2">➕</span> Create User
            </Button>
          </Link>
          <Link href="/super/users/import">
            <Button variant="outline" className="rounded-full shadow-sm">
              <span className="mr-2">📥</span> Import Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link href={stat.link} key={index} className="block">
            <Card className="p-4 h-full border hover:border-primary/40 transition-colors hover:shadow-md bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
                  <div className={`mt-1 text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </div>
                </div>
                <div className="text-3xl bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary/90">
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border p-0 overflow-hidden bg-white">
        <div className="border-b px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Recent Activity</h2>
            <Link href="/super/activity" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{activity.action}</div>
                <div className="text-xs text-gray-500">{activity.date}, {activity.time}</div>
              </div>
              <div className="text-sm text-gray-600">{activity.user}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border bg-white hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">User Management</h3>
          <p className="text-sm text-gray-600 mb-4">Create, edit, or deactivate user accounts</p>
          <Link href="/super/users">
            <Button variant="outline" className="w-full rounded-lg">Manage Users</Button>
          </Link>
        </Card>
        
        <Card className="p-5 border bg-white hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">Observation Groups</h3>
          <p className="text-sm text-gray-600 mb-4">Organize teachers into observation groups</p>
          <Link href="/super/groups">
            <Button variant="outline" className="w-full rounded-lg">Manage Groups</Button>
          </Link>
        </Card>
        
        <Card className="p-5 border bg-white hover:shadow-md transition-shadow">
          <h3 className="font-semibold mb-2">System Settings</h3>
          <p className="text-sm text-gray-600 mb-4">Configure system-wide settings and preferences</p>
          <Link href="/super/settings">
            <Button variant="outline" className="w-full rounded-lg">System Settings</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
} 