"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { lessonPlanApi, teacherApi } from "@/lib/api";
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Edit, 
  Eye, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  RefreshCw
} from "lucide-react";

// Types for lesson plans
interface LessonPlan {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  submit_date?: string;
  status: "pending" | "submitted" | "overdue";
  feedback_status?: "approved" | "needs_revision" | "pending";
  feedback_comment?: string;
  feedback_date?: string;
  subject: string;
  grade: string;
  teacher_name: string;
  reviewer_name?: string;
  document?: string;
  document_url?: string;
  document_size?: number;
  document_extension?: string;
  created_at: string;
  updated_at: string;
}

interface TeacherData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  subject: string;
  grade: string;
  years_of_experience: number;
}

export default function TeacherLessonPlansPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [weekTitle, setWeekTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<string | null>(null);

  // State for real data
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.id) return;

      try {
        const response = await teacherApi.getAll();
        if (response.data) {
          const teacherRecord = (response.data as TeacherData[]).find((teacher: TeacherData) => 
            teacher.user.email === user.email || teacher.user.id === user.id
          );
          
          if (teacherRecord) {
            setTeacherData(teacherRecord);
          }
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setError('Failed to fetch teacher data');
      }
    };

    fetchTeacherData();
  }, [user?.id, user?.email]);

  // Fetch lesson plans for the teacher
  useEffect(() => {
    const fetchLessonPlans = async () => {
      if (!teacherData?.id) return;

      try {
        setLoading(true);
        const response = await lessonPlanApi.getByTeacher(teacherData.id);
        if (response.data) {
          setLessonPlans(response.data as LessonPlan[]);
        }
      } catch (error) {
        console.error('Error fetching lesson plans:', error);
        setError('Failed to fetch lesson plans');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonPlans();
  }, [teacherData?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !weekTitle || !teacherData) {
      alert("Please provide a title and select a lesson plan file");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', weekTitle);
      formData.append('description', description);
      formData.append('teacher', teacherData.id);
      formData.append('status', 'pending');
      formData.append('document', selectedFile);
      
      // Set due date (you might want to make this configurable)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      formData.append('due_date', nextWeek.toISOString().split('T')[0]);

      const response = await lessonPlanApi.createWithFile(formData);
      
      if (response.data) {
      alert("Lesson plan submitted successfully!");
      setSelectedFile(null);
      setWeekTitle("");
      setDescription("");
      setActiveTab("overview");
        
        // Refresh lesson plans
        const updatedResponse = await lessonPlanApi.getByTeacher(teacherData.id);
        if (updatedResponse.data) {
          setLessonPlans(updatedResponse.data as LessonPlan[]);
        }
      }
    } catch (error) {
      console.error('Error submitting lesson plan:', error);
      alert("Failed to submit lesson plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleViewDetails = (planId: string) => {
    setSelectedPlanDetails(selectedPlanDetails === planId ? null : planId);
  };

  const getSelectedPlan = (planId: string) => {
    return lessonPlans.find(plan => plan.id === planId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPlanDetails) {
        setSelectedPlanDetails(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedPlanDetails]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="text-white" style={{backgroundColor: '#84547c'}}>Submitted</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getFeedbackBadge = (feedbackStatus: string | undefined) => {
    switch (feedbackStatus) {
      case "approved":
        return <Badge className="text-white" style={{backgroundColor: '#e4a414'}}>Approved</Badge>;
      case "needs_revision":
        return <Badge className="bg-orange-100 text-orange-800">Needs Revision</Badge>;
      case "pending":
        return <Badge className="text-white" style={{backgroundColor: '#84547c'}}>Under Review</Badge>;
      default:
        return null;
    }
  };

  const filteredLessonPlans = lessonPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">Lesson Plans</h1>
                  <p className="text-white/90 text-lg mt-1">Submit and manage your weekly lesson plans</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{lessonPlans.filter(p => p.status === 'submitted').length}</div>
                  <div className="text-white/90 text-sm">Submitted</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{lessonPlans.filter(p => p.status === 'pending').length}</div>
                  <div className="text-white/90 text-sm">Pending</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{lessonPlans.filter(p => p.feedback_status === 'approved').length}</div>
                  <div className="text-white/90 text-sm">Approved</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{lessonPlans.filter(p => p.feedback_status === 'needs_revision').length}</div>
                  <div className="text-white/90 text-sm">Need Revision</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setActiveTab("submit")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Submit New Plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
        <button
          className={`flex-1 py-3 px-6 font-medium text-sm rounded-xl transition-all duration-300 ${
            activeTab === "overview"
              ? "text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          style={activeTab === "overview" ? {
            background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)',
            boxShadow: '0 10px 25px rgba(132, 84, 124, 0.25)'
          } : {}}
          onClick={() => setActiveTab("overview")}
        >
          <div className="flex items-center justify-center gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-6 font-medium text-sm rounded-xl transition-all duration-300 ${
            activeTab === "submit"
              ? "text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          style={activeTab === "submit" ? {
            background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)',
            boxShadow: '0 10px 25px rgba(132, 84, 124, 0.25)'
          } : {}}
          onClick={() => setActiveTab("submit")}
        >
          Submit Lesson Plan
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Search and filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    🔍
                  </span>
                  <Input
                    placeholder="Search lesson plans..."
                    className="pl-10 rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold" style={{color: '#e4a414'}}>8</div>
                <div className="text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Need Revision</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold" style={{color: '#84547c'}}>1</div>
                <div className="text-sm text-gray-600">Under Review</div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Plans List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading lesson plans...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-2"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : filteredLessonPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No lesson plans found.</p>
                <Button 
                  onClick={() => setActiveTab("submit")}
                  className="mt-2"
                >
                  Create Your First Lesson Plan
                </Button>
              </div>
            ) : (
              filteredLessonPlans.map((plan) => (
              <Card key={plan.id} className="border bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{plan.title}</h3>
                        {getStatusBadge(plan.status)}
                          {plan.feedback_status && getFeedbackBadge(plan.feedback_status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4">
                          <span>📚 {plan.subject} • {plan.grade}</span>
                            <span>📅 Due: {formatDate(plan.due_date)}</span>
                            {plan.submit_date && <span>✅ Submitted: {formatDate(plan.submit_date)}</span>}
                        </div>
                          {plan.feedback_comment && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">Feedback from {plan.reviewer_name || 'Administrator'}:</span>
                            </div>
                              <p className="text-sm text-gray-700">{plan.feedback_comment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleViewDetails(plan.id)}>
                        View Details
                      </Button>
                      {plan.status === "pending" && (
                        <Button size="sm" className="rounded-lg">
                          Submit Plan
                        </Button>
                      )}
                        {plan.feedback_status === "needs_revision" && (
                        <Button size="sm" className="rounded-lg">
                          Resubmit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Submit Tab */}
      {activeTab === "submit" && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Lesson Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weekTitle">Week Title *</Label>
                  <Input
                    id="weekTitle"
                    value={weekTitle}
                    onChange={(e) => setWeekTitle(e.target.value)}
                    placeholder="e.g., Week of March 20-24, 2023"
                    className="rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={teacherData?.subject || "Loading..."}
                    disabled
                    className="rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the week's focus..."
                  className="rounded-lg"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessonPlan">Lesson Plan Document *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="lessonPlan"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".doc,.docx,.pdf"
                    required
                  />
                  
                  {!selectedFile ? (
                    <>
                      <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)'}}>
                        <span className="text-2xl" style={{color: '#84547c'}}>📄</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop your lesson plan, or
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-lg" 
                        onClick={() => document.getElementById('lessonPlan')?.click()}
                      >
                        Browse Files
                      </Button>
                      <p className="mt-2 text-xs text-gray-500">
                        Supported formats: .docx, .pdf (Max 10MB)
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl" style={{color: '#84547c'}}>📄</span>
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {Math.round(selectedFile.size / 1024)} KB
                        </p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="rounded-lg"
                  onClick={() => setActiveTab("overview")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-lg"
                  disabled={isSubmitting || !selectedFile || !weekTitle}
                >
                  {isSubmitting ? "Submitting..." : "Submit Lesson Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lesson Plan Details Modal */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Lesson Plan Details</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedPlanDetails(null)}
                className="rounded-full hover:bg-gray-100"
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6">
              {(() => {
                const selectedPlan = getSelectedPlan(selectedPlanDetails);
                if (!selectedPlan) return <div>Plan not found</div>;
                
                return (
                  <div className="space-y-6">
                    {/* Plan Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Plan Information</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Title:</span>
                              <span className="font-medium">{selectedPlan.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subject:</span>
                              <span>{selectedPlan.subject}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Grade:</span>
                              <span>{selectedPlan.grade}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span>{getStatusBadge(selectedPlan.status)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">Submission Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Due Date:</span>
                              <span>{selectedPlan.dueDate}</span>
                            </div>
                            {selectedPlan.submitDate && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Submitted:</span>
                                <span style={{color: '#e4a414'}}>{selectedPlan.submitDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700 mb-2">File Information</h3>
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl" style={{color: '#84547c'}}>📄</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {selectedPlan.document ? 
                                    selectedPlan.document.split('/').pop() || 'Document' :
                                    `Lesson_Plan_${selectedPlan.title.replace(/\s+/g, '_')}.pdf`
                                  }
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {selectedPlan.document_size ? formatFileSize(selectedPlan.document_size) : '0 KB'} • 
                                  {selectedPlan.document_extension ? selectedPlan.document_extension.toUpperCase() : 'PDF'} Document
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Uploaded {selectedPlan.submit_date ? formatDate(selectedPlan.submit_date) : 'Not submitted'}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <Button size="sm" variant="outline" className="rounded-lg w-full">
                                <span className="mr-2">⬇</span>
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feedback Section */}
                    {selectedPlan.feedback_status && selectedPlan.feedback_comment && (
                      <div className="border-t pt-6">
                        <h3 className="font-medium text-gray-700 mb-4">Administrator Feedback</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">Status:</span>
                            {getFeedbackBadge(selectedPlan.feedback_status)}
                            <span className="text-sm text-gray-500">• by {selectedPlan.reviewer_name || 'Administrator'}</span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Comments:</h4>
                            <p className="text-gray-700">{selectedPlan.feedback_comment}</p>
                          </div>
                          
                          {selectedPlan.feedback_status === "needs_revision" && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-orange-600 text-lg">⚠️</span>
                                <span className="font-medium text-orange-800">Action Required</span>
                              </div>
                              <p className="text-orange-700 text-sm">
                                Please review the feedback and resubmit your lesson plan with the requested revisions.
                              </p>
                              <div className="mt-3">
                                <Button size="sm" className="rounded-lg">
                                  Resubmit Lesson Plan
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {selectedPlan.feedback_status === "approved" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 text-lg">✅</span>
                                <span className="font-medium text-green-800">Approved</span>
                              </div>
                              <p className="text-green-700 text-sm mt-1">
                                Your lesson plan has been approved. Keep up the great work!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* No Feedback Yet */}
                    {!selectedPlan.feedback_status && selectedPlan.status === "submitted" && (
                      <div className="border-t pt-6">
                        <div className="rounded-lg p-4 text-center" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)', borderColor: '#84547c'}}>
                          <div className="text-2xl mb-2" style={{color: '#84547c'}}>⏳</div>
                          <h4 className="font-medium mb-1" style={{color: '#84547c'}}>Under Review</h4>
                          <p className="text-sm" style={{color: '#84547c'}}>
                            Your lesson plan is currently being reviewed by an administrator. You'll receive feedback soon.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 