-- SQLite Schema for TET-Bloom Application
-- Generated from codebase analysis
-- This includes both existing tables and implied future tables from mock data

-- ==================================================
-- EXISTING TABLE (currently in Supabase)
-- ==================================================

-- User profiles table (currently exists)
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_user', 'administrator', 'teacher')),
  fullName TEXT NOT NULL,
  employmentStartDate TEXT, -- ISO-8601 date string (YYYY-MM-DD)
  yearsOfExperience INTEGER,
  subject TEXT,
  grade TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for faster email lookups
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- ==================================================
-- IMPLIED TABLES (from mock data and types in code)
-- ==================================================

-- Teachers table (currently mocked in API routes)
-- This may be redundant with user_profiles where role='teacher'
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT,
  grade TEXT,
  email TEXT NOT NULL UNIQUE,
  yearsOfExperience INTEGER,
  user_profile_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Observations table (from ObservationRecord type and mock data)
CREATE TABLE observations (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  teacher_name TEXT NOT NULL, -- denormalized for easier queries
  subject TEXT,
  grade TEXT,
  date TEXT NOT NULL, -- ISO-8601 date string
  time TEXT NOT NULL, -- Time string (HH:MM format)
  type TEXT NOT NULL CHECK (type IN ('formal', 'walk-through')),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled')),
  notes TEXT,
  observer_id TEXT NOT NULL,
  observer_name TEXT NOT NULL, -- denormalized
  feedback_provided BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (observer_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Indexes for observations
CREATE INDEX idx_observations_teacher_id ON observations(teacher_id);
CREATE INDEX idx_observations_observer_id ON observations(observer_id);
CREATE INDEX idx_observations_date ON observations(date);
CREATE INDEX idx_observations_status ON observations(status);

-- Feedback table (implied from feedback pages and routes)
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  observation_id TEXT NOT NULL,
  teacher_id TEXT NOT NULL,
  observer_id TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  strengths TEXT,
  areas_for_improvement TEXT,
  action_items TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (observer_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Groups table (implied from super admin group management)
CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  school_name TEXT,
  district TEXT,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (created_by) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Group memberships (many-to-many relationship)
CREATE TABLE group_memberships (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT CHECK (role IN ('administrator', 'teacher', 'observer')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  UNIQUE(group_id, user_id)
);

-- Notifications table (implied from notification system in code)
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('observation', 'feedback', 'system', 'reminder')),
  is_read BOOLEAN DEFAULT FALSE,
  related_id TEXT, -- ID of related record (observation_id, feedback_id, etc.)
  related_type TEXT, -- Type of related record
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Lesson plans table (implied from lesson plans pages)
CREATE TABLE lesson_plans (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  grade TEXT,
  date TEXT NOT NULL,
  objectives TEXT,
  materials TEXT,
  activities TEXT,
  assessment TEXT,
  notes TEXT,
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_lesson_plans_teacher_id ON lesson_plans(teacher_id);
CREATE INDEX idx_lesson_plans_date ON lesson_plans(date);

-- Professional development table (implied from teacher development pages)
CREATE TABLE professional_development (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('workshop', 'course', 'conference', 'certification')),
  provider TEXT,
  hours INTEGER,
  completion_date TEXT, -- ISO-8601 date
  certificate_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- User import sessions (for bulk user import functionality)
CREATE TABLE user_import_sessions (
  id TEXT PRIMARY KEY,
  uploaded_by TEXT NOT NULL,
  filename TEXT NOT NULL,
  total_records INTEGER,
  successful_imports INTEGER DEFAULT 0,
  failed_imports INTEGER DEFAULT 0,
  error_report TEXT, -- JSON string of errors
  status TEXT CHECK (status IN ('processing', 'completed', 'failed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (uploaded_by) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- ==================================================
-- HELPER VIEWS
-- ==================================================

-- View for teacher summary with observation counts
CREATE VIEW teacher_summary AS
SELECT 
  up.id,
  up.fullName,
  up.email,
  up.subject,
  up.grade,
  up.yearsOfExperience,
  up.employmentStartDate,
  COUNT(o.id) as total_observations,
  COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_observations,
  COUNT(CASE WHEN o.status = 'scheduled' THEN 1 END) as upcoming_observations
FROM user_profiles up
LEFT JOIN observations o ON up.id = o.teacher_id
WHERE up.role = 'teacher'
GROUP BY up.id;

-- View for administrator dashboard stats
CREATE VIEW admin_dashboard_stats AS
SELECT 
  COUNT(DISTINCT CASE WHEN up.role = 'teacher' THEN up.id END) as total_teachers,
  COUNT(DISTINCT o.id) as total_observations,
  COUNT(DISTINCT CASE WHEN o.status = 'scheduled' THEN o.id END) as scheduled_observations,
  COUNT(DISTINCT CASE WHEN o.status = 'completed' AND o.feedback_provided = FALSE THEN o.id END) as pending_feedback,
  COUNT(DISTINCT CASE WHEN o.date >= date('now', 'weekday 0', '-6 days') THEN o.id END) as observations_this_week
FROM user_profiles up
LEFT JOIN observations o ON up.id = o.teacher_id OR up.id = o.observer_id;

-- ==================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ==================================================

-- Update user_profiles.updated_at on changes
CREATE TRIGGER update_user_profiles_updated_at 
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  BEGIN
    UPDATE user_profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update observations.updated_at on changes
CREATE TRIGGER update_observations_updated_at 
  AFTER UPDATE ON observations
  FOR EACH ROW
  BEGIN
    UPDATE observations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update feedback.updated_at on changes
CREATE TRIGGER update_feedback_updated_at 
  AFTER UPDATE ON feedback
  FOR EACH ROW
  BEGIN
    UPDATE feedback SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update groups.updated_at on changes
CREATE TRIGGER update_groups_updated_at 
  AFTER UPDATE ON groups
  FOR EACH ROW
  BEGIN
    UPDATE groups SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update lesson_plans.updated_at on changes
CREATE TRIGGER update_lesson_plans_updated_at 
  AFTER UPDATE ON lesson_plans
  FOR EACH ROW
  BEGIN
    UPDATE lesson_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update professional_development.updated_at on changes
CREATE TRIGGER update_professional_development_updated_at 
  AFTER UPDATE ON professional_development
  FOR EACH ROW
  BEGIN
    UPDATE professional_development SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END; 