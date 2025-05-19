import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const upcomingObservations = [
  {
    id: "1",
    observer: "Principal Johnson",
    date: "Mar 15, 2023",
    time: "10:30 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "2",
    observer: "Vice Principal Smith",
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
    observer: "Principal Johnson",
    class: "Mathematics 101",
    summary: "Strong presentation of complex concepts. Students were engaged throughout.",
    rating: "Excellent",
    ratingColor: "text-green-600"
  },
  {
    id: "2",
    date: "Jan 30, 2023",
    observer: "Vice Principal Smith",
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
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">📝</span> Log Teaching Activity
          </Button>
          <Button variant="outline" className="rounded-full shadow-sm">
            <span className="mr-2">🎯</span> Set New Goal
          </Button>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Link href="/dashboard/teacher/observations">
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
              <Link href="/dashboard/teacher/feedback">
                <Button variant="ghost" size="sm" className="text-primary w-full justify-start hover:bg-primary/10">
                  View Feedback <span className="ml-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-5 border bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                🎓
              </div>
              <h2 className="font-semibold">Professional Growth</h2>
            </div>
            <p className="text-4xl font-bold">{professionalDevelopment.length}</p>
            <p className="text-gray-600 mt-1">Learning opportunities available</p>
            <div className="mt-auto pt-4">
              <Link href="/dashboard/teacher/development">
                <Button variant="ghost" size="sm" className="text-primary w-full justify-start hover:bg-primary/10">
                  Explore Opportunities <span className="ml-1">→</span>
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
            <Link href="/dashboard/teacher/observations" className="text-primary text-sm font-medium hover:underline">
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
                  <Link href={`/dashboard/teacher/observations/${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/teacher/lesson-plans/create?observation=${observation.id}`}>
                    <Button size="sm" className="rounded-full text-xs">
                      Submit Lesson Plan
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback */}
        <Card className="border p-0 overflow-hidden bg-white">
          <div className="border-b px-4 py-3 bg-gradient-to-r from-secondary/5 to-primary/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Feedback</h2>
              <Link href="/dashboard/teacher/feedback" className="text-primary text-sm font-medium hover:underline">
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
                  <Link href={`/dashboard/teacher/feedback/${feedback.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs w-full">
                      View Full Feedback
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Professional Development */}
        <Card className="border p-0 overflow-hidden bg-white">
          <div className="border-b px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Professional Development</h2>
              <Link href="/dashboard/teacher/development" className="text-primary text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {professionalDevelopment.map((opportunity) => (
              <div key={opportunity.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{opportunity.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        {opportunity.type}
                      </span>
                      <span>{opportunity.date}</span>
                    </div>
                  </div>
                  {opportunity.recommended && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <Button size="sm" className="rounded-full text-xs w-full">
                    {opportunity.status === "Available" ? "Enroll Now" : "Registration Info"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Development Goals */}
      <Card className="border p-0 overflow-hidden bg-white">
        <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Your Development Goals</h2>
            <Button size="sm" className="rounded-full">
              <span className="mr-1">➕</span> Add Goal
            </Button>
          </div>
        </div>
        
        <div className="p-4 grid gap-4">
          {develGoals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="font-medium text-base">{goal.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      {goal.status}
                    </span>
                    <span>Due: {goal.dueDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center w-32">
                    <div className="bg-gray-200 h-2 flex-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium ml-2">{goal.progress}%</span>
                  </div>
                  
                  <Button size="sm" variant="outline" className="rounded-full">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 