"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function TeacherHelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Help & Documentation</h1>
        <p className="text-gray-600">Learn how to use the Teacher Evaluation Tool</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to TET Bloom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p>
                  TET Bloom is a comprehensive Teacher Evaluation Tool designed to support your professional growth
                  and development. This platform allows you to:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>View upcoming classroom observations and prepare necessary materials</li>
                  <li>Submit lesson plans and supporting documents before observations</li>
                  <li>Receive feedback from administrators and respond to it</li>
                  <li>Track your professional development progress</li>
                  <li>Access resources to help improve your teaching practice</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Getting Started</h3>

                <p>
                  To make the most of TET Bloom, we recommend:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Update your profile information in Settings</li>
                  <li>Review scheduled observations on your dashboard</li>
                  <li>Submit required lesson plans well before the due date</li>
                  <li>Check your notifications regularly for updates</li>
                </ol>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                  <h4 className="text-blue-700 font-medium">Quick Tip</h4>
                  <p className="text-blue-600 text-sm mt-1">
                    Use the navigation menu on the left to quickly access different sections of the platform.
                    The notification bell at the top will alert you to important updates.
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
              <CardTitle>Managing Observations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Viewing Scheduled Observations</h3>
                <p>
                  Your dashboard displays all upcoming observations. Click on any observation to view details
                  such as the date, time, observer, and submission requirements.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">Submitting Lesson Plans</h3>
                <p>
                  For each observation, you'll need to submit a lesson plan and any supporting materials:
                </p>

                <ol className="space-y-2 list-decimal pl-6">
                  <li>Navigate to the specific observation</li>
                  <li>Upload your lesson plan document (PDF or Word format)</li>
                  <li>Add any supporting materials (presentations, worksheets, etc.)</li>
                  <li>Include notes for your observer if you have specific areas you'd like feedback on</li>
                  <li>Submit your materials before the due date (typically two weeks before the observation)</li>
                </ol>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
                  <h4 className="text-amber-700 font-medium">Important</h4>
                  <p className="text-amber-600 text-sm mt-1">
                    Late submissions may affect your evaluation. If you need an extension, contact your administrator directly.
                  </p>
                </div>

                <h3 className="text-lg font-medium mt-6 mb-3">Preparing for the Observation</h3>
                <p>
                  On the day of the observation:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Arrive early to set up your classroom</li>
                  <li>Have copies of your lesson plan and materials ready</li>
                  <li>Conduct your class as you normally would</li>
                  <li>Be prepared for a post-observation discussion</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Accessing Feedback</h3>
                <p>
                  After your observation, your administrator will provide feedback through the platform.
                  You'll receive a notification when feedback is available to review.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">Feedback Components</h3>
                <p>
                  Each feedback report includes:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li><strong>Glows:</strong> Areas where you demonstrated strength</li>
                  <li><strong>Grows:</strong> Areas for potential improvement</li>
                  <li><strong>Performance Ratings:</strong> Assessment across different teaching dimensions</li>
                  <li><strong>Action Plan:</strong> Specific steps to enhance your teaching practice</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Responding to Feedback</h3>
                <p>
                  When you receive feedback, you have two options:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-green-700">Approve Feedback</h4>
                    <p className="text-sm mt-2">
                      If you agree with the assessment, you can approve the feedback by providing your
                      digital signature. This completes the observation cycle.
                    </p>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-amber-700">Request Review</h4>
                    <p className="text-sm mt-2">
                      If you have questions or concerns about the feedback, you can request a review.
                      Provide specific comments about what you'd like to discuss further.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                  <h4 className="text-blue-700 font-medium">Professional Tip</h4>
                  <p className="text-blue-600 text-sm mt-1">
                    When requesting a review, be specific about which aspects of the feedback you'd like to discuss.
                    Focus on professional growth rather than disagreement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Development Tab */}
        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle>Professional Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Your Development Plan</h3>
                <p>
                  Based on observation feedback, you and your administrator will develop a professional 
                  growth plan with specific goals and action steps.
                </p>

                <h3 className="text-lg font-medium mt-6 mb-3">Tracking Progress</h3>
                <p>
                  The Development section allows you to:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>View your current development goals</li>
                  <li>Track progress on action steps</li>
                  <li>Upload evidence of professional development activities</li>
                  <li>Reflect on your growth over time</li>
                </ul>

                <h3 className="text-lg font-medium mt-6 mb-3">Resources Library</h3>
                <p>
                  Access teaching resources related to your development areas:
                </p>

                <ul className="space-y-2 list-disc pl-6">
                  <li>Instructional strategies</li>
                  <li>Classroom management techniques</li>
                  <li>Assessment methods</li>
                  <li>Professional articles and research</li>
                </ul>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
                  <h4 className="text-purple-700 font-medium">Growth Mindset</h4>
                  <p className="text-purple-600 text-sm mt-1">
                    The most effective teachers view feedback as an opportunity for continuous improvement.
                    Regularly revisit your development plan and seek out additional resources.
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
                    How often will I be observed?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Observation frequency varies by school district, but most teachers can expect 2-4 formal
                      observations per school year. New teachers typically receive more frequent observations
                      for additional support.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    What if I need to reschedule an observation?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      If you need to reschedule an observation, contact your administrator directly as soon as possible.
                      While the platform displays scheduled observations, rescheduling requests must be handled directly
                      with your observer.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How long do I have to respond to feedback?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      You should respond to feedback within 5 business days of receiving it. This ensures the
                      observation cycle can be completed in a timely manner and any follow-up discussions can
                      occur while the lesson is still fresh.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What happens after I request a review of my feedback?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      After requesting a review, your administrator will schedule a meeting to discuss your concerns.
                      They may revise the feedback based on your discussion or provide additional context. The goal
                      is to reach mutual understanding rather than simply changing ratings.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Can I upload revised lesson plans after submission?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Yes, you can update your materials even after initial submission. From the observation detail page,
                      select "Update Materials" to upload a revised lesson plan or additional supporting documents. Just
                      be sure to do this before the actual observation takes place.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    How are performance ratings determined?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Performance ratings are based on district-approved evaluation frameworks that assess different
                      dimensions of teaching practice. Your administrator uses a rubric that outlines the criteria for
                      each performance level. You can access these rubrics in the Resources section.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    How can I export my observation history?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      You can export a summary of your observation history and feedback from the Development section.
                      Click on "Export Professional Record" to generate a PDF that includes all observations, feedback,
                      and professional development activities for the current school year.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    Who can access my observation data?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600">
                      Your observation data is accessible to you, your direct administrators, and authorized school
                      district personnel. The system maintains strict privacy controls to ensure your professional
                      information is protected. All access to your records is logged for security purposes.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-center">
                <h3 className="font-medium text-gray-700 mb-2">Need additional help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you can't find answers to your questions here, please contact your administrator
                  or the technical support team.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/contact-support" className="text-primary hover:underline text-sm font-medium">
                    Contact Support
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/training-sessions" className="text-primary hover:underline text-sm font-medium">
                    Training Sessions
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