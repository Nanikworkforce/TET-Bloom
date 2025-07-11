"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Mock observation feedback data
const feedbackData = {
  id: "1",
  observationDate: "Feb 24, 2023",
  observer: "Administrator Johnson",
  subject: "Mathematics",
  grade: "7th Grade",
  status: "Feedback Provided",
  
  // Feedback content
  glows: [
    "Excellent use of questioning techniques to engage all students",
    "Clear and concise explanations of complex mathematical concepts",
    "Effective integration of technology to enhance student understanding"
  ],
  grows: [
    "Consider incorporating more opportunities for group work and peer collaboration",
    "Allocate time for students to reflect on their learning and self-assess"
  ],
  
  // Action plan
  actionStepCategory: "Lesson Pacing",
  actionStep: "Adjust pacing to match curriculum guide",
  
  // Response status
  teacherResponse: null, // null, "approved", "review_requested"
  teacherResponseDate: null,
  teacherComments: null,
  
  // Observation ratings (simplified)
  ratings: {
    lessonPreparation: "Excellent",
    instructionalDelivery: "Good",
    studentEngagement: "Excellent",
    classroomManagement: "Good",
    assessmentStrategies: "Good"
  }
};

export default function FeedbackDetailPage() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const feedbackId = params.id as string;
  
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [comments, setComments] = useState("");
  const [digitalSignature, setDigitalSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherResponse, setTeacherResponse] = useState<string | null>(feedbackData.teacherResponse);
  const [teacherComments, setTeacherComments] = useState<string | null>(feedbackData.teacherComments);
  
  const handleApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!digitalSignature) {
      alert("Please provide your digital signature");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setTeacherResponse("approved");
      setShowApprovalForm(false);
    }, 1000);
  };
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments) {
      alert("Please provide comments for your review request");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setTeacherResponse("review_requested");
      setTeacherComments(comments);
      setShowReviewForm(false);
    }, 1000);
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
            <p className="mt-1 font-medium">{feedbackData.observationDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Observer</h3>
            <p className="mt-1 font-medium">{feedbackData.observer}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Subject & Grade</h3>
            <p className="mt-1 font-medium">{feedbackData.subject}, {feedbackData.grade}</p>
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
              {feedbackData.glows.map((glow, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{glow}</span>
                </li>
              ))}
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
              {feedbackData.grows.map((grow, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>{grow}</span>
                </li>
              ))}
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
            {Object.entries(feedbackData.ratings).map(([category, rating]) => (
              <div key={category} className="p-4 rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h3>
                <div className="flex items-center mt-1">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    rating === "Excellent" 
                      ? "bg-green-500" 
                      : rating === "Good" 
                        ? "bg-blue-500" 
                        : rating === "Satisfactory" 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                  }`}></div>
                  <p className="font-medium">{rating}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Action Plan */}
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Action Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="mt-1 font-medium">{feedbackData.actionStepCategory}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recommended Action</h3>
            <p className="mt-1 font-medium">{feedbackData.actionStep}</p>
          </div>
        </CardContent>
      </Card>
      
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
                    <p className="text-green-700 mt-1">You've accepted this feedback on {new Date().toLocaleDateString()}.</p>
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
                    <p className="text-yellow-700 mt-1">You've requested a review on {new Date().toLocaleDateString()}.</p>
                    <div className="bg-white p-3 rounded mt-2 text-gray-700">
                      {teacherComments}
                    </div>
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