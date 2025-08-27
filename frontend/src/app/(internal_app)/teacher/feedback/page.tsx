"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { baseUrl, feedbackApi, ApiError } from "@/lib/api";
import { useState, useEffect } from "react";

// Interface for feedback data from backend
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
  score_classroom_management: number;
  score_content_knowledge: number;
  score_student_engagement: number;
  score_teaching_methods: number;
  score_assessment: number;
  score_professionalism: number;
  strengths: string[];
  areas_for_improvement: string[];
  overall_comments: string;
  lesson_objectives: string;
  observation_notes: string;
  action_step_category: string;
  action_step: string;
  overall_rating: string;
  average_score: number;
  created_at: string;
  updated_at: string;
}

// Transform backend data to match UI expectations
const transformFeedbackData = (feedback: FeedbackData) => {
  const getRatingBg = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent': return '#e4a414';
      case 'good': return '#84547c';
      case 'satisfactory': return '#6b7280';
      case 'needs_improvement': return '#dc2626';
      default: return '#84547c';
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

  return {
    id: feedback.id,
    observer: feedback.observer.name,
    date: formatDate(feedback.schedule.date),
    class: `${feedback.teacher.subject} - ${feedback.schedule.observation_type}`,
    grade: feedback.teacher.grade,
    topic: feedback.lesson_objectives || 'Lesson Observation',
    overallRating: feedback.overall_rating.charAt(0).toUpperCase() + feedback.overall_rating.slice(1).replace('_', ' '),
    ratingColor: 'text-white',
    ratingBg: getRatingBg(feedback.overall_rating),
    categories: {
      'Classroom Management': feedback.score_classroom_management,
      'Content Knowledge': feedback.score_content_knowledge,
      'Student Engagement': feedback.score_student_engagement,
      'Teaching Methods': feedback.score_teaching_methods,
      'Assessment': feedback.score_assessment,
      'Professionalism': feedback.score_professionalism
    },
    strengths: feedback.strengths || [],
    improvements: feedback.areas_for_improvement || [],
    comments: feedback.overall_comments || 'No additional comments provided.',
    averageScore: feedback.average_score,
    actionStep: feedback.action_step
  };
};

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

