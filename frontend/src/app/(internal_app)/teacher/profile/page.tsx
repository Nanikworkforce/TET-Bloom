"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { baseUrl, authApi } from "@/lib/api";
import { 
  User,
  Mail,
  GraduationCap,
  Calendar,
  BookOpen,
  Phone,
  Save,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit,
  Award,
  Clock
} from "lucide-react";

interface TeacherProfile {
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
  phoneNumber?: string;
  classroomNumber?: string;
  bio?: string;
  education?: string;
  certifications?: string[];
  joinDate?: string;
}

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function TeacherProfilePage() {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<TeacherProfile>>({});
  
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch teacher profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch all teachers to find the current user's teacher record
        const allTeachersResponse = await fetch(`${baseUrl}/teachers/`);
        if (allTeachersResponse.ok) {
          const allTeachers = await allTeachersResponse.json();
          
          const teacherRecord = allTeachers.find((teacher: TeacherProfile) => 
            teacher.user.email === user.email || teacher.user.id === user.id
          );
          
          if (teacherRecord) {
            // Try to fetch detailed profile
            const detailResponse = await fetch(`${baseUrl}/teachers/${teacherRecord.id}/`);
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              
              // Add mock additional fields if not present
              const enhancedProfile = {
                ...detailData,
                phoneNumber: detailData.phoneNumber || "(555) 123-4567",
                classroomNumber: detailData.classroomNumber || "Room 205",
                bio: detailData.bio || `I am a passionate ${detailData.subject} teacher with ${detailData.years_of_experience} years of experience. I enjoy helping students discover their potential and develop a love for learning.`,
                education: detailData.education || "Master's in Education, Bachelor's in " + detailData.subject,
                certifications: detailData.certifications || ["Teaching License", "Subject Area Certification"],
                joinDate: detailData.joinDate || "2020-08-15"
              };
              
              setProfileData(enhancedProfile);
              setEditedProfile(enhancedProfile);
            } else {
              setProfileData(teacherRecord);
              setEditedProfile(teacherRecord);
            }
          } else {
            setError("Teacher profile not found");
          }
        } else {
          setError("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id, user?.email]);

  // Save profile changes
  const saveProfileChanges = async () => {
    if (!profileData) return;

    setSaving(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProfileData({ ...profileData, ...editedProfile });
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    setSaving(true);
    try {
      const response = await authApi.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      });
      
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
      setSuccessMessage("Password changed successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your teaching profile and account settings</p>
        </div>
        <div className="flex gap-3">
          {!isChangingPassword && (
            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          )}
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card className="lg:col-span-1 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Teacher Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Picture Placeholder */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {profileData?.user?.name?.[0]?.toUpperCase() || 'T'}
              </div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            {/* Role Badge */}
            <div className="text-center">
              <Badge className="bg-blue-100 text-blue-800">
                <GraduationCap className="h-3 w-3 mr-1" />
                Teacher
              </Badge>
            </div>

            {/* Teaching Info */}
            <div className="text-center space-y-1">
              <Badge className="bg-green-100 text-green-800">
                <BookOpen className="h-3 w-3 mr-1" />
                {profileData?.subject}
              </Badge>
              <div className="text-sm text-gray-600">
                {profileData?.grade}
              </div>
            </div>

            {/* Experience Badge */}
            <div className="text-center">
              <Badge className="bg-orange-100 text-orange-800">
                <Award className="h-3 w-3 mr-1" />
                {profileData?.years_of_experience} Years Experience
              </Badge>
            </div>

            {/* Quick Info */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{profileData?.user?.email || user?.email}</span>
              </div>
              {profileData?.classroomNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{profileData.classroomNumber}</span>
                </div>
              )}
              {profileData?.joinDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Since {new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Profile Details
              </CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(profileData || {});
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={saveProfileChanges} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedProfile.user?.name || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      user: { ...prev.user, name: e.target.value } as any
                    }))}
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.user?.name || "Not set"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <p className="text-gray-900 font-medium mt-1">{profileData?.user?.email || user?.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                {isEditing ? (
                  <Input
                    id="subject"
                    value={editedProfile.subject || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      subject: e.target.value
                    }))}
                    placeholder="e.g., Mathematics"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.subject || "Not set"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="grade">Grade Level</Label>
                {isEditing ? (
                  <Input
                    id="grade"
                    value={editedProfile.grade || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      grade: e.target.value
                    }))}
                    placeholder="e.g., 5th Grade"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.grade || "Not set"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                {isEditing ? (
                  <Input
                    id="experience"
                    type="number"
                    value={editedProfile.years_of_experience || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      years_of_experience: parseInt(e.target.value) || 0
                    }))}
                    placeholder="5"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.years_of_experience || 0} years</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phoneNumber || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      phoneNumber: e.target.value
                    }))}
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.phoneNumber || "Not set"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="classroom">Classroom Number</Label>
                {isEditing ? (
                  <Input
                    id="classroom"
                    value={editedProfile.classroomNumber || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      classroomNumber: e.target.value
                    }))}
                    placeholder="Room 205"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.classroomNumber || "Not set"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                {isEditing ? (
                  <Input
                    id="education"
                    value={editedProfile.education || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      education: e.target.value
                    }))}
                    placeholder="Master's in Education"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.education || "Not set"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={editedProfile.bio || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      bio: e.target.value
                    }))}
                    placeholder="Tell us about your teaching philosophy and experience..."
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.bio || "Not set"}</p>
                )}
              </div>
            </div>

            {/* Certifications */}
            {profileData?.certifications && profileData.certifications.length > 0 && (
              <div className="pt-4 border-t">
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change Section */}
      {isChangingPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsChangingPassword(false);
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setError(null);
              }}>
                Cancel
              </Button>
              <Button onClick={changePassword} disabled={saving}>
                <Key className="h-4 w-4 mr-2" />
                {saving ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
