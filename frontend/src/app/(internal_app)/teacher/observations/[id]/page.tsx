"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Mock observation data
const observationData = {
  id: "1",
  observer: "Administrator Johnson",
  subject: "Mathematics",
  grade: "7th Grade",
  scheduledDate: "Mar 15, 2023",
  scheduledTime: "10:30 AM",
  status: "scheduled",
  lessonPlanDueDate: "Mar 1, 2023", // Two weeks before observation
  lessonPlanSubmitted: false,
  lessonPlanSubmittedDate: null,
  supportingDocuments: []
};

export default function ObservationDetailPage() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const observationId = params.id as string;
  
  const [files, setFiles] = useState<File[]>([]);
  const [lessonPlanFile, setLessonPlanFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // For demo purposes
  const [mockSubmittedLessonPlan, setMockSubmittedLessonPlan] = useState(observationData.lessonPlanSubmitted);
  const [mockSupportingDocs, setMockSupportingDocs] = useState<{name: string, size: string, date: string}[]>(
    observationData.supportingDocuments as {name: string, size: string, date: string}[]
  );
  
  const handleLessonPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLessonPlanFile(e.target.files[0]);
    }
  };
  
  const handleSupportingFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonPlanFile) {
      alert("Please upload a lesson plan file");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setMockSubmittedLessonPlan(true);
      
      // Add mock supporting docs
      const newDocs = [
        ...mockSupportingDocs,
        ...files.map(file => ({
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          date: new Date().toLocaleDateString()
        }))
      ];
      setMockSupportingDocs(newDocs);
      
      // Clear form
      setLessonPlanFile(null);
      setFiles([]);
      setNotes("");
    }, 1500);
  };
  
  const isPastDueDate = new Date(observationData.lessonPlanDueDate) < new Date();
  const isLessonPlanSubmitted = mockSubmittedLessonPlan;
  
  // Function to determine badge color based on due date
  const getDueDateClass = () => {
    const dueDate = new Date(observationData.lessonPlanDueDate);
    const today = new Date();
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (isLessonPlanSubmitted) return "bg-green-100 text-green-800";
    if (diffDays < 0) return "bg-red-100 text-red-800";
    if (diffDays <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };
  
  const getDueDateText = () => {
    if (isLessonPlanSubmitted) return "Submitted";
    if (isPastDueDate) return "Past Due";
    return `Due ${observationData.lessonPlanDueDate}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Observation Details</h1>
          <p className="text-gray-600">Prepare for your upcoming observation</p>
        </div>
        <Link href="/teacher/observations">
          <Button variant="outline" className="rounded-full shadow-sm">
            ← Back to Observations
          </Button>
        </Link>
      </div>
      
      {/* Observation Details Card */}
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Scheduled Observation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Observer</h3>
            <p className="mt-1 font-medium">{observationData.observer}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Subject & Grade</h3>
            <p className="mt-1 font-medium">{observationData.subject}, {observationData.grade}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="mt-1 font-medium">{observationData.scheduledDate}, {observationData.scheduledTime}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {observationData.status}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lesson Plan</h3>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDueDateClass()}`}>
                {getDueDateText()}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Submission Form or Submitted Content */}
      {!isLessonPlanSubmitted ? (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Submit Lesson Plan & Materials</CardTitle>
            {isPastDueDate && (
              <div className="text-sm text-red-600 mt-1">
                The due date has passed. Please submit your materials as soon as possible.
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lessonPlan" className="text-base">Lesson Plan Document <span className="text-red-500">*</span></Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="lessonPlan"
                    onChange={handleLessonPlanChange}
                    className="hidden"
                    accept=".doc,.docx,.pdf"
                  />
                  
                  {!lessonPlanFile ? (
                    <>
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <span className="text-primary text-2xl">📄</span>
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
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <span className="text-green-600 text-2xl">✓</span>
                      </div>
                      <p className="font-medium">{lessonPlanFile.name}</p>
                      <p className="text-sm text-gray-500">{Math.round(lessonPlanFile.size / 1024)} KB</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 rounded-full"
                        onClick={() => setLessonPlanFile(null)}
                      >
                        Change File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportingFiles" className="text-base">Supporting Materials (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="supportingFiles"
                    onChange={handleSupportingFilesChange}
                    className="hidden"
                    multiple
                    accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  
                  {files.length === 0 ? (
                    <>
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <span className="text-primary text-2xl">📁</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Upload additional supporting materials
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-lg" 
                        onClick={() => document.getElementById('supportingFiles')?.click()}
                      >
                        Select Files
                      </Button>
                      <p className="mt-2 text-xs text-gray-500">
                        Supported formats: .docx, .pdf, .pptx, .xlsx, .jpg, .png (Max 50MB total)
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <span className="text-green-600 text-xl">{files.length}</span>
                      </div>
                      <p className="font-medium">{files.length} files selected</p>
                      <div className="max-h-40 overflow-y-auto border rounded-lg divide-y bg-gray-50">
                        {files.map((file, index) => (
                          <div key={index} className="px-3 py-2 text-left text-sm flex justify-between items-center">
                            <div className="truncate max-w-xs">{file.name}</div>
                            <div className="text-gray-500 text-xs">{Math.round(file.size / 1024)} KB</div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => setFiles([])}
                      >
                        Clear Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes for Observer (Optional)</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border rounded-lg min-h-[100px]"
                  placeholder="Add any context or notes for your observer about the lesson plan..."
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="rounded-lg" 
                  disabled={isSubmitting || !lessonPlanFile}
                >
                  {isSubmitting ? "Submitting..." : "Submit Materials"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border bg-white">
          <CardHeader>
            <CardTitle>Submitted Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center mb-4">
                <span className="mr-2 text-xl">✓</span>
                <span>Your materials have been submitted successfully!</span>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-3">Lesson Plan</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center p-3 bg-gray-50 border-b">
                  <div className="text-primary mr-3">📄</div>
                  <div className="flex-1">
                    <div className="font-medium">Lesson_Plan_Math_Grade7.pdf</div>
                    <div className="text-xs text-gray-500">Submitted on March 1, 2023</div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    Download
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Supporting Materials</h3>
              {mockSupportingDocs.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  {mockSupportingDocs.map((doc, index) => (
                    <div key={index} className="flex items-center p-3 bg-white border-b last:border-0">
                      <div className="text-primary mr-3">📄</div>
                      <div className="flex-1">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-gray-500">
                          {doc.size} • Submitted on {doc.date}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg border-dashed">
                  <p className="text-gray-500">No supporting materials submitted</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                className="rounded-lg" 
                onClick={() => {
                  setMockSubmittedLessonPlan(false);
                  setShowSuccess(false);
                }}
              >
                Update Materials
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Observer Notes */}
      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>Preparation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              To prepare for this observation, please ensure:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
              <li>Your lesson plan aligns with the curriculum and standards</li>
              <li>You have all necessary materials prepared for the lesson</li>
              <li>Your lesson objectives are clearly defined</li>
              <li>You have planned for different learning styles and abilities</li>
              <li>Assessment strategies are incorporated into your lesson</li>
            </ul>
            <p className="text-gray-700 mt-4">
              If you have any questions about this observation, please contact {observationData.observer} directly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 