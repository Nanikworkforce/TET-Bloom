"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ObservationType } from "@/lib/types";

// Mock teachers data - in a real app, this would come from an API
const teachers = [
  {
    id: "1",
    name: "Sarah Johnson",
    subject: "Mathematics",
    grade: "5th Grade",
    email: "sarah.johnson@school.edu",
    yearsOfExperience: 8
  },
  {
    id: "2",
    name: "Michael Chen",
    subject: "Science",
    grade: "7th Grade",
    email: "michael.chen@school.edu",
    yearsOfExperience: 5
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    subject: "English Literature",
    grade: "10th Grade",
    email: "emily.rodriguez@school.edu",
    yearsOfExperience: 12
  },
  {
    id: "4",
    name: "David Wilson",
    subject: "History",
    grade: "9th Grade",
    email: "david.wilson@school.edu",
    yearsOfExperience: 15
  },
  {
    id: "5",
    name: "Jessica Martinez",
    subject: "Art",
    grade: "Multiple",
    email: "jessica.martinez@school.edu",
    yearsOfExperience: 7
  },
  {
    id: "6",
    name: "Robert Thompson",
    subject: "Physical Education",
    grade: "Multiple",
    email: "robert.thompson@school.edu",
    yearsOfExperience: 10
  }
];

interface ScheduleObservationForm {
  teacherId: string;
  date: string;
  time: string;
  type: ObservationType;
  notes: string;
}

export default function ScheduleObservationPage() {
  const router = useRouter();
  const [form, setForm] = useState<ScheduleObservationForm>({
    teacherId: "",
    date: "",
    time: "",
    type: "formal",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTeacher = teachers.find(t => t.id === form.teacherId);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teacherId || !form.date || !form.time) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/observations/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: form.teacherId,
          date: form.date,
          time: form.time,
          type: form.type,
          notes: form.notes,
          observerId: 'admin1' // In a real app, this would come from the authenticated user
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        router.push("/administrator/observations");
      } else {
        alert(result.error || "Failed to schedule observation. Please try again.");
      }
    } catch (error) {
      console.error('Error scheduling observation:', error);
      alert("Failed to schedule observation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeColor = (type: ObservationType) => {
    return type === 'formal' 
      ? 'bg-blue-100 text-blue-800 border-blue-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getTypeIcon = (type: ObservationType) => {
    return type === 'formal' ? '📋' : '👁️';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link href="/administrator/observations">
          <Button variant="ghost" size="sm" className="rounded-full">
            <span className="mr-2">←</span> Back to Observations
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule New Observation</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teacher Selection */}
        <Card className="p-6 bg-white border shadow-sm">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-gray-800">Select Teacher *</Label>
              <p className="text-sm text-gray-600 mt-1">Choose the teacher you want to observe</p>
            </div>

            {/* Search for teachers */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <Input
                placeholder="Search teachers by name, subject, or grade..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Selected teacher display */}
            {selectedTeacher && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedTeacher.name}</h3>
                    <p className="text-blue-700 text-sm">{selectedTeacher.subject} • {selectedTeacher.grade}</p>
                    <p className="text-blue-600 text-xs mt-1">{selectedTeacher.yearsOfExperience} years experience</p>
                  </div>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setForm({...form, teacherId: ""})}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Teacher list */}
            {!selectedTeacher && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="p-4 border rounded-lg hover:border-primary/40 hover:bg-gray-50 cursor-pointer transition-all"
                    onClick={() => setForm({...form, teacherId: teacher.id})}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.subject} • {teacher.grade}</p>
                        <p className="text-xs text-gray-500 mt-1">{teacher.yearsOfExperience} years experience</p>
                      </div>
                      <span className="text-primary">→</span>
                    </div>
                  </div>
                ))}
                {filteredTeachers.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No teachers found matching your search.
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Observation Details */}
        <Card className="p-6 bg-white border shadow-sm">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-gray-800">Observation Details</Label>
              <p className="text-sm text-gray-600 mt-1">Set the date, time, and type of observation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-lg"
                  required
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({...form, time: e.target.value})}
                  className="rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Observation Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Observation Type *</Label>
              <RadioGroup
                value={form.type}
                onValueChange={(value) => setForm({...form, type: value as ObservationType})}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="formal" id="formal" />
                  <label htmlFor="formal" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor('formal')}>
                        {getTypeIcon('formal')} Formal Observation
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Comprehensive evaluation with full documentation
                      </span>
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="walk-through" id="walk-through" />
                  <label htmlFor="walk-through" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor('walk-through')}>
                        {getTypeIcon('walk-through')} Walk-through
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Brief visit for quick feedback and support
                      </span>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any specific areas to focus on or additional context for the observation..."
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                className="rounded-lg min-h-20"
              />
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <Link href="/administrator/observations">
            <Button type="button" variant="outline" className="rounded-full">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="rounded-full bg-primary/90 hover:bg-primary"
            disabled={isSubmitting || !form.teacherId || !form.date || !form.time}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">⏳</span> Scheduling...
              </>
            ) : (
              <>
                <span className="mr-2">📅</span> Schedule Observation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 