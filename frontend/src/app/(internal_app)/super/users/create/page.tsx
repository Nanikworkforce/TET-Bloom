"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userApi, teacherApi, administratorApi, ApiError } from "@/lib/api";


export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    subject: "",
    grade: "",
    years_of_experience: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInviteSent(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.role) {
        setError("Please fill in all required fields: Name, Email, and Role.");
        return;
    }

    setIsLoading(true);
    
    try {
      // Create user data
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Active'
      };

      // Create user in backend
      const userResponse = await userApi.create(userData);
      
      // If user is a teacher, create teacher profile
      if (formData.role === "Teacher" && userResponse.data && typeof userResponse.data === 'object' && 'id' in userResponse.data) {
        const teacherData = {
          user: (userResponse.data as any).id,
          subject: formData.subject || "General",
          grade: formData.grade || "Kindergarten",
          years_of_experience: formData.years_of_experience
        };
        
        console.log("Creating teacher with data:", teacherData);
        await teacherApi.create(teacherData);
      }

      // If user is an administrator, create administrator profile
      if (formData.role === "Administrator" && userResponse.data && typeof userResponse.data === 'object' && 'id' in userResponse.data) {
        const adminData = {
          user: (userResponse.data as any).id,
          // No specific fields for administrators yet, but can be added later
        };
        console.log("Creating administrator with data:", adminData);
        await administratorApi.create(adminData);
      }

      setInviteSent(true);
      console.log("User created successfully:", userResponse.data);
      
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to create user: ${err.message}`);
      } else {
        setError("Failed to create user. Please try again.");
      }
      console.error("Error creating user:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const subjects = ["Mathematics", "Science", "English Language Arts", "Social Studies", "Art", "Music", "Physical Education", "Other"];
  const grades = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Specialist/Other"];


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New User</h1>
          <p className="text-gray-600">Create a new user account in the system.</p>
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
          <CardDescription>Fill in the information to create a new user account.</CardDescription>
        </CardHeader>
        <CardContent>
          {inviteSent ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">User Created Successfully!</h2>
              <p className="text-gray-600 mt-2">
                User {formData.name} has been created successfully. <br/>They can now log in using their email address.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/super/users">
                  <Button variant="outline" className="rounded-full">
                    Back to User Management
                  </Button>
                </Link>
                <Button onClick={() => { setInviteSent(false); setFormData({ name: '', email: '', role: '', subject: '', grade: '', years_of_experience: 0}); setError(null); }} className="rounded-full">
                  Create Another User
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

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select onValueChange={handleRoleChange} value={formData.role} required>
                  <SelectTrigger className="w-full md:w-1/2 rounded-lg">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Super User">Super User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "Teacher" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, subject: value}))} value={formData.subject}>
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
                    <Select onValueChange={(value) => setFormData(prev => ({...prev, grade: value}))} value={formData.grade}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                    <Input
                      id="years_of_experience"
                      name="years_of_experience"
                      type="number"
                      min="0"
                      value={formData.years_of_experience}
                      onChange={(e) => setFormData(prev => ({...prev, years_of_experience: parseInt(e.target.value) || 0}))}
                      placeholder="0"
                      className="rounded-lg"
                    />
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
                  {isLoading ? "Creating User..." : "Invite User"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 