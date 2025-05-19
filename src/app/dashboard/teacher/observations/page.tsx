import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data
const observations = [
  {
    id: "1",
    observer: "Principal Johnson",
    date: "Mar 15, 2023",
    time: "10:30 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    topic: "Introduction to Algebra",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800",
    hasLessonPlan: true
  },
  {
    id: "2",
    observer: "Vice Principal Smith",
    date: "Mar 22, 2023",
    time: "1:15 PM",
    class: "Mathematics 102",
    grade: "7th Grade",
    topic: "Geometry Fundamentals",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800",
    hasLessonPlan: false
  },
  {
    id: "3",
    observer: "Principal Johnson",
    date: "Feb 20, 2023",
    time: "9:30 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    topic: "Fractions and Decimals",
    status: "completed",
    statusColor: "bg-green-100 text-green-800",
    feedback: true,
    rating: "Excellent",
    ratingColor: "text-green-600"
  },
  {
    id: "4",
    observer: "Department Head Taylor",
    date: "Feb 10, 2023",
    time: "2:00 PM",
    class: "Mathematics 103",
    grade: "7th Grade",
    topic: "Percentages",
    status: "completed",
    statusColor: "bg-green-100 text-green-800",
    feedback: true,
    rating: "Good",
    ratingColor: "text-blue-600"
  },
  {
    id: "5",
    observer: "Vice Principal Smith",
    date: "Jan 15, 2023",
    time: "11:00 AM",
    class: "Mathematics 102",
    grade: "7th Grade",
    topic: "Equations and Variables",
    status: "completed",
    statusColor: "bg-green-100 text-green-800",
    feedback: true,
    rating: "Good",
    ratingColor: "text-blue-600"
  },
  {
    id: "6",
    observer: "Principal Johnson",
    date: "Jan 8, 2023",
    time: "9:00 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    topic: "Mathematical Reasoning",
    status: "canceled",
    statusColor: "bg-red-100 text-red-800",
    cancellationReason: "School closure due to weather"
  }
];

export default function TeacherObservationsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Observations</h1>
          <p className="text-gray-600">Track your scheduled and past classroom observations</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">📝</span> Create Lesson Plan
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4 bg-white border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <Input
                placeholder="Search by class, topic, or observer..."
                className="pl-10 rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Classes</option>
              <option>Mathematics 101</option>
              <option>Mathematics 102</option>
              <option>Mathematics 103</option>
            </select>
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Status</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Canceled</option>
            </select>
          </div>
        </div>

        {/* Date filter */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input type="date" className="px-3 py-1 border rounded-md text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input type="date" className="px-3 py-1 border rounded-md text-sm" />
          </div>
          <Button variant="outline" size="sm" className="rounded-full">
            Apply Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 rounded-full">
            Reset
          </Button>
        </div>
      </Card>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border bg-white">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Total Observations</p>
            <p className="text-2xl font-bold mt-1 text-gray-800">{observations.length}</p>
          </div>
        </Card>
        <Card className="p-4 border bg-white">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Upcoming</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{observations.filter(o => o.status === 'scheduled').length}</p>
          </div>
        </Card>
        <Card className="p-4 border bg-white">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{observations.filter(o => o.status === 'completed').length}</p>
          </div>
        </Card>
        <Card className="p-4 border bg-white">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold mt-1 text-purple-600">4.5/5</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        <a href="#" className="px-4 py-2 border-b-2 border-primary text-primary font-medium whitespace-nowrap">All Observations</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:text-primary whitespace-nowrap">Upcoming</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:text-primary whitespace-nowrap">Completed</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:text-primary whitespace-nowrap">Needs Lesson Plan</a>
      </div>

      {/* Observations list */}
      <div className="space-y-4">
        {observations.map((observation) => (
          <Card key={observation.id} className="border p-4 hover:border-primary/20 transition-all bg-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Left: Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{observation.class}</h3>
                    <p className="text-gray-600">{observation.topic} • {observation.grade}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${observation.statusColor}`}>
                    {observation.status}
                  </span>
                </div>
                
                <div className="mt-2 grid md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div>
                    <span className="text-gray-500 mr-1">Observer:</span>
                    <span>{observation.observer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 mr-1">Date & Time:</span>
                    <span>{observation.date}, {observation.time}</span>
                  </div>
                  
                  {observation.status === 'completed' && observation.feedback && (
                    <div className="col-span-2 mt-1">
                      <span className="text-gray-500 mr-1">Rating:</span>
                      <span className={observation.ratingColor}>{observation.rating}</span>
                    </div>
                  )}
                  
                  {observation.status === 'scheduled' && (
                    <div className="col-span-2 mt-1">
                      <span className="text-gray-500 mr-1">Lesson Plan:</span>
                      <span className={observation.hasLessonPlan ? "text-green-600" : "text-amber-600"}>
                        {observation.hasLessonPlan ? "Submitted" : "Not Submitted"}
                      </span>
                    </div>
                  )}
                  
                  {observation.status === 'canceled' && observation.cancellationReason && (
                    <div className="col-span-2 mt-1">
                      <span className="text-gray-500 mr-1">Reason:</span>
                      <span>{observation.cancellationReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap gap-2">
                <Link href={`/dashboard/teacher/observations/${observation.id}`}>
                  <Button size="sm" variant="outline" className="rounded-full">
                    View Details
                  </Button>
                </Link>
                
                {observation.status === 'scheduled' && !observation.hasLessonPlan && (
                  <Link href={`/dashboard/teacher/lesson-plans/create?observation=${observation.id}`}>
                    <Button size="sm" className="rounded-full">
                      Submit Lesson Plan
                    </Button>
                  </Link>
                )}
                
                {observation.status === 'scheduled' && observation.hasLessonPlan && (
                  <Link href={`/dashboard/teacher/lesson-plans/edit?observation=${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full">
                      Edit Lesson Plan
                    </Button>
                  </Link>
                )}
                
                {observation.status === 'completed' && observation.feedback && (
                  <Link href={`/dashboard/teacher/feedback/${observation.id}`}>
                    <Button size="sm" className="rounded-full">
                      View Feedback
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-gray-600">
          Showing all {observations.length} observations
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="rounded-md">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-md bg-primary/10">1</Button>
          <Button variant="outline" size="sm" className="rounded-md">Next</Button>
        </div>
      </div>
    </div>
  );
} 