import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data
const feedbackEntries = [
  {
    id: "1",
    teacher: "David Wilson",
    subject: "History",
    grade: "9th Grade",
    date: "Feb 24, 2023",
    observation: "Feb 22, 2023",
    strengths: [
      "Excellent student engagement strategies",
      "Clear explanations of complex historical concepts",
      "Effective use of multimedia resources"
    ],
    areas: [
      "Could improve on time management",
      "Consider more group activities"
    ],
    status: "acknowledged",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "2",
    teacher: "Jessica Martinez",
    subject: "Art",
    grade: "Multiple",
    date: "Feb 22, 2023",
    observation: "Feb 20, 2023",
    strengths: [
      "Creative project design",
      "Inclusive teaching approach",
      "Strong classroom management"
    ],
    areas: [
      "More structured assessment methods",
      "Could provide clearer rubrics for assignments"
    ],
    status: "pending review",
    statusColor: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "3",
    teacher: "Michael Chen",
    subject: "Science",
    grade: "7th Grade",
    date: "Feb 15, 2023",
    observation: "Feb 12, 2023",
    strengths: [
      "Excellent lab safety protocols",
      "Engaging hands-on experiments",
      "Clear scientific explanations"
    ],
    areas: [
      "More differentiation for various ability levels",
      "Additional support for struggling students"
    ],
    status: "acknowledged",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "4",
    teacher: "Emily Rodriguez",
    subject: "English Literature",
    grade: "10th Grade",
    date: "Feb 10, 2023",
    observation: "Feb 8, 2023",
    strengths: [
      "Thoughtful discussion facilitation",
      "In-depth text analysis",
      "Strong writing instruction"
    ],
    areas: [
      "More diverse text selections",
      "Additional support for ESL students"
    ],
    status: "acknowledged",
    statusColor: "bg-green-100 text-green-800"
  },
  {
    id: "5",
    teacher: "Robert Thompson",
    subject: "Physical Education",
    grade: "Multiple",
    date: "Jan 25, 2023",
    observation: "Jan 22, 2023",
    strengths: [
      "Inclusive activities for all ability levels",
      "Clear instructions and demonstrations",
      "Positive encouragement"
    ],
    areas: [
      "More varied activities",
      "Additional focus on teamwork skills"
    ],
    status: "pending review",
    statusColor: "bg-yellow-100 text-yellow-800"
  }
];

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Feedback</h1>
          <p className="text-gray-600">Review and manage feedback provided to teachers</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">📋</span> Feedback Templates
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
                placeholder="Search by teacher name or subject..."
                className="pl-10 rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
              <option>History</option>
              <option>Art</option>
              <option>Physical Education</option>
            </select>
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Grades</option>
              <option>Elementary (K-5)</option>
              <option>Middle School (6-8)</option>
              <option>High School (9-12)</option>
            </select>
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Status</option>
              <option>Acknowledged</option>
              <option>Pending Review</option>
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

      {/* Feedback entries */}
      <div className="space-y-6">
        {feedbackEntries.map((feedback) => (
          <Card key={feedback.id} className="bg-white border overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
              <div>
                <h3 className="font-semibold text-lg">{feedback.teacher}</h3>
                <p className="text-gray-600 text-sm">
                  {feedback.subject} • {feedback.grade}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="text-primary">📝</span> Feedback date: {feedback.date}
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${feedback.statusColor}`}>
                  {feedback.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-3">
                <span className="text-primary">👁️</span> Observation conducted on {feedback.observation}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="text-green-700 font-medium flex items-center gap-2">
                    <span className="text-lg">✨</span> Strengths
                  </h4>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <ul className="space-y-2">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Areas for Growth */}
                <div className="space-y-2">
                  <h4 className="text-amber-700 font-medium flex items-center gap-2">
                    <span className="text-lg">🌱</span> Areas for Growth
                  </h4>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <ul className="space-y-2">
                      {feedback.areas.map((area, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t">
              <Link href={`/dashboard/school-leader/feedback/${feedback.id}`}>
                <Button size="sm" variant="outline" className="rounded-full">
                  View Full Details
                </Button>
              </Link>
              <Link href={`/dashboard/school-leader/feedback/${feedback.id}/edit`}>
                <Button size="sm" className="rounded-full">
                  <span className="mr-1">✏️</span> Edit Feedback
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-gray-600">
          Showing 1-5 of 18 feedback entries
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="rounded-md">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-md bg-primary/10">1</Button>
          <Button variant="outline" size="sm" className="rounded-md">2</Button>
          <Button variant="outline" size="sm" className="rounded-md">3</Button>
          <Button variant="outline" size="sm" className="rounded-md">4</Button>
          <Button variant="outline" size="sm" className="rounded-md">Next</Button>
        </div>
      </div>
    </div>
  );
} 