export default function TeacherFeedbackPage() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teacher data from backend
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.id) return;

      try {
        const allTeachersResponse = await fetch(`${baseUrl}/teachers/`);
        if (allTeachersResponse.ok) {
          const allTeachers = await allTeachersResponse.json();
          
          const teacherRecord = allTeachers.find((teacher: TeacherData) => 
            teacher.user.email === user.email || teacher.user.id === user.id
          );
          
          if (teacherRecord) {
            const individualResponse = await fetch(`${baseUrl}/teachers/${teacherRecord.id}/`);
            if (individualResponse.ok) {
              const teacherDetails = await individualResponse.json();
              setTeacherData(teacherDetails);
            } else {
              setTeacherData(teacherRecord);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.id, user?.email]);

  // Fetch feedback data for the teacher
  useEffect(() => {
    const fetchFeedbackData = async () => {
      if (!teacherData?.id) return;

      try {
        setFeedbackLoading(true);
        setError(null);
        
        // Get feedback for this teacher
        const response = await feedbackApi.getAll({ teacher: teacherData.id });
        
        if (response.data && Array.isArray(response.data)) {
          console.log('Raw feedback data:', response.data);
          setFeedbackData(response.data);
        } else {
          setFeedbackData([]);
        }
      } catch (err) {
        console.error('Error fetching feedback data:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load feedback data. Please try again.');
        }
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedbackData();
  }, [teacherData?.id]);

  // Get teacher's name for dynamic replacement
  const getTeacherName = () => {
    if (teacherData?.user?.name) {
      return teacherData.user.name;
    }
    if (user?.fullName) {
      return user.fullName;
    }
    return "the teacher";
  };

  // Transform backend feedback data for UI
  const transformedFeedback = feedbackData.map(transformFeedbackData);

  // Calculate average ratings for stats
  const calculateAverageRatings = () => {
    if (feedbackData.length === 0) {
      return {
        classroomManagement: 0,
        contentKnowledge: 0,
        studentEngagement: 0,
        teachingMethods: 0,
        assessment: 0,
        professionalism: 0
      };
    }

    const totals = feedbackData.reduce((acc, feedback) => ({
      classroomManagement: acc.classroomManagement + feedback.score_classroom_management,
      contentKnowledge: acc.contentKnowledge + feedback.score_content_knowledge,
      studentEngagement: acc.studentEngagement + feedback.score_student_engagement,
      teachingMethods: acc.teachingMethods + feedback.score_teaching_methods,
      assessment: acc.assessment + feedback.score_assessment,
      professionalism: acc.professionalism + feedback.score_professionalism
    }), {
      classroomManagement: 0,
      contentKnowledge: 0,
      studentEngagement: 0,
      teachingMethods: 0,
      assessment: 0,
      professionalism: 0
    });

    const count = feedbackData.length;
    return {
      classroomManagement: Number((totals.classroomManagement / count).toFixed(1)),
      contentKnowledge: Number((totals.contentKnowledge / count).toFixed(1)),
      studentEngagement: Number((totals.studentEngagement / count).toFixed(1)),
      teachingMethods: Number((totals.teachingMethods / count).toFixed(1)),
      assessment: Number((totals.assessment / count).toFixed(1)),
      professionalism: Number((totals.professionalism / count).toFixed(1))
    };
  };

  const averageRatings = calculateAverageRatings();

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
          <Button className="rounded-full shadow-sm text-white" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 border bg-white col-span-1">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500">Feedback Received</p>
            <p className="text-2xl font-bold mt-1 text-gray-800">
              {feedbackLoading ? '...' : feedbackData.length}
            </p>
          </div>
        </Card>
        
        <Card className="p-4 border bg-white col-span-5">
          <p className="text-sm font-medium text-gray-500 mb-3">Average Rating Breakdown</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "Classroom Management", value: averageRatings.classroomManagement, color: "#84547c" },
              { label: "Content Knowledge", value: averageRatings.contentKnowledge, color: "#e4a414" },
              { label: "Student Engagement", value: averageRatings.studentEngagement, color: "#10b981" },
              { label: "Teaching Methods", value: averageRatings.teachingMethods, color: "#8b5cf6" },
              { label: "Assessment", value: averageRatings.assessment, color: "#f59e0b" },
              { label: "Professionalism", value: averageRatings.professionalism, color: "#06b6d4" }
            ].map((category, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{category.label}</span>
                  <span className="font-medium">
                    {feedbackLoading ? '...' : `${category.value}/5`}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      backgroundColor: category.color,
                      width: feedbackLoading ? '0%' : `${(category.value / 5) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Loading State */}
      {(loading || feedbackLoading) && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border overflow-hidden animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && !feedbackLoading && (
        <Card className="p-8 text-center bg-white border-red-200">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-red-700">Error Loading Feedback</h3>
          <p className="text-red-600 mt-1 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Feedback entries */}
      {!loading && !feedbackLoading && !error && (
        <div className="space-y-6">
          {transformedFeedback.map((feedback) => (
            <Card key={feedback.id} className="bg-white border overflow-hidden">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center p-4 border-b" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {feedback.class}
                  <span 
                    className={`text-sm font-medium px-2 py-1 rounded-full ${feedback.ratingColor}`}
                    style={{backgroundColor: feedback.ratingBg}}
                  >
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
                  <h4 className="font-medium flex items-center gap-2" style={{color: '#e4a414'}}>
                    <span className="text-lg">✨</span> Strengths
                  </h4>
                  <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(228, 164, 20, 0.1)'}}>
                    <ul className="space-y-2">
                      {feedback.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1" style={{color: '#e4a414'}}>•</span>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                      {feedback.strengths.length > 3 && (
                        <li className="text-xs font-medium" style={{color: '#e4a414'}}>
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
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(feedback.categories).map(([category, rating], index) => {
                  const colors = ['#84547c', '#e4a414', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4'];
                  return (
                    <div key={index} className="flex flex-col">
                      <div className="text-xs mb-1 text-gray-600">{category}</div>
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-300"
                            style={{
                              backgroundColor: colors[index % colors.length],
                              width: `${(rating / 5) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium ml-2">{rating}/5</span>
                      </div>
                    </div>
                  );
                })}
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
          
          {/* Empty state */}
          {transformedFeedback.length === 0 && (
            <Card className="p-8 text-center bg-white">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-medium">No feedback yet</h3>
              <p className="text-gray-600 mt-1 mb-4">Feedback will appear here after classroom observations are completed and submitted</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 