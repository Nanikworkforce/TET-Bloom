"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data for lesson plans submissions
const mockLessonPlans = [
  {
    id: "1",
    teacher: "Ms. Sarah Johnson",
    title: "Week of March 20-24, 2023",
    subject: "Mathematics",
    grade: "7th Grade",
    submitDate: "2023-03-17",
    dueDate: "2023-03-20",
    status: "pending_review",
    description: "Focus on algebraic expressions and solving one-step equations",
    fileName: "Math_Week_March20_Johnson.pdf",
    fileSize: "2.3 MB"
  },
  {
    id: "2",
    teacher: "Mr. David Wilson",
    title: "Week of March 20-24, 2023",
    subject: "History",
    grade: "9th Grade",
    submitDate: "2023-03-18",
    dueDate: "2023-03-20",
    status: "pending_review",
    description: "American Civil War: Causes and major battles",
    fileName: "History_Week_March20_Wilson.pdf",
    fileSize: "1.8 MB"
  },
  {
    id: "3",
    teacher: "Ms. Emily Rodriguez",
    title: "Week of March 13-17, 2023",
    subject: "English Literature",
    grade: "10th Grade",
    submitDate: "2023-03-10",
    dueDate: "2023-03-13",
    status: "reviewed",
    description: "Poetry analysis: Themes and literary devices",
    fileName: "English_Week_March13_Rodriguez.pdf",
    fileSize: "2.1 MB",
    feedback: {
      status: "approved",
      comment: "Excellent detailed lesson plan with clear learning objectives and assessment rubrics.",
      reviewDate: "2023-03-12"
    }
  },
  {
    id: "4", 
    teacher: "Mr. Michael Chen",
    title: "Week of March 13-17, 2023",
    subject: "Science",
    grade: "8th Grade",
    submitDate: "2023-03-09",
    dueDate: "2023-03-13",
    status: "reviewed",
    description: "Chemical reactions and the periodic table",
    fileName: "Science_Week_March13_Chen.pdf",
    fileSize: "2.7 MB",
    feedback: {
      status: "needs_revision",
      comment: "Please add more specific assessment criteria for the lab activities. Also, consider including safety protocols more explicitly.",
      reviewDate: "2023-03-11"
    }
  }
];

export default function AdministratorLessonPlansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    status: "approved",
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = (planId: string) => {
    if (!reviewForm.comment.trim()) {
      alert("Please provide a comment");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate review submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Feedback submitted successfully!`);
      setSelectedPlan(null);
      setReviewForm({ status: "approved", comment: "" });
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "reviewed":
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getFeedbackBadge = (feedbackStatus: string | undefined) => {
    switch (feedbackStatus) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "needs_revision":
        return <Badge className="bg-orange-100 text-orange-800">Needs Revision</Badge>;
      default:
        return null;
    }
  };

  const filteredPlans = mockLessonPlans.filter(plan => {
    const matchesSearch = 
      plan.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || plan.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockLessonPlans.filter(p => p.status === "pending_review").length;
  const reviewedCount = mockLessonPlans.filter(p => p.status === "reviewed").length;
  const approvedCount = mockLessonPlans.filter(p => p.feedback?.status === "approved").length;
  const needsRevisionCount = mockLessonPlans.filter(p => p.feedback?.status === "needs_revision").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lesson Plans Management</h1>
          <p className="text-gray-600">Review and provide feedback on teacher lesson plans</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{needsRevisionCount}</div>
            <div className="text-sm text-gray-600">Need Revision</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{reviewedCount}</div>
            <div className="text-sm text-gray-600">Total Reviewed</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <Input
                placeholder="Search by teacher, title, or subject..."
                className="pl-10 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending_review">Pending Review</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lesson Plans List */}
      <div className="space-y-4">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="border bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{plan.title}</h3>
                      {getStatusBadge(plan.status)}
                      {plan.feedback && getFeedbackBadge(plan.feedback.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span>👨‍🏫 {plan.teacher}</span>
                        <span>📚 {plan.subject} • {plan.grade}</span>
                        <span>📅 Due: {plan.dueDate}</span>
                        <span>✅ Submitted: {plan.submitDate}</span>
                      </div>
                      <p className="text-gray-700 mt-2">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <Button size="sm" variant="outline" className="rounded-lg">
                      <span className="mr-2">📄</span>
                      Download ({plan.fileSize})
                    </Button>
                    {plan.status === "pending_review" && (
                      <Button 
                        size="sm" 
                        className="rounded-lg"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        Provide Feedback
                      </Button>
                    )}
                    {plan.status === "reviewed" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-lg"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        View Feedback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Existing Feedback Display */}
                {plan.feedback && selectedPlan !== plan.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">Your Feedback ({plan.feedback.reviewDate}):</span>
                      {getFeedbackBadge(plan.feedback.status)}
                    </div>
                    <p className="text-sm text-gray-700">{plan.feedback.comment}</p>
                  </div>
                )}

                {/* Review Form */}
                {selectedPlan === plan.id && (
                  <div className="mt-4 p-4 border-t">
                    <h4 className="font-medium mb-4">
                      {plan.status === "reviewed" ? "View/Edit Feedback" : "Provide Feedback"}
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Review Status</Label>
                        <select
                          id="status"
                          value={reviewForm.status}
                          onChange={(e) => setReviewForm({...reviewForm, status: e.target.value})}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="approved">Approved</option>
                          <option value="needs_revision">Needs Revision</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="comment">Feedback Comment</Label>
                        <Textarea
                          id="comment"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                          placeholder={reviewForm.status === "approved" 
                            ? "Provide positive feedback and any suggestions for continued improvement..."
                            : "Explain what needs to be revised and provide specific guidance..."
                          }
                          className="rounded-lg min-h-[100px]"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="rounded-lg"
                          onClick={() => {
                            setSelectedPlan(null);
                            setReviewForm({ status: "approved", comment: "" });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="rounded-lg"
                          onClick={() => handleReviewSubmit(plan.id)}
                          disabled={isSubmitting || !reviewForm.comment.trim()}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No lesson plans found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No lesson plans have been submitted yet."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 