"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { baseUrl, feedbackApi } from "@/lib/api";
import { useState, useEffect } from "react";

// Note: Observation data is now fetched from the backend API

interface FeedbackData {
  id: string;
  schedule: {
    id: string;
    date: string;
    time: string;
    observation_type: string;
  };
  teacher: {
    id: string;
    user: {
      name: string;
      email: string;
    };
    subject: string;
    grade: string;
  };
  observer: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  overall_rating?: string;
  average_score?: number;
  strengths?: string;
  areas_for_improvement?: string;
  overall_comments?: string;
  created_at: string;
  updated_at: string;
}

const professionalDevelopment = [
  {
    id: "1",
    title: "Innovative Teaching Methods Workshop",
    date: "Mar 25, 2023",
    type: "Workshop",
    recommended: true,
    status: "Available"
  },
  {
    id: "2",
    title: "Mathematics Curriculum Conference",
    date: "Apr 10-12, 2023",
    type: "Conference",
    recommended: true,
    status: "Registration Required"
  },
  {
    id: "3",
    title: "Digital Tools for Math Education",
    date: "On-Demand",
    type: "Online Course",
    recommended: false,
    status: "Available"
  }
];

const develGoals = [
  {
    id: "1",
    title: "Implement Project-Based Learning",
    status: "In Progress",
    progress: 60,
    dueDate: "End of Semester"
  },
  {
    id: "2",
    title: "Incorporate More Technology in Lessons",
    status: "In Progress",
    progress: 40,
    dueDate: "End of Year"
  }
];

interface TeacherData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  grade: string;
  years_of_experience: number;
}

