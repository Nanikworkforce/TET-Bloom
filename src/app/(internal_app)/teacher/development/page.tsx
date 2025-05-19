import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data
const developmentGoals = [
  {
    id: "1",
    title: "Implement Project-Based Learning",
    description: "Incorporate at least one project-based learning activity per month in Mathematics classes",
    status: "In Progress",
    progress: 60,
    dueDate: "Jun 15, 2023",
    createdDate: "Jan 10, 2023",
    relatedTo: "Feedback from School Leader Johnson",
    category: "Teaching Methods",
    tasks: [
      { title: "Research PBL techniques for mathematics", completed: true },
      { title: "Attend PBL workshop", completed: true },
      { title: "Develop first project plan", completed: true },
      { title: "Implement first project", completed: true },
      { title: "Evaluate and adjust approach", completed: false },
      { title: "Implement second project", completed: false }
    ]
  },
  {
    id: "2",
    title: "Incorporate More Technology in Lessons",
    description: "Integrate digital tools to enhance student engagement and understanding in mathematics",
    status: "In Progress",
    progress: 40,
    dueDate: "May 20, 2023",
    createdDate: "Jan 25, 2023",
    relatedTo: "Department Goals",
    category: "Technology Integration",
    tasks: [
      { title: "Identify suitable educational technology tools", completed: true },
      { title: "Complete online course on edtech integration", completed: true },
      { title: "Create lesson plans incorporating chosen tools", completed: false },
      { title: "Implement tools in classroom", completed: false },
      { title: "Gather student feedback", completed: false }
    ]
  },
  {
    id: "3",
    title: "Improve Differentiation Strategies",
    description: "Develop and implement differentiated instruction techniques to better serve diverse learning needs",
    status: "Not Started",
    progress: 0,
    dueDate: "Sep 30, 2023",
    createdDate: "Feb 20, 2023",
    relatedTo: "Feedback from Department Head Taylor",
    category: "Inclusive Teaching",
    tasks: [
      { title: "Research differentiation strategies for mathematics", completed: false },
      { title: "Consult with special education department", completed: false },
      { title: "Develop differentiated lesson plans", completed: false },
      { title: "Implement strategies", completed: false },
      { title: "Assess effectiveness", completed: false }
    ]
  }
];

const learningOpportunities = [
  {
    id: "1",
    title: "Innovative Teaching Methods Workshop",
    type: "Workshop",
    format: "In-Person",
    date: "Mar 25, 2023",
    duration: "Full Day",
    provider: "District Professional Development",
    location: "Main High School Auditorium",
    description: "Learn innovative teaching methods to engage students in mathematics through hands-on activities and collaborative learning.",
    status: "Registration Open",
    recommended: true,
    relevantToGoals: ["Implement Project-Based Learning"]
  },
  {
    id: "2",
    title: "Mathematics Curriculum Conference",
    type: "Conference",
    format: "In-Person",
    date: "Apr 10-12, 2023",
    duration: "3 Days",
    provider: "State Mathematics Teachers Association",
    location: "State Convention Center",
    description: "Annual conference featuring workshops, presentations, and networking opportunities for mathematics educators at all levels.",
    status: "Registration Required",
    recommended: true,
    relevantToGoals: ["Implement Project-Based Learning", "Incorporate More Technology in Lessons"]
  },
  {
    id: "3",
    title: "Digital Tools for Math Education",
    type: "Online Course",
    format: "Self-Paced",
    date: "On-Demand",
    duration: "10 Hours",
    provider: "EduTech Learning",
    location: "Online",
    description: "Explore and learn to implement various digital tools specifically designed for mathematics education.",
    status: "Available",
    recommended: true,
    relevantToGoals: ["Incorporate More Technology in Lessons"]
  },
  {
    id: "4",
    title: "Differentiated Instruction in Mathematics",
    type: "Webinar Series",
    format: "Online Live",
    date: "Tuesdays in April",
    duration: "4 Sessions, 1 Hour Each",
    provider: "National Center for Mathematics Education",
    location: "Online",
    description: "Learn practical strategies for differentiating mathematics instruction to meet the needs of all learners.",
    status: "Registration Open",
    recommended: true,
    relevantToGoals: ["Improve Differentiation Strategies"]
  },
  {
    id: "5",
    title: "Project-Based Learning in Mathematics",
    type: "Book Club",
    format: "Hybrid",
    date: "Starting Apr 5, 2023",
    duration: "6 Weekly Meetings",
    provider: "School District",
    location: "Library & Online",
    description: "Read and discuss strategies for implementing project-based learning specifically in mathematics classrooms.",
    status: "Spaces Available",
    recommended: false,
    relevantToGoals: ["Implement Project-Based Learning"]
  }
];

