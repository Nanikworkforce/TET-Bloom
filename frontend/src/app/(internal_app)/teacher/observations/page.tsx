"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { baseUrl } from "@/lib/api";
import { 
  Eye, 
  Calendar, 
  Clock, 
  Search, 
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Star,
  Users,
  BookOpen,
  MessageSquare,
  Target,
  Sparkles
} from "lucide-react";

// Interfaces for real data
interface TeacherData {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  grade: string;
  years_of_experience: number;
}

interface ObservationSchedule {
  id: string;
  date: string;
  time: string;
  status: string;
  observation_type: string;
  notes?: string;
  teacher: TeacherData;
  observation_group?: {
    id: string;
    name: string;
    created_by: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    status: string;
  };
}

export default function TeacherObservationsPage() {
  const router = useRouter();
  const { user } = useAuth();
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
  
  // State for real data
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [observations, setObservations] = useState<ObservationSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.id) return;

      try {
        const allTeachersResponse = await fetch(`${baseUrl}/teachers/`);
        if (allTeachersResponse.ok) {
          const allTeachers = await allTeachersResponse.json();
          
          const teacherRecord = allTeachers.find((teacher: TeacherData) => 
            teacher.user.email === user.email || teacher.user.id === user.id
          );
          
          if (teacherRecord) {
            const individualResponse = await fetch(`${baseUrl}/teachers/${teacherRecord.id}/`);
            if (individualResponse.ok) {
              const teacherDetails = await individualResponse.json();
              setTeacherData(teacherDetails);
            } else {
              setTeacherData(teacherRecord);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeacherData();
  }, [user?.id, user?.email]);

  // Fetch observations for the teacher
  useEffect(() => {
    const fetchObservations = async () => {
      if (!teacherData?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/schedules/`);
        
        if (response.ok) {
          const allSchedules = await response.json();
          
          // Filter schedules for the current teacher
          const teacherObservations = allSchedules.filter((schedule: ObservationSchedule) => 
            schedule.teacher?.id === teacherData.id
          );
          
          // Sort by date (most recent first)
          const sortedObservations = teacherObservations.sort((a: ObservationSchedule, b: ObservationSchedule) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          setObservations(sortedObservations);
        } else {
          console.error('Failed to fetch schedules:', response.status);
        }
      } catch (error) {
        console.error('Error fetching observations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [teacherData?.id]);
  
  // Filter observations by status
  const upcomingObservations = observations.filter(observation => 
    observation.status === "Scheduled" && new Date(observation.date) >= new Date()
  );
  const pastObservations = observations.filter(observation => 
    observation.status === "Completed" || (observation.status === "Scheduled" && new Date(observation.date) < new Date())
  );
  
  const handleSupportingMaterialsSubmit = (observationId: string) => {
    // In a real app, this would handle the file upload to the server
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadingFor(null);
      // Would update the observation status in a real app
      alert("Supporting materials submitted successfully!");
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

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getObserverName = (observation: ObservationSchedule) => {
    if (observation.observation_group?.created_by?.name) {
      return observation.observation_group.created_by.name;
    }
    return "Administrator";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'text-white';
      case 'completed':
        return 'text-white';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <Eye className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">My Observations</h1>
                  <p className="text-white/90 text-lg mt-1">View and prepare for upcoming observations</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{upcomingObservations.length}</div>
                  <div className="text-white/90 text-sm">Upcoming</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{pastObservations.length}</div>
                  <div className="text-white/90 text-sm">Completed</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{upcomingObservations.length + pastObservations.length}</div>
                  <div className="text-white/90 text-sm">Total</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Request
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
        <button
          className={`flex-1 py-3 px-6 font-medium text-sm rounded-xl transition-all duration-300 ${
            activeTab === "upcoming"
              ? "text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          style={activeTab === "upcoming" ? {
            background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)',
            boxShadow: '0 10px 25px rgba(132, 84, 124, 0.25)'
          } : {}}
          onClick={() => setActiveTab("upcoming")}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming Observations
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-6 font-medium text-sm rounded-xl transition-all duration-300 ${
            activeTab === "past"
              ? "text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          style={activeTab === "past" ? {
            background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)',
            boxShadow: '0 10px 25px rgba(132, 84, 124, 0.25)'
          } : {}}
          onClick={() => setActiveTab("past")}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Past Observations
          </div>
        </button>
      </div>

      {/* Modern Observations List */}
      <div className="space-y-6">
        {loading ? (
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <RefreshCw className="h-6 w-6 animate-spin" style={{color: '#84547c'}} />
                <p className="text-gray-500 text-lg">Loading observations...</p>
              </div>
            </div>
          </Card>
        ) : (activeTab === "upcoming" ? upcomingObservations : pastObservations).length === 0 ? (
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(132, 84, 124, 0.1) 0%, rgba(228, 164, 20, 0.1) 100%)'}}>
            <div className="p-8 text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(135deg, rgba(132, 84, 124, 0.2) 0%, rgba(228, 164, 20, 0.2) 100%)'}}>
                {activeTab === "upcoming" ? (
                  <Clock className="h-12 w-12" style={{color: '#84547c'}} />
                ) : (
                  <CheckCircle className="h-12 w-12" style={{color: '#e4a414'}} />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {activeTab === "upcoming" ? "No upcoming observations" : "No past observations"}
              </h3>
              <p className="text-gray-600">
                {activeTab === "upcoming" 
                  ? "You're all caught up! No observations scheduled at this time." 
                  : "Your observation history will appear here once you complete some observations."
                }
              </p>
            </div>
          </Card>
        ) : (
          (activeTab === "upcoming" ? upcomingObservations : pastObservations).map((observation) => (
            <Card key={observation.id} className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">
              <div className="p-6 border-b" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)'}}>
                      <BookOpen className="h-5 w-5" style={{color: '#84547c'}} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-800">{teacherData?.subject || 'Subject'}</h3>
                      <p className="text-gray-600 text-sm">Grade {teacherData?.grade || 'N/A'}</p>
                    </div>
                  </div>
                  <span 
                    className={`px-4 py-2 text-sm font-medium rounded-2xl ${getStatusColor(observation.status)}`}
                    style={{backgroundColor: observation.status.toLowerCase() === 'scheduled' ? '#84547c' : observation.status.toLowerCase() === 'completed' ? '#e4a414' : undefined}}
                  >
                    {observation.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Observer:</span>
                      <span className="font-semibold text-gray-800">{getObserverName(observation)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Date & Time:</span>
                      <span className="font-semibold text-gray-800">{formatDate(observation.date)}, {formatTime(observation.time)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Type:</span>
                      <span className="font-semibold text-gray-800 capitalize">{observation.observation_type.replace('-', ' ')}</span>
                    </div>
                    {observation.notes && (
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                        <span className="text-gray-600 font-medium">Notes:</span>
                        <span className="font-medium text-gray-800">{observation.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Modern Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {observation.status === "Scheduled" && (
                    <>
                      <Button 
                        className="rounded-2xl text-white transition-all duration-300 hover:scale-105"
                        style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}
                        onClick={() => {
                          setUploadingFor(observation.id);
                          setSelectedObservation(null);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Submit Materials
                      </Button>
                      <Button 
                        variant="outline" 
                        className="rounded-2xl"
                        style={{borderColor: '#84547c', color: '#84547c'}}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(132, 84, 124, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => {
                          setSelectedObservation(observation.id === selectedObservation ? null : observation.id);
                          setUploadingFor(null);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {observation.id === selectedObservation ? "Hide Details" : "View Details"}
                      </Button>
                    </>
                  )}
                  
                  {observation.status === "Completed" && (
                    <Button 
                      variant="outline" 
                      className="rounded-2xl"
                      style={{borderColor: '#e4a414', color: '#e4a414'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(228, 164, 20, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        setSelectedObservation(observation.id === selectedObservation ? null : observation.id);
                      }}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      {observation.id === selectedObservation ? "Hide Details" : "View Feedback"}
                    </Button>
                  )}
                </div>
              
                {/* Modern Supporting Materials Upload Section */}
                {uploadingFor === observation.id && (
                  <div className="mt-6 p-6 rounded-2xl border" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 0.05) 0%, rgba(228, 164, 20, 0.05) 100%)'}}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl" style={{backgroundColor: 'rgba(132, 84, 124, 0.1)'}}>
                        <FileText className="h-5 w-5" style={{color: '#84547c'}} />
                      </div>
                      <h4 className="font-semibold text-lg text-gray-800">Submit Supporting Materials</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="supporting-materials" className="text-sm font-medium text-gray-700">Supporting Materials</Label>
                        <Input
                          id="supporting-materials"
                          type="file"
                          accept=".pdf,.docx,.pptx,.xlsx"
                          multiple
                          className="mt-2 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          You can select multiple files (up to 5) - presentations, worksheets, handouts, etc.
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setUploadingFor(null)}
                          className="rounded-2xl border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={isUploading}
                          onClick={() => handleSupportingMaterialsSubmit(observation.id)}
                          className="rounded-2xl text-white transition-all duration-300"
                          style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Submit
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              

              
              {/* Observation Details Section */}
              {selectedObservation === observation.id && observation.status === "Scheduled" && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Observation Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-600">Preparation Checklist</h5>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs bg-gray-100 text-gray-400">!</span>
                          <span>Submit supporting materials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs bg-gray-100 text-gray-400">!</span>
                          <span>Prepare classroom materials</span>
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
              
              {/* Past Observation Details Section */}
              {selectedObservation === observation.id && observation.status === "Completed" && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Observation Summary</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg" style={{backgroundColor: 'rgba(132, 84, 124, 0.05)'}}>
                      <div className="font-medium mb-1" style={{color: '#84547c'}}>Observation Completed</div>
                      <div className="text-sm" style={{color: '#84547c'}}>
                        This {observation.observation_type.replace('-', ' ')} observation was completed on {formatDate(observation.date)}.
                        {observation.notes && ` Notes: ${observation.notes}`}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Feedback and detailed results will be available once the administrator completes the evaluation process.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))
        )}
      </div>
      

    </div>
  );
} 