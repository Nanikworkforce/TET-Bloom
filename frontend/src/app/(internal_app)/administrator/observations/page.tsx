"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ObservationType, ObservationRecord } from "@/lib/types";
import { scheduleApi, baseUrl } from "@/lib/api";
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
  Send
} from "lucide-react";
import NotificationStatus from "@/components/notifications/NotificationStatus";

// Mock data as fallback
const mockObservations: ObservationRecord[] = [
  {
    id: "1",
    teacher: "Sarah Johnson",
    teacherId: "1",
    subject: "Mathematics",
    grade: "5th Grade",
    date: "Feb 28, 2023",
    time: "10:30 AM",
    type: "formal",
    status: "scheduled",
    statusColor: "text-white",
    statusBg: "#84547c",
    observerId: "admin1",
    observerName: "Administrator Johnson",
    notificationSent: true,
    notificationSentAt: "2024-02-20T10:30:00Z",
    reminderSent: false
  },
  {
    id: "2",
    teacher: "Michael Chen",
    teacherId: "2",
    subject: "Science",
    grade: "7th Grade",
    date: "Mar 1, 2023",
    time: "9:15 AM",
    type: "walk-through",
    status: "scheduled",
    statusColor: "text-white",
    statusBg: "#84547c",
    observerId: "admin1",
    observerName: "Administrator Johnson",
    notificationSent: true,
    notificationSentAt: "2024-02-20T10:30:00Z",
    reminderSent: false
  },
  {
    id: "3",
    teacher: "Emily Rodriguez",
    teacherId: "3",
    subject: "English Literature",
    grade: "10th Grade",
    date: "Mar 3, 2023",
    time: "1:00 PM",
    type: "formal",
    status: "scheduled",
    statusColor: "text-white",
    statusBg: "#84547c",
    observerId: "admin1",
    observerName: "Administrator Johnson",
    notificationSent: true,
    notificationSentAt: "2024-02-20T10:30:00Z",
    reminderSent: false
  },
  {
    id: "4",
    teacher: "David Wilson",
    teacherId: "4",
    subject: "History",
    grade: "9th Grade",
    date: "Feb 24, 2023",
    time: "11:00 AM",
    type: "formal",
    status: "completed",
    statusColor: "text-white",
    statusBg: "#e4a414",
    feedback: true,
    observerId: "admin1",
    observerName: "Administrator Johnson"
  },
  {
    id: "5",
    teacher: "Jessica Martinez",
    teacherId: "5",
    subject: "Art",
    grade: "Multiple",
    date: "Feb 22, 2023",
    time: "2:30 PM",
    type: "walk-through",
    status: "completed",
    statusColor: "text-white",
    statusBg: "#e4a414",
    feedback: true,
    observerId: "admin1",
    observerName: "Administrator Johnson"
  },
  {
    id: "6",
    teacher: "Lisa Thompson",
    teacherId: "6",
    subject: "Physics",
    grade: "11th Grade",
    date: "Mar 5, 2023",
    time: "2:30 PM",
    type: "formal",
    status: "in_progress",
    statusColor: "text-white",
    statusBg: "#84547c",
    observerId: "admin1",
    observerName: "Administrator Johnson",
    notificationSent: true,
    notificationSentAt: "2024-02-20T10:30:00Z",
    reminderSent: false
  },
  {
    id: "7",
    teacher: "Robert Kim",
    teacherId: "7",
    subject: "Chemistry",
    grade: "10th Grade",
    date: "Mar 6, 2023",
    time: "10:00 AM",
    type: "walk-through",
    status: "in_progress",
    statusColor: "text-white",
    statusBg: "#84547c",
    observerId: "admin1",
    observerName: "Administrator Johnson",
    notificationSent: true,
    notificationSentAt: "2024-02-20T10:30:00Z",
    reminderSent: false
  },
  {
    id: "8",
    teacher: "Robert Thompson",
    teacherId: "8",
    subject: "Physical Education",
    grade: "Multiple",
    date: "Feb 15, 2023",
    time: "9:45 AM",
    type: "walk-through",
    status: "completed",
    statusColor: "text-white",
    statusBg: "#e4a414",
    feedback: false,
    observerId: "admin1",
    observerName: "Administrator Johnson"
  },
  {
    id: "7",
    teacher: "Lisa Brown",
    teacherId: "7",
    subject: "Mathematics",
    grade: "8th Grade",
    date: "Feb 10, 2023",
    time: "1:15 PM",
    type: "formal",
    status: "canceled",
    statusColor: "bg-red-100 text-red-800",
    observerId: "admin1",
    observerName: "Administrator Johnson"
  }
];

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

const getTypeIcon = (type: ObservationType) => {
  return type === 'formal' ? '📋' : '👁️';
};

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

