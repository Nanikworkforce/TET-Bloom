import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data
const teachers = [
  {
    id: "1",
    name: "Sarah Johnson",
    subject: "Mathematics",
    grade: "5th Grade",
    observations: 4,
    lastObservation: "Feb 15, 2023",
    status: "Good Standing",
    avatarColor: "bg-blue-100",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "2",
    name: "Michael Chen",
    subject: "Science",
    grade: "7th Grade",
    observations: 3,
    lastObservation: "Feb 10, 2023",
    status: "Good Standing",
    avatarColor: "bg-green-100",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    subject: "English Literature",
    grade: "10th Grade",
    observations: 2,
    lastObservation: "Feb 5, 2023",
    status: "Needs Improvement",
    avatarColor: "bg-purple-100",
    statusColor: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "4",
    name: "David Wilson",
    subject: "History",
    grade: "9th Grade",
    observations: 3,
    lastObservation: "Jan 27, 2023",
    status: "Good Standing",
    avatarColor: "bg-amber-100",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "5",
    name: "Jessica Martinez",
    subject: "Art",
    grade: "Multiple",
    observations: 2,
    lastObservation: "Jan 20, 2023",
    status: "Good Standing",
    avatarColor: "bg-pink-100",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "6",
    name: "Robert Thompson",
    subject: "Physical Education",
    grade: "Multiple",
    observations: 2,
    lastObservation: "Jan 18, 2023",
    status: "Exemplary",
    avatarColor: "bg-red-100",
    statusColor: "bg-blue-100 text-blue-800"
  },
];

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
          <p className="text-gray-600">Manage and view all teachers at your school</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">➕</span> Add Teacher
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <Card className="p-4 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <Input
                placeholder="Search teachers by name or subject..."
                className="pl-10 rounded-full"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 border rounded-full text-sm">
              <option>All Grades</option>
              <option>Elementary</option>
              <option>Middle School</option>
              <option>High School</option>
            </select>
            <select className="px-4 py-2 border rounded-full text-sm">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
              <option>Arts</option>
              <option>Physical Education</option>
            </select>
            <select className="px-4 py-2 border rounded-full text-sm">
              <option>All Status</option>
              <option>Exemplary</option>
              <option>Good Standing</option>
              <option>Needs Improvement</option>
              <option>Under Review</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Teachers list */}
      <div className="grid gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="p-4 bg-white border hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${teacher.avatarColor}`}>
                <span className="text-lg font-bold">
                  {teacher.name.split(" ").map(name => name[0]).join("")}
                </span>
              </div>
              
              {/* Teacher info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold truncate">{teacher.name}</h3>
                    <div className="text-sm text-gray-600">
                      {teacher.subject} • {teacher.grade}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.statusColor}`}>
                      {teacher.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Observations:</span> {teacher.observations} completed
                  </div>
                  <div>
                    <span className="text-gray-500">Last observed:</span> {teacher.lastObservation}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href={`/dashboard/principal/teachers/${teacher.id}`}>
                  <Button size="sm" variant="outline" className="rounded-full w-full sm:w-auto">
                    View Profile
                  </Button>
                </Link>
                <Link href={`/dashboard/principal/observations/new?teacher=${teacher.id}`}>
                  <Button size="sm" className="rounded-full w-full sm:w-auto">
                    Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-gray-600">
          Showing 1-6 of 42 teachers
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="rounded-md">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-md bg-primary/10">1</Button>
          <Button variant="outline" size="sm" className="rounded-md">2</Button>
          <Button variant="outline" size="sm" className="rounded-md">3</Button>
          <Button variant="outline" size="sm" className="rounded-md">Next</Button>
        </div>
      </div>
    </div>
  );
} 