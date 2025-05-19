"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock feedback data
const feedbackData = {
  id: "1",
  observationDate: "Feb 24, 2023",
  teacher: {
    id: "t1",
    name: "Sarah Chen",
    subject: "Mathematics",
    grade: "7th Grade",
    email: "schen@school.edu"
  },
  status: "review_requested", // "pending", "approved", "review_requested", "revised"
  responseDate: "Mar 1, 2023",
  responseComments: "I appreciate the feedback on my questioning techniques. However, I would like to discuss the action step regarding pacing. I believe the pacing was appropriate for the complexity of the content and the students\' prior knowledge. Could we discuss specific moments where the pacing could be improved?",
  
  // Original feedback
  glows: [
    "Excellent use of questioning techniques to engage all students",
    "Clear and concise explanations of complex mathematical concepts",
    "Effective integration of technology to enhance student understanding"
  ],
  grows: [
    "Consider incorporating more opportunities for group work and peer collaboration",
    "Allocate time for students to reflect on their learning and self-assess"
  ],
  actionStepCategory: "Lesson Pacing",
  actionStep: "Adjust pacing to match curriculum guide",
  
  // Additional information
  lessonObjectives: "Students will be able to solve multi-step equations involving rational numbers and explain their solution process.",
  observationNotes: "Ms. Chen demonstrated strong content knowledge and classroom management skills. The lesson was well-structured but moved quickly through some complex concepts."
};

