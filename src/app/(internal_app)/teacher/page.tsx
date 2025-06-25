import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const upcomingObservations = [
  {
    id: "1",
    observer: "Administrator Johnson",
    date: "Mar 15, 2023",
    time: "10:30 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "2",
    observer: "Vice Administrator Smith",
    date: "Mar 22, 2023",
    time: "1:15 PM",
    class: "Mathematics 102",
    grade: "7th Grade",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800"
  }
];

const recentFeedback = [
  {
    id: "1",
    date: "Feb 20, 2023",
    observer: "Administrator Johnson",
    class: "Mathematics 101",
    summary: "Strong presentation of complex concepts. Students were engaged throughout.",
    rating: "Excellent",
    ratingColor: "text-green-600"
  },
  {
    id: "2",
    date: "Jan 30, 2023",
    observer: "Vice Administrator Smith",
    class: "Mathematics 103",
    summary: "Good classroom management. Consider incorporating more group activities.",
    rating: "Good",
    ratingColor: "text-blue-600"
  }
];

const professionalDevelopment = [
  {
    id: "1",
    title: "Innovative Teaching Methods Workshop",
    date: "Mar 25, 2023",
    type: "Workshop",
    recommended: true,
    status: "Available"
  },
  {
    id: "2",
    title: "Mathematics Curriculum Conference",
    date: "Apr 10-12, 2023",
    type: "Conference",
    recommended: true,
    status: "Registration Required"
  },
  {
    id: "3",
    title: "Digital Tools for Math Education",
    date: "On-Demand",
    type: "Online Course",
    recommended: false,
    status: "Available"
  }
];

const develGoals = [
  {
    id: "1",
    title: "Implement Project-Based Learning",
    status: "In Progress",
    progress: 60,
    dueDate: "End of Semester"
  },
  {
    id: "2",
    title: "Incorporate More Technology in Lessons",
    status: "In Progress",
    progress: 40,
    dueDate: "End of Year"
  }
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Ms. Chen</h1>
          <p className="text-gray-600">Your teaching journey at a glance</p>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                📅
              </div>
              <h2 className="font-semibold">Upcoming Observations</h2>
            </div>
            <p className="text-4xl font-bold">{upcomingObservations.length}</p>
            <p className="text-gray-600 mt-1">Next: {upcomingObservations[0]?.date}</p>
            <div className="mt-auto pt-4">
              <Link href="/teacher/observations">
                <Button variant="ghost" size="sm" className="text-primary w-full justify-start hover:bg-primary/10">
                  View Schedule <span className="ml-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-5 border bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center">
                📈
              </div>
              <h2 className="font-semibold">Performance Rating</h2>
            </div>
            <p className="text-4xl font-bold">4.5/5</p>
            <p className="text-gray-600 mt-1">Based on last 5 observations</p>
            <div className="mt-auto pt-4">
              <Link href="/teacher/feedback">
                <Button variant="ghost" size="sm" className="text-primary w-full justify-start hover:bg-primary/10">
                  View Feedback <span className="ml-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming observations */}
      <Card className="border p-0 overflow-hidden bg-white">
        <div className="border-b px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Upcoming Observations</h2>
            <Link href="/teacher/observations" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
        </div>
        {upcomingObservations.length > 0 ? (
          <div className="divide-y">
            {upcomingObservations.map((observation) => (
              <div key={observation.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{observation.observer}</div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${observation.statusColor}`}>
                    {observation.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-1">
                  <div className="text-gray-600">Class:</div>
                  <div>{observation.class}</div>
                  <div className="text-gray-600">Grade:</div>
                  <div>{observation.grade}</div>
                  <div className="text-gray-600">Date & Time:</div>
                  <div>{observation.date}, {observation.time}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/teacher/observations/${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/teacher/lesson-plans">
                    <Button size="sm" className="rounded-full text-xs">
                      Weekly Lesson Plans
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-800">No upcoming observations!</h3>
            <p className="text-gray-600 mt-1">You're all caught up for now.</p>
          </div>
        )}
      </Card>

      {/* Two column layout for recent feedback and professional development */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Feedback */}
        <Card className="border p-0 overflow-hidden bg-white">
          <div className="border-b px-4 py-3 bg-gradient-to-r from-secondary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Feedback</h2>
              <Link href="/teacher/feedback" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{feedback.observer}</div>
                  <div className="text-xs text-gray-500">{feedback.date}</div>
                </div>
                <div className="text-sm text-gray-600">{feedback.class}</div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border text-sm">
                  <p className="text-gray-700">{feedback.summary}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Overall Rating</span>
                    <span className={`font-medium ${feedback.ratingColor}`}>{feedback.rating}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Link href={`/teacher/feedback/${feedback.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs w-full">
                      View Full Feedback
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 