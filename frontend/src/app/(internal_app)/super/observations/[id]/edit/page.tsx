"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ObservationRecord } from "@/lib/types";
import { scheduleApi, baseUrl, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { 
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  User,
  GraduationCap,
  FileText,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Crown,
  UserCheck,
  Edit,
  Trash2
} from "lucide-react";

interface EditObservationForm {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
  observerId: string;
  observerName: string;
  
  // Additional superuser fields
  priority: 'high' | 'medium' | 'low';
  adminNotes: string;
  systemImportance: 'critical' | 'high' | 'medium' | 'low';
}

const observationTypes = [
  { value: 'formal', label: 'Formal Observation' },
  { value: 'walk-through', label: 'Walk-through' }
];

const observationStatuses = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'in_progress', label: 'In Progress' }
];

const priorityOptions = [
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' }
];

const systemImportanceOptions = [
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  { value: 'high', label: 'High Impact', color: 'bg-orange-100 text-orange-800' },
  { value: 'medium', label: 'Medium Impact', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'low', label: 'Low Impact', color: 'bg-green-100 text-green-800' }
];

export default function EditObservationPage() {
  const params = useParams();
  const router = useRouter();
  const observationId = params.id as string;
  const { user } = useAuth();
  
  const [observation, setObservation] = useState<ObservationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EditObservationForm>({
    id: observationId,
    teacherId: "",
    teacherName: "",
    subject: "",
    grade: "",
    date: "",
    time: "",
    type: "formal",
    status: "scheduled",
    notes: "",
    observerId: "",
    observerName: "",
    priority: "medium",
    adminNotes: "",
    systemImportance: "medium"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch observation details
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
          statusColor: "",
          statusBg: "",
          observerId: schedule.observation_group?.created_by?.id || "admin1",
          observerName: observerName,
          notes: schedule.notes || ''
        };
        
        setObservation(observationRecord);
        
        // Pre-populate form with observation data
        setFormData({
          id: observationRecord.id,
          teacherId: observationRecord.teacherId,
          teacherName: observationRecord.teacher,
          subject: observationRecord.subject,
          grade: observationRecord.grade,
          date: observationRecord.date,
          time: observationRecord.time,
          type: observationRecord.type,
          status: observationRecord.status,
          notes: observationRecord.notes || "",
          observerId: observationRecord.observerId,
          observerName: observationRecord.observerName,
          priority: "medium", // Default values for superuser fields
          adminNotes: "",
          systemImportance: "medium"
        });
        
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

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    
    // Check if date is in the past for scheduled observations
    if (formData.status === 'scheduled' && formData.date) {
      const observationDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (observationDate < today) {
        newErrors.date = "Cannot schedule observations in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const saveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Observation updated successfully!");
      router.push("/super/observations");
    } catch (err) {
      alert("Error updating observation");
    } finally {
      setSaving(false);
    }
  };

  // Delete observation
  const deleteObservation = async () => {
    if (!confirm("Are you sure you want to delete this observation? This action cannot be undone.")) {
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert("Observation deleted successfully!");
      router.push("/super/observations");
    } catch (err) {
      alert("Error deleting observation");
    } finally {
      setSaving(false);
    }
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
          {error ? error : "The observation you're trying to edit doesn't exist."}
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

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="h-8 w-8 text-purple-600" />
            Edit Observation
          </h1>
          <p className="text-gray-600 mt-1">Modify observation details with superuser privileges</p>
        </div>
      </div>

      {/* Teacher Info Card */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="text-white p-6" style={{background: 'linear-gradient(90deg, rgba(132, 84, 124, 1) 0%, rgba(228, 164, 20, 1) 100%)'}}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{observation.teacher}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/80">{observation.subject} • {observation.grade}</span>
                <span className="text-white/60">•</span>
                <UserCheck className="h-4 w-4 text-white/80" />
                <span className="text-white/80">Observer: {observation.observerName}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Observation Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {observationTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {observationStatuses.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observation Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any specific notes or instructions for this observation..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Superuser Settings */}
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Superuser Settings
              <Badge className="bg-purple-100 text-purple-800">Advanced</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="priority">Observation Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
              <div className="mt-2">
                <Badge className={priorityOptions.find(p => p.value === formData.priority)?.color}>
                  {priorityOptions.find(p => p.value === formData.priority)?.label}
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="systemImportance">System Importance</Label>
              <select
                id="systemImportance"
                value={formData.systemImportance}
                onChange={(e) => setFormData(prev => ({ ...prev, systemImportance: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {systemImportanceOptions.map((importance) => (
                  <option key={importance.value} value={importance.value}>{importance.label}</option>
                ))}
              </select>
              <div className="mt-2">
                <Badge className={systemImportanceOptions.find(i => i.value === formData.systemImportance)?.color}>
                  {systemImportanceOptions.find(i => i.value === formData.systemImportance)?.label}
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="adminNotes">Administrative Notes</Label>
              <Textarea
                id="adminNotes"
                value={formData.adminNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
                placeholder="Add administrative notes visible only to superusers..."
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                These notes are only visible to superusers and can be used for administrative tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Observation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Teacher:</span>
              <p className="font-medium">{formData.teacherName}</p>
            </div>
            <div>
              <span className="text-gray-500">Subject:</span>
              <p className="font-medium">{formData.subject}</p>
            </div>
            <div>
              <span className="text-gray-500">Grade:</span>
              <p className="font-medium">{formData.grade}</p>
            </div>
            <div>
              <span className="text-gray-500">Observer:</span>
              <p className="font-medium">{formData.observerName}</p>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <p className="font-medium capitalize">{formData.type}</p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <Badge className={
                formData.status === 'completed' ? 'bg-green-100 text-green-800' :
                formData.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                formData.status === 'canceled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {formData.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex gap-3">
              <Button
                onClick={saveChanges}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={deleteObservation}
              disabled={saving}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Observation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
