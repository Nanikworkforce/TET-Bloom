"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// T-TESS Domains and Dimensions
const tTessDomains = [
  {
    id: "planning",
    name: "Planning",
    description: "Standards and Alignment, Data and Assessment, Knowledge of Students, Activities",
    dimensions: [
      { id: "1.1", name: "Standards and Alignment", description: "The teacher designs clear, well-organized, sequential lessons that reflect best practice, align with standards and are appropriate for diverse learners." },
      { id: "1.2", name: "Data and Assessment", description: "The teacher uses formal and informal methods to measure student progress, then manages and analyzes student data to inform instruction." },
      { id: "1.3", name: "Knowledge of Students", description: "Through knowledge of students and proven practices, the teacher ensures high levels of learning, social-emotional development and achievement for all students." },
      { id: "1.4", name: "Activities", description: "The teacher plans engaging, flexible lessons that encourage higher-order thinking, persistence and achievement." }
    ]
  },
  {
    id: "instruction",
    name: "Instruction",
    description: "Achieving Expectations, Content Knowledge and Expertise, Communication, Differentiation, Monitor and Adjust",
    dimensions: [
      { id: "2.1", name: "Achieving Expectations", description: "The teacher supports all learners in their pursuit of high levels of academic and social-emotional success." },
      { id: "2.2", name: "Content Knowledge and Expertise", description: "The teacher uses content and pedagogical expertise to design and execute lessons aligned with state standards, related content and student needs." },
      { id: "2.3", name: "Communication", description: "The teacher clearly and accurately communicates to support persistence, deeper learning and effective effort." },
      { id: "2.4", name: "Differentiation", description: "The teacher differentiates instruction, aligning methods and techniques to diverse student needs." },
      { id: "2.5", name: "Monitor and Adjust", description: "The teacher formally and informally collects, analyzes and uses student progress data and makes needed lesson adjustments." }
    ]
  },
  {
    id: "learning_environment",
    name: "Learning Environment",
    description: "Classroom Environment, Managing Student Behavior, Classroom Culture",
    dimensions: [
      { id: "3.1", name: "Classroom Environment, Routines and Procedures", description: "The teacher organizes a safe, accessible and efficient classroom environment." },
      { id: "3.2", name: "Managing Student Behavior", description: "The teacher establishes, communicates and maintains clear expectations for student behavior." },
      { id: "3.3", name: "Classroom Culture", description: "The teacher leads a mutually respectful and collaborative class of actively engaged learners." }
    ]
  },
  {
    id: "professional_practices",
    name: "Professional Practices and Responsibilities",
    description: "Professional Demeanor and Ethics, Goal Setting, Professional Development, School Community Involvement",
    dimensions: [
      { id: "4.1", name: "Professional Demeanor and Ethics", description: "The teacher meets district expectations for attendance, professional appearance, decorum, procedural, ethical, legal and statutory responsibilities." },
      { id: "4.2", name: "Goal Setting", description: "The teacher reflects on his/her practice." },
      { id: "4.3", name: "Professional Development", description: "The teacher enhances the professional community." },
      { id: "4.4", name: "School Community Involvement", description: "The teacher demonstrates leadership with students, colleagues, and community members in the school, district and community through effective communication and outreach." }
    ]
  }
];

// Performance levels
const performanceLevels = [
  { value: "distinguished", label: "Distinguished", color: "bg-green-100 text-green-800" },
  { value: "accomplished", label: "Accomplished", color: "bg-blue-100 text-blue-800" },
  { value: "developing", label: "Developing", color: "bg-yellow-100 text-yellow-800" },
  { value: "improvement_needed", label: "Improvement Needed", color: "bg-red-100 text-red-800" }
];

interface EvaluationData {
  teacherName: string;
  teacherId: string;
  subject: string;
  grade: string;
  date: string;
  observerName: string;
  dimensions: Record<string, {
    rating: string;
    evidence: string;
    goals: string;
  }>;
  overallRating: string;
  summary: string;
  goals: string;
}

