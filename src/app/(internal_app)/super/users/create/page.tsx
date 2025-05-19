"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    subject: "",
    grade: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

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

    // Basic validation (e.g., email format) can be added here if needed
    if (!formData.name || !formData.email || !formData.role) {
        setError("Please fill in all required fields: Name, Email, and Role.");
        return;
    }

    setIsLoading(true);
    // Simulate API call to send invitation
    try {
      // In a real app, you would send formData to your backend API
      // which then handles sending an email invite (e.g., via Supabase Auth or Resend)
      console.log("Sending invitation to:", formData.email, "for user:", formData.name, "with role:", formData.role);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setInviteSent(true);
      // Optionally, redirect after a delay or on a button click from the success message
      // router.push("/super/users"); 
    } catch (err) {
      setError("Failed to send invitation. Please try again.");
      console.error(err);
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
          <h1 className="text-2xl font-bold text-gray-800">Invite New User</h1>
          <p className="text-gray-600">Send an email invitation to a new user to set up their account.</p>
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
          <CardDescription>Fill in the information to send an invitation.</CardDescription>
        </CardHeader>
        <CardContent>
          {inviteSent ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Invitation Sent!</h2>
              <p className="text-gray-600 mt-2">
                An invitation email has been sent to {formData.email}. <br/>They will be able to set their password and log in using the link in the email.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/super/users">
                  <Button variant="outline" className="rounded-full">
                    Back to User Management
                  </Button>
                </Link>
                <Button onClick={() => { setInviteSent(false); setFormData({ name: '', email: '', role: '', subject: '', grade: ''}); setError(null); }} className="rounded-full">
                  Invite Another User
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
                    <SelectItem value="School Leader">School Leader</SelectItem>
                    <SelectItem value="Super">Super User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "Teacher" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4">
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
                  {isLoading ? "Sending Invitation..." : "Send Invitation"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 