interface ObservationSchedule {
  id: string;
  date: string;
  time: string;
  status: string;
  observation_type: string;
  notes?: string;
  teacher: TeacherData;
  observation_group?: {
    id: string;
    name: string;
    created_by: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    status: string;
  };
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [observations, setObservations] = useState<ObservationSchedule[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [observationsLoading, setObservationsLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  // Fetch individual teacher data from backend
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.id) return;

      try {
        // First, get all teachers to find the teacher record that matches the user
        const allTeachersResponse = await fetch(`${baseUrl}/teachers/`);
        if (allTeachersResponse.ok) {
          const allTeachers = await allTeachersResponse.json();
          console.log('All teachers:', allTeachers);
          
          // Find the teacher record that matches the current user
          const teacherRecord = allTeachers.find((teacher: TeacherData) => 
            teacher.user.email === user.email || teacher.user.id === user.id
          );
          
          if (teacherRecord) {
            console.log('Found teacher record:', teacherRecord);
            
            // Now fetch individual teacher details using the specific endpoint
            const individualResponse = await fetch(`${baseUrl}/teachers/${teacherRecord.id}/`);
            if (individualResponse.ok) {
              const teacherDetails = await individualResponse.json();
              console.log('Individual teacher details:', teacherDetails);
              setTeacherData(teacherDetails);
            } else {
              console.error('Failed to fetch individual teacher details:', individualResponse.status);
              // Fallback to the teacher record we found
              setTeacherData(teacherRecord);
            }
          } else {
            console.log('Teacher record not found for user:', user.email);
          }
        } else {
          console.error('Failed to fetch teachers list:', allTeachersResponse.status);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.id, user?.email]);

  // Fetch observations for the teacher
  useEffect(() => {
    const fetchObservations = async () => {
      if (!teacherData?.id) return;

      try {
        setObservationsLoading(true);
        const response = await fetch(`${baseUrl}/schedules/`);
        
        if (response.ok) {
          const allSchedules = await response.json();
          console.log('All schedules:', allSchedules);
          
          // Filter schedules for the current teacher
          const teacherObservations = allSchedules.filter((schedule: ObservationSchedule) => 
            schedule.teacher?.id === teacherData.id
          );
          
          console.log('Teacher observations:', teacherObservations);
          
          // Sort by date (most recent first)
          const sortedObservations = teacherObservations.sort((a: ObservationSchedule, b: ObservationSchedule) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          // Filter for upcoming observations (scheduled status regardless of date)
          const upcomingObservations = sortedObservations.filter((obs: ObservationSchedule) => 
            obs.status === 'Scheduled'
          );
          
          setObservations(upcomingObservations);
        } else {
          console.error('Failed to fetch schedules:', response.status);
        }
      } catch (error) {
        console.error('Error fetching observations:', error);
      } finally {
        setObservationsLoading(false);
      }
    };

    fetchObservations();
  }, [teacherData?.id]);

  // Fetch feedback data for the teacher
  useEffect(() => {
    const fetchFeedbackData = async () => {
      if (!teacherData?.id) return;

      try {
        setFeedbackLoading(true);
        
        // Get feedback for this teacher
        const response = await feedbackApi.getAll({ teacher: teacherData.id });
        
        if (response.data && Array.isArray(response.data)) {
          console.log('Raw feedback data:', response.data);
          
          // Sort by creation date (most recent first) and take the latest 3
          const sortedFeedback = response.data
            .sort((a: FeedbackData, b: FeedbackData) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 3);
          
          setFeedbackData(sortedFeedback);
        } else {
          setFeedbackData([]);
        }
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setFeedbackData([]);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedbackData();
  }, [teacherData?.id]);
  
  // Get teacher's name from API data or fallback to auth data
  const getTeacherName = () => {
    if (teacherData?.user?.name) {
      const firstName = teacherData.user.name.split(' ')[0];
      return firstName;
    }
    
    if (user?.fullName) {
      const firstName = user.fullName.split(' ')[0];
      return firstName;
    }
    
    return "Teacher";
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get observer name from observation group or fall back
  const getObserverName = (observation: ObservationSchedule) => {
    if (observation.observation_group?.created_by?.name) {
      return observation.observation_group.created_by.name;
    }
    return "Administrator";
  };

  // Get status color for display
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'text-white';
        // Will use custom background color
      case 'completed':
        return 'text-white';
        // Will use custom background color
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get feedback rating color
  const getFeedbackRatingColor = (rating?: string) => {
    if (!rating) return 'text-gray-600';
    
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'satisfactory':
        return 'text-yellow-600';
      case 'needs improvement':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get feedback summary text
  const getFeedbackSummary = (feedback: FeedbackData) => {
    if (feedback.overall_comments) {
      return feedback.overall_comments;
    }
    if (feedback.strengths) {
      return feedback.strengths;
    }
    return "No detailed feedback available.";
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {getTeacherName()}!</h1>
          {teacherData ? (
            <p className="text-gray-600">
              {teacherData.subject} • {teacherData.grade} • {teacherData.years_of_experience} years experience
            </p>
          ) : (
            <p className="text-gray-600">Your teaching journey at a glance</p>
          )}
          {loading && (
            <p className="text-gray-400 text-sm">Loading teacher details...</p>
          )}
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: '#84547c'}}>
                📅
              </div>
              <h2 className="font-semibold">Upcoming Observations</h2>
            </div>
            <p className="text-4xl font-bold">{observationsLoading ? '...' : observations.length}</p>
            <p className="text-gray-600 mt-1">
              {observationsLoading ? 'Loading...' : 
               observations.length > 0 ? `Next: ${formatDate(observations[0].date)}` : 'No scheduled observations'}
            </p>
            <div className="mt-auto pt-4">
              <Link href="/teacher/observations">
                <Button variant="ghost" size="sm" className="w-full justify-start" style={{color: '#84547c'}}>
                  View Schedule <span className="ml-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-5 border bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: '#e4a414'}}>
                📈
              </div>
              <h2 className="font-semibold">Performance Rating</h2>
            </div>
            <p className="text-4xl font-bold">4.5/5</p>
            <p className="text-gray-600 mt-1">Based on last 5 observations</p>
            <div className="mt-auto pt-4">
              <Link href="/teacher/feedback">
                <Button variant="ghost" size="sm" className="w-full justify-start" style={{color: '#84547c'}}>
                  View Feedback <span className="ml-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming observations */}
      <Card className="border p-0 overflow-hidden bg-white">
        <div className="border-b px-4 py-3" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Upcoming Observations</h2>
            <Link href="/teacher/observations" className="text-sm font-medium hover:underline" style={{color: '#84547c'}}>
              View All
            </Link>
          </div>
        </div>
        {observationsLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading observations...</p>
          </div>
        ) : observations.length > 0 ? (
          <div className="divide-y">
            {observations.map((observation) => (
              <div key={observation.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{getObserverName(observation)}</div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(observation.status)}`}>
                    {observation.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-1">
                  <div className="text-gray-600">Subject:</div>
                  <div>{teacherData?.subject || 'N/A'}</div>
                  <div className="text-gray-600">Grade:</div>
                  <div>{teacherData?.grade || 'N/A'}</div>
                  <div className="text-gray-600">Date & Time:</div>
                  <div>{formatDate(observation.date)}, {formatTime(observation.time)}</div>
                  <div className="text-gray-600">Type:</div>
                  <div className="capitalize">{observation.observation_type.replace('-', ' ')}</div>
                  {observation.notes && (
                    <>
                      <div className="text-gray-600">Notes:</div>
                      <div className="text-sm">{observation.notes}</div>
                    </>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link href={`/teacher/observations/${observation.id}`}>
                    <Button size="sm" variant="outline" className="rounded-full text-xs">
                      View Details
                    </Button>
                  </Link>
                  <Link href="/teacher/lesson-plans">
                    <Button size="sm" className="rounded-full text-xs">
                      Weekly Lesson Plans
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-800">No scheduled observations</h3>
            <p className="text-gray-600 mt-1">No observations are currently scheduled. Check back later or contact your administrator.</p>
          </div>
        )}
      </Card>

      {/* Two column layout for recent feedback and professional development */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Feedback */}
        <Card className="border p-0 overflow-hidden bg-white">
          <div className="border-b px-4 py-3" style={{background: 'linear-gradient(90deg, rgba(228, 164, 20, 0.05) 0%, rgba(132, 84, 124, 0.05) 100%)'}}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Feedback</h2>
              <Link href="/teacher/feedback" className="text-sm font-medium hover:underline" style={{color: '#84547c'}}>
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {feedbackLoading ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">Loading feedback...</p>
              </div>
            ) : feedbackData.length > 0 ? (
              feedbackData.map((feedback) => (
                <div key={feedback.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{feedback.observer.name}</div>
                    <div className="text-xs text-gray-500">{formatDate(feedback.schedule.date)}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {feedback.teacher.subject} • {feedback.teacher.grade}
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border text-sm">
                    <p className="text-gray-700">{getFeedbackSummary(feedback)}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Overall Rating</span>
                      <span className={`font-medium ${getFeedbackRatingColor(feedback.overall_rating)}`}>
                        {feedback.overall_rating || 'Not rated'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/teacher/feedback/${feedback.id}`}>
                      <Button size="sm" variant="outline" className="rounded-full text-xs w-full">
                        View Full Feedback
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500">No recent feedback available.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 