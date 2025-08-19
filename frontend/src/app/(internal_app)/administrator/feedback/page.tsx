"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ObservationRecord } from "@/lib/types";
import { scheduleApi, feedbackApi, baseUrl, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { 
  Search, 
  Filter, 
  FileText, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Calendar,
  User,
  GraduationCap,
  ClipboardCheck,
  RefreshCw
} from "lucide-react";

interface FeedbackOpportunity {
  id: string;
  observationId: string;
  teacher: string;
  teacherId: string;
  subject: string;
  grade: string;
  observationDate: string;
  observationTime: string;
  observationType: string;
  status: 'pending' | 'completed' | 'in_progress';
  feedbackDueDate: string;
  priority: 'high' | 'medium' | 'low';
  feedbackId?: string | null;
}

// Filter options
const subjects = ["All Subjects", "Mathematics", "Science", "English Literature", "History", "Art", "Physical Education"];
const grades = ["All Grades", "Elementary (K-5)", "Middle School (6-8)", "High School (9-12)"];
const statuses = ["All Status", "Pending", "In Progress", "Completed"];
const priorities = ["All Priorities", "High", "Medium", "Low"];

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const calculatePriority = (observationDate: string): 'high' | 'medium' | 'low' => {
  const obsDate = new Date(observationDate);
  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - obsDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDifference > 7) return 'high';
  if (daysDifference > 3) return 'medium';
  return 'low';
};

const calculateDueDate = (observationDate: string): string => {
  const obsDate = new Date(observationDate);
  const dueDate = new Date(obsDate);
  dueDate.setDate(dueDate.getDate() + 7); // 7 days after observation
  return dueDate.toISOString().split('T')[0];
};

