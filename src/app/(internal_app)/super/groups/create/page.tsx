"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data
const mockSchoolLeaders = [
  { id: "1", name: "David Wilson", role: "School Leader" },
  { id: "2", name: "Jessica Martinez", role: "Vice School Leader" },
  { id: "3", name: "Robert Johnson", role: "Assistant School Leader" },
];

const mockTeachers = [
  { id: "1", name: "Sarah Johnson", subject: "Mathematics", grade: "7th Grade", experience: "3 years" },
  { id: "2", name: "Michael Chen", subject: "Science", grade: "8th Grade", experience: "5 years" },
  { id: "3", name: "Emily Rodriguez", subject: "English", grade: "6th Grade", experience: "2 years" },
  { id: "4", name: "James Williams", subject: "History", grade: "7th Grade", experience: "7 years" },
  { id: "5", name: "Lisa Brown", subject: "Art", grade: "Multiple", experience: "4 years" },
  { id: "6", name: "Daniel Lee", subject: "Physical Education", grade: "Multiple", experience: "6 years" },
  { id: "7", name: "Jennifer Garcia", subject: "Mathematics", grade: "6th Grade", experience: "1 year" },
  { id: "8", name: "Anthony Taylor", subject: "Science", grade: "7th Grade", experience: "3 years" },
];

export default function CreateObservationGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [selectedObserver, setSelectedObserver] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchTeachers, setSearchTeachers] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  
  // Filter teachers based on search
  const filteredTeachers = searchTeachers
    ? mockTeachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTeachers.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTeachers.toLowerCase()) ||
        teacher.grade.toLowerCase().includes(searchTeachers.toLowerCase())
      )
    : mockTeachers;

  const handleSelectTeacher = (teacherId: string) => {
    if (selectedTeachers.includes(teacherId)) {
      setSelectedTeachers(selectedTeachers.filter(id => id !== teacherId));
    } else {
      setSelectedTeachers([...selectedTeachers, teacherId]);
    }
  };

  const handleSelectAllTeachers = () => {
    if (selectedTeachers.length === filteredTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers.map(teacher => teacher.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName || !selectedObserver || selectedTeachers.length === 0) {
      alert("Please fill in all required fields and select at least one teacher");
      return;
    }
    
    setIsCreating(true);
    
    // Simulate creation delay
    setTimeout(() => {
      setIsCreating(false);
      setCreationSuccess(true);
    }, 1500);
  };

  if (creationSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Observation Group</h1>
            <p className="text-gray-600">Set up a new group for teacher observations</p>
          </div>
          <div>
            <Link href="/super/groups">
              <Button variant="outline" className="rounded-full shadow-sm">
                ← Back to Groups
              </Button>
            </Link>
          </div>
        </div>
        
        <Card className="border bg-white">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Group Created Successfully!</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              The observation group "{groupName}" has been created with {selectedTeachers.length} teachers.
            </p>
            <div className="flex gap-4">
              <Link href="/super/groups">
                <Button className="rounded-lg">
                  View All Groups
                </Button>
              </Link>
              <Link href="/super/groups/create">
                <Button variant="outline" className="rounded-lg">
                  Create Another Group
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Observation Group</h1>
          <p className="text-gray-600">Set up a new group for teacher observations</p>
        </div>
        <div>
          <Link href="/super/groups">
            <Button variant="outline" className="rounded-full shadow-sm">
              ← Back to Groups
            </Button>
          </Link>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group Details */}
          <Card className="border bg-white md:col-span-1">
            <CardHeader>
              <CardTitle>Group Details</CardTitle>
              <CardDescription>
                Basic information about the observation group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  placeholder="e.g., Math Department"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observer">Observer (School Leader) *</Label>
                <select
                  id="observer"
                  className="w-full p-2 border rounded-lg"
                  value={selectedObserver}
                  onChange={(e) => setSelectedObserver(e.target.value)}
                  required
                >
                  <option value="" disabled>Select an observer</option>
                  {mockSchoolLeaders.map((school-leader) => (
                    <option key={school-leader.id} value={school-leader.id}>
                      {school-leader.name} ({school-leader.role})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
          
          {/* Teacher Selection */}
          <Card className="border bg-white md:col-span-2">
            <CardHeader>
              <CardTitle>Select Teachers</CardTitle>
              <CardDescription>
                Choose teachers to include in this observation group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Input
                  placeholder="Search teachers by name, subject, or grade"
                  value={searchTeachers}
                  onChange={(e) => setSearchTeachers(e.target.value)}
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg whitespace-nowrap"
                  onClick={handleSelectAllTeachers}
                >
                  {selectedTeachers.length === filteredTeachers.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="w-16 px-4 py-2"></th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTeachers.map((teacher) => (
                      <tr 
                        key={teacher.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedTeachers.includes(teacher.id) ? 'bg-primary/5' : ''}`}
                        onClick={() => handleSelectTeacher(teacher.id)}
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.includes(teacher.id)}
                            onChange={() => {}}
                            className="h-4 w-4 text-primary border-gray-300 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{teacher.subject}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{teacher.grade}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{teacher.experience}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTeachers.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No teachers found matching your search
                  </div>
                )}
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected
                </div>
                <Button 
                  type="submit" 
                  className="rounded-lg"
                  disabled={isCreating || !groupName || !selectedObserver || selectedTeachers.length === 0}
                >
                  {isCreating ? "Creating..." : "Create Observation Group"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
} 