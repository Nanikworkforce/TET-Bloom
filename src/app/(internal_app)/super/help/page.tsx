"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SuperUserHelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">System Administration Guide</h1>
        <p className="text-gray-600">Reference and documentation for TET Bloom super users</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="groups">Observation Groups</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Super User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p>
                  As a super user, you have system-wide administrative access to TET Bloom.
                  Your responsibilities include:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Creating and managing user accounts for all staff</li>
                  <li>Organizing teachers into observation groups</li>
                  <li>Configuring system-wide settings and preferences</li>
                  <li>Managing evaluation frameworks and rubrics</li>
                  <li>Monitoring system usage and generating reports</li>
                  <li>Providing technical support to school-leaders and teachers</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Super User Dashboard Overview</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700">User Management</h4>
                    <p className="text-sm mt-2">
                      Create, edit, and deactivate user accounts. Assign appropriate roles and
                      permissions to each user type.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700">Observation Groups</h4>
                    <p className="text-sm mt-2">
                      Create and organize teacher groups that can be assigned to specific school-leaders
                      or administrators for observations.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-green-700">System Settings</h4>
                    <p className="text-sm mt-2">
                      Configure district-specific settings, evaluation frameworks, notification rules,
                      and integration with other systems.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                  <h4 className="text-blue-700 font-medium">Security Best Practice</h4>
                  <p className="text-blue-600 text-sm mt-1">
                    Super user accounts have extensive permissions. Always use strong passwords, enable
                    two-factor authentication if available, and avoid sharing access credentials with others.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Creating User Accounts</h3>
                <p>
                  To create a new user account:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to User Management</li>
                  <li>Click "Add New User"</li>
                  <li>Enter the user's information (name, email, etc.)</li>
                  <li>Select the appropriate role (Teacher, School Leader, Super User)</li>
                  <li>Assign to appropriate school or department</li>
                  <li>Set initial password or enable email invitation</li>
                  <li>Save the new user record</li>
                </ol>

                <h3 className="text-lg font-medium mt-6 mb-3">Bulk User Import</h3>
                <p>
                  For adding multiple users simultaneously:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to User Management</li>
                  <li>Click "Bulk Import"</li>
                  <li>Download the template spreadsheet</li>
                  <li>Fill in user details according to the template format</li>
                  <li>Upload the completed spreadsheet</li>
                  <li>Review and confirm the import preview</li>
                  <li>Process the import</li>
                </ol>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
                  <h4 className="text-amber-700 font-medium">Important</h4>
                  <p className="text-amber-600 text-sm mt-1">
                    Always verify email addresses before bulk import to prevent creating accounts with
                    incorrect contact information. The system will send welcome emails to all new users.
                  </p>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Managing Existing Users</h3>
                <p>
                  To update or deactivate existing users:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Search for users by name, email, or role</li>
                  <li>Click on a user to view/edit their profile</li>
                  <li>Update information as needed</li>
                  <li>Toggle account status (active/inactive) to control access</li>
                  <li>Reset passwords for users who need account recovery</li>
                  <li>Change role assignments as staff responsibilities change</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Role Permissions</h3>
                <p>
                  Overview of system roles:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700">Teacher</h4>
                    <ul className="text-sm mt-2 space-y-1 list-disc pl-4">
                      <li>View own observations and feedback</li>
                      <li>Submit lesson plans</li>
                      <li>Respond to feedback</li>
                      <li>Access professional development resources</li>
                    </ul>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700">School Leader</h4>
                    <ul className="text-sm mt-2 space-y-1 list-disc pl-4">
                      <li>Schedule and conduct observations</li>
                      <li>Provide feedback to teachers</li>
                      <li>Generate reports for assigned teachers</li>
                      <li>Manage teacher development plans</li>
                    </ul>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700">Super User</h4>
                    <ul className="text-sm mt-2 space-y-1 list-disc pl-4">
                      <li>All system functions</li>
                      <li>User account management</li>
                      <li>System configuration</li>
                      <li>District-wide reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Observation Groups Tab */}
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <CardTitle>Observation Group Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Creating Observation Groups</h3>
                <p>
                  Observation groups organize teachers for evaluation assignments:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to Observation Groups</li>
                  <li>Click "Create New Group"</li>
                  <li>Enter a descriptive name for the group</li>
                  <li>Select the group type (Department, Grade Level, Custom)</li>
                  <li>Add teachers to the group from the user directory</li>
                  <li>Assign school-leaders or administrators as group observers</li>
                  <li>Save the group configuration</li>
                </ol>

                <h3 className="text-lg font-medium mt-6 mb-3">Group Organization Strategies</h3>
                <p>
                  Consider these approaches for organizing observation groups:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li><strong>By Department:</strong> Group teachers by subject area for subject-specific evaluation</li>
                  <li><strong>By Grade Level:</strong> Organize by grade for age-appropriate pedagogical focus</li>
                  <li><strong>By Experience:</strong> Create new teacher mentoring groups with focused support</li>
                  <li><strong>By Building:</strong> Group by physical location for logistical efficiency</li>
                  <li><strong>By Development Need:</strong> Create groups for specific growth areas</li>
                </ul>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
                  <h4 className="text-purple-700 font-medium">Group Assignment Tip</h4>
                  <p className="text-purple-600 text-sm mt-1">
                    Balance observer workloads by considering the number of observations required for each
                    teacher. New teachers typically require more observations, so adjust group sizes accordingly.
                  </p>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Managing Group Assignments</h3>
                <p>
                  To modify group membership or observers:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Select an existing observation group</li>
                  <li>Click "Edit Group"</li>
                  <li>Add or remove teachers as needed</li>
                  <li>Update observer assignments</li>
                  <li>Save your changes</li>
                </ol>

                <p className="mt-4">
                  When teachers or administrators change roles or leave the organization,
                  remember to update their group assignments accordingly.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">Group Reporting</h3>
                <p>
                  Observation groups enable specialized reporting:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Generate group-specific observation completion reports</li>
                  <li>Compare performance metrics across different groups</li>
                  <li>Track observer workload and completion rates</li>
                  <li>Identify group-specific professional development needs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">General Settings</h3>
                <p>
                  Configure district-specific system settings:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li><strong>District Information:</strong> Update district name, logo, and contact details</li>
                  <li><strong>Academic Calendar:</strong> Set school year dates and observation windows</li>
                  <li><strong>Email Settings:</strong> Configure email templates and notification preferences</li>
                  <li><strong>Security Settings:</strong> Set password policies and account security options</li>
                  <li><strong>Appearance:</strong> Customize colors, branding, and display preferences</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Evaluation Framework Configuration</h3>
                <p>
                  Customize observation forms and evaluation criteria:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to System Settings > Evaluation Frameworks</li>
                  <li>Select an existing framework or create a new one</li>
                  <li>Define domains, components, and elements</li>
                  <li>Configure rating scales and descriptors</li>
                  <li>Set up observation form layouts</li>
                  <li>Define required evidence and documentation</li>
                </ol>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                  <h4 className="text-blue-700 font-medium">Configuration Tip</h4>
                  <p className="text-blue-600 text-sm mt-1">
                    Always test framework changes in a controlled environment before full deployment.
                    Consider piloting new evaluation components with a small group before system-wide implementation.
                  </p>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Workflow Configuration</h3>
                <p>
                  Define observation and feedback processes:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li><strong>Observation Cycle:</strong> Set due dates for lesson plans and feedback</li>
                  <li><strong>Approval Workflows:</strong> Configure review and approval processes</li>
                  <li><strong>Notification Rules:</strong> Set up automated reminders and alerts</li>
                  <li><strong>Document Requirements:</strong> Define required documentation for observations</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">System Maintenance</h3>
                <p>
                  Routine system administration tasks:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li><strong>Backups:</strong> Schedule and verify regular data backups</li>
                  <li><strong>Year-End Procedures:</strong> Archive old data and prepare for new school year</li>
                  <li><strong>User Cleanup:</strong> Deactivate accounts for departed staff</li>
                  <li><strong>Performance Monitoring:</strong> Check system usage and performance metrics</li>
                  <li><strong>Updates:</strong> Apply system updates and patches when available</li>
                </ul>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
                  <h4 className="text-amber-700 font-medium">Important</h4>
                  <p className="text-amber-600 text-sm mt-1">
                    Always announce planned maintenance windows in advance. Schedule system updates during
                    low-usage periods (weekends or evenings) to minimize disruption to users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I transfer a teacher to a different school?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      To transfer a teacher to a different school, go to User Management, search for the teacher,
                      and edit their profile. Update their school assignment in the Organization section. Then, remove
                      them from their current observation groups and add them to appropriate groups at the new school.
                      Notify the school-leaders at both schools about the transfer to ensure proper handoff of any ongoing
                      evaluation processes.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    What happens to observation data when a teacher leaves the district?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      When a teacher leaves the district, you should deactivate their account rather than delete it.
                      This preserves all historical observation data for reporting purposes. To deactivate an account,
                      go to User Management, find the teacher, and change their status to "Inactive." Their data will
                      remain in the system but they will no longer have access. You can also generate an export of
                      their complete evaluation history for record-keeping.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How can I reset a user's password?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      To reset a user's password, go to User Management and find the user's account. Click on
                      "Reset Password" in their profile. You can either set a temporary password manually or send
                      an automated password reset email to the user's registered email address. For security reasons,
                      if you set a manual temporary password, instruct the user to change it immediately upon login.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    How do I prepare the system for a new school year?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Preparing for a new school year involves several steps: 1) Archive completed observations from
                      the previous year, 2) Update the academic calendar with new dates, 3) Update teacher assignments
                      and observation groups, 4) Deactivate accounts for staff who have left, 5) Create accounts for
                      new staff, 6) Update any evaluation framework changes, and 7) Reset observation counts and
                      tracking metrics. This is typically done during summer break before teachers return.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Can I customize notification emails?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Yes, you can customize notification emails. Go to System Settings > Email Templates to access
                      the email editor. You can modify the content, formatting, and timing of various notification
                      types, such as observation reminders, feedback alerts, and account notifications. You can include
                      dynamic fields that will be populated with user-specific information. Always test your customized
                      templates before activating them system-wide.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    How do I add a new observation form or rubric?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      To add a new observation form or rubric, go to System Settings > Evaluation Frameworks.
                      Click "Create New Framework" and use the form builder to design your observation template.
                      You can define domains, components, rating scales, and evidence requirements. Once created,
                      you can assign the new framework to specific observation types or groups. Consider piloting
                      new forms with a small group before district-wide implementation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    How do I generate district-wide reports?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      For district-wide reporting, go to the Reports section and select "District Overview" from
                      the report types. You can configure parameters such as date range, included schools, and
                      metrics to analyze. The system can generate comprehensive reports on observation completion,
                      rating distributions, and growth trends across the district. These reports can be exported
                      in various formats (PDF, Excel, CSV) for sharing with district leadership or school boards.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    What should I do if a school-leader accidentally deletes feedback?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The system maintains an audit log and data recovery options for accidental deletions.
                      Go to System Settings > Recovery Tools and select "Feedback Recovery." You can search
                      for recently deleted feedback by teacher name, date range, or observer. Locate the
                      deleted feedback item and use the "Restore" function. Note that recovery is only possible
                      for items deleted within the past 30 days, so act promptly when accidental deletions occur.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-center">
                <h3 className="font-medium text-gray-700 mb-2">Technical Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For advanced system administration assistance, contact TET Bloom technical support.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/technical-support" className="text-primary hover:underline text-sm font-medium">
                    Contact Technical Support
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/admin-resources" className="text-primary hover:underline text-sm font-medium">
                    System Admin Resources
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 