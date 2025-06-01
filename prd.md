Product Requirements Document: Teacher Evaluation Tool
1. Introduction
Purpose: This document outlines the product requirements for the Teacher Evaluation Tool, a software application designed to streamline and manage the teacher observation, feedback, and evaluation process within an educational institution.

Product Goal: To provide a centralized platform for Administrators and teachers to manage observation schedules, conduct observations, provide and receive feedback, track progress, and facilitate professional growth.

2. User Roles
The system will support the following user roles:

Super User (e.g., Brittany & Brandon):

Manages system-level configurations.

Creates and manages all user accounts (Administrators, Teachers), including bulk import capabilities.

Can perform all actions of a Administrator.

Administrator (Observer):

Creates and manages observation groups.

Assigns teachers to observation groups.

Conducts observations and completes observation forms.

Provides feedback (glows and grows) to teachers.

Views observation records and teacher performance statistics.

Reviews teacher requests for feedback revision.

Teacher:

Updates their user profile information.

Submits lesson plans and supporting artifacts for observations.

Views their upcoming and past observation records (narrative section only).

Reviews feedback from Administrators.

Approves observation feedback or requests a review.

3. Overall System Goals
To digitize and streamline the teacher observation and evaluation process.

To facilitate timely and constructive feedback for teachers.

To provide a clear record of observations, feedback, and teacher development.

To support Administrators in managing and coaching their teaching staff effectively.

To enable teachers to actively participate in their evaluation process.

4. Product Features (Epics & User Stories)
4.1. User Account Management
Epic: Manage user accounts and profiles.

User Story 1 (Super User): As a Super User, I want to create individual teacher and Administrator accounts by entering their email address, full name, and employment start date, so that they can access the system. [MVP]

User Story 2 (Super User): As a Super User, I want to import a spreadsheet of teacher accounts, so that I can efficiently create multiple accounts at once. [MVP - High Priority for setup]

User Story 3 (Teacher): As a Teacher, I want to navigate to my account page from the dashboard, so that I can view and update my profile. [MVP]

User Story 4 (Teacher): As a Teacher, I want to update my profile information (e.g., name, years of teaching experience), so that my information is current. [MVP]

User Story 5 (System): When a teacher saves their profile, the system should update and store the new profile information. [MVP - System Requirement]

4.2. Observation Group Management
Epic: Organize teachers into groups for focused observation and coaching.

User Story 1 (Administrator): As a Administrator, I want to select "Observation Groups" from the dashboard, so that I can manage my observation groups. [MVP]

User Story 2 (Administrator): As a Administrator, I want to create a new observation group by entering a name for the group, so that I can organize teachers for observation. [MVP]

User Story 3 (Administrator): As a Administrator, I want to select an observer (myself) for the group, so that responsibilities are clear. [MVP]

User Story 4 (Administrator): As a Administrator, I want to select teachers to assign to a new observation group, viewing their subject, grade level, and teaching experience during selection, so that I can form relevant groups. [MVP]

User Story 5 (Administrator): As a Administrator, I want to save the new observation group, so that it is created and stored in the system. [MVP]

User Story 6 (System): When an observation group is saved, the system should add the new group to the list of observation groups for the Administrator. [MVP - System Requirement]

User Story 7 (System): When teachers are added to an observation group, the system should create an initial "observation record" for each teacher, auto-populated with their subject, grade, years of teaching experience, etc. [MVP - System Requirement, core to workflow]

4.3. Observation Workflow Management
Epic: Facilitate the end-to-end process of teacher observation, from planning to feedback and review.

Sub-Epic 4.3.1: Lesson Plan & Artifact Submission

User Story 1 (Teacher): As a Teacher, I want to select "Observations" from the dashboard, so that I can view my observation records. [MVP]

User Story 2 (Teacher): As a Teacher, I want to view my upcoming and past observation records. [MVP]

User Story 3 (Teacher): As a Teacher, I want to select an upcoming observation record, so that I can prepare for it. [MVP]

User Story 4 (Teacher): As a Teacher, I want to upload lesson plans and additional supporting artifacts to an upcoming observation record, so that my observer has the necessary materials. [MVP]

Acceptance Criterion: Lesson plans should be submitted two weeks in advance of the observation. [MVP - Business Rule]

Acceptance Criterion: All uploads to an observation record must include a timestamp. [MVP - System Requirement]

User Story 5 (Teacher): As a Teacher, I want to save the observation record after uploading materials, so that the changes are stored. [MVP]

