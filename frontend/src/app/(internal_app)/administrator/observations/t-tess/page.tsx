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
import { 
  BarChart3, 
  Users, 
  FileText, 
  Target, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Sparkles,
  Eye,
  Calendar,
  User,
  BookOpen,
  Brain,
  Heart,
  Shield
} from "lucide-react";

// T-TESS Domains and Dimensions
const tTessDomains = [
  {
    id: "planning",
    name: "Planning",
    description: "Standards and Alignment, Data and Assessment, Knowledge of Students, Activities",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-100",
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
    icon: Brain,
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-100",
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
    icon: Heart,
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-100",
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
    icon: Shield,
    color: "from-orange-500 to-red-600",
    bgColor: "from-orange-50 to-red-100",
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
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">T-TESS Evaluation</h1>
                  <p className="text-violet-100 text-lg mt-1">Texas Teacher Evaluation and Support System</p>
                </div>
              </div>
              
              {/* Progress Info */}
              <div className="mt-6 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5 text-violet-100" />
                  <span className="text-lg font-semibold">Evaluation Progress</span>
                </div>
                <div className="bg-white/20 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <div className="text-violet-100 text-sm">
                  Step {currentStep} of {totalSteps} • {Math.round((currentStep / totalSteps) * 100)}% Complete
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/administrator/observations">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Observations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">Step 1: Basic Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="teacherName" className="text-sm font-medium text-gray-700">Teacher Name</Label>
                <Input
                  id="teacherName"
                  value={evaluationData.teacherName}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, teacherName: e.target.value }))}
                  placeholder="Enter teacher name"
                  className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherId" className="text-sm font-medium text-gray-700">Teacher ID</Label>
                <Input
                  id="teacherId"
                  value={evaluationData.teacherId}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, teacherId: e.target.value }))}
                  placeholder="Enter teacher ID"
                  className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</Label>
                <Input
                  id="subject"
                  value={evaluationData.subject}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                  className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade" className="text-sm font-medium text-gray-700">Grade Level</Label>
                <Input
                  id="grade"
                  value={evaluationData.grade}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="Enter grade level"
                  className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">Evaluation Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={evaluationData.date}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, date: e.target.value }))}
                  className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observerName" className="text-sm font-medium text-gray-700">Observer Name</Label>
                <Input
                  id="observerName"
                  value={evaluationData.observerName}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, observerName: e.target.value }))}
                  placeholder="Enter observer name"
                  className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setCurrentStep(2)} 
                disabled={!evaluationData.teacherName}
                className="rounded-2xl px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Domain Evaluations */}
      {currentStep === 2 && (
        <div className="space-y-8">
          {tTessDomains.map((domain) => {
            const IconComponent = domain.icon;
            return (
              <Card key={domain.id} className={`border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br ${domain.bgColor}`}>
                <CardHeader className={`bg-gradient-to-r ${domain.color} text-white p-6`}>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{domain.name}</div>
                      <div className="text-sm opacity-90 mt-1">{domain.description}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6 bg-white">
                  {domain.dimensions.map((dimension) => {
                    const dimensionData = getDimensionData(dimension.id);
                    return (
                      <div key={dimension.id} className="bg-white/50 border border-gray-200 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">{dimension.id}: {dimension.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{dimension.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Performance Level</Label>
                            <Select
                              value={dimensionData.rating}
                              onValueChange={(value) => handleDimensionChange(dimension.id, 'rating', value)}
                            >
                              <SelectTrigger className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Evidence and Examples</Label>
                          <Textarea
                            value={dimensionData.evidence}
                            onChange={(e) => handleDimensionChange(dimension.id, 'evidence', e.target.value)}
                            placeholder="Provide specific evidence and examples that support your rating..."
                            rows={3}
                            className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Goals and Growth Areas</Label>
                          <Textarea
                            value={dimensionData.goals}
                            onChange={(e) => handleDimensionChange(dimension.id, 'goals', e.target.value)}
                            placeholder="Identify specific goals and areas for growth..."
                            rows={2}
                            className="rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
              className="rounded-2xl px-6 py-3 border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Step
            </Button>
            <Button 
              onClick={() => setCurrentStep(3)}
              className="rounded-2xl px-8 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Summary and Goals */}
      {currentStep === 3 && (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">Step 3: Summary and Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Overall Rating */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">Overall Performance Rating</Label>
              <div className="grid grid-cols-2 gap-3">
                {performanceLevels.map((level) => (
                  <label key={level.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <input
                      type="radio"
                      name="overallRating"
                      value={level.value}
                      checked={evaluationData.overallRating === level.value}
                      onChange={(e) => setEvaluationData(prev => ({ ...prev, overallRating: e.target.value }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`px-3 py-1 rounded-xl text-sm font-medium ${level.color}`}>
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800">Overall Summary</Label>
              <Textarea
                value={evaluationData.summary}
                onChange={(e) => setEvaluationData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Provide an overall summary of the teacher's performance, highlighting strengths and areas for improvement..."
                rows={4}
                className="rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            {/* Professional Goals */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-800">Professional Development Goals</Label>
              <Textarea
                value={evaluationData.goals}
                onChange={(e) => setEvaluationData(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="Outline specific professional development goals and recommendations for the upcoming year..."
                rows={4}
                className="rounded-2xl border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(2)}
                className="rounded-2xl px-6 py-3 border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="rounded-2xl px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Submit Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 