export default function AdministratorFeedbackPage() {
  const { user } = useAuth();
  const [feedbackOpportunities, setFeedbackOpportunities] = useState<FeedbackOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");

  // Fetch observations that need feedback
  useEffect(() => {
    const fetchFeedbackOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both schedules and existing feedback
        const [schedulesResponse, feedbackResponse] = await Promise.all([
          scheduleApi.getAll(),
          feedbackApi.getAll()
        ]);
        
        const schedules = Array.isArray(schedulesResponse.data) ? schedulesResponse.data : [];
        const existingFeedback = Array.isArray(feedbackResponse.data) ? feedbackResponse.data : [];
        
        // Create a map of schedule ID to feedback
        const feedbackMap = new Map();
        existingFeedback.forEach((feedback: any) => {
          if (feedback.schedule && feedback.schedule.id) {
            feedbackMap.set(feedback.schedule.id, feedback);
          }
        });
        
        // Debug: Log what we're getting from backend
        console.log("Backend schedules:", schedules);
        console.log("Total schedules:", schedules.length);
        console.log("Existing feedback:", existingFeedback);
        
        // Show all observations for feedback opportunities (not just completed)
        // Admins can provide feedback for scheduled observations too
        const allObservations = schedules.filter((schedule: any) => 
          schedule.status && schedule.status.toLowerCase() !== 'cancelled'
        );
        
        console.log("Filtered observations (non-cancelled):", allObservations.length);
        
        // Convert to feedback opportunities
        const opportunities: FeedbackOpportunity[] = allObservations.map((schedule: any) => {
          let teacherName = "Unknown";
          let subject = "Unknown Subject";
          let grade = "Unknown Grade";
          
          if (schedule.teacher && schedule.teacher.user) {
            teacherName = schedule.teacher.user.name || "Unknown Teacher";
            subject = schedule.teacher.subject || "Unknown Subject";
            grade = schedule.teacher.grade || "Unknown Grade";
          } else if (schedule.observation_group) {
            teacherName = schedule.observation_group.name || "Group Observation";
            subject = "Group Observation";
            grade = "Multiple Grades";
          }
          
          const priority = calculatePriority(schedule.date);
          const dueDate = calculateDueDate(schedule.date);
          
          // Check if feedback exists for this schedule
          const existingFeedbackForSchedule = feedbackMap.get(schedule.id);
          let feedbackStatus: 'pending' | 'completed' | 'in_progress';
          
          if (existingFeedbackForSchedule) {
            // Map backend feedback status to frontend status
            switch (existingFeedbackForSchedule.status) {
              case 'draft':
                feedbackStatus = 'in_progress';
                break;
              case 'submitted':
              case 'approved':
              case 'revised':
                feedbackStatus = 'completed';
                break;
              case 'review_requested':
                feedbackStatus = 'in_progress';
                break;
              default:
                feedbackStatus = 'pending';
            }
          } else {
            // No feedback exists yet
            feedbackStatus = 'pending';
          }
          
          return {
            id: `feedback-${schedule.id}`,
            observationId: schedule.id,
            teacher: teacherName,
            teacherId: schedule.teacher?.id || schedule.observation_group?.id || "",
            subject: subject,
            grade: grade,
            observationDate: schedule.date,
            observationTime: schedule.time,
            observationType: schedule.observation_type,
            status: feedbackStatus,
            feedbackDueDate: dueDate,
            priority: priority,
            feedbackId: existingFeedbackForSchedule?.id || null
          };
        });
        
        console.log("Final feedback opportunities:", opportunities);
        setFeedbackOpportunities(opportunities);
      } catch (err) {
        console.error("Error fetching feedback opportunities:", err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load feedback opportunities. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackOpportunities();
  }, []);

  // Filter opportunities based on search and filter criteria
  const filteredOpportunities = feedbackOpportunities.filter((opportunity) => {
    const matchesSearch = opportunity.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || 
                         opportunity.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesPriority = priorityFilter === "All Priorities" || 
                           opportunity.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    const matchesSubject = subjectFilter === "All Subjects" || 
                          opportunity.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSubject;
  });

  // Calculate stats for the summary cards
  const stats = {
    total: feedbackOpportunities.length,
    pending: feedbackOpportunities.filter(opp => opp.status === 'pending').length,
    inProgress: feedbackOpportunities.filter(opp => opp.status === 'in_progress').length,
    overdue: feedbackOpportunities.filter(opp => {
      const dueDate = new Date(opp.feedbackDueDate);
      return opp.status !== 'completed' && dueDate < new Date();
    }).length,
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Feedback</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Observation Feedback</h1>
          <p className="text-gray-600 mt-1">Provide feedback and scores for completed observations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Feedback Templates
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Feedback Needed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <Edit className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by teacher or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback opportunities found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => {
            const isOverdue = new Date(opportunity.feedbackDueDate) < new Date() && opportunity.status !== 'completed';
            
            return (
              <Card key={opportunity.id} className={`border transition-all bg-white ${
                isOverdue ? 'border-red-300 bg-red-50/30' : 'hover:border-purple-300'
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left section: Main info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-gray-500" />
                            <h3 className="font-semibold text-lg text-gray-900">{opportunity.teacher}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(opportunity.status)}>
                              {opportunity.status}
                            </Badge>
                            <Badge className={getPriorityColor(opportunity.priority)}>
                              {opportunity.priority} priority
                            </Badge>
                            {isOverdue && (
                              <Badge className="bg-red-100 text-red-800">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{opportunity.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{opportunity.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Observed: {formatDate(opportunity.observationDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{formatTime(opportunity.observationTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{opportunity.observationType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Due: {formatDate(opportunity.feedbackDueDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right section: Actions */}
                    <div className="flex items-center justify-end gap-2 lg:min-w-64">
                      {opportunity.status === 'completed' ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/administrator/feedback/${opportunity.observationId}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Feedback
                            </Link>
                          </Button>
                          {opportunity.feedbackId && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/administrator/feedback/${opportunity.observationId}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/administrator/observations/${opportunity.observationId}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Observation
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            asChild
                            className={isOverdue ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            <Link href={`/administrator/feedback/${opportunity.observationId}/create`}>
                              <Star className="h-4 w-4 mr-2" />
                              {opportunity.status === 'in_progress' ? 'Continue' : 'Start'} Feedback
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Results count */}
      {filteredOpportunities.length > 0 && (
        <div className="text-center text-gray-600">
          Showing {filteredOpportunities.length} of {feedbackOpportunities.length} feedback opportunities
        </div>
      )}
    </div>
  );
}
