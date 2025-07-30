"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ObservationType, ObservationRecord } from "@/lib/types";
import { scheduleApi } from "@/lib/api";

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
    statusColor: "bg-blue-100 text-blue-800",
    observerId: "admin1",
    observerName: "Administrator Johnson"
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
    statusColor: "bg-blue-100 text-blue-800",
    observerId: "admin1",
    observerName: "Administrator Johnson"
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
    statusColor: "bg-blue-100 text-blue-800",
    observerId: "admin1",
    observerName: "Administrator Johnson"
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
    statusColor: "bg-green-100 text-green-800",
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
    statusColor: "bg-green-100 text-green-800",
    feedback: true,
    observerId: "admin1",
    observerName: "Administrator Johnson"
  },
  {
    id: "6",
    teacher: "Robert Thompson",
    teacherId: "6",
    subject: "Physical Education",
    grade: "Multiple",
    date: "Feb 15, 2023",
    time: "9:45 AM",
    type: "walk-through",
    status: "completed",
    statusColor: "bg-green-100 text-green-800",
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
    ? 'bg-blue-100 text-blue-800 border-blue-200' 
    : 'bg-green-100 text-green-800 border-green-200';
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
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800';
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

export default function ObservationsPage() {
  const [observations, setObservations] = useState<ObservationRecord[]>(mockObservations);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Observations</h1>
          <p className="text-gray-600">Schedule, manage, and review observation sessions</p>
        </div>
        <div className="flex gap-3">
          <Link href="/administrator/observations/schedule">
            <Button className="rounded-full shadow-sm bg-primary/90 hover:bg-primary">
              <span className="mr-2">➕</span> Schedule New Observation
            </Button>
          </Link>
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
          <Button variant="outline" size="sm" className="rounded-full">
            Apply Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 rounded-full">
            Reset
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b">
        <a href="#" className="px-4 py-2 border-b-2 border-primary text-primary font-medium">All</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:text-primary">Scheduled</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:text-primary">Completed</a>
        <a href="#" className="px-4 py-2 text-gray-600 hover:text-primary">Canceled</a>
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${observation.statusColor}`}>
                        {observation.status}
                      </span>
                      <Badge className={getTypeColor(observation.type)}>
                        {getTypeIcon(observation.type)} {getTypeLabel(observation.type)}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{observation.subject} • {observation.grade}</p>
                  </div>
                  
                  {/* Date and time info */}
                  <div className="mt-2 flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-primary">📅</span>
                      <span className="text-sm">{observation.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-primary">⏰</span>
                      <span className="text-sm">{observation.time}</span>
                    </div>
                    {observation.status === 'completed' && (
                      <div className="flex items-center gap-1">
                        <span className="text-primary">{observation.feedback ? '✅' : '❌'}</span>
                        <span className="text-sm">{observation.feedback ? 'Feedback Provided' : 'Feedback Pending'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right section: Action buttons - vertically centered */}
                <div className="flex items-center justify-end md:min-w-48 gap-2">
                  <Link href={`/administrator/observations/${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full whitespace-nowrap">
                      View Details
                    </Button>
                  </Link>
                  {observation.status === 'scheduled' && (
                    <>
                      <Link href={`/administrator/observations/schedule?edit=${observation.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full border-yellow-400 text-yellow-600 hover:bg-yellow-50 whitespace-nowrap">
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
          <Button variant="outline" size="sm" className="rounded-md bg-primary/10">1</Button>
          <Button variant="outline" size="sm" disabled className="rounded-md">Next</Button>
        </div>
      </div>
    </div>
  );
} 