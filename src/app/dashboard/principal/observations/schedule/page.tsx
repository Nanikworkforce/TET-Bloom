"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

// Form data interface
interface FormData {
  selectedTeacher: string;
  subject: string;
  grade: string;
  moduleUnit: string;
  lessonNumber: string;
  contentArea: string;
  lessonTopic: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  notes: string;
  notifyTeacher: boolean;
  addReminder: boolean;
  requestLessonPlan: boolean;
}

// Error interface
interface FormErrors {
  selectedTeacher?: string;
  subject?: string;
  grade?: string;
  contentArea?: string;
  date?: string;
  time?: string;
  location?: string;
  [key: string]: string | undefined;
}

export default function ScheduleObservationPage() {
  const router = useRouter();
  
  // Mock data for teachers and subjects
  const teachers = [
    { id: "1", name: "Sarah Johnson", subject: "Mathematics", grade: "5th Grade" },
    { id: "2", name: "Michael Chen", subject: "Science", grade: "7th Grade" },
    { id: "3", name: "Emily Rodriguez", subject: "English Literature", grade: "10th Grade" },
    { id: "4", name: "David Wilson", subject: "History", grade: "9th Grade" },
    { id: "5", name: "Jessica Martinez", subject: "Art", grade: "Multiple" },
  ];
  
  // Get the edit ID from the URL if present
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  // Mock data for an existing observation (for edit mode)
  const existingObservation = editId ? {
    id: "1",
    teacherId: "1",
    subject: "Mathematics",
    grade: "5th Grade",
    moduleUnit: "Unit 3",
    lessonNumber: "Lesson 5",
    contentArea: "Math",
    lessonTopic: "Introduction to Fractions",
    date: "2023-03-15",
    time: "10:30",
    duration: "60",
    location: "Room 203",
    notes: "Please have the student workbooks ready.",
    notifyTeacher: true,
    addReminder: true,
    requestLessonPlan: true
  } : null;
  
  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    selectedTeacher: existingObservation?.teacherId || "",
    subject: existingObservation?.subject || "",
    grade: existingObservation?.grade || "",
    moduleUnit: existingObservation?.moduleUnit || "",
    lessonNumber: existingObservation?.lessonNumber || "",
    contentArea: existingObservation?.contentArea || "",
    lessonTopic: existingObservation?.lessonTopic || "",
    date: existingObservation?.date || "",
    time: existingObservation?.time || "",
    duration: existingObservation?.duration || "60",
    location: existingObservation?.location || "",
    notes: existingObservation?.notes || "",
    notifyTeacher: existingObservation?.notifyTeacher !== false,
    addReminder: existingObservation?.addReminder !== false,
    requestLessonPlan: existingObservation?.requestLessonPlan !== false
  });
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.selectedTeacher) newErrors.selectedTeacher = "Please select a teacher";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.grade) newErrors.grade = "Grade level is required";
    if (!formData.contentArea) newErrors.contentArea = "Content area is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };
  
  // Handle confirm submission
  const handleConfirmSubmit = () => {
    // Here we would normally submit to a backend
    // For now, just show success message and redirect
    setShowConfirmation(false);
    setShowSuccess(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/dashboard/school-leader/observations');
    }, 2000);
  };
  
  const subjects = ["Mathematics", "Science", "English Literature", "History", "Art", "Physical Education"];
  const grades = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", 
                 "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"];

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {editId ? 'Observation Updated!' : 'Observation Scheduled!'}
              </h3>
              <p className="text-gray-600 mb-4">
                {editId 
                  ? 'The observation has been successfully updated.' 
                  : 'The observation has been successfully scheduled.'}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to observations page...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm {editId ? 'Update' : 'Schedule'}
            </h3>
            <p className="text-gray-600 mb-6">
              {editId 
                ? 'Are you sure you want to update this observation?' 
                : 'Are you sure you want to schedule this observation?'}
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-full"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full shadow-sm bg-primary/90 hover:bg-primary"
                onClick={handleConfirmSubmit}
              >
                {editId ? 'Update Observation' : 'Schedule Observation'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{editId ? 'Reschedule Observation' : 'Schedule Observation'}</h1>
          <p className="text-gray-600">{editId ? 'Update an existing observation' : 'Plan a new teacher observation session'}</p>
        </div>
        <div>
          <Link href="/dashboard/school-leader/observations">
            <Button variant="outline" className="rounded-full">
              Cancel
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 bg-white border shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Teacher Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Select Teacher</h2>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  🔍
                </span>
                <Input
                  placeholder="Search for teachers by name or subject..."
                  className="pl-10 rounded-full"
                />
              </div>
              
              <div className="grid gap-3 mt-4">
                {teachers.map((teacher) => (
                  <label key={teacher.id} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${errors.selectedTeacher ? 'border-red-300' : ''}`}>
                    <input
                      type="radio"
                      name="selectedTeacher"
                      value={teacher.id}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      checked={formData.selectedTeacher === teacher.id}
                      onChange={handleInputChange}
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{teacher.name}</p>
                      <p className="text-sm text-gray-600">{teacher.subject} • {teacher.grade}</p>
                    </div>
                  </label>
                ))}
                {errors.selectedTeacher && (
                  <p className="text-sm text-red-500 mt-1">{errors.selectedTeacher}</p>
                )}
              </div>
            </div>
          </div>

          {/* Observation Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">2. Observation Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="subject">
                  Subject
                </label>
                <select 
                  id="subject" 
                  name="subject"
                  className={`w-full px-3 py-2 border rounded-md ${errors.subject ? 'border-red-300' : ''}`}
                  value={formData.subject}
                  onChange={handleInputChange}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="grade">
                  Grade Level
                </label>
                <select 
                  id="grade" 
                  name="grade"
                  className={`w-full px-3 py-2 border rounded-md ${errors.grade ? 'border-red-300' : ''}`}
                  value={formData.grade}
                  onChange={handleInputChange}
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="text-sm text-red-500 mt-1">{errors.grade}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="moduleUnit">
                  Module/Unit Number
                </label>
                <Input
                  id="moduleUnit"
                  name="moduleUnit"
                  placeholder="e.g., Unit 3"
                  value={formData.moduleUnit}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="lessonNumber">
                  Lesson Number
                </label>
                <Input
                  id="lessonNumber"
                  name="lessonNumber"
                  placeholder="e.g., Lesson 4"
                  value={formData.lessonNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="contentArea">
                  Content Area
                </label>
                                <div className={`flex gap-4 ${errors.contentArea ? 'border border-red-300 p-2 rounded-md' : ''}`}>
                  <label className="inline-flex items-center">
                                          <input
                      type="radio"
                      name="contentArea"
                      value="ELAR"
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      checked={formData.contentArea === "ELAR"}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2">ELAR</span>
                  </label>
                  <label className="inline-flex items-center">
                                          <input
                      type="radio"
                      name="contentArea"
                      value="Math"
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      checked={formData.contentArea === "Math"}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2">Math</span>
                  </label>
                </div>
                {errors.contentArea && (
                  <p className="text-sm text-red-500 mt-1">{errors.contentArea}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="lessonTopic">
                  Lesson Topic/Title
                </label>
                <Input
                  id="lessonTopic"
                  name="lessonTopic"
                  placeholder="e.g., Introduction to Fractions"
                  value={formData.lessonTopic}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">3. Schedule</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`w-full px-3 py-2 border rounded-md ${errors.date ? 'border-red-300' : ''}`}
                  value={formData.date}
                  onChange={handleInputChange}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="time">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className={`w-full px-3 py-2 border rounded-md ${errors.time ? 'border-red-300' : ''}`}
                  value={formData.time}
                  onChange={handleInputChange}
                />
                {errors.time && (
                  <p className="text-sm text-red-500 mt-1">{errors.time}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="duration">
                  Duration
                </label>
                <select 
                  id="duration" 
                  name="duration"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.duration}
                  onChange={handleInputChange}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="location">
                  Classroom/Location
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Room 203"
                  className={errors.location ? 'border-red-300' : ''}
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">4. Additional Notes</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="notes">
                Notes for Teacher (Optional)
              </label>
                              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-3 py-2 border rounded-md resize-none"
                placeholder="Add any specific notes or requests for the teacher..."
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* Notification */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">5. Notification Preferences</h2>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notifyTeacher"
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={formData.notifyTeacher}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-sm text-gray-700">Send email notification to teacher</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="addReminder"
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={formData.addReminder}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Add reminder to my calendar (1 day before)
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requestLessonPlan"
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={formData.requestLessonPlan}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Request lesson plan submission (2 weeks before observation)
                </span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link href="/dashboard/school-leader/observations">
              <Button variant="outline" className="w-full sm:w-auto rounded-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-full shadow-sm bg-primary/90 hover:bg-primary"
            >
              {editId ? 'Update Observation' : 'Schedule Observation'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 