Sub-Epic 4.3.2: Conducting Observations & Providing Feedback

User Story 1 (Administrator): As a Administrator, I want to select a teacher from an observation group (via the dashboard), so that I can access their observation records and provide feedback. [MVP]

User Story 2 (Administrator): As a Administrator, I want to complete an observation form (referencing details in Section 8) for a selected teacher, so that I can document my observations. [MVP - Core Functionality]

User Story 3 (Administrator): As a Administrator, I want to save the completed observation record, so that the feedback is stored. [MVP]

User Story 4 (System): When an observation record is saved by a Administrator, the system should update performance statistics for the teacher and the observation group. [MVP - for basic reporting, can be simplified for initial MVP]

User Story 5 (System): When an observation record is saved by a Administrator, the system should notify the teacher that their observation is complete. [MVP - Basic Notification]

Acceptance Criterion: Teachers should only see the narrative section of the observation record, including "glows" (strengths) and "grows" (areas for improvement), and potentially selected parts of the observation form as defined by system configuration. [MVP - Security/Access Rule]

Sub-Epic 4.3.3: Viewing Observation Records

User Story 1 (Administrator): As a Administrator, starting from the dashboard, I want to select "Observations" and then filter by a specific teacher, so that I can view all observations for that individual teacher. [MVP]

User Story 2 (Administrator): As a Administrator, after filtering/selecting a teacher's observations, I want to select a specific observation record, so that the system displays the full observation record to me. [MVP]

User Story 3 (Administrator): As a Administrator, starting from the dashboard, I want to select "Observation Groups," then select a specific group, then select a teacher from that group, and finally select an observation record for that teacher, so that the system displays the full observation record to me. [MVP - Alternative Flow]

Sub-Epic 4.3.4: Teacher Response to Observation Feedback

User Story 1 (Teacher): As a Teacher, I want to select "Observations" from the side menu on my dashboard, so that I can access my observation records. [MVP]

User Story 2 (Teacher): As a Teacher, I want to select a post-observation record, so that I can review the feedback. [MVP]

User Story 3 (Teacher): As a Teacher, after reviewing the observation record, I want to either approve the feedback or request a review. [MVP]

User Story 4 (Teacher): If I choose to approve, I want to check an "I accept..." checkbox, provide a digital signature (e.g., type name), and submit, so that my acceptance is recorded. [MVP]

User Story 5 (Teacher): If I choose to request a review, I want to enter comments and/or questions in an open-text field on the observation record, so that I can communicate my concerns to the observer. [MVP]

User Story 6 (System): If a teacher requests a review, the system should send an email notification to the observer, indicating that the teacher has requested a review of their observation feedback. [MVP - Basic Notification]

User Story 7 (Administrator/Observer): As an Observer, I want to be able to review the teacher's comments/questions (following a review request), so that I can connect with the teacher offline to discuss. [MVP - Supports workflow]

4.4. Dashboard
Epic: Provide a central starting point for users to access key functionalities.

User Story 1 (All Users): As a user, I want to see a dashboard upon logging in, so that I can quickly access relevant features and information. [MVP]

User Story 2 (Administrator): As a Administrator, the dashboard should provide access to "Observation Groups" and "Observations". [MVP]

User Story 3 (Teacher): As a Teacher, the dashboard should provide access to "Observations" and my "Account Page". [MVP]

4.5. Notifications
Epic: Keep users informed about important events and actions.

User Story 1 (System): The system should notify a teacher when an observation record is completed by a Administrator. [MVP - can be simple in-app notification initially]

User Story 2 (System): The system should send an email notification to an observer when a teacher requests a review of their observation feedback. [MVP - can be simple in-app notification initially, email is enhancement]

4.6. Reporting & Analytics (Implied)
Epic: Track and display performance data.

User Story 1 (System): The system should update and maintain performance statistics for individual teachers based on observation records. [MVP - Basic data collection for future reporting]

User Story 2 (System): The system should update and maintain performance statistics for observation groups. [MVP - Basic data collection for future reporting]

User Story 3 (Administrator): As a Administrator, I want to view performance stats for teachers and observation groups, so that I can track progress and identify trends. Specific stats should include: [Consider for MVP - at least some basic stats. More advanced stats can be Future Release]

Percentage of all teachers that were observed last week. [Future Release - requires date logic for "last week"]

Percentage of teachers observed in each observation group last week. [Future Release - requires date logic for "last week"]

Percentage of lesson plans submitted (overall and per group/teacher). [MVP - if submission status is tracked]

