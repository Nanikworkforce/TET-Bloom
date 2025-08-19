"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ObservationType, ObservationRecord } from "@/lib/types";
import { scheduleApi, baseUrl, ApiError } from "@/lib/api";
import { 
  Eye, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  BarChart3,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Star,
  Users,
  Mail,
  MailCheck,
  Send,
  UserCheck,
  GraduationCap,
  ClipboardCheck
} from "lucide-react";

// Filter options
const subjects = ["All Subjects", "Mathematics", "Science", "English Literature", "History", "Art", "Physical Education"];
const grades = ["All Grades", "Elementary (K-5)", "Middle School (6-8)", "High School (9-12)"];
const statuses = ["All Status", "Scheduled", "Completed", "Canceled"];
const types = ["All Types", "Formal", "Walk-through"];

// Helper functions for observation type display
const getTypeColor = (type: ObservationType) => {
  return type === 'formal' 
    ? 'text-white border-gray-200' 
    : 'text-white border-green-200';
};

const getTypeIcon = (type: ObservationType) => 
  type === 'formal' ? ClipboardCheck : Eye;

const getTypeLabel = (type: ObservationType) => {
  return type === 'formal' ? 'Formal' : 'Walk-through';
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'text-white';
    case 'completed':
      return 'text-white';
    case 'in_progress':
      return 'text-white';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return '#84547c';
    case 'completed': 
      return '#e4a414';
    case 'in_progress':
      return '#84547c';
    case 'cancelled':
    case 'canceled':
      return '#dc2626';
    default:
      return '#6b7280';
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

export default function SuperUserObservationsPage() {
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");

  // Fetch all observations from backend
  useEffect(() => {
    const fetchAllObservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await scheduleApi.getAll();
        const schedules = Array.isArray(response.data) ? response.data : [];
        
        // Convert backend schedule data to match ObservationRecord format
        const convertedObservations: ObservationRecord[] = schedules.map((schedule: any) => {
          // Extract teacher information
          let teacherName = "Unknown";
          let subject = "Unknown Subject";
          let grade = "Unknown Grade";
          let observerName = "Administrator";
          
          if (schedule.teacher && schedule.teacher.user) {
            teacherName = schedule.teacher.user.name || "Unknown Teacher";
            subject = schedule.teacher.subject || "Unknown Subject";
            grade = schedule.teacher.grade || "Unknown Grade";
          } else if (schedule.observation_group) {
            teacherName = schedule.observation_group.name || "Group Observation";
            subject = "Group Observation";
            grade = "Multiple Grades";
            if (schedule.observation_group.created_by) {
              observerName = schedule.observation_group.created_by.name || "Administrator";
            }
          }
          
          return {
            id: schedule.id,
            teacher: teacherName,
            teacherId: schedule.teacher?.id || schedule.observation_group?.id || "",
            subject: subject,
            grade: grade,
            date: formatDate(schedule.date),
            time: formatTime(schedule.time),
            type: schedule.observation_type as ObservationType,
            status: schedule.status.toLowerCase(),
            statusColor: getStatusColor(schedule.status),
            statusBg: getStatusBadgeColor(schedule.status),
            observerId: schedule.observation_group?.created_by?.id || "admin1",
            observerName: observerName,
            feedback: schedule.status.toLowerCase() === 'completed' ? Math.random() > 0.5 : undefined,
            notificationSent: schedule.notification_sent || false,
            notificationSentAt: schedule.notification_sent_at || null,
            reminderSent: schedule.reminder_sent || false,
            reminderSentAt: schedule.reminder_sent_at || null
          };
        });
        
        setObservations(convertedObservations);
      } catch (err) {
        console.error("Error fetching observations:", err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load observations. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllObservations();
  }, []);

  // Filter observations based on search and filter criteria
  const filteredObservations = observations.filter((observation) => {
    const matchesSearch = observation.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         observation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         observation.observerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Status" || 
                         observation.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesType = typeFilter === "All Types" || 
                       observation.type === typeFilter.toLowerCase();
    
    const matchesSubject = subjectFilter === "All Subjects" || 
                          observation.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesSubject;
  });

  // Calculate stats for the summary cards
  const stats = {
    total: observations.length,
    scheduled: observations.filter(obs => obs.status === 'scheduled').length,
    completed: observations.filter(obs => obs.status === 'completed').length,
    pendingFeedback: observations.filter(obs => obs.status === 'completed' && !obs.feedback).length,
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
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Observations</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">All Observations</h1>
          <p className="text-gray-600 mt-1">System-wide observation overview and management</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Observations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingFeedback}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
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
                  placeholder="Search by teacher, subject, or observer..."
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
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

      {/* Observations List */}
      <div className="space-y-4">
        {filteredObservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No observations found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredObservations.map((observation) => {
            const TypeIcon = getTypeIcon(observation.type);
            
            return (
              <Card key={observation.id} className="border hover:border-purple-300 transition-all bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left section: Main info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-gray-500" />
                            <h3 className="font-semibold text-lg text-gray-900">{observation.teacher}</h3>
                          </div>
                          <Badge 
                            style={{ backgroundColor: observation.statusBg }}
                            className={`${observation.statusColor} font-medium`}
                          >
                            {observation.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{observation.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{observation.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{observation.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{observation.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{getTypeLabel(observation.type)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">Observer: {observation.observerName}</span>
                        </div>
                      </div>

                      {/* Feedback status for completed observations */}
                      {observation.status === 'completed' && (
                        <div className="mt-3 flex items-center gap-2">
                          {observation.feedback ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-700 font-medium">Feedback Provided</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-700 font-medium">Feedback Pending</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right section: Actions */}
                    <div className="flex items-center justify-end gap-2 lg:min-w-64">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/super/observations/${observation.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/super/observations/${observation.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Results count */}
      {filteredObservations.length > 0 && (
        <div className="text-center text-gray-600">
          Showing {filteredObservations.length} of {observations.length} observations
        </div>
      )}
    </div>
  );
}