export default function TeacherDevelopmentPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Professional Development</h1>
          <p className="text-gray-600">Set goals, track progress, and find learning opportunities</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full shadow-sm" variant="outline">
            <span className="mr-2">📋</span> Request PD Approval
          </Button>
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">🎯</span> Create New Goal
          </Button>
        </div>
      </div>

      {/* Development Progress */}
      <Card className="p-5 border bg-white">
        <h2 className="text-lg font-semibold mb-4">Your Development Journey</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="rounded-lg border p-4 h-full flex flex-col">
              <div className="text-2xl text-center text-primary mb-2">🎯</div>
              <p className="text-sm text-center text-gray-600">Active Goals</p>
              <p className="text-3xl font-bold text-center mt-2">{developmentGoals.filter(g => g.status !== "Completed").length}</p>
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="rounded-lg border p-4 h-full flex flex-col">
              <div className="text-2xl text-center text-green-500 mb-2">✅</div>
              <p className="text-sm text-center text-gray-600">Completed Goals</p>
              <p className="text-3xl font-bold text-center mt-2">{developmentGoals.filter(g => g.status === "Completed").length}</p>
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="rounded-lg border p-4 h-full flex flex-col">
              <div className="text-2xl text-center text-blue-500 mb-2">📚</div>
              <p className="text-sm text-center text-gray-600">Hours of PD</p>
              <p className="text-3xl font-bold text-center mt-2">24</p>
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="rounded-lg border p-4 h-full flex flex-col">
              <div className="text-2xl text-center text-purple-500 mb-2">💡</div>
              <p className="text-sm text-center text-gray-600">Learning Opps</p>
              <p className="text-3xl font-bold text-center mt-2">{learningOpportunities.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Development Goals and Learning Opportunities Tabs */}
      <div className="flex border-b">
        <a href="#goals" className="px-4 py-2 border-b-2 border-primary text-primary font-medium">My Goals</a>
        <a href="#opportunities" className="px-4 py-2 text-gray-600 hover:text-primary">Learning Opportunities</a>
        <a href="#completed" className="px-4 py-2 text-gray-600 hover:text-primary">Completed Activities</a>
      </div>

      {/* Development Goals */}
      <div id="goals">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Development Goals</h2>
          <Button size="sm" className="rounded-full">
            <span className="mr-1">➕</span> New Goal
          </Button>
        </div>

        <div className="space-y-4">
          {developmentGoals.map((goal) => (
            <Card key={goal.id} className="border overflow-hidden bg-white">
              <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          goal.progress >= 80 ? 'bg-green-500' : 
                          goal.progress >= 40 ? 'bg-blue-500' : 
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium ml-2 min-w-[40px]">{goal.progress}%</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {goal.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-700 mb-3">{goal.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Due Date:</span> {goal.dueDate}
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span> {goal.createdDate}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500">Related to:</span> {goal.relatedTo}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Tasks & Milestones:</h4>
                  <div className="grid gap-2">
                    {goal.tasks.map((task, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${task.completed ? 'bg-green-100 border-green-500 text-green-500' : 'bg-gray-50 border-gray-300'}`}>
                          {task.completed && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t">
                <Link href={`/dashboard/teacher/development/goals/${goal.id}`}>
                  <Button size="sm" variant="outline" className="rounded-full">
                    View Details
                  </Button>
                </Link>
                <Link href={`/dashboard/teacher/development/goals/${goal.id}/edit`}>
                  <Button size="sm" className="rounded-full">
                    Update Progress
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Opportunities */}
      <div id="opportunities" className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recommended Learning Opportunities</h2>
          <Button variant="outline" size="sm" className="rounded-full">
            View All
          </Button>
        </div>

        {/* Filter */}
        <Card className="p-4 bg-white border shadow-sm mb-4">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  🔍
                </span>
                <Input
                  placeholder="Search learning opportunities..."
                  className="pl-10 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <select className="px-4 py-2 border rounded-full text-sm bg-white">
                <option>All Types</option>
                <option>Workshop</option>
                <option>Course</option>
                <option>Conference</option>
                <option>Webinar</option>
                <option>Book Club</option>
              </select>
              <select className="px-4 py-2 border rounded-full text-sm bg-white">
                <option>All Formats</option>
                <option>In-Person</option>
                <option>Online Live</option>
                <option>Self-Paced</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningOpportunities
            .filter(opp => opp.recommended)
            .slice(0, 4)
            .map((opportunity) => (
              <Card key={opportunity.id} className="border bg-white">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {opportunity.type}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {opportunity.format}
                        </span>
                      </div>
                    </div>
                    {opportunity.recommended && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Recommended
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500">Date:</span> {opportunity.date}
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span> {opportunity.duration}
                      </div>
                      <div>
                        <span className="text-gray-500">Provider:</span> {opportunity.provider}
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span> {opportunity.location}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-700">{opportunity.description}</p>
                    
                    {opportunity.relevantToGoals && opportunity.relevantToGoals.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-500">Relevant to your goals:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {opportunity.relevantToGoals.map((goal, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end p-3 bg-gray-50 border-t">
                  <Button size="sm" className="rounded-full">
                    {opportunity.status === "Available" ? "Enroll Now" : "View Details"}
                  </Button>
                </div>
              </Card>
            ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="rounded-full">
            Show All Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
} 