export default function SchoolLeaderFeedbackDetailPage() {
  const params = useParams();
  const feedbackId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [revisedGlows, setRevisedGlows] = useState(feedbackData.glows);
  const [revisedGrows, setRevisedGrows] = useState(feedbackData.grows);
  const [revisedActionStep, setRevisedActionStep] = useState(feedbackData.actionStep);
  const [revisedActionCategory, setRevisedActionCategory] = useState(feedbackData.actionStepCategory);
  const [responseToTeacher, setResponseToTeacher] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showRevisedSuccess, setShowRevisedSuccess] = useState(false);
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);
  
  // Function to add a new glow
  const addGlow = () => {
    setRevisedGlows([...revisedGlows, ""]);
  };
  
  // Function to update a glow
  const updateGlow = (index: number, value: string) => {
    const newGlows = [...revisedGlows];
    newGlows[index] = value;
    setRevisedGlows(newGlows);
  };
  
  // Function to remove a glow
  const removeGlow = (index: number) => {
    setRevisedGlows(revisedGlows.filter((_, i) => i !== index));
  };
  
  // Function to add a new grow
  const addGrow = () => {
    setRevisedGrows([...revisedGrows, ""]);
  };
  
  // Function to update a grow
  const updateGrow = (index: number, value: string) => {
    const newGrows = [...revisedGrows];
    newGrows[index] = value;
    setRevisedGrows(newGrows);
  };
  
  // Function to remove a grow
  const removeGrow = (index: number) => {
    setRevisedGrows(revisedGrows.filter((_, i) => i !== index));
  };
  
  // Function to handle save revisions
  const handleSaveRevisions = () => {
    setIsSaving(true);
    
    // Validate fields
    if (revisedGlows.some(glow => !glow.trim()) || revisedGrows.some(grow => !grow.trim())) {
      alert("Please fill in all feedback fields");
      setIsSaving(false);
      return;
    }
    
    if (!revisedActionStep || !revisedActionCategory) {
      alert("Please select an action step and category");
      setIsSaving(false);
      return;
    }
    
    if (!responseToTeacher.trim()) {
      alert("Please provide a response to the teacher");
      setIsSaving(false);
      return;
    }
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowRevisedSuccess(true);
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setShowRevisedSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  // Function to handle schedule meeting
  const handleScheduleMeeting = () => {
    setIsSaving(true);
    
    // Simulate scheduling
    setTimeout(() => {
      setIsSaving(false);
      setShowScheduleSuccess(true);
      
      // Hide success message after a few seconds
      setTimeout(() => {
        setShowScheduleSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (feedbackData.status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'review_requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'revised':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch (feedbackData.status) {
      case 'approved':
        return 'Approved by Teacher';
      case 'review_requested':
        return 'Review Requested';
      case 'revised':
        return 'Feedback Revised';
      default:
        return 'Pending Response';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Observation Feedback</h1>
          <p className="text-gray-600">
            {isEditing ? "Revise feedback based on teacher's request" : `Feedback for ${feedbackData.teacher.name}`}
          </p>
        </div>
        <Link href="/school-leader/feedback">
          <Button variant="outline" className="rounded-full shadow-sm">
            ← Back to Feedback
          </Button>
        </Link>
      </div>
      
      {/* Success Messages */}
      {showRevisedSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <span className="mr-2 text-xl">✓</span>
          <span>Your revised feedback has been sent to the teacher.</span>
        </div>
      )}
      
      {showScheduleSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <span className="mr-2 text-xl">✓</span>
          <span>A meeting request has been sent to the teacher.</span>
        </div>
      )}
      
      {/* Teacher Information */}
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 font-medium">{feedbackData.teacher.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Subject</h3>
            <p className="mt-1 font-medium">{feedbackData.teacher.subject}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Grade</h3>
            <p className="mt-1 font-medium">{feedbackData.teacher.grade}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Observation Date</h3>
            <p className="mt-1 font-medium">{feedbackData.observationDate}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
                {getStatusText()}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Response Date</h3>
            <p className="mt-1 font-medium">{feedbackData.responseDate || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Teacher's Response */}
      {feedbackData.status === "review_requested" && (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Teacher's Review Request</CardTitle>
            <CardDescription>
              {feedbackData.teacher.name} has requested a review of your feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-gray-700">{feedbackData.responseComments}</p>
            </div>
            
            {!isEditing && (
              <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
                <Button 
                  className="rounded-full"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="mr-2">✏️</span> Revise Feedback
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={handleScheduleMeeting}
                  disabled={isSaving}
                >
                  <span className="mr-2">📅</span> Schedule Discussion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Original Feedback or Edit Form */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Glows */}
          <Card className="border bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span>Glows</span>
              </CardTitle>
              <CardDescription>Strengths observed during the lesson</CardDescription>
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
      ) : (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Revise Feedback</CardTitle>
            <CardDescription>
              Make revisions to your feedback based on the teacher's request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Glows Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Glows (Strengths)</h3>
              {revisedGlows.map((glow, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <textarea
                    value={glow}
                    onChange={(e) => updateGlow(index, e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Enter a strength observed during the lesson"
                    rows={2}
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-red-500 hover:text-red-700"
                    onClick={() => removeGlow(index)}
                    disabled={revisedGlows.length <= 1}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button 
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={addGlow}
              >
                <span className="mr-2">+</span> Add Glow
              </Button>
            </div>
            
            {/* Grows Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Grows (Areas for Improvement)</h3>
              {revisedGrows.map((grow, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <textarea
                    value={grow}
                    onChange={(e) => updateGrow(index, e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Enter an area for improvement"
                    rows={2}
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-red-500 hover:text-red-700"
                    onClick={() => removeGrow(index)}
                    disabled={revisedGrows.length <= 1}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button 
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={addGrow}
              >
                <span className="mr-2">+</span> Add Grow
              </Button>
            </div>
            
            {/* Action Plan Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Action Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actionCategory">Action Step Category</Label>
                  <select
                    id="actionCategory"
                    value={revisedActionCategory}
                    onChange={(e) => setRevisedActionCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Internalization">Internalization</option>
                    <option value="Year-Long Pacing">Year-Long Pacing</option>
                    <option value="Lesson Pacing">Lesson Pacing</option>
                    <option value="Student Engagement">Student Engagement</option>
                    <option value="Instructional Methods">Instructional Methods</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="actionStep">Action Step</Label>
                  <select
                    id="actionStep"
                    value={revisedActionStep}
                    onChange={(e) => setRevisedActionStep(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select an action step</option>
                    <option value="Review lesson materials before teaching">Review lesson materials before teaching</option>
                    <option value="Add annotations to lesson plans">Add annotations to lesson plans</option>
                    <option value="Practice delivering key instructions">Practice delivering key instructions</option>
                    <option value="Adjust pacing to match curriculum guide">Adjust pacing to match curriculum guide</option>
                    <option value="Incorporate more student-led discussions">Incorporate more student-led discussions</option>
                    <option value="Implement exit tickets for assessment">Implement exit tickets for assessment</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Response to Teacher */}
            <div className="space-y-2">
              <Label htmlFor="responseToTeacher">Response to Teacher's Comments</Label>
              <textarea
                id="responseToTeacher"
                value={responseToTeacher}
                onChange={(e) => setResponseToTeacher(e.target.value)}
                placeholder="Provide a response to the teacher's review request..."
                className="w-full p-2 border rounded-lg min-h-[120px]"
                required
              />
              <p className="text-xs text-gray-500">
                Explain the changes you've made, or address specific concerns mentioned in their review request.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-full"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="rounded-full"
                onClick={handleSaveRevisions}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Revisions"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Action Plan and Notes (when not editing) */}
      {!isEditing && (
        <>
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
          
          <Card className="border bg-white">
            <CardHeader>
              <CardTitle>Observation Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Lesson Objectives</h3>
                <p className="mt-1">{feedbackData.lessonObjectives}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Observation Notes</h3>
                <p className="mt-1">{feedbackData.observationNotes}</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 