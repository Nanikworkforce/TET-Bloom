import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data
const feedbackEntries = [
  {
    id: "1",
    observer: "Administrator Johnson",
    date: "Feb 20, 2023",
    class: "Mathematics 101",
    grade: "7th Grade",
    topic: "Fractions and Decimals",
    overallRating: "Excellent",
    ratingColor: "text-green-600",
    categories: {
      "Classroom Management": 5,
      "Content Knowledge": 5,
      "Student Engagement": 4,
      "Teaching Methods": 5,
      "Assessment": 4
    },
    strengths: [
      "Excellent presentation of complex concepts",
      "Clear explanations with relevant examples",
      "Strong classroom management",
      "Effective use of technology",
      "Good pacing throughout the lesson"
    ],
    improvements: [
      "Consider more group activities",
      "Could provide additional support for struggling students"
    ],
    comments: "Ms. Chen demonstrates excellent teaching skills. Her ability to break down complex mathematical concepts into understandable parts is impressive. Students were engaged throughout the lesson."
  },
  {
    id: "2",
    observer: "Vice Administrator Smith",
    date: "Jan 30, 2023",
    class: "Mathematics 103",
    grade: "7th Grade",
    topic: "Percentages",
    overallRating: "Good",
    ratingColor: "text-blue-600",
    categories: {
      "Classroom Management": 4,
      "Content Knowledge": 5,
      "Student Engagement": 3,
      "Teaching Methods": 4,
      "Assessment": 4
    },
    strengths: [
      "Strong content knowledge",
      "Well-organized lesson plan",
      "Good classroom management",
      "Clear instructions"
    ],
    improvements: [
      "Could increase student participation",
      "Consider more real-world applications",
      "Vary teaching methods"
    ],
    comments: "Ms. Chen has strong knowledge of the subject matter and manages the classroom effectively. The lesson could benefit from more interactive elements to increase student engagement. Overall, a solid performance."
  },
  {
    id: "3",
    observer: "Department Head Taylor",
    date: "Jan 15, 2023",
    class: "Mathematics 102",
    grade: "7th Grade",
    topic: "Equations and Variables",
    overallRating: "Good",
    ratingColor: "text-blue-600",
    categories: {
      "Classroom Management": 4,
      "Content Knowledge": 5,
      "Student Engagement": 4,
      "Teaching Methods": 3,
      "Assessment": 4
    },
    strengths: [
      "Excellent content knowledge",
      "Clear explanations",
      "Good rapport with students",
      "Effective classroom management"
    ],
    improvements: [
      "Could diversify teaching methods",
      "Consider incorporating more technology",
      "Include more formative assessment throughout the lesson"
    ],
    comments: "Ms. Chen shows strong command of mathematical concepts and explains them well to students. The lesson was well-structured but could benefit from a wider variety of teaching approaches. Students responded well to her teaching style."
  }
];

export default function TeacherFeedbackPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Feedback</h1>
          <p className="text-gray-600">Review observation feedback and track your professional growth</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full shadow-sm" variant="outline">
            <span className="mr-2">📊</span> View Trends
          </Button>
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">🎯</span> Set Development Goals
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
                placeholder="Search feedback..."
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
              <option>All Ratings</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Satisfactory</option>
              <option>Needs Improvement</option>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border bg-white col-span-1">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Feedback Received</p>
            <p className="text-2xl font-bold mt-1 text-gray-800">{feedbackEntries.length}</p>
          </div>
        </Card>
        
        <Card className="p-4 border bg-white col-span-4">
          <p className="text-sm font-medium text-gray-500 mb-3">Rating Breakdown</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Classroom Management", value: 4.3, color: "bg-blue-500" },
              { label: "Content Knowledge", value: 5.0, color: "bg-green-500" },
              { label: "Student Engagement", value: 3.7, color: "bg-yellow-500" },
              { label: "Teaching Methods", value: 4.0, color: "bg-purple-500" },
              { label: "Assessment", value: 4.0, color: "bg-pink-500" }
            ].map((category, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{category.label}</span>
                  <span className="font-medium">{category.value}/5</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${category.color}`} 
                    style={{ width: `${(category.value / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Feedback entries */}
      <div className="space-y-6">
        {feedbackEntries.map((feedback) => (
          <Card key={feedback.id} className="bg-white border overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {feedback.class}
                  <span className={`text-sm font-medium ${feedback.ratingColor}`}>
                    ({feedback.overallRating})
                  </span>
                </h3>
                <p className="text-gray-600 text-sm">
                  {feedback.topic} • {feedback.grade}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="mr-1">👤</span> {feedback.observer}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="mr-1">📅</span> {feedback.date}
                </div>
              </div>
            </div>

            {/* Content preview */}
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="text-green-700 font-medium flex items-center gap-2">
                    <span className="text-lg">✨</span> Strengths
                  </h4>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <ul className="space-y-2">
                      {feedback.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                      {feedback.strengths.length > 3 && (
                        <li className="text-xs text-green-600 font-medium">
                          +{feedback.strengths.length - 3} more strengths
                        </li>
                      )}
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
                      {feedback.improvements.slice(0, 3).map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                      {feedback.improvements.length > 3 && (
                        <li className="text-xs text-amber-600 font-medium">
                          +{feedback.improvements.length - 3} more areas
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Comment preview */}
              {feedback.comments && (
                <div className="mt-4">
                  <h4 className="text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">💬</span> Comments
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{feedback.comments}</p>
                </div>
              )}
            </div>

            {/* Rating categories */}
            <div className="px-4 pt-2 pb-4 border-t">
              <h4 className="text-gray-700 font-medium text-sm mb-3">Category Ratings</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(feedback.categories).map(([category, rating], index) => (
                  <div key={index} className="flex flex-col">
                    <div className="text-xs mb-1 text-gray-600">{category}</div>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium ml-2">{rating}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t">
              <Link href={`/teacher/feedback/${feedback.id}`}>
                <Button size="sm" className="rounded-full">
                  View Full Feedback
                </Button>
              </Link>
              <Link href={`/teacher/development/goals/new?feedback=${feedback.id}`}>
                <Button size="sm" variant="outline" className="rounded-full">
                  <span className="mr-1">🎯</span> Set Goal Based on Feedback
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {feedbackEntries.length === 0 && (
        <Card className="p-8 text-center bg-white">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-medium">No feedback yet</h3>
          <p className="text-gray-600 mt-1 mb-4">Feedback will appear here after classroom observations</p>
        </Card>
      )}
    </div>
  );
} 