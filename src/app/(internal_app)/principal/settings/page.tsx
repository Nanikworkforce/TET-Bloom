"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SchoolLeaderSettingsPage() {
  // Profile settings
  const [profile, setProfile] = useState({
    name: "School Leader Johnson",
    email: "johnson@schooldistrict.edu",
    phone: "(555) 123-4567",
    title: "School Leader",
    avatar: "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newObservation: true,
    lessonPlanSubmitted: true,
    feedbackReviewRequested: true,
    systemUpdates: false,
    weeklyDigest: true,
  });

  // System preferences
  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    autoSave: true,
    defaultView: "observations",
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    emailSignature: "Best regards,\nSchool Leader Johnson\nMiddle School",
    ccAdmin: false,
    bccSelf: true,
  });

  // Handle notifications toggle
  const handleNotificationToggle = (field: string) => {
    setNotifications({
      ...notifications,
      [field]: !notifications[field as keyof typeof notifications],
    });
  };

  // Handle preferences toggle
  const handlePreferenceToggle = (field: string) => {
    setPreferences({
      ...preferences,
      [field]: !preferences[field as keyof typeof preferences],
    });
  };

  // Handle email settings toggle
  const handleEmailToggle = (field: string) => {
    setEmailSettings({
      ...emailSettings,
      [field]: !emailSettings[field as keyof typeof emailSettings],
    });
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving
    setTimeout(() => {
      alert("Profile updated successfully");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="email">Email Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <Button variant="outline" type="button">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="password"
                      value="••••••••••"
                      disabled
                      className="flex-1"
                    />
                    <Button variant="outline" type="button">
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-medium text-sm text-gray-700">Notify me about:</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-observation" className="flex-1 cursor-pointer">
                      New observation requests
                    </Label>
                    <Switch
                      id="new-observation"
                      checked={notifications.newObservation}
                      onCheckedChange={() => handleNotificationToggle("newObservation")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lesson-plan" className="flex-1 cursor-pointer">
                      Lesson plan submissions
                    </Label>
                    <Switch
                      id="lesson-plan"
                      checked={notifications.lessonPlanSubmitted}
                      onCheckedChange={() => handleNotificationToggle("lessonPlanSubmitted")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="feedback-review" className="flex-1 cursor-pointer">
                      Feedback review requests
                    </Label>
                    <Switch
                      id="feedback-review"
                      checked={notifications.feedbackReviewRequested}
                      onCheckedChange={() => handleNotificationToggle("feedbackReviewRequested")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-updates" className="flex-1 cursor-pointer">
                      System updates and announcements
                    </Label>
                    <Switch
                      id="system-updates"
                      checked={notifications.systemUpdates}
                      onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly-digest" className="flex-1 cursor-pointer">
                      Weekly observation digest
                    </Label>
                    <Switch
                      id="weekly-digest"
                      checked={notifications.weeklyDigest}
                      onCheckedChange={() => handleNotificationToggle("weeklyDigest")}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Customize your experience with the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex-1 cursor-pointer">
                    <div>
                      <p>Dark Mode</p>
                      <p className="text-sm text-gray-500">Use dark theme throughout the application</p>
                    </div>
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={preferences.darkMode}
                    onCheckedChange={() => handlePreferenceToggle("darkMode")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-view" className="flex-1 cursor-pointer">
                    <div>
                      <p>Compact View</p>
                      <p className="text-sm text-gray-500">Show more information with less spacing</p>
                    </div>
                  </Label>
                  <Switch
                    id="compact-view"
                    checked={preferences.compactView}
                    onCheckedChange={() => handlePreferenceToggle("compactView")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save" className="flex-1 cursor-pointer">
                    <div>
                      <p>Auto Save</p>
                      <p className="text-sm text-gray-500">Automatically save forms while editing</p>
                    </div>
                  </Label>
                  <Switch
                    id="auto-save"
                    checked={preferences.autoSave}
                    onCheckedChange={() => handlePreferenceToggle("autoSave")}
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default Dashboard View</Label>
                  <select
                    id="default-view"
                    className="w-full p-2 border rounded-md"
                    value={preferences.defaultView}
                    onChange={(e) => setPreferences({ ...preferences, defaultView: e.target.value })}
                  >
                    <option value="observations">Observations</option>
                    <option value="teachers">Teachers</option>
                    <option value="feedback">Feedback</option>
                    <option value="reports">Reports</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure how emails are sent from the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <textarea
                  id="email-signature"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  value={emailSettings.emailSignature}
                  onChange={(e) => setEmailSettings({ ...emailSettings, emailSignature: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cc-admin" className="flex-1 cursor-pointer">
                    <div>
                      <p>CC Admin on All Emails</p>
                      <p className="text-sm text-gray-500">Automatically CC school administrators</p>
                    </div>
                  </Label>
                  <Switch
                    id="cc-admin"
                    checked={emailSettings.ccAdmin}
                    onCheckedChange={() => handleEmailToggle("ccAdmin")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="bcc-self" className="flex-1 cursor-pointer">
                    <div>
                      <p>BCC Yourself</p>
                      <p className="text-sm text-gray-500">Receive a copy of all sent emails</p>
                    </div>
                  </Label>
                  <Switch
                    id="bcc-self"
                    checked={emailSettings.bccSelf}
                    onCheckedChange={() => handleEmailToggle("bccSelf")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button>Save Email Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 