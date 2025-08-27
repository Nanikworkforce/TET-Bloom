export const baseUrl = 'https://tet-bloom.onrender.com/api';
// export const baseUrl = 'http://127.0.0.1:8000/api';
const API_BASE_URL = baseUrl;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authentication header if token is available
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  console.log('API Request - Token from localStorage:', token ? 'Present' : 'Not found');
  console.log('API Request - Token value check:', { 
    token: token ? `${token.substring(0, 20)}...` : 'null/undefined',
    isString: typeof token,
    length: token?.length,
    isNullString: token === 'null',
    isUndefinedString: token === 'undefined'
  });
  
  if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
    console.log('API Request - Added Authorization header with Bearer token');
  } else {
    console.log('API Request - No valid token available for authorization');
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new ApiError(response.status, data.message || data.detail || 'API request failed');
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error');
  }
}

// User API functions
export const userApi = {
  // Create a new user
  create: async (userData: any) => {
    return apiRequest('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get all users
  getAll: async () => {
    return apiRequest('/users/');
  },

  // Get user by ID
  getById: async (id: string) => {
    return apiRequest(`/users/${id}/`);
  },

  // Update user
  update: async (id: string, userData: any) => {
    return apiRequest(`/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  delete: async (id: string) => {
    return apiRequest(`/users/${id}/`, {
      method: 'DELETE',
    });
  },

  // Search users
  search: async (query: string) => {
    return apiRequest(`/users/?search=${encodeURIComponent(query)}`);
  },
};

// Teacher API functions
export const teacherApi = {
  create: async (teacherData: any) => {
    return apiRequest('/teachers/', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  },

  getAll: async () => {
    return apiRequest('/teachers/');
  },

  getById: async (id: string) => {
    return apiRequest(`/teachers/${id}/`);
  },

  update: async (id: string, teacherData: any) => {
    return apiRequest(`/teachers/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/teachers/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Administrator API functions
export const administratorApi = {
  create: async (administratorData: any) => {
    return apiRequest('/administrators/', {
      method: 'POST',
      body: JSON.stringify(administratorData),
    });
  },

  getAll: async () => {
    return apiRequest('/administrators/');
  },

  getById: async (id: string) => {
    return apiRequest(`/administrators/${id}/`);
  },

  update: async (id: string, administratorData: any) => {
    return apiRequest(`/administrators/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(administratorData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/administrators/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Observation Group API functions
export const observationGroupApi = {
  create: async (groupData: any) => {
    return apiRequest('/observation-groups/', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  getAll: async () => {
    return apiRequest('/observation-groups/');
  },

  getById: async (id: string) => {
    return apiRequest(`/observation-groups/${id}/`);
  },

  update: async (id: string, groupData: any) => {
    return apiRequest(`/observation-groups/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/observation-groups/${id}/`, {
      method: 'DELETE',
    });
  },
};

// Schedule API functions
export const scheduleApi = {
  create: async (scheduleData: any) => {
    return apiRequest('/schedules/', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  },

  getAll: async () => {
    return apiRequest('/schedules/');
  },

  getById: async (id: string) => {
    return apiRequest(`/schedules/${id}/`);
  },

  update: async (id: string, scheduleData: any) => {
    return apiRequest(`/schedules/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/schedules/${id}/`, {
      method: 'DELETE',
    });
  },

  // Send reminder for a schedule
  sendReminder: async (id: string) => {
    return apiRequest(`/schedules/${id}/send_reminder/`, {
      method: 'POST',
    });
  },
};

// Auth API functions
export const authApi = {
  // Test authentication
  testAuth: async () => {
    return apiRequest('/auth/test-auth/', {
      method: 'GET',
    });
  },

  // Change password for authenticated user
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    return apiRequest('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },
};

// Feedback API functions
export const feedbackApi = {
  create: async (feedbackData: any) => {
    return apiRequest('/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  getAll: async (filters?: { teacher?: string; observer?: string; status?: string; schedule?: string }) => {
    let url = '/feedback/';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return apiRequest(url);
  },

  getById: async (id: string) => {
    return apiRequest(`/feedback/${id}/`);
  },

  update: async (id: string, feedbackData: any) => {
    return apiRequest(`/feedback/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  },

  patch: async (id: string, feedbackData: any) => {
    return apiRequest(`/feedback/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(feedbackData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/feedback/${id}/`, {
      method: 'DELETE',
    });
  },

  // Submit feedback for review
  submit: async (id: string) => {
    return apiRequest(`/feedback/${id}/submit/`, {
      method: 'POST',
    });
  },

  // Teacher requests review of feedback
  requestReview: async (id: string, responseComments: string) => {
    return apiRequest(`/feedback/${id}/request_review/`, {
      method: 'POST',
      body: JSON.stringify({ response_comments: responseComments }),
    });
  },

  // Teacher approves feedback
  approve: async (id: string) => {
    return apiRequest(`/feedback/${id}/approve/`, {
      method: 'POST',
    });
  },

  // Observer revises feedback
  revise: async (id: string, revisionData: any) => {
    return apiRequest(`/feedback/${id}/revise/`, {
      method: 'POST',
      body: JSON.stringify(revisionData),
    });
  },

  // Get feedback by schedule ID
  getBySchedule: async (scheduleId: string) => {
    return apiRequest(`/feedback/?schedule=${scheduleId}`);
  },

  // Get feedback for a specific teacher
  getByTeacher: async (teacherId: string) => {
    return apiRequest(`/feedback/?teacher=${teacherId}`);
  },

  // Get feedback by observer
  getByObserver: async (observerId: string) => {
    return apiRequest(`/feedback/?observer=${observerId}`);
  },
};

// Lesson Plan API functions
export const lessonPlanApi = {
  create: async (lessonPlanData: any) => {
    return apiRequest('/lesson-plans/', {
      method: 'POST',
      body: JSON.stringify(lessonPlanData),
    });
  },

  createWithFile: async (formData: FormData) => {
    return apiRequest('/lesson-plans/', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
  },

  getAll: async (filters?: { 
    teacher?: string; 
    status?: string; 
    feedback_status?: string;
    due_date_from?: string;
    due_date_to?: string;
  }) => {
    let url = '/lesson-plans/';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return apiRequest(url);
  },

  getById: async (id: string) => {
    return apiRequest(`/lesson-plans/${id}/`);
  },

  update: async (id: string, lessonPlanData: any) => {
    return apiRequest(`/lesson-plans/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(lessonPlanData),
    });
  },

  updateWithFile: async (id: string, formData: FormData) => {
    return apiRequest(`/lesson-plans/${id}/`, {
      method: 'PUT',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
  },

  patch: async (id: string, lessonPlanData: any) => {
    return apiRequest(`/lesson-plans/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(lessonPlanData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/lesson-plans/${id}/`, {
      method: 'DELETE',
    });
  },

  // Submit a lesson plan
  submit: async (id: string) => {
    return apiRequest(`/lesson-plans/${id}/submit/`, {
      method: 'POST',
    });
  },

  // Provide feedback on a lesson plan (for administrators)
  provideFeedback: async (id: string, feedbackData: {
    feedback_status: string;
    feedback_comment?: string;
    reviewer?: string;
  }) => {
    return apiRequest(`/lesson-plans/${id}/provide_feedback/`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  // Resubmit a lesson plan that needs revision
  resubmit: async (id: string, formData?: FormData) => {
    return apiRequest(`/lesson-plans/${id}/resubmit/`, {
      method: 'POST',
      headers: formData ? {} : undefined, // Let browser set content-type for FormData
      body: formData || undefined,
    });
  },

  // Get lesson plans for a specific teacher
  getByTeacher: async (teacherId: string) => {
    return apiRequest(`/lesson-plans/?teacher=${teacherId}`);
  },

  // Get lesson plans by status
  getByStatus: async (status: string) => {
    return apiRequest(`/lesson-plans/?status=${status}`);
  },

  // Get lesson plans by feedback status
  getByFeedbackStatus: async (feedbackStatus: string) => {
    return apiRequest(`/lesson-plans/?feedback_status=${feedbackStatus}`);
  },
};

// Lesson Plan Feedback API functions
export const lessonPlanFeedbackApi = {
  create: async (feedbackData: any) => {
    return apiRequest('/lesson-plan-feedback/', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  getAll: async (filters?: { lesson_plan?: string; reviewer?: string }) => {
    let url = '/lesson-plan-feedback/';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return apiRequest(url);
  },

  getById: async (id: string) => {
    return apiRequest(`/lesson-plan-feedback/${id}/`);
  },

  update: async (id: string, feedbackData: any) => {
    return apiRequest(`/lesson-plan-feedback/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/lesson-plan-feedback/${id}/`, {
      method: 'DELETE',
    });
  },

  // Get feedback for a specific lesson plan
  getByLessonPlan: async (lessonPlanId: string) => {
    return apiRequest(`/lesson-plan-feedback/?lesson_plan=${lessonPlanId}`);
  },
}; 