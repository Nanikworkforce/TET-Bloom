"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Mock data for observations
const mockObservations = [
  {
    id: "1",
    observer: "School Leader Johnson",
    date: "Mar 15, 2023",
    time: "10:30 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800",
    lessonPlanSubmitted: false,
    dueDate: "Mar 1, 2023"
  },
  {
    id: "2",
    observer: "Vice School Leader Smith",
    date: "Mar 22, 2023",
    time: "1:15 PM",
    class: "Mathematics 102",
    grade: "7th Grade",
    status: "scheduled",
    statusColor: "bg-blue-100 text-blue-800",
    lessonPlanSubmitted: true,
    dueDate: "Mar 8, 2023"
  },
  {
    id: "3",
    observer: "School Leader Johnson",
    date: "Feb 15, 2023",
    time: "9:30 AM",
    class: "Mathematics 101",
    grade: "7th Grade",
    status: "completed",
    statusColor: "bg-green-100 text-green-800",
    lessonPlanSubmitted: true,
    dueDate: "Feb 1, 2023",
    feedback: {
      status: "pending_approval",
      glows: "Great student engagement strategies. Clear explanations of complex concepts.",
      grows: "Consider more hands-on activities for kinesthetic learners."
    }
  },
  {
    id: "4",
    observer: "Vice School Leader Smith",
    date: "Jan 20, 2023",
    time: "11:00 AM",
    class: "Mathematics 103",
    grade: "7th Grade",
    status: "completed",
    statusColor: "bg-green-100 text-green-800",
    lessonPlanSubmitted: true,
    dueDate: "Jan 6, 2023",
    feedback: {
      status: "approved",
      glows: "Excellent classroom management. Well-structured lesson flow.",
      grows: "Could incorporate more group discussions for collaborative learning."
    }
  }
];

