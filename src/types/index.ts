export type TechnicalDomain =
  | 'Développement Web'
  | 'JavaScript'
  | 'Python'
  | 'Java'
  | 'C/C++'
  | 'Bases de données'
  | 'Réseaux'
  | 'Cybersécurité'
  | 'Algorithmique';

export type ExperienceLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';

export type InterviewMode = 'Entraînement' | 'Simulation';

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'trial';
export type PaymentMethod = 'Carte Bancaire' | 'Mobile Money' | 'Virement Bancaire';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
  // Student registration domain & level target
  targetDomain?: TechnicalDomain;
  targetLevel?: ExperienceLevel;
  role?: 'student' | 'admin';
  subscription?: {
    status: SubscriptionStatus;
    monthlyFee: number; // e.g. 29 € / 25 000 FCFA
    nextDueDate: string; // End of month payment date
    lastPaymentDate?: string;
    totalDeposited: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string; // e.g. 'Cotisation mensuelle cours', 'Frais serveur', etc.
  paymentMethod: PaymentMethod;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  description: string;
  date: string;
}

export interface AdminNotification {
  id: string;
  type: 'NEW_REGISTRATION' | 'NEW_PAYMENT' | 'SUBSCRIPTION_DUE';
  title: string;
  message: string;
  userId?: string;
  studentName?: string;
  domain?: TechnicalDomain;
  level?: ExperienceLevel;
  amount?: number;
  read: boolean;
  createdAt: string;
}

export interface TreasuryStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  activeStudentsCount: number;
  pendingDueCount: number;
  expectedMonthlyRevenue: number;
}

export interface Question {
  id: string;
  interviewId?: string;
  orderIndex: number;
  question: string;
  expectedTopics: string[];
  difficulty: QuestionDifficulty;
}

export interface EvaluationResult {
  score: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improvementTips: string[];
}

export interface Answer extends EvaluationResult {
  id: string;
  questionId: string;
  userAnswer: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  userId: string;
  domain: TechnicalDomain;
  level: ExperienceLevel;
  mode: InterviewMode;
  questionCount: number;
  globalScore: number;
  createdAt: string;
  completedAt?: string;
  questions: Question[];
  answers: Answer[];
  summary?: {
    overallStrengths: string[];
    overallWeaknesses: string[];
    recommendations: string[];
  };
}

export interface FavoriteQuestion {
  id: string;
  userId: string;
  questionId: string;
  domain: TechnicalDomain;
  level: ExperienceLevel;
  question: string;
  expectedTopics: string[];
  createdAt: string;
  notes?: string;
}

export interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  totalQuestionsAnswered: number;
  recentProgress: number; // Percentage change compared to previous period
  scoreHistory: {
    interviewId: string;
    date: string;
    domain: string;
    score: number;
    level: string;
  }[];
  domainStats: {
    domain: TechnicalDomain;
    interviewCount: number;
    averageScore: number;
  }[];
  levelStats: {
    level: ExperienceLevel;
    interviewCount: number;
    averageScore: number;
  }[];
}

export interface PersonalizedRecommendation {
  id: string;
  category: 'domain' | 'concept' | 'general';
  title: string;
  description: string;
  actionText: string;
  domain?: TechnicalDomain;
  level?: ExperienceLevel;
}
