export type UserRole = 'super_user' | 'principal' | 'teacher';

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