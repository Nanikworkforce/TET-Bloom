# Teacher Evaluation Tool

## 1. Project Goal

The primary goal of the Teacher Evaluation Tool is to provide a centralized, efficient, and user-friendly platform for Administrators and teachers to manage the entire teacher observation, feedback, and evaluation process. This tool aims to digitize and streamline workflows, facilitate timely and constructive feedback, maintain a clear record of professional development, and ultimately support instructional improvement.

This project is being developed with the assistance of AI development tools like Cursor AI, leveraging the detailed Product Requirements Document (PRD) for feature implementation.

## 2. Overview

This application will support educational institutions by:
* Allowing **Super Users** to manage accounts and system settings.
* Enabling **Administrators** to create observation groups, conduct classroom observations using a structured digital form, provide targeted feedback ("Glows" and "Grows"), and suggest actionable steps.
* Empowering **Teachers** to submit lesson plans, view their observation schedules and feedback, and participate actively in the review and approval process.

The initial development will focus on delivering a **Minimum Viable Product (MVP)** that covers the core end-to-end observation workflow.

## 3. Core MVP Features

The MVP will include the following key functionalities:

* **User Account Management:**
    * Super User: Create individual and bulk import teacher/Administrator accounts.
    * Teacher: Update personal profile information.
* **Observation Group Management:**
    * Administrator: Create observation groups, assign teachers, and designate observers.
    * System: Auto-create initial observation records for assigned teachers.
* **End-to-End Observation Workflow:**
    * **Lesson Plan Submission:** Teachers can upload lesson plans and supporting artifacts for upcoming observations.
    * **Observation & Feedback:** Administrators can complete detailed digital observation forms (based on ELAR/Math criteria), record notes, identify "Glows" (strengths) and "Grows" (areas for improvement), and select predefined action steps.
    * **Feedback Review & Response:** Teachers can view their observation feedback (narrative sections) and either approve it or request a review with comments.
    * **Notifications:** Basic in-app notifications for key events (e.g., observation completion, review requests).
* **Dashboard Access:** Role-specific dashboards for Super Users, Administrators, and Teachers to access relevant functionalities.
* **Basic Reporting Data:**
    * Tracking of lesson plan submission status.
    * Tracking of feedback provision status.
    * Overall completion rates for the observation cycle.
    * Lists of teachers needing follow-up for submissions or feedback.
* **Structured Observation Forms:** Detailed digital forms with specific look-fors for ELAR and Math observations, including sections for lesson review, HQIM implementation, instructional strategies, student engagement, and more (as detailed in the PRD Section 8).

For a complete list of all features, user stories, and MVP scope, please refer to the [Product Requirements Document (PRD)](link_to_prd_or_attach_prd.pdf). *(Assume PRD is available in the repository or a shared location)*

## 4. User Roles

* **Super User:** System administrators with full access, primarily for setup and user management.
* **Administrator (Observer):** Instructional leaders responsible for conducting observations and providing coaching.
* **Teacher:** Educators who are being observed and receiving feedback for professional growth.

## 5. Tech Stack (Proposed / To Be Determined)

* **Frontend:** (e.g., React, Vue, Angular, HTML/CSS/JS - to be decided)
* **Backend:** (e.g., Node.js/Express, Python/Django/Flask, Java/Spring Boot - to be decided)
* **Database:** Supabase
* **AI Assistance:** Cursor AI (or similar) will be utilized for code generation, and to accelerate development based on the PRD.

## 6. Getting Started / How to Use

1.  **Prerequisites:** (List any development environment prerequisites, e.g., Node.js version, Python version, package managers).
2.  **Installation:** (Steps to clone the repository and install dependencies).
    ```bash
    git clone [repository-url]
    cd teacher-evaluation-tool
    # npm install (or yarn install, pip install -r requirements.txt, etc.)
    ```
3.  **Running the Application:** (Instructions to start the development server).
    ```bash
    # npm start (or yarn dev, python manage.py runserver, etc.)
    ```
4.  **Accessing the Application:** Open your browser and navigate to `http://localhost:[port]`.

Refer to the **Product Requirements Document (PRD)** for detailed user flows and feature specifications.

## 7. Development with Cursor AI

This project intends to leverage Cursor AI for accelerated development. Key inputs for Cursor AI will include:
* The detailed Product Requirements Document (PRD), especially user stories and data models.
* Specific prompts for generating components, functions, and UI elements based on the PRD.
* Iterative feedback and refinement of AI-generated code.

## 8. Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards (to be defined).

## 9. Future Enhancements (Post-MVP)

Based on the PRD, potential future enhancements include:
* Advanced, time-based reporting (e.g., "percentage of teachers observed last week").
* Complex analytical reports (e.g., trend analysis of "glows" and "grows").
* Email notifications as an enhancement to in-app notifications.
* Advanced customization of observation forms and workflows.
* Scheduling features for observations.
* A dedicated mobile application.

---

This README provides a high-level overview. For detailed specifications, please consult the full Product Requirements Document.
