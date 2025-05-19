import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const reportTypes = [
  {
    id: "teacher-performance",
    title: "Teacher Performance",
    description: "View performance metrics and growth trends for individual teachers",
    icon: "📊",
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    id: "department-analysis",
    title: "Department Analysis",
    description: "Compare metrics across different subject departments",
    icon: "📚",
    color: "bg-purple-50 text-purple-600 border-purple-200"
  },
  {
    id: "observation-trends",
    title: "Observation Trends",
    description: "Track observation patterns and identify teaching trends",
    icon: "📈",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  {
    id: "feedback-summary",
    title: "Feedback Summary",
    description: "Analysis of feedback provided and teacher responses",
    icon: "💬",
    color: "bg-amber-50 text-amber-600 border-amber-200"
  },
  {
    id: "professional-development",
    title: "Professional Development",
    description: "Track teacher growth and professional development needs",
    icon: "🎓",
    color: "bg-pink-50 text-pink-600 border-pink-200"
  },
  {
    id: "school-overview",
    title: "School Overview",
    description: "Comprehensive view of all teaching metrics across the school",
    icon: "🏫",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200"
  },
];

// Simulated quick stats
const quickStats = [
  { label: "Observations This Year", value: "164", change: "+12%", icon: "👁️" },
  { label: "Average Rating", value: "4.2/5", change: "+0.3", icon: "⭐" },
  { label: "Feedback Response Rate", value: "87%", change: "+5%", icon: "📋" },
  { label: "Teachers Needing Support", value: "7", change: "-2", icon: "❓" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">View insights and generate reports about teacher performance</p>
        </div>
        <div className="flex gap-3">
          <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
            <span className="mr-2">⬇️</span> Export Reports
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4 border shadow-sm bg-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
                <div className="mt-1 text-xs font-medium text-green-600">
                  {stat.change} from previous period
                </div>
              </div>
              <div className="text-2xl bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Most recent reports */}
      <Card className="bg-white border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <h2 className="font-semibold text-lg">Recently Generated Reports</h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {[
              { title: "Monthly Performance Summary", date: "Feb, 2023", type: "School Overview" },
              { title: "Science Department Analysis", date: "Feb 15, 2023", type: "Department Analysis" },
              { title: "Teacher Development Needs", date: "Feb 10, 2023", type: "Professional Development" },
            ].map((report, index) => (
              <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border">
                <div className="flex items-center gap-3">
                  <div className="text-xl text-primary">📄</div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.type} • Generated on {report.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-full">
                    <span className="mr-1">👁️</span> View
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <span className="mr-1">⬇️</span> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Report types */}
      <div>
        <h2 className="text-xl font-semibold mb-4 pl-1">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <Link key={report.id} href={`/dashboard/principal/reports/${report.id}`}>
              <Card className={`border p-5 hover:shadow-md transition-all bg-white hover:border-primary/40 ${report.id === 'teacher-performance' ? 'ring-2 ring-primary/20' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${report.color}`}>
                    {report.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button size="sm" className="rounded-full">Generate Report</Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Scheduled reports */}
      <Card className="bg-white border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-secondary/5 to-primary/5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Scheduled Reports</h2>
            <Button size="sm" className="rounded-full">
              <span className="mr-1">➕</span> Add Schedule
            </Button>
          </div>
        </div>
        <div className="p-4">
          {[
            { title: "Monthly Performance Summary", schedule: "Last day of each month", recipients: "School Board, Department Heads" },
            { title: "Weekly Observation Summary", schedule: "Every Friday at 4:00 PM", recipients: "Principal, Vice Principal" },
          ].map((schedule, index) => (
            <div key={index} className="p-3 border-b last:border-b-0">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{schedule.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="text-primary mr-1">🕒</span> 
                    {schedule.schedule}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="text-primary mr-1">👥</span> 
                    Recipients: {schedule.recipients}
                  </p>
                </div>
                <div className="flex items-start gap-1">
                  <Button size="sm" variant="ghost" className="text-gray-500 h-8 w-8 p-0 rounded-full">
                    ✏️
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-500 h-8 w-8 p-0 rounded-full">
                    🗑️
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data visualization preview */}
      <Card className="bg-white border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Teacher Performance Trends</h2>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 border rounded-lg flex items-center justify-center h-64">
            <p className="text-gray-400">Interactive chart will be displayed here</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" className="rounded-full">
              <span className="mr-1">📊</span> View Detailed Analysis
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 