export default function TeacherObservationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedObservation, setSelectedObservation] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState({
    id: "",
    approve: true,
    comments: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [observationId, setObservationId] = useState<string | null>(null);
  
  const upcomingObservations = mockObservations.filter(observation => observation.status === "scheduled");
  const pastObservations = mockObservations.filter(observation => observation.status === "completed");
  
  const handleLessonPlanSubmit = (observationId: string) => {
    // In a real app, this would handle the file upload to the server
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadingFor(null);
      // Would update the observation status in a real app
      alert("Lesson plan submitted successfully!");
    }, 1500);
  };
  
  const handleFeedbackResponse = (observationId: string, approve: boolean) => {
    setFeedback({
      id: observationId,
      approve,
      comments: ""
    });
  };
  
  const submitFeedbackResponse = () => {
    // In a real app, this would send the feedback response to the server
    alert(feedback.approve 
      ? "Feedback approved successfully!" 
      : `Review requested with comments: ${feedback.comments}`);
    
    setFeedback({
      id: "",
      approve: true,
      comments: ""
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Observations</h1>
          <p className="text-gray-600">View and prepare for upcoming observations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "upcoming"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Observations
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "past"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Observations
        </button>
      </div>

      {/* Observations List */}
      <div className="space-y-4">
        {(activeTab === "upcoming" ? upcomingObservations : pastObservations).map((observation) => (
          <Card key={observation.id} className="border bg-white overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{observation.class}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${observation.statusColor}`}>
                      {observation.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mt-3">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[90px]">Observer:</span>
                      <span>{observation.observer}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[90px]">Date & Time:</span>
                      <span>{observation.date}, {observation.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[90px]">Grade:</span>
                      <span>{observation.grade}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[90px]">Lesson Plan:</span>
                      <span>
                        {observation.lessonPlanSubmitted ? (
                          <span className="text-green-600">Submitted</span>
                        ) : (
                          <span className="text-red-500">Due {observation.dueDate}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[130px]">
                  {/* Actions for upcoming observations */}
                  {observation.status === "scheduled" && (
                    <>
                      <Button 
                        variant={observation.lessonPlanSubmitted ? "outline" : "default"} 
                        size="sm" 
                        className="rounded-lg w-full"
                        onClick={() => {
                          setUploadingFor(observation.id);
                          setSelectedObservation(null);
                        }}
                      >
                        {observation.lessonPlanSubmitted ? "Update Lesson Plan" : "Submit Lesson Plan"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg w-full"
                        onClick={() => {
                          setSelectedObservation(observation.id === selectedObservation ? null : observation.id);
                          setUploadingFor(null);
                        }}
                      >
                        {observation.id === selectedObservation ? "Hide Details" : "View Details"}
                      </Button>
                    </>
                  )}
                  
                  {/* Actions for completed observations */}
                  {observation.status === "completed" && (
                    <>
                      {observation.feedback && observation.feedback.status === "pending_approval" && (
                        <Button 
                          size="sm" 
                          className="rounded-lg w-full"
                          onClick={() => {
                            handleFeedbackResponse(observation.id, true);
                          }}
                        >
                          Review Feedback
                        </Button>
                      )}
                      
                      {observation.feedback && observation.feedback.status === "approved" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg w-full"
                          onClick={() => {
                            setSelectedObservation(observation.id === selectedObservation ? null : observation.id);
                          }}
                        >
                          {observation.id === selectedObservation ? "Hide Feedback" : "View Feedback"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Lesson Plan Upload Section */}
              {uploadingFor === observation.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Submit Lesson Plan</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lesson-plan">Lesson Plan (PDF, DOCX)</Label>
                      <Input
                        id="lesson-plan"
                        type="file"
                        accept=".pdf,.docx"
                        className="mt-1 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="supporting-materials">Supporting Materials (Optional)</Label>
                      <Input
                        id="supporting-materials"
                        type="file"
                        accept=".pdf,.docx,.pptx,.xlsx"
                        multiple
                        className="mt-1 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can select multiple files (up to 5)
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadingFor(null)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={isUploading}
                        onClick={() => handleLessonPlanSubmit(observation.id)}
                        className="rounded-lg"
                      >
                        {isUploading ? "Uploading..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Feedback Review Section */}
              {feedback.id === observation.id && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Review Feedback</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-700 mb-1">Strengths (Glows)</div>
                      <div className="text-sm">{observation.feedback?.glows}</div>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <div className="font-medium text-amber-700 mb-1">Areas for Growth</div>
                      <div className="text-sm">{observation.feedback?.grows}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="approve"
                          name="feedback-response"
                          checked={feedback.approve}
                          onChange={() => setFeedback({...feedback, approve: true})}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="approve">I accept this feedback</Label>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id="request-review"
                          name="feedback-response"
                          checked={!feedback.approve}
                          onChange={() => setFeedback({...feedback, approve: false})}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="request-review">I'd like to request a review</Label>
                      </div>
                    </div>
                    
                    {!feedback.approve && (
                      <div>
                        <Label htmlFor="review-comments">Comments or Questions</Label>
                        <textarea
                          id="review-comments"
                          className="w-full mt-1 p-2 border rounded-lg min-h-[100px]"
                          placeholder="Please explain your concerns or questions about the feedback..."
                          value={feedback.comments}
                          onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                        ></textarea>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeedback({id: "", approve: true, comments: ""})}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={!feedback.approve && !feedback.comments}
                        onClick={submitFeedbackResponse}
                        className="rounded-lg"
                      >
                        {feedback.approve ? "Submit Approval" : "Request Review"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Observation Details Section */}
              {selectedObservation === observation.id && observation.status === "scheduled" && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Observation Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-600">Preparation Checklist</h5>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${observation.lessonPlanSubmitted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                            {observation.lessonPlanSubmitted ? '✓' : '!'}
                          </span>
                          <span>Submit lesson plan by {observation.dueDate}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs bg-gray-100 text-gray-400">!</span>
                          <span>Prepare supporting materials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs bg-gray-100 text-gray-400">!</span>
                          <span>Review observation criteria</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-600">Observation Focus</h5>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                        <li>Lesson execution and student engagement</li>
                        <li>Implementation of instructional strategies</li>
                        <li>Use of engagement strategies</li>
                        <li>Support for all learners</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Past Observation Feedback Section */}
              {selectedObservation === observation.id && observation.status === "completed" && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Observation Feedback</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-medium text-green-700 mb-1">Strengths (Glows)</div>
                      <div className="text-sm">{observation.feedback?.glows}</div>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <div className="font-medium text-amber-700 mb-1">Areas for Growth</div>
                      <div className="text-sm">{observation.feedback?.grows}</div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div>
                        Status: <span className="font-medium text-blue-600">{observation.feedback?.status === "approved" ? "Approved by You" : "Pending Your Approval"}</span>
                      </div>
                      
                      {observation.feedback?.status === "pending_approval" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-lg"
                          onClick={() => {
                            handleFeedbackResponse(observation.id, true);
                          }}
                        >
                          Review Feedback
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Empty State */}
      {((activeTab === "upcoming" && upcomingObservations.length === 0) ||
        (activeTab === "past" && pastObservations.length === 0)) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            No {activeTab === "upcoming" ? "upcoming" : "past"} observations
          </h3>
          <p className="text-gray-600">
            {activeTab === "upcoming"
              ? "You don't have any scheduled observations at this time."
              : "You don't have any completed observations yet."}
          </p>
        </div>
      )}
    </div>
  );
} 