"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ObservationRecord } from "@/lib/types";
import { scheduleApi, feedbackApi, baseUrl, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { 
  ArrowLeft,
  Save,
  Send,
  Star,
  Plus,
  Minus,
  Calendar,
  Clock,
  User,
  GraduationCap,
  FileText,
  AlertCircle,
  RefreshCw,
  CheckCircle
} from "lucide-react";

interface TeacherFeedbackForm {
  // Observation details
  observationId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  observationDate: string;
  observationTime: string;
  observationType: string;
  
  // Scoring categories (1-5 scale)
  scores: {
    classroomManagement: number;
    contentKnowledge: number;
    studentEngagement: number;
    teachingMethods: number;
    assessment: number;
    professionalism: number;
  };
  
  // Qualitative feedback
  strengths: string[];
  areasForImprovement: string[];
  overallComments: string;
  
  // Action plan
  actionStepCategory: string;
  actionStep: string;
  
  // Lesson context
  lessonObjectives: string;
  observationNotes: string;
  
  // Overall rating
  overallRating: string;
}

const categoryDescriptions = {
  classroomManagement: "Organization, discipline, and environment management",
  contentKnowledge: "Subject matter expertise and accuracy",
  studentEngagement: "Student participation and interest",
  teachingMethods: "Instructional strategies and techniques",
  assessment: "Evaluation and feedback to students", 
  professionalism: "Professional conduct and collaboration"
};

const actionCategories = [
  "Internalization",
  "Year-Long Pacing", 
  "Lesson Pacing",
  "Student Engagement",
  "Instructional Methods",
  "Assessment",
  "Classroom Management",
  "Content Knowledge",
  "Professional Development"
];

// Mapping from frontend display names to backend database values
const categoryToApiMapping: { [key: string]: string } = {
  "Internalization": "internalization",
  "Year-Long Pacing": "year_long_pacing",
  "Lesson Pacing": "lesson_pacing", 
  "Student Engagement": "student_engagement",
  "Instructional Methods": "instructional_methods",
  "Assessment": "assessment",
  "Classroom Management": "classroom_management",
  "Content Knowledge": "content_knowledge",
  "Professional Development": "professional_development"
};

// Reverse mapping for displaying existing data
const apiToCategoryMapping: { [key: string]: string } = {
  "internalization": "Internalization",
  "year_long_pacing": "Year-Long Pacing",
  "lesson_pacing": "Lesson Pacing",
  "student_engagement": "Student Engagement", 
  "instructional_methods": "Instructional Methods",
  "assessment": "Assessment",
  "classroom_management": "Classroom Management",
  "content_knowledge": "Content Knowledge",
  "professional_development": "Professional Development"
};

const actionSteps = [
  "Review lesson materials before teaching",
  "Add annotations to lesson plans", 
  "Practice delivering key instructions",
  "Adjust pacing to match curriculum guide",
  "Incorporate more student-led discussions",
  "Implement exit tickets for assessment",
  "Develop more engaging activities",
  "Use varied questioning techniques",
  "Create rubrics for assessments",
  "Establish clearer classroom procedures",
  "Seek mentoring or coaching support",
  "Attend professional development workshops"
];

export default function CreateFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const observationId = params.id as string;
  const { user } = useAuth();
  
  const [observation, setObservation] = useState<ObservationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [observerLoading, setObserverLoading] = useState(true);
  
  const [observerUserId, setObserverUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TeacherFeedbackForm>({
    observationId: observationId,
    teacherId: "",
    teacherName: "",
    subject: "",
    grade: "",
    observationDate: "",
    observationTime: "",
    observationType: "",
    scores: {
      classroomManagement: 3,
      contentKnowledge: 3,
      studentEngagement: 3,
      teachingMethods: 3,
      assessment: 3,
      professionalism: 3
    },
    strengths: [""],
    areasForImprovement: [""],
    overallComments: "",
    actionStepCategory: "",
    actionStep: "",
    lessonObjectives: "",
    observationNotes: "",
    overallRating: ""
  });

  // Fetch corresponding Users record for current authenticated user
  useEffect(() => {
    const fetchObserverUserId = async () => {
      if (!user?.email) {
        setObserverLoading(false);
        return;
      }
      
      try {
        setObserverLoading(true);
        console.log('Looking up Users record for:', user.email);
        
        // Get all Users records to find the one matching current auth user
        const response = await fetch(`${baseUrl}/users/`);
        if (response.ok) {
          const users = await response.json();
          console.log('All Users records:', users);
          
          const matchingUser = users.find((u: any) => u.email === user.email);
          
          if (matchingUser) {
            console.log('Found matching Users record:', matchingUser);
            setObserverUserId(matchingUser.id);
          } else {
            console.error('No Users record found for authenticated user:', user.email);
            setError(`No Users record found for ${user.email}. Please contact administrator.`);
          }
        } else {
          console.error('Failed to fetch Users records');
          setError('Failed to load user information. Please refresh the page.');
        }
      } catch (err) {
        console.error('Error fetching observer user ID:', err);
        setError('Failed to load user information. Please refresh the page.');
      } finally {
        setObserverLoading(false);
      }
    };
    
    fetchObserverUserId();
  }, [user?.email]);

  // Fetch observation details
  useEffect(() => {
    const fetchObservationDetails = async () => {
      if (!observationId) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await scheduleApi.getAll();
        const schedules = Array.isArray(response.data) ? response.data : [];
        
        const schedule = schedules.find((s: any) => s.id === observationId);
        
        if (!schedule) {
          setError("Observation not found");
          return;
        }

        // Convert to ObservationRecord format
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
        
        const observationRecord: ObservationRecord = {
          id: schedule.id,
          teacher: teacherName,
          teacherId: schedule.teacher?.id || schedule.observation_group?.id || "",
          subject: subject,
          grade: grade,
          date: schedule.date,
          time: schedule.time,
          type: schedule.observation_type,
          status: schedule.status.toLowerCase(),
          statusColor: "",
          statusBg: "",
          observerId: schedule.observation_group?.created_by?.id || "admin1",
          observerName: schedule.observation_group?.created_by?.name || "Administrator",
          notes: schedule.notes || ''
        };
        
        setObservation(observationRecord);
        
        // Pre-populate form with observation data
        setFormData(prev => ({
          ...prev,
          teacherId: observationRecord.teacherId,
          teacherName: observationRecord.teacher,
          subject: observationRecord.subject,
          grade: observationRecord.grade,
          observationDate: observationRecord.date,
          observationTime: observationRecord.time,
          observationType: observationRecord.type,
          observationNotes: observationRecord.notes || ""
        }));

        // Check if there's existing feedback for this schedule
        try {
          const existingFeedbackResponse = await feedbackApi.getBySchedule(observationId);
          if (existingFeedbackResponse.data && Array.isArray(existingFeedbackResponse.data) && existingFeedbackResponse.data.length > 0) {
            const existingFeedback = existingFeedbackResponse.data[0];
            
            // Pre-populate form with existing feedback data
            setFormData(prev => ({
              ...prev,
              scores: {
                classroomManagement: existingFeedback.score_classroom_management || 3,
                contentKnowledge: existingFeedback.score_content_knowledge || 3,
                studentEngagement: existingFeedback.score_student_engagement || 3,
                teachingMethods: existingFeedback.score_teaching_methods || 3,
                assessment: existingFeedback.score_assessment || 3,
                professionalism: existingFeedback.score_professionalism || 3,
              },
              strengths: existingFeedback.strengths && existingFeedback.strengths.length > 0 ? existingFeedback.strengths : [""],
              areasForImprovement: existingFeedback.areas_for_improvement && existingFeedback.areas_for_improvement.length > 0 ? existingFeedback.areas_for_improvement : [""],
              overallComments: existingFeedback.overall_comments || "",
              actionStepCategory: existingFeedback.action_step_category ? apiToCategoryMapping[existingFeedback.action_step_category] || "" : "",
              actionStep: existingFeedback.action_step || "",
              lessonObjectives: existingFeedback.lesson_objectives || "",
            }));
            
            console.log("Pre-populated form with existing feedback:", existingFeedback);
          }
        } catch (feedbackErr) {
          console.log("No existing feedback found, starting fresh");
        }
        
      } catch (err) {
        console.error("Error fetching observation details:", err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load observation details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchObservationDetails();
  }, [observationId]);

  // Calculate overall rating based on scores
  useEffect(() => {
    const average = Object.values(formData.scores).reduce((sum, score) => sum + score, 0) / Object.values(formData.scores).length;
    
    let rating = "";
    if (average >= 4.5) rating = "Excellent";
    else if (average >= 3.5) rating = "Good";
    else if (average >= 2.5) rating = "Satisfactory";
    else rating = "Needs Improvement";
    
    setFormData(prev => ({ ...prev, overallRating: rating }));
  }, [formData.scores]);

  // Update score
  const updateScore = (category: keyof typeof formData.scores, value: number) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: Math.max(1, Math.min(5, value))
      }
    }));
  };

  // Add/remove strengths
  const addStrength = () => {
    setFormData(prev => ({
      ...prev,
      strengths: [...prev.strengths, ""]
    }));
  };

  const removeStrength = (index: number) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const updateStrength = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.map((strength, i) => i === index ? value : strength)
    }));
  };

  // Add/remove areas for improvement
  const addImprovement = () => {
    setFormData(prev => ({
      ...prev,
      areasForImprovement: [...prev.areasForImprovement, ""]
    }));
  };

  const removeImprovement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      areasForImprovement: prev.areasForImprovement.filter((_, i) => i !== index)
    }));
  };

  const updateImprovement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      areasForImprovement: prev.areasForImprovement.map((improvement, i) => i === index ? value : improvement)
    }));
  };

  // Save as draft
  const saveDraft = async () => {
    if (!observerUserId) {
      alert("Observer user record not found. Please refresh the page or contact administrator.");
      return;
    }
    
    setSaving(true);
    try {
      // Check if we need to update existing draft or create new
      const existingFeedback = await feedbackApi.getBySchedule(observationId);
      
      console.log('User data for feedback creation:', {
        user: user,
        authUserId: user?.id,
        userEmail: user?.email,
        observerUserId: observerUserId,
        teacherId: formData.teacherId
      });
      
      const feedbackData = {
        schedule: observationId,
        teacher: formData.teacherId,
        observer: observerUserId, // Current user as observer
        status: 'draft',
        score_classroom_management: formData.scores.classroomManagement,
        score_content_knowledge: formData.scores.contentKnowledge,
        score_student_engagement: formData.scores.studentEngagement,
        score_teaching_methods: formData.scores.teachingMethods,
        score_assessment: formData.scores.assessment,
        score_professionalism: formData.scores.professionalism,
        strengths: formData.strengths.filter(s => s.trim()),
        areas_for_improvement: formData.areasForImprovement.filter(a => a.trim()),
        overall_comments: formData.overallComments,
        lesson_objectives: formData.lessonObjectives,
        observation_notes: formData.observationNotes,
        action_step_category: formData.actionStepCategory ? categoryToApiMapping[formData.actionStepCategory] || "" : "",
        action_step: formData.actionStep
      };

      console.log('Feedback data being sent to API (draft):', feedbackData);

      if (existingFeedback.data && Array.isArray(existingFeedback.data) && existingFeedback.data.length > 0) {
        // Update existing draft
        await feedbackApi.update(existingFeedback.data[0].id, feedbackData);
      } else {
        // Create new draft
        await feedbackApi.create(feedbackData);
      }
      
      alert("Feedback saved as draft!");
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Error saving draft");
    } finally {
      setSaving(false);
    }
  };

  // Submit feedback
  const submitFeedback = async () => {
    if (!observerUserId) {
      alert("Observer user record not found. Please refresh the page or contact administrator.");
      return;
    }
    
    // Validation
    if (formData.strengths.some(s => !s.trim()) || formData.areasForImprovement.some(a => !a.trim())) {
      alert("Please fill in all strength and improvement areas");
      return;
    }
    
    if (!formData.overallComments.trim() || !formData.lessonObjectives.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (!formData.actionStepCategory || !formData.actionStep) {
      alert("Please select an action step category and specific action");
      return;
    }

    setSaving(true);
    try {
      // Check if we need to update existing feedback or create new
      const existingFeedback = await feedbackApi.getBySchedule(observationId);
      
      console.log('User data for feedback submission:', {
        user: user,
        authUserId: user?.id,
        userEmail: user?.email,
        observerUserId: observerUserId,
        teacherId: formData.teacherId
      });
      
      const feedbackData = {
        schedule: observationId,
        teacher: formData.teacherId,
        observer: observerUserId, // Current user as observer
        status: 'draft', // Create as draft first, then submit
        score_classroom_management: formData.scores.classroomManagement,
        score_content_knowledge: formData.scores.contentKnowledge,
        score_student_engagement: formData.scores.studentEngagement,
        score_teaching_methods: formData.scores.teachingMethods,
        score_assessment: formData.scores.assessment,
        score_professionalism: formData.scores.professionalism,
        strengths: formData.strengths.filter(s => s.trim()),
        areas_for_improvement: formData.areasForImprovement.filter(a => a.trim()),
        overall_comments: formData.overallComments,
        lesson_objectives: formData.lessonObjectives,
        observation_notes: formData.observationNotes,
        action_step_category: formData.actionStepCategory ? categoryToApiMapping[formData.actionStepCategory] || "" : "",
        action_step: formData.actionStep
      };

      console.log('Feedback data being sent to API (submit):', feedbackData);

      let feedbackId;
      if (existingFeedback.data && Array.isArray(existingFeedback.data) && existingFeedback.data.length > 0) {
        // Update existing feedback and submit
        const updatedFeedback = await feedbackApi.update(existingFeedback.data[0].id, feedbackData);
        feedbackId = existingFeedback.data[0].id;
      } else {
        // Create new feedback
        const newFeedback = await feedbackApi.create(feedbackData);
        feedbackId = (newFeedback.data as any)?.id;
      }
      
      // Submit the feedback
      if (feedbackId) {
        await feedbackApi.submit(feedbackId);
      }
      
      alert("Feedback submitted successfully!");
      router.push("/administrator/feedback");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      if (err instanceof ApiError) {
        alert(`Error submitting feedback: ${err.message}`);
      } else {
      alert("Error submitting feedback");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || observerLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="text-center text-gray-500 mt-4">
          {loading ? "Loading observation details..." : "Loading user information..."}
        </div>
      </div>
    );
  }

  if (error || !observation) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {error || "Observation not found"}
        </h3>
        <p className="text-gray-600 mb-4 text-center">
          {error ? error : "The observation you're trying to provide feedback for doesn't exist."}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Create Observation Feedback</h1>
          <p className="text-gray-600 mt-1">Score and provide feedback for the observed teacher</p>
          {/* Debug observer info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>Debug:</strong> Observer ID: {observerUserId || 'Loading...'} | Auth ID: {user?.id} | Email: {user?.email}
            </div>
          )}
        </div>
      </div>

      {/* Observation Details Card */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="text-white p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{observation.teacher}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/80">{observation.subject} • {observation.grade}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Date: {observation.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Time: {observation.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Type: {observation.type}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Performance Scores
          </CardTitle>
          <p className="text-gray-600">Rate each category on a scale of 1-5 (5 being excellent)</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(formData.scores).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-base font-medium capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {categoryDescriptions[category as keyof typeof categoryDescriptions]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateScore(category as keyof typeof formData.scores, score - 1)}
                    disabled={score <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        className={`h-6 w-6 cursor-pointer ${
                          num <= score ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => updateScore(category as keyof typeof formData.scores, num)}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateScore(category as keyof typeof formData.scores, score + 1)}
                    disabled={score >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold ml-2 w-6">{score}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Overall Rating Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Overall Rating:</span>
              <Badge 
                className={`text-lg px-4 py-2 ${
                  formData.overallRating === 'Excellent' ? 'bg-green-100 text-green-800' :
                  formData.overallRating === 'Good' ? 'bg-blue-100 text-blue-800' :
                  formData.overallRating === 'Satisfactory' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                {formData.overallRating}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qualitative Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Strengths
            </CardTitle>
            <p className="text-gray-600">What did the teacher do well?</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.strengths.map((strength, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={strength}
                  onChange={(e) => updateStrength(index, e.target.value)}
                  placeholder="Enter a specific strength you observed..."
                  className="flex-1"
                  rows={2}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStrength(index)}
                  disabled={formData.strengths.length <= 1}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addStrength}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Strength
            </Button>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Areas for Improvement
            </CardTitle>
            <p className="text-gray-600">What could be improved?</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.areasForImprovement.map((improvement, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={improvement}
                  onChange={(e) => updateImprovement(index, e.target.value)}
                  placeholder="Enter a specific area for improvement..."
                  className="flex-1"
                  rows={2}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImprovement(index)}
                  disabled={formData.areasForImprovement.length <= 1}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addImprovement}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Improvement Area
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Overall Comments and Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Comments</CardTitle>
            <p className="text-gray-600">General observations and feedback</p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.overallComments}
              onChange={(e) => setFormData(prev => ({ ...prev, overallComments: e.target.value }))}
              placeholder="Provide overall comments about the lesson and teacher performance..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Context</CardTitle>
            <p className="text-gray-600">Lesson objectives and additional notes</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="objectives">Lesson Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.lessonObjectives}
                onChange={(e) => setFormData(prev => ({ ...prev, lessonObjectives: e.target.value }))}
                placeholder="What were the main learning objectives for this lesson?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Action Plan</CardTitle>
          <p className="text-gray-600">Recommended next steps for teacher development</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="actionCategory">Action Step Category</Label>
              <select
                id="actionCategory"
                value={formData.actionStepCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, actionStepCategory: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a category</option>
                {actionCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="actionStep">Specific Action Step</Label>
              <select
                id="actionStep"
                value={formData.actionStep}
                onChange={(e) => setFormData(prev => ({ ...prev, actionStep: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select an action step</option>
                {actionSteps.map((step) => (
                  <option key={step} value={step}>{step}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              onClick={saveDraft}
              disabled={saving || !observerUserId}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={submitFeedback}
              disabled={saving || !observerUserId}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {saving ? "Submitting..." : "Submit Feedback"}
            </Button>
            {!observerUserId && (
              <p className="text-sm text-gray-500">Loading user information...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}