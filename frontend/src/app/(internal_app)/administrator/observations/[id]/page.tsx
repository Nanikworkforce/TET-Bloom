"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ObservationRecord, ObservationStatus } from "@/lib/types";
import { scheduleApi, baseUrl, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  GraduationCap,
  FileText,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  UserCheck,
  Edit,
  Star,
  Eye,
  ClipboardCheck,
  Save,
  X
} from "lucide-react";

// Helper functions for observation type display
const getTypeIcon = (type: string) => 
  type === 'formal' ? ClipboardCheck : Eye;

const getTypeLabel = (type: string) => {
  return type === 'formal' ? 'Formal Observation' : 'Walk-through Observation';
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'text-white';
    case 'completed':
      return 'text-white';
    case 'in_progress':
      return 'text-white';
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return '#84547c';
    case 'completed': 
      return '#e4a414';
    case 'in_progress':
      return '#84547c';
    case 'cancelled':
    case 'canceled':
      return '#dc2626';
    default:
      return '#6b7280';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
};

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function AdministratorObservationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const observationId = params.id as string;
  const { user } = useAuth();
  
  const [observation, setObservation] = useState<ObservationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchObservationDetails = async () => {
      if (!observationId) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await scheduleApi.getAll();
        const schedules = Array.isArray(response.data) ? response.data : [];
        
        const schedule = schedules.find((s: any) => s.id === observationId);
        
        if (!schedule) {
          setError("Observation not found");
          return;
        }

        // Convert to ObservationRecord format
        let teacherName = "Unknown";
        let subject = "Unknown Subject";
        let grade = "Unknown Grade";
        let observerName = "Administrator";
        
        if (schedule.teacher && schedule.teacher.user) {
          teacherName = schedule.teacher.user.name || "Unknown Teacher";
          subject = schedule.teacher.subject || "Unknown Subject";
          grade = schedule.teacher.grade || "Unknown Grade";
        } else if (schedule.observation_group) {
          teacherName = schedule.observation_group.name || "Group Observation";
          subject = "Group Observation";
          grade = "Multiple Grades";
        }
        
        if (schedule.observation_group?.created_by) {
          observerName = schedule.observation_group.created_by.name || "Administrator";
        }
        
        const observationRecord: ObservationRecord = {
          id: schedule.id,
          teacher: teacherName,
          teacherId: schedule.teacher?.id || schedule.observation_group?.id || "",
          subject: subject,
          grade: grade,
          date: schedule.date,
          time: schedule.time,
          type: schedule.observation_type,
          status: schedule.status.toLowerCase(),
          statusColor: getStatusColor(schedule.status),
          statusBg: getStatusBadgeColor(schedule.status),
          observerId: schedule.observation_group?.created_by?.id || "admin1",
          observerName: observerName,
          feedback: schedule.status.toLowerCase() === 'completed' ? Math.random() > 0.5 : undefined,
          notes: schedule.notes || '',
          notificationSent: schedule.notification_sent || false,
          notificationSentAt: schedule.notification_sent_at || null,
          reminderSent: schedule.reminder_sent || false,
          reminderSentAt: schedule.reminder_sent_at || null
        };
        
        setObservation(observationRecord);
        setEditedStatus(schedule.status);
      } catch (err) {
        console.error("Error fetching observation details:", err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load observation details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchObservationDetails();
  }, [observationId]);

  // Function to handle status update
  const handleStatusUpdate = async () => {
    if (!observation || !editedStatus) return;

    setSaving(true);
    setError(null);
    
    try {
      // First, get the current schedule data to include all required fields
      const currentScheduleResponse = await scheduleApi.getById(observation.id);
      const currentSchedule: any = currentScheduleResponse.data;
      
      // Update the schedule via API with all required fields
      await scheduleApi.update(observation.id, {
        date: currentSchedule.date,
        time: currentSchedule.time,
        observation_type: currentSchedule.observation_type,
        notes: currentSchedule.notes || "",
        status: editedStatus,
        // Include teacher and observation_group IDs if they exist
        ...(currentSchedule.teacher && { teacher: currentSchedule.teacher.id }),
        ...(currentSchedule.observation_group && { observation_group: currentSchedule.observation_group.id })
      });
      
      // Update local state
      const normalizedStatus = editedStatus.toLowerCase() === 'cancelled' ? 'canceled' : editedStatus.toLowerCase();
      const updatedObservation: ObservationRecord = {
        ...observation,
        status: normalizedStatus as ObservationStatus,
        statusColor: getStatusColor(editedStatus),
        statusBg: getStatusBadgeColor(editedStatus)
      };
      
      setObservation(updatedObservation);
      setIsEditing(false);
      setSuccessMessage("Observation status updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error updating observation status:", err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update observation status. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedStatus(observation?.status || "");
    setError(null);
  };

  // Get available status options
  const getStatusOptions = () => {
    return [
      { value: "Scheduled", label: "Scheduled" },
      { value: "Completed", label: "Completed" },
      { value: "Cancelled", label: "Cancelled" }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !observation) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {error || "Observation not found"}
        </h3>
        <p className="text-gray-600 mb-4 text-center">
          {error ? error : "The observation you're looking for doesn't exist or has been removed."}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(observation.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Observation Details</h1>
            <p className="text-gray-600 mt-1">Complete information about this observation</p>
          </div>
        </div>
        
        {/* Edit Status Button */}
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Status
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={cancelEditing}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={saving || editedStatus === observation?.status}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={() => setError(null)}
          >
            ×
          </Button>
        </div>
      )}

      {/* Main Info Card */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="text-white p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <TypeIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">{observation.teacher}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {isEditing ? (
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Select value={editedStatus} onValueChange={setEditedStatus}>
                        <SelectTrigger className="w-40 bg-white/90 text-gray-900 border-white/30">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatusOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Badge 
                      style={{ backgroundColor: observation.statusBg }}
                      className={`${observation.statusColor} font-medium`}
                    >
                      {observation.status}
                    </Badge>
                  )}
                  <span className="text-white/80">•</span>
                  <span className="text-white/80">{getTypeLabel(observation.type)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Teacher</p>
                    <p className="font-medium text-gray-900">{observation.teacher}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="font-medium text-gray-900">{observation.subject}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-medium text-gray-900">{observation.grade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                Schedule Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(observation.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{formatTime(observation.time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <TypeIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium text-gray-900">{getTypeLabel(observation.type)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Observer Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                Observer Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Observer</p>
                    <p className="font-medium text-gray-900">{observation.observerName}</p>
                  </div>
                </div>
                
                {observation.status === 'completed' && (
                  <div className="flex items-center gap-3">
                    {observation.feedback ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Feedback Status</p>
                          <p className="font-medium text-green-700">Feedback Provided</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">Feedback Status</p>
                          <p className="font-medium text-orange-700">Pending</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {observation.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{observation.notes}</p>
              </div>
            </div>
          )}

          {/* Notification Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-3">Notification Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Initial Notification</p>
                  <p className={`font-medium ${observation.notificationSent ? 'text-green-700' : 'text-gray-500'}`}>
                    {observation.notificationSent ? 'Sent' : 'Not Sent'}
                  </p>
                  {observation.notificationSentAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(observation.notificationSentAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Reminder</p>
                  <p className={`font-medium ${observation.reminderSent ? 'text-green-700' : 'text-gray-500'}`}>
                    {observation.reminderSent ? 'Sent' : 'Not Sent'}
                  </p>
                  {observation.reminderSentAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(observation.reminderSentAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Link href="/administrator/observations">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Observations
              </Button>
            </Link>
            
            {observation.status === 'scheduled' && (
              <Link href={`/administrator/observations/schedule?edit=${observation.id}`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </Link>
            )}
            
            {(observation.status === 'completed' || observation.status === 'scheduled') && (
              <Link href={`/administrator/feedback/${observation.id}/create`}>
                <Button>
                  <Star className="h-4 w-4 mr-2" />
                  {observation.feedback ? 'View' : 'Provide'} Feedback
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
