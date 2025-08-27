"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { feedbackApi, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

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
  teacher_response_date: string | null;
  teacher_response_comments: string | null;
  created_at: string;
  updated_at: string;
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const feedbackId = params.id as string;
  const { user } = useAuth();
  
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [comments, setComments] = useState("");
  const [digitalSignature, setDigitalSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherResponse, setTeacherResponse] = useState<string | null>(null);
  const [teacherComments, setTeacherComments] = useState<string | null>(null);

  // Fetch feedback data from backend
  useEffect(() => {
    const fetchFeedbackData = async () => {
      if (!feedbackId) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await feedbackApi.getById(feedbackId);
        
        if (response.data) {
          const feedback = response.data;
          setFeedbackData(feedback);
          
          // Set teacher response state based on backend data
          if (feedback.status === 'approved') {
            setTeacherResponse('approved');
          } else if (feedback.status === 'review_requested') {
            setTeacherResponse('review_requested');
            setTeacherComments(feedback.teacher_response_comments);
          }
        } else {
          setError("Feedback not found");
        }
      } catch (err) {
        console.error('Error fetching feedback data:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load feedback data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [feedbackId]);

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!digitalSignature) {
      alert("Please provide your digital signature");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await feedbackApi.approve(feedbackId);
      setTeacherResponse("approved");
      setShowApprovalForm(false);
    } catch (err) {
      console.error('Error approving feedback:', err);
      alert('Failed to approve feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments) {
      alert("Please provide comments for your review request");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await feedbackApi.requestReview(feedbackId, comments);
      setTeacherResponse("review_requested");
      setTeacherComments(comments);
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error requesting review:', err);
      alert('Failed to request review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !feedbackData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Feedback not found"}</p>
            <Link href="/teacher/feedback">
              <Button variant="outline" className="rounded-full shadow-sm">
                ← Back to Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get rating display name
  const getRatingDisplay = (rating: string) => {
    const ratingMap: { [key: string]: string } = {
      'excellent': 'Excellent',
      'good': 'Good',
      'satisfactory': 'Satisfactory',
      'needs_improvement': 'Needs Improvement'
    };
    return ratingMap[rating] || rating;
  };

  // Get action category display name
  const getActionCategoryDisplay = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'internalization': 'Internalization',
      'year_long_pacing': 'Year-Long Pacing',
      'lesson_pacing': 'Lesson Pacing',
      'student_engagement': 'Student Engagement',
      'instructional_methods': 'Instructional Methods',
      'assessment': 'Assessment',
      'classroom_management': 'Classroom Management',
      'content_knowledge': 'Content Knowledge',
      'professional_development': 'Professional Development'
    };
    return categoryMap[category] || category;
  };

  // Create ratings object for display
  const ratings = {
    'Classroom Management': feedbackData.score_classroom_management,
    'Content Knowledge': feedbackData.score_content_knowledge,
    'Student Engagement': feedbackData.score_student_engagement,
    'Teaching Methods': feedbackData.score_teaching_methods,
    'Assessment': feedbackData.score_assessment,
    'Professionalism': feedbackData.score_professionalism
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Observation Feedback</h1>
          <p className="text-gray-600">Review your feedback and respond</p>
        </div>
        <Link href="/teacher/feedback">
          <Button variant="outline" className="rounded-full shadow-sm">
            ← Back to Feedback
          </Button>
        </Link>
      </div>
      
      {/* Observation Overview */}
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Observation Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="mt-1 font-medium">{formatDate(feedbackData.schedule.date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Observer</h3>
            <p className="mt-1 font-medium">{feedbackData.observer.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Subject & Grade</h3>
            <p className="mt-1 font-medium">{feedbackData.teacher.subject}, {feedbackData.teacher.grade}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                teacherResponse === "approved" 
                  ? "bg-green-100 text-green-800" 
                  : teacherResponse === "review_requested" 
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }`}>
                {teacherResponse === "approved" 
                  ? "Approved" 
                  : teacherResponse === "review_requested" 
                    ? "Review Requested"
                    : "Pending Review"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Glows */}
        <Card className="border bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>Glows</span>
            </CardTitle>
            <CardDescription>Strengths observed during your lesson</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedbackData.strengths && feedbackData.strengths.length > 0 ? (
                feedbackData.strengths.map((glow, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{glow}</span>
                </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No strengths recorded</li>
              )}
            </ul>
          </CardContent>
        </Card>
        
        {/* Grows */}
        <Card className="border bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span>Grows</span>
            </CardTitle>
            <CardDescription>Areas for improvement and development</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedbackData.areas_for_improvement && feedbackData.areas_for_improvement.length > 0 ? (
                feedbackData.areas_for_improvement.map((grow, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>{grow}</span>
                </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No areas for improvement recorded</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Ratings */}
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Performance Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ratings).map(([category, score]) => (
              <div key={category} className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{category}</h3>
                <div className="flex items-center mt-1">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    score >= 4.5 
                      ? "bg-green-500" 
                      : score >= 3.5 
                        ? "bg-blue-500" 
                        : score >= 2.5 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                  }`}></div>
                  <p className="font-medium">{score}/5</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-blue-50">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Overall Rating</h3>
            <p className="font-medium text-blue-800">{getRatingDisplay(feedbackData.overall_rating)}</p>
            <p className="text-sm text-blue-600">Average Score: {feedbackData.average_score}/5</p>
          </div>
        </CardContent>
      </Card>

      {/* Overall Comments */}
      {feedbackData.overall_comments && (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Overall Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{feedbackData.overall_comments}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Action Plan */}
      {feedbackData.action_step && (
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Action Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {feedbackData.action_step_category && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 font-medium">{getActionCategoryDisplay(feedbackData.action_step_category)}</p>
          </div>
            )}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recommended Action</h3>
              <p className="mt-1 font-medium">{feedbackData.action_step}</p>
          </div>
        </CardContent>
      </Card>
      )}
      
      {/* Teacher Response Section */}
      {teacherResponse === null ? (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
            <CardDescription>
              Please review the feedback above and either approve it or request a review if you have questions or concerns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showApprovalForm ? (
              <form onSubmit={handleApprovalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      required 
                      className="h-4 w-4 rounded"
                    />
                    <span>I accept this feedback as an accurate representation of my observation.</span>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="digitalSignature">Digital Signature</Label>
                  <input 
                    type="text"
                    id="digitalSignature"
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value)}
                    placeholder="Type your full name as signature"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500">By typing your name above, you are providing your electronic signature.</p>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => setShowApprovalForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Approval"}
                  </Button>
                </div>
              </form>
            ) : showReviewForm ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comments">Questions or Comments</Label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Please provide specific questions or comments about the feedback..."
                    className="w-full p-2 border rounded-lg min-h-[120px]"
                    required
                  />
                  <p className="text-xs text-gray-500">Be specific about what aspects of the feedback you would like to discuss further.</p>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="rounded-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Review"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center py-6">
                <Button 
                  className="rounded-full w-full md:w-auto"
                  onClick={() => setShowApprovalForm(true)}
                >
                  <span className="mr-2">✓</span> Approve Feedback
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full w-full md:w-auto"
                  onClick={() => setShowReviewForm(true)}
                >
                  <span className="mr-2">💬</span> Request Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            {teacherResponse === "approved" ? (
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl">✓</div>
                  <div>
                    <h3 className="font-medium text-green-800">Feedback Approved</h3>
                    <p className="text-green-700 mt-1">
                      You've accepted this feedback on {feedbackData.teacher_response_date ? formatDate(feedbackData.teacher_response_date) : new Date().toLocaleDateString()}.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-green-700 font-normal underline mt-2"
                      onClick={() => setTeacherResponse(null)}
                    >
                      Change your response
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-500 text-xl">💬</div>
                  <div>
                    <h3 className="font-medium text-yellow-800">Review Requested</h3>
                    <p className="text-yellow-700 mt-1">
                      You've requested a review on {feedbackData.teacher_response_date ? formatDate(feedbackData.teacher_response_date) : new Date().toLocaleDateString()}.
                    </p>
                    {teacherComments && (
                    <div className="bg-white p-3 rounded mt-2 text-gray-700">
                      {teacherComments}
                    </div>
                    )}
                    <p className="text-xs text-yellow-700 mt-2">
                      Your observer will be notified and will contact you to discuss your questions.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-yellow-700 font-normal underline mt-2"
                      onClick={() => setTeacherResponse(null)}
                    >
                      Change your response
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 