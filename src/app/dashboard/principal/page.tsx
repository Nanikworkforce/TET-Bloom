import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const stats = [
  { 
    label: "Total Teachers", 
    value: 42, 
    change: "+2", 
    changeType: "positive",
    icon: "👩‍🏫",
    link: "/dashboard/principal/teachers"
  },
  { 
    label: "Pending Observations", 
    value: 8, 
    change: "-3", 
    changeType: "positive",
    icon: "📅",
    link: "/dashboard/principal/observations"
  },
  { 
    label: "Completed This Month", 
    value: 24, 
    change: "+5", 
    changeType: "positive",
    icon: "✅",
    link: "/dashboard/principal/observations?status=completed"
  },
  { 
    label: "Feedback Response Rate", 
    value: "87%", 
    change: "+12%", 
    changeType: "positive",
    icon: "📈",
    link: "/dashboard/principal/feedback"
  },
];

const upcomingObservations = [
  {
    id: "1",
    teacher: "Sarah Johnson",
    subject: "Mathematics",
    date: "Feb 28, 2023",
    time: "10:30 AM",
    grade: "5th Grade",
    status: "scheduled"
  },
  {
    id: "2",
    teacher: "Michael Chen",
    subject: "Science",
    date: "Mar 1, 2023",
    time: "9:15 AM",
    grade: "7th Grade",
    status: "scheduled"
  },
  {
    id: "3",
    teacher: "Emily Rodriguez",
    subject: "English Literature",
    date: "Mar 3, 2023",
    time: "1:00 PM",
    grade: "10th Grade",
    status: "scheduled"
  },
];

const recentFeedback = [
  {
    id: "1",
    teacher: "David Wilson",
    subject: "History",
    date: "Feb 24, 2023",
    strengths: "Excellent student engagement strategies",
    areas: "Could improve on time management"
  },
  {
    id: "2",
    teacher: "Jessica Martinez",
    subject: "Art",
    date: "Feb 22, 2023",
    strengths: "Creative project design, inclusive teaching",
    areas: "More structured assessment methods"
  },
];

export default function PrincipalDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Principal!</h1>
          <p className="text-gray-600">Here's what's happening at your school</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/principal/observations/schedule">
            <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
              <span className="mr-2">➕</span> Schedule Observation
            </Button>
          </Link>
          <Button variant="outline" className="rounded-full shadow-sm">
            <span className="mr-2">📊</span> View Reports
          </Button>
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

      {/* Two column layout for upcoming and feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Observations */}
        <Card className="border p-0 overflow-hidden bg-white">
          <div className="border-b px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Upcoming Observations</h2>
              <Link href="/dashboard/principal/observations" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {upcomingObservations.map((observation) => (
              <div key={observation.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{observation.teacher}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {observation.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-1">
                  <div className="text-gray-600">Subject:</div>
                  <div>{observation.subject}</div>
                  <div className="text-gray-600">Grade:</div>
                  <div>{observation.grade}</div>
                  <div className="text-gray-600">Date & Time:</div>
                  <div>{observation.date}, {observation.time}</div>
                </div>
                <div className="mt-3">
                  <Link href={`/dashboard/principal/observations/${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-primary/5 text-center">
            <Link href="/dashboard/principal/observations/schedule">
              <Button size="sm" className="rounded-full w-full bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white">
                <span className="mr-1">➕</span> Schedule New Observation
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Feedback */}
        <Card className="border p-0 overflow-hidden bg-white">
          <div className="border-b px-4 py-3 bg-gradient-to-r from-secondary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Teacher Feedback</h2>
              <Link href="/dashboard/principal/feedback" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{feedback.teacher}</div>
                  <div className="text-xs text-gray-500">{feedback.date}</div>
                </div>
                <div className="text-sm text-gray-600">{feedback.subject}</div>
                <div className="mt-3 grid gap-2">
                  <div className="bg-green-50 p-2 rounded-lg text-sm">
                    <span className="font-medium text-green-700">Strengths:</span> {feedback.strengths}
                  </div>
                  <div className="bg-amber-50 p-2 rounded-lg text-sm">
                    <span className="font-medium text-amber-700">Areas for Growth:</span> {feedback.areas}
                  </div>
                </div>
                <div className="mt-3">
                  <Link href={`/dashboard/principal/feedback/${feedback.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs w-full">
                      View Full Feedback
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-secondary/5 text-center">
            <Button size="sm" className="rounded-full w-full bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white">
              <span className="mr-1">📝</span> Submit New Feedback
            </Button>
          </div>
        </Card>
      </div>

      {/* Calendar summary/Performance section */}
      <Card className="border p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Monthly Observation Progress</h2>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>February 2023</option>
            <option>January 2023</option>
            <option>December 2022</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
          <p className="text-gray-400">Progress chart will be displayed here</p>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-blue-50">
            <div className="text-sm text-gray-600">Target</div>
            <div className="text-xl font-bold text-blue-600">35</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xl font-bold text-green-600">24</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-xl font-bold text-yellow-600">8</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50">
            <div className="text-sm text-gray-600">Completion Rate</div>
            <div className="text-xl font-bold text-purple-600">68%</div>
          </div>
        </div>
      </Card>
    </div>
  );
} 