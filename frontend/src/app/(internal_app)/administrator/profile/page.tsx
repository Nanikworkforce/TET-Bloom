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
  Shield,
  Calendar,
  MapPin,
  Phone,
  Save,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit
} from "lucide-react";

interface AdministratorProfile {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  department?: string;
  phone_number?: string;
  office_location?: string;
  join_date?: string;
  bio?: string;
}

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdministratorProfilePage() {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<AdministratorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<AdministratorProfile>>({});
  
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

  // Debug authentication state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const mockUser = localStorage.getItem('tet-bloom:mockUser');
      console.log('Authentication Debug:', {
        user: user,
        hasAccessToken: !!token,
        hasRefreshToken: !!refreshToken,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'None',
        tokenActualValue: token,
        hasMockUser: !!mockUser,
        isTokenStringNull: token === 'null',
        isTokenStringUndefined: token === 'undefined',
        enforceAuth: process.env.NEXT_PUBLIC_ENFORCE_AUTH
      });
    }
  }, [user]);

  // Fetch administrator profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch all administrators to find the current user's admin record
        const allAdminsResponse = await fetch(`${baseUrl}/administrators/`);
        if (allAdminsResponse.ok) {
          const allAdmins = await allAdminsResponse.json();
          
          console.log('Looking for admin with user email:', user.email, 'and user id:', user.id);
          console.log('Available administrators:', allAdmins.map((admin: AdministratorProfile) => ({ 
            id: admin.id, 
            userName: admin.user.name, 
            userEmail: admin.user.email, 
            userId: admin.user.id 
          })));
          
          const adminRecord = allAdmins.find((admin: AdministratorProfile) => 
            admin.user.email === user.email || admin.user.id.toString() === user.id.toString()
          );
          
          if (adminRecord) {
            console.log('Found admin record:', adminRecord);
            // Try to fetch detailed profile
            const detailResponse = await fetch(`${baseUrl}/administrators/${adminRecord.id}/`);
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log('Detailed admin data:', detailData);
              setProfileData(detailData);
              setEditedProfile(detailData);
            } else {
              console.log('Detail fetch failed, using admin record');
              setProfileData(adminRecord);
              setEditedProfile(adminRecord);
            }
          } else {
            console.log('No administrator record found for user:', { email: user.email, id: user.id });
            setError("Administrator profile not found");
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
      // Test authentication first
      console.log('Testing authentication before password change...');
      try {
        const authTest = await authApi.testAuth();
        console.log('Auth test successful:', authTest);
      } catch (authError) {
        console.error('Auth test failed:', authError);
        
        // Try to get a fresh JWT token by calling Django login directly
        console.log('Attempting to get fresh JWT token...');
        try {
          const freshTokenResponse = await fetch(`${baseUrl}/auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: user?.email, 
              password: passwordForm.currentPassword 
            }),
          });

          if (freshTokenResponse.ok) {
            const tokenData = await freshTokenResponse.json();
            console.log('Fresh token response:', tokenData);
            
            if (tokenData.access) {
              // Store the fresh token and retry
              localStorage.setItem('accessToken', tokenData.access);
              if (tokenData.refresh) {
                localStorage.setItem('refreshToken', tokenData.refresh);
              }
              console.log('Stored fresh tokens, retrying password change...');
            } else {
              setError("Unable to get authentication tokens. The Django login endpoint may not be configured properly.");
              setSaving(false);
              return;
            }
          } else {
            setError("Authentication failed. Please verify your current password is correct.");
            setSaving(false);
            return;
          }
        } catch (tokenError) {
          console.error('Failed to get fresh token:', tokenError);
          setError("Authentication failed. Please log out and log back in.");
          setSaving(false);
          return;
        }
      }

      console.log('Attempting password change...');
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
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const result = await authApi.testAuth();
                setSuccessMessage("Authentication test successful!");
                console.log('Auth test result:', result);
              } catch (error) {
                setError("Authentication test failed. Please log out and log back in.");
                console.error('Auth test error:', error);
              }
            }}
          >
            Test Auth
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              // Clear tokens and force re-login
              if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tet-bloom:mockUser');
              }
              signOut();
            }}
          >
            Force Re-login
          </Button>
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
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Picture Placeholder */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {profileData?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            {/* Role Badge */}
            <div className="text-center">
              <Badge className="bg-purple-100 text-purple-800">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
            </div>

            {/* Quick Info */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{profileData?.user?.email || user?.email}</span>
              </div>
              {profileData?.join_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Joined {new Date(profileData.join_date).toLocaleDateString()}</span>
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
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={editedProfile.department || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      department: e.target.value
                    }))}
                    placeholder="e.g., Academic Affairs"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.department || "Not set"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone_number || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      phone_number: e.target.value
                    }))}
                    placeholder="e.g., (555) 123-4567"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.phone_number || "Not set"}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="office">Office Location</Label>
                {isEditing ? (
                  <Input
                    id="office"
                    value={editedProfile.office_location || ""}
                    onChange={(e) => setEditedProfile(prev => ({
                      ...prev,
                      office_location: e.target.value
                    }))}
                    placeholder="e.g., Building A, Room 205"
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.office_location || "Not set"}</p>
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
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900 font-medium mt-1">{profileData?.bio || "Not set"}</p>
                )}
              </div>
            </div>
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