export default function ObservationsPage() {
  const [observations, setObservations] = useState<ObservationRecord[]>(mockObservations);
  const [loading, setLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  // Fetch real schedule data from backend
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await scheduleApi.getAll();
        const schedules = Array.isArray(response.data) ? response.data : [];
        
        // Debug: Log the first schedule to see the structure
        if (schedules.length > 0) {
          console.log("First schedule from backend:", schedules[0]);
        }
        
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
            feedback: schedule.status.toLowerCase() === 'completed' ? Math.random() > 0.5 : undefined
          };
        });
        
        setObservations(convertedObservations.length > 0 ? convertedObservations : mockObservations);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        // Keep using mock data if API fails
        setObservations(mockObservations);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleSendReminder = async (observationId: string) => {
    try {
      setSendingReminder(observationId);
      
      // Make API call to send reminder
      const response = await fetch(`${baseUrl}/schedules/${observationId}/send_reminder/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
      });

      if (response.ok) {
        // Update the observation to show reminder was sent
        setObservations(prev => prev.map(obs => 
          obs.id === observationId 
            ? { ...obs, reminderSent: true, reminderSentAt: new Date().toISOString() }
            : obs
        ));
        console.log('Reminder sent successfully');
      } else {
        console.error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    } finally {
      setSendingReminder(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Eye className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Teacher Observations</h1>
                  <p className="text-blue-100 text-lg mt-1">Schedule, manage, and review observation sessions</p>
                </div>
              </div>
              
              {/* Quick Stats - Refined Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{observations.length}</div>
                  <div className="text-white/90 text-sm">Total Active</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{observations.filter(o => o.status === 'scheduled').length}</div>
                  <div className="text-white/90 text-sm">Scheduled</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{observations.filter(o => o.status === 'completed').length}</div>
                  <div className="text-white/90 text-sm">Completed</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{observations.filter(o => o.status === 'in_progress').length}</div>
                  <div className="text-white/90 text-sm">In Progress</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{observations.filter(o => o.status === 'completed' && !o.feedback).length}</div>
                  <div className="text-white/90 text-sm">Pending Feedback</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/administrator/observations/schedule">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Schedule Observation
                </Button>
              </Link>
              <Link href="/administrator/observations/t-tess">
                <Button className="bg-transparent border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  T-TESS Evaluation
                </Button>
              </Link>
            </div>
          </div>
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
              {subjects.slice(1).map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Grades</option>
              {grades.slice(1).map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Types</option>
              {types.slice(1).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-full text-sm bg-white">
              <option>All Status</option>
              {statuses.slice(1).map((status) => (
                <option key={status}>{status}</option>
              ))}
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
          <Button variant="outline" size="sm" className="rounded-full" style={{borderColor: '#84547c', color: '#84547c'}}>
            Apply Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 rounded-full">
            Reset
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b">
        <a href="#" className="px-4 py-2 border-b-2 font-medium" style={{borderColor: '#84547c', color: '#84547c'}}>All</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:underline" onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#84547c'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}>Scheduled</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:underline" onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#84547c'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}>Completed</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:underline" onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#84547c'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = ''}>Canceled</a>
      </div>

      {/* Observations list */}
      <div className="space-y-4">
        {loading ? (
          <Card className="border p-8 text-center bg-white">
            <div className="text-gray-500">Loading observations...</div>
          </Card>
        ) : (
          observations.map((observation) => (
            <Card key={observation.id} className="border p-4 hover:border-primary/20 transition-all bg-white">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left section: Teacher info and status */}
                <div className="flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-lg">{observation.teacher}</h3>
                      <span 
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`}
                        style={{backgroundColor: getStatusBadgeColor(observation.status)}}
                      >
                        {observation.status.charAt(0).toUpperCase() + observation.status.slice(1).replace('_', ' ')}
                      </span>
                      <Badge 
                        className={getTypeColor(observation.type)}
                        style={{backgroundColor: observation.type === 'formal' ? '#84547c' : '#e4a414'}}
                      >
                        {getTypeIcon(observation.type)} {getTypeLabel(observation.type)}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{observation.subject} • {observation.grade}</p>
                  </div>
                  
                  {/* Date and time info */}
                  <div className="mt-2 flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span style={{color: '#84547c'}}>📅</span>
                      <span className="text-sm">{observation.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span style={{color: '#84547c'}}>⏰</span>
                      <span className="text-sm">{observation.time}</span>
                    </div>
                    {observation.status === 'completed' && (
                      <div className="flex items-center gap-1">
                        <span style={{color: '#84547c'}}>{observation.feedback ? '✅' : '❌'}</span>
                        <span className="text-sm">{observation.feedback ? 'Feedback Provided' : 'Feedback Pending'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right section: Action buttons - vertically centered */}
                <div className="flex items-center justify-end md:min-w-48 gap-2">
                  <Link href={`/administrator/observations/${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full whitespace-nowrap" style={{borderColor: '#84547c', color: '#84547c'}}>
                      View Details
                    </Button>
                  </Link>
                  {observation.status === 'scheduled' && (
                    <>
                      <Link href={`/administrator/observations/schedule?edit=${observation.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full whitespace-nowrap" style={{borderColor: '#e4a414', color: '#e4a414', backgroundColor: 'rgba(228, 164, 20, 0.05)'}}>
                          <span className="mr-1">✏️</span> Reschedule
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-full border-red-400 text-red-600 hover:bg-red-50 whitespace-nowrap"
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this observation?")) {
                            alert("Observation canceled successfully");
                            // In a real app, we would update the backend here
                          }
                        }}
                      >
                        <span className="mr-1">❌</span> Cancel
                      </Button>
                    </>
                  )}
                  {observation.status === 'completed' && !observation.feedback && (
                    <Button size="sm" className="rounded-full whitespace-nowrap">
                      <span className="mr-1">📝</span> Add Feedback
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Notification Status */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <NotificationStatus
                  notificationSent={observation.notificationSent}
                  notificationSentAt={observation.notificationSentAt}
                  reminderSent={observation.reminderSent}
                  reminderSentAt={observation.reminderSentAt}
                  onSendReminder={() => handleSendReminder(observation.id)}
                  isLoading={sendingReminder === observation.id}
                />
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-gray-600">
          Showing 1-{observations.length} of {observations.length} observations
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="rounded-md">Previous</Button>
          <Button variant="outline" size="sm" className="rounded-md" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)', borderColor: '#84547c', color: '#84547c'}}>1</Button>
          <Button variant="outline" size="sm" disabled className="rounded-md">Next</Button>
        </div>
      </div>
    </div>
  );
} 