List of teachers that did not submit a lesson plan for an upcoming observation. [MVP - if submission status is tracked]

Percentage of submitted lesson plans/observation records that received feedback from a Administrator in their observation group. [MVP - if feedback status is tracked]

List of teachers that have completed observations but have not yet received feedback. [MVP - if feedback status is tracked]

Trends in "glows" and "grows" across teachers, groups, or specific observation criteria. [Future Release - complex analysis]

Completion rates for the observation cycle (e.g., submitted, feedback provided, teacher acknowledged). [MVP - Basic status tracking]

5. Data Management
The system will need to store and manage data related to:

Users: Profile information (name, email, role, employment start date, years of experience, etc.), credentials. [MVP]

Observation Groups: Group name, assigned observer, list of assigned teachers. [MVP]

Observation Records: [MVP - All sub-points are core to the MVP]

Associated Teacher

Associated Observer

Date of observation

Teacher's subject, grade, years of teaching experience (at time of record creation)

Lesson plans and supporting artifacts (with upload timestamps)

Observation form content (as detailed in Section 8, including narrative, glows, grows, specific question responses, and action steps)

Status (e.g., scheduled, pending teacher submission, pending feedback, feedback provided, approved, review requested)

Teacher comments/questions for review requests

Approval status (checkbox, signature)

Performance Statistics: Data derived from observation records for teachers and groups. [MVP - Basic data for the selected MVP reports]

6. Non-Functional Requirements
Usability: The system should be intuitive and easy to navigate for all user roles. A central dashboard should provide clear access points. [MVP - Core Principle]

Data Integrity: All data, especially observation records and profile information, must be stored accurately and consistently. Auto-population of data should be reliable. [MVP - Core Principle]

Security: User authentication is required. Role-based access control must be implemented to ensure users can only access and modify data appropriate to their role (e.g., teachers only see the narrative part of their feedback and other designated sections). [MVP - Core Principle]

Reliability: The system should be available and perform reliably during school operational hours. [MVP - Core Principle]

Auditability: Timestamps for uploads and key actions (e.g., feedback submission, approval) should be recorded. [MVP - Important for tracking]

7. Future Considerations / Out of Scope (for initial version based on provided flows)
Advanced customization of observation form templates beyond the structure outlined in Section 8.

Scheduling of observations (the flows assume observations are already scheduled or upcoming; the system will manage records for these).

Highly detailed, customizable advanced reporting and analytics dashboards beyond the core stats identified for MVP.

Direct communication/messaging platform beyond notifications and review request comments.

Mobile application (flows imply a web-based dashboard).

8. Observation Form Content Details
This section outlines the specific questions and data points that will constitute the observation form, based on the provided "Observation Tool" (Google Form printout). [MVP - The entire form structure is core to the observation process]

8.1. Pre-Observation Information
(Captured during observation setup or form initiation by the Administrator/Observer)

Content Area of Observation: (Selection: ELAR, Math)

Module or Unit Number: (Text Input)

Lesson Number: (Text Input)

8.2. Common Observation Elements
(Applicable to both ELAR and Math unless specified)

Lesson Review & Pacing (Matrix: Yes/No)

Evidence of lesson internalization.

The appropriate unit within the scope and sequence.

Within +/-5 instructional days of the pacing guide.

Lesson meets the minimum number of minutes for core instruction.

HQIM Implementation

Are the HQIMs designated for tier 1 (core instruction) being utilized? (Selection: Yes, Partial, No, Other - with text field for "Other")

8.3. ELAR Specific Observation Look-fors
Lesson Execution & Student Engagement (Matrix: Yes, Partial, No, N/A)

Teacher has materials ready and established routines for lesson key components.

Lesson objectives are shared with students in an oral and/or written capacity.

The lesson key components, including texts, identified for use in the lesson are present and implemented effectively to support learning throughout the lesson.

All students spend the majority of the lesson listening to, reading, writing, and/or speaking about texts.

The teacher maintains alignment to the lesson objective, structure, and pacing.

Students are expected to use text evidence and academic vocabulary in responding to verbalizations and/or in writing.

Students receive in-the-moment feedback on their work.

Optional lesson components included in the lesson are purposeful in supporting student learning and are appropriate.

Instructional Approaches & Strategies

The instructional approaches and strategies outlined in the lesson--including the teacher's annotations--are implemented effectively. (Selection: Yes, Partial, Not observed, No)

When adjustments have been made to the instructional approaches and strategies outlined in the lesson, those adjustments are purposeful in supporting the needs of all learners and aligned with lesson objectives. (Selection: Yes, Partial, No, Not observed)

