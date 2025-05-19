"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - in a real app, this would come from your API/database
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    role: "Teacher",
    subject: "Mathematics",
    grade: "10th Grade",
    startDate: "2020-08-15",
    status: "Active"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@school.edu",
    role: "Teacher",
    subject: "Science",
    grade: "8th Grade",
    startDate: "2018-08-15",
    status: "Active"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@school.edu",
    role: "Teacher",
    subject: "English",
    grade: "11th Grade",
    startDate: "2021-08-15",
    status: "Active"
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@school.edu",
    role: "Principal",
    subject: "",
    grade: "",
    startDate: "2015-08-15",
    status: "Active"
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.martinez@school.edu",
    role: "Teacher",
    subject: "Art",
    grade: "7th Grade",
    startDate: "2019-08-15",
    status: "Inactive"
  },
];

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    subject: "",
    grade: "",
    status: ""
  });
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch user data from your API/database
    const user = mockUsers.find(u => u.id === params.id);
    
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        subject: user.subject || "",
        grade: user.grade || "",
        status: user.status
      });
      setOriginalData({
        name: user.name,
        email: user.email,
        role: user.role,
        subject: user.subject || "",
        grade: user.grade || "",
        status: user.status
      });
    } else {
      setUserNotFound(true);
    }
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      subject: value === "Teacher" ? prev.subject : "",
      grade: value === "Teacher" ? prev.grade : "",
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.role) {
      setError("Please fill in all required fields: Name, Email, and Role.");
      return;
    }

    setIsLoading(true);
    // Simulate API call to update user
    try {
      // In a real app, you would send formData to your backend API
      console.log("Updating user:", params.id, "with data:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSuccess(true);
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const subjects = ["Mathematics", "Science", "English Language Arts", "Social Studies", "Art", "Music", "Physical Education", "Other"];
  const grades = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Specialist/Other"];

  if (userNotFound) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
          </div>
          <Link href="/super/users">
            <Button variant="outline" className="rounded-full shadow-sm">
              ← Back to User Management
            </Button>
          </Link>
        </div>
        <Card className="border bg-white">
          <CardContent className="p-8">
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">User Not Found</h2>
              <p className="text-gray-600 mt-2">
                The user you're trying to edit could not be found.
              </p>
              <div className="mt-6">
                <Link href="/super/users">
                  <Button className="rounded-full">
                    Back to User Management
                  </Button>
                </Link>
              </div>
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
          <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
          <p className="text-gray-600">Update user information and settings</p>
        </div>
        <Link href="/super/users">
          <Button variant="outline" className="rounded-full shadow-sm">
            ← Back to User Management
          </Button>
        </Link>
      </div>

      <Card className="border bg-white">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Update the user's information below.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">User Updated!</h2>
              <p className="text-gray-600 mt-2">
                The user information has been successfully updated.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/super/users">
                  <Button variant="outline" className="rounded-full">
                    Back to User Management
                  </Button>
                </Link>
                <Button onClick={() => setSuccess(false)} className="rounded-full">
                  Continue Editing
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Jane Doe"
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., jane.doe@example.com"
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select onValueChange={handleRoleChange} value={formData.role} required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Principal">Principal</SelectItem>
                      <SelectItem value="Super">Super User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={handleStatusChange} value={formData.status} required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.role === "Teacher" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      onValueChange={(value) => setFormData(prev => ({...prev, subject: value}))} 
                      value={formData.subject}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Select 
                      onValueChange={(value) => setFormData(prev => ({...prev, grade: value}))} 
                      value={formData.grade}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Link href="/super/users">
                  <Button type="button" variant="outline" className="rounded-full" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="rounded-full" disabled={isLoading}>
                  {isLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 