export default function TTessEvaluationPage() {
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    teacherName: "",
    teacherId: "",
    subject: "",
    grade: "",
    date: new Date().toISOString().split('T')[0],
    observerName: "",
    dimensions: {},
    overallRating: "",
    summary: "",
    goals: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleDimensionChange = (dimensionId: string, field: 'rating' | 'evidence' | 'goals', value: string) => {
    setEvaluationData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimensionId]: {
          ...prev.dimensions[dimensionId],
          [field]: value
        }
      }
    }));
  };

  const getDimensionData = (dimensionId: string) => {
    return evaluationData.dimensions[dimensionId] || { rating: '', evidence: '', goals: '' };
  };

  const calculateOverallRating = () => {
    const ratings = Object.values(evaluationData.dimensions).map(d => d.rating);
    const validRatings = ratings.filter(r => r);
    
    if (validRatings.length === 0) return '';
    
    const ratingValues = {
      'distinguished': 4,
      'accomplished': 3,
      'developing': 2,
      'improvement_needed': 1
    };
    
    const average = validRatings.reduce((sum, rating) => sum + ratingValues[rating as keyof typeof ratingValues], 0) / validRatings.length;
    
    if (average >= 3.5) return 'distinguished';
    if (average >= 2.5) return 'accomplished';
    if (average >= 1.5) return 'developing';
    return 'improvement_needed';
  };

  const handleSubmit = () => {
    const overallRating = calculateOverallRating();
    setEvaluationData(prev => ({ ...prev, overallRating }));
    
    // Here you would typically save to backend
    console.log('T-TESS Evaluation Data:', { ...evaluationData, overallRating });
    alert('T-TESS Evaluation submitted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">T-TESS Evaluation Form</h1>
          <p className="text-gray-600">Texas Teacher Evaluation and Support System</p>
        </div>
        <Link href="/administrator/observations">
          <Button variant="outline" className="rounded-full">
            ← Back to Observations
          </Button>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="text-sm text-gray-600 text-center">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teacherName">Teacher Name</Label>
                <Input
                  id="teacherName"
                  value={evaluationData.teacherName}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, teacherName: e.target.value }))}
                  placeholder="Enter teacher name"
                />
              </div>
              <div>
                <Label htmlFor="teacherId">Teacher ID</Label>
                <Input
                  id="teacherId"
                  value={evaluationData.teacherId}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, teacherId: e.target.value }))}
                  placeholder="Enter teacher ID"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={evaluationData.subject}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade Level</Label>
                <Input
                  id="grade"
                  value={evaluationData.grade}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="Enter grade level"
                />
              </div>
              <div>
                <Label htmlFor="date">Evaluation Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={evaluationData.date}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="observerName">Observer Name</Label>
                <Input
                  id="observerName"
                  value={evaluationData.observerName}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, observerName: e.target.value }))}
                  placeholder="Enter observer name"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} disabled={!evaluationData.teacherName}>
                Next Step →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Domain Evaluations */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {tTessDomains.map((domain) => (
            <Card key={domain.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {domain.name}
                  </Badge>
                  <span className="text-sm text-gray-600">{domain.description}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {domain.dimensions.map((dimension) => {
                  const dimensionData = getDimensionData(dimension.id);
                  return (
                    <div key={dimension.id} className="border rounded-lg p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg">{dimension.id}: {dimension.name}</h4>
                        <p className="text-gray-600 text-sm">{dimension.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Performance Level</Label>
                          <Select
                            value={dimensionData.rating}
                            onValueChange={(value) => handleDimensionChange(dimension.id, 'rating', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select performance level" />
                            </SelectTrigger>
                            <SelectContent>
                              {performanceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${level.color}`}>
                                      {level.label}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Evidence and Examples</Label>
                        <Textarea
                          value={dimensionData.evidence}
                          onChange={(e) => handleDimensionChange(dimension.id, 'evidence', e.target.value)}
                          placeholder="Provide specific evidence and examples that support your rating..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label>Goals and Growth Areas</Label>
                        <Textarea
                          value={dimensionData.goals}
                          onChange={(e) => handleDimensionChange(dimension.id, 'goals', e.target.value)}
                          placeholder="Identify specific goals and areas for growth..."
                          rows={2}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              ← Previous Step
            </Button>
            <Button onClick={() => setCurrentStep(3)}>
              Next Step →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Summary and Goals */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Summary and Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div>
              <Label>Overall Performance Rating</Label>
              <div className="mt-2">
                {performanceLevels.map((level) => (
                  <label key={level.value} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="overallRating"
                      value={level.value}
                      checked={evaluationData.overallRating === level.value}
                      onChange={(e) => setEvaluationData(prev => ({ ...prev, overallRating: e.target.value }))}
                    />
                    <span className={`px-3 py-1 rounded text-sm ${level.color}`}>
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <Label>Overall Summary</Label>
              <Textarea
                value={evaluationData.summary}
                onChange={(e) => setEvaluationData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Provide an overall summary of the teacher's performance, highlighting strengths and areas for improvement..."
                rows={4}
              />
            </div>

            {/* Professional Goals */}
            <div>
              <Label>Professional Development Goals</Label>
              <Textarea
                value={evaluationData.goals}
                onChange={(e) => setEvaluationData(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="Outline specific professional development goals and recommendations for the upcoming year..."
                rows={4}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                ← Previous Step
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Submit Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 