Engagement & Support

Teacher uses engagement strategies throughout the lesson. (Selection: Yes, Partial, No, Not observed)

Teacher uses embedded supports included in the lesson to support all learners. (Selection: Yes, Partial, No, Not observed)

8.4. Math Specific Observation Look-fors
Fluency (Matrix: Yes, Partially observed; not fully implemented, No; not observed)

Teacher has materials ready and there is evidence of established fluency routines.

Students follow established routines to complete fluency in time provided.

Teacher sequences problems from simple to complex and facilitates connections to prior learning or adjusts based on student responses (may not be applicable for Sprints).

Application Problem (Matrix: Yes, Partially observed; not fully implemented, No; not observed)

Students use the Read-Draw-Write approach.

Students engage in student-to-student discourse around various explanations, models, and/or student work within the time provided.

Teacher varies delivery method based on student data (interactive questioning, guided practice or independent practice).

Concept Development (Matrix: Yes, Partially observed; not fully implemented, No; not observed)

All students are active participants in the learning.

Teacher maintains alignment to lesson objective, structure, and pacing.

Teacher/students use models, manipulatives, and academic vocabulary from lesson.

Teacher regularly checks for understanding at key learning moments and adjusts instruction as needed.

Students engage in problem-solving that requires them to explain their thinking.

Problem Set (Matrix: Yes, Partially observed; not fully implemented, No; not observed)

Students complete must-do and could-do problems strategically selected by the teacher within the ten-minute time frame.

Students independently practice and teacher allows for productive struggle.

Teacher regularly checks for understanding at key learning moments and adjusts instruction as needed.

Students receive in-the-moment feedback on their work.

Student Debrief (Matrix: Yes, Partially observed; not fully implemented, No; not observed)

Students engage in student-to-student discourse around various explanations, models, and/or student work within the time provided.

Students have the opportunity to reflect and discuss key learning.

Students complete assigned exit tickets after student debrief.

Embedded Supports & Instruction

The teacher uses embedded support strategies within lesson (e.g., green margin boxes, author's notes). (Selection: Yes, Partial, Not observed, No)

The teacher provides just-in-time instruction using embedded HQIM resources. (Selection: Yes, Partial, No, Not observed)

8.5. Post-Observation Summary & Action Planning
Observation Notes: (Open Text Area - for general notes by the observer)

Glows: (Open Text Area - specific strengths observed during the lesson)

Grows: (Open Text Area - specific areas for improvement identified during the lesson)

Action Step Category: (Selection: Internalization, Year-Long Pacing, Lesson Pacing)

This selection will dynamically determine which set of action steps below is most relevant or presented to the Administrator.

Internalization Action Step: (Dropdown Selection from a predefined list of actions)

Year-Long Pacing Action Step: (Dropdown Selection from a predefined list of actions)

Lesson Pacing Action Step: (Dropdown Selection from a predefined list of actions)

9. MVP Definition Summary
This section provides a summary of what is considered in scope for the Minimum Viable Product (MVP). The goal of the MVP is to deliver a functional core product that allows users to complete the primary observation and feedback cycle.

Key MVP Components:

Core User Management: Ability for Super Users to create and manage Administrator and Teacher accounts (including bulk import). Teachers can update basic profiles.

Observation Group Management: Administrators can create groups, assign teachers, and define observers.

End-to-End Observation Workflow:

Teachers can submit lesson plans/artifacts.

Administrators can complete detailed observation forms (as defined in Section 8).

Administrators can provide "Glows" and "Grows" and select predefined action steps.

Teachers can view their feedback (narrative sections).

Teachers can approve feedback or request a review.

Basic notifications for key workflow steps (e.g., observation complete, review requested).

Basic Dashboard Access: All users have a dashboard to access their relevant sections.

Essential Data Management: All data related to users, groups, observation records (including form content), and statuses will be stored.

Fundamental Reporting Data: Collection of data to support basic MVP reports (e.g., submission status, feedback status, completion rates). Some simple list-based reports for Administrators.

Core Non-Functional Requirements: Usability, Data Integrity, Security (role-based access), Reliability, and Auditability are paramount for the MVP.

Specifically Excluded from MVP (Examples - refer to [Future Release] tags above):

Advanced, time-based reporting (e.g., "last week" stats).

Complex analytical reports (e.g., trend analysis of glows/grows).

Email notifications if in-app notifications suffice for MVP.

Advanced customization of forms or workflows beyond what's defined.