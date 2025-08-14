export type UserRole = 'super_user' | 'administrator' | 'teacher';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  employmentStartDate?: string;
  yearsOfExperience?: number;
  subject?: string;
  grade?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ObservationType = 'formal' | 'walk-through';

export type ObservationStatus = 'scheduled' | 'completed' | 'canceled';

export interface ObservationRecord {
  id: string;
  teacher: string;
  teacherId: string;
  subject: string;
  grade: string;
  date: string;
  time: string;
  type: ObservationType;
  status: ObservationStatus;
  statusColor: string;
  statusBg?: string;
  feedback?: boolean;
  notes?: string;
  observerId: string;
  observerName: string;
} 