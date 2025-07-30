"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userApi, teacherApi, observationGroupApi, ApiError } from "@/lib/api";

interface Teacher {
  id: string;
  user: {
    name: string;
    email: string;
  };
  subject: string;
  grade: string;
  years_of_experience: number;
}

interface Administrator {
  id: string;
  user: {
    name: string;
    email: string;
  };
}

export default function CreateObservationGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [note, setNote] = useState("");
  const [selectedObserver, setSelectedObserver] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchTeachers, setSearchTeachers] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real data from backend
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [adminResponse, teacherResponse] = await Promise.all([
          userApi.getAll(), // We'll filter for administrators
          teacherApi.getAll()
        ]);

        // Filter users for administrators
        const adminUsers = (adminResponse.data as any[])?.filter((user: any) => user.role === 'Administrator') || [];
        setAdministrators(adminUsers.map((user: any) => ({
          id: user.id,
          user: { name: user.name, email: user.email }
        })));

        setTeachers((teacherResponse.data as Teacher[]) || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Filter teachers based on search
  const filteredTeachers = searchTeachers
    ? teachers.filter(teacher => 
        teacher.user.name.toLowerCase().includes(searchTeachers.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTeachers.toLowerCase()) ||
        teacher.grade.toLowerCase().includes(searchTeachers.toLowerCase())
      )
    : teachers;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!groupName || !selectedObserver || selectedTeachers.length === 0) {
      setError("Please fill in all required fields and select at least one teacher");
      return;
    }
    
    setIsCreating(true);
    
    try {
      const groupData = {
        name: groupName,
        note: note,
        created_by: selectedObserver,
        teachers: selectedTeachers,
        status: 'Scheduled'
      };

      await observationGroupApi.create(groupData);
      setCreationSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to create group: ${err.message}`);
      } else {
        setError("Failed to create group. Please try again.");
      }
      console.error("Error creating group:", err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Observation Group</h1>
            <p className="text-gray-600">Set up a new group for teacher observations</p>
          </div>
        </div>
        <Card className="border bg-white">
          <CardContent className="pt-6 flex items-center justify-center py-12">
            <div className="text-gray-600">Loading data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
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
                <Label htmlFor="note">Notes</Label>
                <Textarea
                  id="note"
                  placeholder="Optional notes about this observation group"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-lg"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observer">Observer (Administrator) *</Label>
                <select
                  id="observer"
                  className="w-full p-2 border rounded-lg"
                  value={selectedObserver}
                  onChange={(e) => setSelectedObserver(e.target.value)}
                  required
                >
                  <option value="" disabled>Select an observer</option>
                  {administrators.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.user.name} ({admin.user.email})
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.user.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{teacher.subject}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{teacher.grade}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{teacher.years_of_experience} years</td>
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