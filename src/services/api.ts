import {
  TechnicalDomain,
  ExperienceLevel,
  InterviewMode,
  Interview,
  EvaluationResult,
  DashboardStats,
  PersonalizedRecommendation,
  FavoriteQuestion,
  User,
  Transaction,
  AdminNotification,
  TreasuryStats,
  PaymentMethod,
} from '../types';

let authToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('techinterviews_token', token);
  } else {
    localStorage.removeItem('techinterviews_token');
  }
}

export function getStoredAuthToken(): string | null {
  if (authToken) return authToken;
  authToken = localStorage.getItem('techinterviews_token');
  return authToken;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAuthToken();
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erreur serveur (${response.status})`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(
    name: string,
    email: string,
    password: string,
    targetDomain?: TechnicalDomain,
    targetLevel?: ExperienceLevel
  ): Promise<{ user: User; token: string }> {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, targetDomain, targetLevel }),
    });
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(): Promise<{ user: User }> {
    return request('/api/auth/me');
  },

  async updateProfile(name: string): Promise<{ user: User }> {
    return request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setApiAuthToken(null);
    }
  },

  // Finance & Trésorerie
  async getTreasuryStats(): Promise<TreasuryStats> {
    return request('/api/finance/stats');
  },

  async getTransactions(type?: 'INCOME' | 'EXPENSE'): Promise<Transaction[]> {
    const q = type ? `?type=${type}` : '';
    return request(`/api/finance/transactions${q}`);
  },

  async getStudentAccounts(): Promise<any[]> {
    return request('/api/finance/students');
  },

  async depositPayment(
    amount: number,
    paymentMethod: PaymentMethod,
    description?: string
  ): Promise<{ message: string; transaction: Transaction; user: Partial<User> }> {
    return request('/api/finance/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod, description }),
    });
  },

  async recordExpense(params: {
    amount: number;
    category: string;
    description: string;
    paymentMethod?: PaymentMethod;
  }): Promise<{ message: string; transaction: Transaction }> {
    return request('/api/finance/expense', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Notifications Administrateur
  async getNotifications(): Promise<AdminNotification[]> {
    return request('/api/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return request(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return request('/api/notifications/mark-all-read', { method: 'POST' });
  },

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    return request(`/api/notifications/${id}`, { method: 'DELETE' });
  },

  // Interviews
  async generateQuestions(params: {
    domain: TechnicalDomain;
    level: ExperienceLevel;
    mode: InterviewMode;
    questionCount: number;
    adaptiveFromPrevious?: boolean;
  }): Promise<{ domain: TechnicalDomain; level: ExperienceLevel; questions: any[]; isAdaptive?: boolean }> {
    return request('/api/interviews/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async evaluateAnswer(params: {
    questionId: string;
    question: string;
    userAnswer: string;
    domain: TechnicalDomain;
    level: ExperienceLevel;
    expectedTopics: string[];
  }): Promise<EvaluationResult> {
    return request('/api/interviews/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async saveInterview(interviewData: {
    domain: TechnicalDomain;
    level: ExperienceLevel;
    mode: InterviewMode;
    questionCount: number;
    questions: any[];
    answers: any[];
  }): Promise<Interview> {
    return request('/api/interviews/save', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    });
  },

  async getInterview(id: string): Promise<Interview> {
    return request(`/api/interviews/${id}`);
  },

  async getInterviews(params?: {
    domain?: TechnicalDomain;
    level?: ExperienceLevel;
    sortBy?: string;
  }): Promise<{ items: Interview[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.domain) query.set('domain', params.domain);
    if (params?.level) query.set('level', params.level);
    if (params?.sortBy) query.set('sortBy', params.sortBy);

    return request(`/api/interviews?${query.toString()}`);
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return request('/api/dashboard/stats');
  },

  async getRecommendations(): Promise<PersonalizedRecommendation[]> {
    return request('/api/dashboard/recommendations');
  },

  // Favorites
  async getFavorites(): Promise<FavoriteQuestion[]> {
    return request('/api/favorites');
  },

  async toggleFavorite(params: {
    questionId: string;
    domain?: TechnicalDomain;
    level?: ExperienceLevel;
    question?: string;
    expectedTopics?: string[];
    notes?: string;
  }): Promise<{ isFavorite: boolean; favorite?: FavoriteQuestion }> {
    return request('/api/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Revision
  async getRevisionQuestions(): Promise<any[]> {
    return request('/api/revision');
  },

  // Database viewer
  async getDatabaseContent(): Promise<any> {
    return request('/api/admin/database');
  },
};
