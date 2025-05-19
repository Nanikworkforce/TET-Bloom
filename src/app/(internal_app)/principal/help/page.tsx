"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SchoolLeaderHelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Administrator Guide</h1>
        <p className="text-gray-600">Comprehensive documentation for school administrators</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p>
                  Welcome to the TET Bloom administrator portal. This platform provides you with tools to:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Manage teacher evaluations and observations</li>
                  <li>Schedule and conduct classroom observations</li>
                  <li>Provide structured feedback to teachers</li>
                  <li>Track professional development progress</li>
                  <li>Generate reports on teaching effectiveness</li>
                  <li>Support continuous improvement in your school</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Key Administrative Functions</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700">Teacher Management</h4>
                    <p className="text-sm mt-2">
                      View teacher profiles, assignments, and evaluation histories. Organize teachers by
                      department, grade level, or custom groups.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-green-700">Observation Scheduling</h4>
                    <p className="text-sm mt-2">
                      Plan and schedule classroom observations. Create observation cycles and assign
                      evaluators to specific teachers.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700">Feedback & Development</h4>
                    <p className="text-sm mt-2">
                      Provide structured feedback to teachers. Respond to review requests and
                      monitor professional growth over time.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                  <h4 className="text-blue-700 font-medium">Best Practice</h4>
                  <p className="text-blue-600 text-sm mt-1">
                    Review the observation schedule at the beginning of each month to ensure balanced
                    coverage across all teachers and departments. Regular check-ins with new teachers
                    are especially important.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Observations Tab */}
        <TabsContent value="observations">
          <Card>
            <CardHeader>
              <CardTitle>Observation Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Scheduling Observations</h3>
                <p>
                  To schedule a new observation:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to the Observations section</li>
                  <li>Click "Schedule New Observation"</li>
                  <li>Select the teacher to observe</li>
                  <li>Choose a date and time</li>
                  <li>Select the observation type (formal/informal)</li>
                  <li>Add any additional notes or focus areas</li>
                  <li>Save the observation schedule</li>
                </ol>

                <p className="mt-4">
                  Once scheduled, the teacher will receive a notification and be prompted to submit
                  their lesson plan and materials.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">Conducting Observations</h3>
                <p>
                  On the day of the observation:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Access the observation details from your dashboard</li>
                  <li>Review the teacher's submitted lesson plan and materials</li>
                  <li>Use the mobile-friendly observation form during the classroom visit</li>
                  <li>Take detailed notes of both strengths and areas for growth</li>
                  <li>Complete all required sections of the observation rubric</li>
                </ol>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
                  <h4 className="text-amber-700 font-medium">Important</h4>
                  <p className="text-amber-600 text-sm mt-1">
                    Always complete your observation form within 48 hours of the classroom visit to
                    ensure details are fresh and feedback is timely for the teacher.
                  </p>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Managing Multiple Observers</h3>
                <p>
                  For schools with multiple administrators or instructional coaches:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Use the "Assign Observer" function to delegate observations</li>
                  <li>Track observation completion status in the dashboard</li>
                  <li>Review observation consistency across different observers</li>
                  <li>Conduct joint observations for calibration purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Providing Effective Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Creating Feedback</h3>
                <p>
                  After completing an observation, you'll need to provide structured feedback:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to the completed observation</li>
                  <li>Click "Provide Feedback"</li>
                  <li>Complete the "Glows" section highlighting teacher strengths</li>
                  <li>Document "Grows" areas for potential improvement</li>
                  <li>Select appropriate ratings for each domain</li>
                  <li>Create a specific action plan with clear next steps</li>
                  <li>Submit the feedback for teacher review</li>
                </ol>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                  <h4 className="text-blue-700 font-medium">Feedback Best Practices</h4>
                  <p className="text-blue-600 text-sm mt-1">
                    Balance positive feedback with growth areas. Be specific about both what was done well and
                    what could be improved. Always connect feedback to student learning outcomes and provide
                    actionable next steps.
                  </p>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Addressing Review Requests</h3>
                <p>
                  When a teacher requests a review of their feedback:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Review the teacher's comments carefully</li>
                  <li>Schedule a face-to-face meeting to discuss concerns</li>
                  <li>Listen to the teacher's perspective</li>
                  <li>Consider revising feedback if warranted</li>
                  <li>Document the resolution in the system</li>
                </ol>

                <p className="mt-4">
                  The review process is an opportunity for professional dialogue. Approach it as a
                  collaborative discussion rather than a defense of your assessment.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">Tracking Feedback Implementation</h3>
                <p>
                  Follow up on action steps from previous observations:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Use the "Action Plan Tracker" to monitor progress</li>
                  <li>Schedule informal follow-up observations</li>
                  <li>Acknowledge growth in subsequent feedback</li>
                  <li>Adjust action plans as needed based on progress</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generating & Using Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Available Reports</h3>
                <p>
                  TET Bloom offers various reports to help monitor teaching effectiveness:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-700">Teacher Performance</h4>
                    <p className="text-sm mt-2">
                      Individual teacher reports showing observation history, rating trends, and progress
                      on professional development goals.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-green-700">Department Analysis</h4>
                    <p className="text-sm mt-2">
                      Compare performance metrics across departments or grade levels to identify areas
                      of strength and needs for targeted support.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-amber-700">Observation Trends</h4>
                    <p className="text-sm mt-2">
                      Track school-wide trends in teaching practice over time, highlighting overall
                      growth and persistent challenges.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700">Professional Development Needs</h4>
                    <p className="text-sm mt-2">
                      Identify common growth areas to inform school-wide professional development planning
                      and resource allocation.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Generating Reports</h3>
                <p>
                  To create a new report:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to the Reports section</li>
                  <li>Select the report type</li>
                  <li>Choose the relevant time period</li>
                  <li>Apply any filters (department, grade level, etc.)</li>
                  <li>Generate the report</li>
                  <li>Export or share as needed</li>
                </ol>

                <h3 className="text-lg font-medium mt-6 mb-3">Using Data for School Improvement</h3>
                <p>
                  Effective use of observation data:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Identify patterns across classrooms and departments</li>
                  <li>Celebrate strengths and share best practices</li>
                  <li>Target professional development to specific needs</li>
                  <li>Track the impact of improvement initiatives</li>
                  <li>Inform resource allocation and staffing decisions</li>
                </ul>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
                  <h4 className="text-purple-700 font-medium">Data Privacy Reminder</h4>
                  <p className="text-purple-600 text-sm mt-1">
                    Teacher evaluation data is sensitive and confidential. Share reports only with authorized
                    personnel and always be mindful of privacy considerations when discussing results.
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
                    How many observations should each teacher receive?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      The number of required observations typically depends on district policy and teacher experience.
                      As a general guideline, new teachers should receive 3-4 formal observations per year, while
                      experienced teachers may receive 1-2 formal observations supplemented by informal walkthroughs.
                      Always refer to your district's evaluation policy for specific requirements.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How can I modify an observation after it's scheduled?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      To modify a scheduled observation, go to the Observations section, find the specific observation,
                      and click "Edit" or the three-dot menu to access options. You can change the date, time, or focus
                      area. The teacher will receive a notification of any changes. Avoid rescheduling observations
                      frequently as this can disrupt teachers' preparation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What should I do if a teacher disagrees with their feedback?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      If a teacher requests a review of their feedback, schedule a face-to-face meeting within a
                      week. Listen to their concerns with an open mind, review the evidence together, and be
                      willing to revise your assessment if appropriate. The goal is to reach a shared understanding
                      that supports professional growth. Document the resolution in the system, whether you modify
                      the feedback or maintain your original assessment with additional explanation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can I assign other administrators as observers?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Yes, you can assign other administrators or instructional coaches as observers if they have
                      the appropriate access level in the system. When scheduling an observation, use the "Assign
                      Observer" dropdown to select another qualified evaluator. Consider pairing experienced and
                      newer evaluators for calibration purposes. Remember that all observers must be properly
                      trained on your evaluation framework.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    How can I export data for district reporting?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      To export data, navigate to the Reports section and select the report type needed for district
                      reporting. After generating the report, click the "Export" button and choose your preferred
                      format (Excel, PDF, or CSV). For comprehensive year-end reporting, use the "Annual Summary"
                      report type, which compiles all evaluation data for the selected time period.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    How should I approach observations for struggling teachers?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      For teachers needing additional support, consider increasing observation frequency but maintaining
                      a growth-oriented approach. Provide very specific, actionable feedback tied to concrete examples.
                      Create a more detailed action plan with short-term goals and regular check-ins. Consider
                      assigning a mentor teacher or instructional coach. Document all support provided and progress
                      made, especially if performance concerns may lead to more formal improvement plans.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    How can I ensure consistency across multiple observers?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      To maintain consistency, conduct calibration exercises where multiple observers evaluate the
                      same lesson (either live or recorded) and compare ratings. Hold regular observer meetings to
                      discuss the evaluation rubric and review sample evidence. Use the "Observer Consistency Report"
                      to identify and address any patterns of significant rating differences between observers.
                      Consider occasional joint observations for ongoing calibration.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    What are best practices for end-of-year evaluations?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      For end-of-year evaluations, review the complete observation history and all feedback provided
                      throughout the year. Consider growth over time rather than focusing solely on the most recent
                      observation. Schedule longer conferences with teachers to discuss overall performance and set
                      goals for the following year. Generate the "Teacher Year Summary" report to guide your conversation
                      and provide teachers with a comprehensive view of their professional growth.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-center">
                <h3 className="font-medium text-gray-700 mb-2">Need additional support?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  For administrator-specific training or technical assistance, contact your district
                  coordinator or the TET Bloom support team.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/contact-support" className="text-primary hover:underline text-sm font-medium">
                    Administrator Support
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/admin-training" className="text-primary hover:underline text-sm font-medium">
                    Advanced Training
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