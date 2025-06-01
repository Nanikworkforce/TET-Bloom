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

export default function ScheduleObservationForm() { // Renamed component
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
      router.push('/administrator/observations'); // This path might need to be updated if your routes are different
    }, 2000);
  };
  
  const subjects = ["Mathematics", "Science", "English Literature", "History", "Art", "Physical Education"];
  const grades = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", 
                 "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"];

  // The rest of the JSX remains the same as in the original page.tsx file
  // For brevity, it's omitted here but should be copied over.
  // ... (Full JSX from ScheduleObservationPage)

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
          <Link href="/administrator/observations">
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
                  &#128270; {/* Magnifying glass icon */}
                </span>
                <Input
                  placeholder="Search for teachers by name or subject..."
                  className="pl-10 rounded-full"
                  // Add search functionality if needed
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                  <label 
                    key={teacher.id} 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 
                                ${formData.selectedTeacher === teacher.id ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    <Input
                      type="radio"
                      name="selectedTeacher"
                      value={teacher.id}
                      checked={formData.selectedTeacher === teacher.id}
                      onChange={handleInputChange}
                      className="sr-only" // Hide the actual radio button
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{teacher.name}</h3>
                      <p className="text-sm text-gray-500">{teacher.subject} - {teacher.grade}</p>
                    </div>
                    {formData.selectedTeacher === teacher.id && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ml-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {errors.selectedTeacher && <p className="text-sm text-red-600">{errors.selectedTeacher}</p>}
            </div>
          </div>

          {/* Lesson Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">2. Lesson Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-600">*</span></label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject}</p>}
              </div>
              {/* Grade Level */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade Level <span className="text-red-600">*</span></label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.grade ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                >
                  <option value="">Select Grade</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.grade && <p className="text-sm text-red-600 mt-1">{errors.grade}</p>}
              </div>
              {/* Module/Unit */}
              <div>
                <label htmlFor="moduleUnit" className="block text-sm font-medium text-gray-700 mb-1">Module/Unit</label>
                <Input
                  id="moduleUnit"
                  name="moduleUnit"
                  value={formData.moduleUnit}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {/* Lesson Number */}
              <div>
                <label htmlFor="lessonNumber" className="block text-sm font-medium text-gray-700 mb-1">Lesson Number</label>
                <Input
                  id="lessonNumber"
                  name="lessonNumber"
                  value={formData.lessonNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {/* Content Area */}
              <div className="md:col-span-2">
                <label htmlFor="contentArea" className="block text-sm font-medium text-gray-700 mb-1">Content Area <span className="text-red-600">*</span></label>
                <Input
                  id="contentArea"
                  name="contentArea"
                  value={formData.contentArea}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.contentArea ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.contentArea && <p className="text-sm text-red-600 mt-1">{errors.contentArea}</p>}
              </div>
              {/* Lesson Topic */}
              <div className="md:col-span-2">
                <label htmlFor="lessonTopic" className="block text-sm font-medium text-gray-700 mb-1">Lesson Topic/Objective</label>
                <Input
                  id="lessonTopic"
                  name="lessonTopic"
                  value={formData.lessonTopic}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Scheduling Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">3. Scheduling Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-600">*</span></label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
              </div>
              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time <span className="text-red-600">*</span></label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.time && <p className="text-sm text-red-600 mt-1">{errors.time}</p>}
              </div>
              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  min="15"
                  step="5"
                />
              </div>
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location/Room <span className="text-red-600">*</span></label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`}
                />
                {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">4. Additional Options</h2>
            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes for Teacher (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder="e.g., specific focus areas, materials needed"
              ></textarea>
            </div>
            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="notifyTeacher"
                  name="notifyTeacher"
                  checked={formData.notifyTeacher}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="notifyTeacher" className="ml-2 block text-sm text-gray-700">
                  Notify teacher via email
                </label>
              </div>
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="addReminder"
                  name="addReminder"
                  checked={formData.addReminder}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="addReminder" className="ml-2 block text-sm text-gray-700">
                  Add reminder to your calendar
                </label>
              </div>
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="requestLessonPlan"
                  name="requestLessonPlan"
                  checked={formData.requestLessonPlan}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="requestLessonPlan" className="ml-2 block text-sm text-gray-700">
                  Request lesson plan from teacher
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="rounded-full shadow-md bg-primary hover:bg-primary/90 px-8 py-3">
              {editId ? 'Update Observation' : 'Schedule Observation'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 