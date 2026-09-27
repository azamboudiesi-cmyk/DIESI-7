import { z } from 'zod';

export const TechnicalDomainEnum = z.enum([
  'Développement Web',
  'JavaScript',
  'Python',
  'Java',
  'C/C++',
  'Bases de données',
  'Réseaux',
  'Cybersécurité',
  'Algorithmique',
]);

export const ExperienceLevelEnum = z.enum(['Débutant', 'Intermédiaire', 'Avancé']);

export const InterviewModeEnum = z.enum(['Entraînement', 'Simulation']);

export const QuestionDifficultyEnum = z.enum(['beginner', 'intermediate', 'advanced']);

// Auth schemas
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  email: z.string().email('Format email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').max(100),
  targetDomain: TechnicalDomainEnum.optional(),
  targetLevel: ExperienceLevelEnum.optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Format email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const PaymentSchema = z.object({
  amount: z.number().positive('Le montant doit être supérieur à zéro'),
  paymentMethod: z.enum(['Carte Bancaire', 'Mobile Money', 'Virement Bancaire']),
  description: z.string().optional(),
});

export const ExpenseSchema = z.object({
  amount: z.number().positive('Le montant doit être supérieur à zéro'),
  category: z.string().min(2, 'Catégorie requise'),
  description: z.string().min(2, 'Description requise'),
  paymentMethod: z.enum(['Carte Bancaire', 'Mobile Money', 'Virement Bancaire']).default('Virement Bancaire'),
});

// Interview configuration schema
export const StartInterviewSchema = z.object({
  domain: TechnicalDomainEnum,
  level: ExperienceLevelEnum,
  mode: InterviewModeEnum,
  questionCount: z.number().int().min(1).max(20).default(5),
  adaptiveFromPrevious: z.boolean().optional(),
});

// Generated question schema (from Gemini)
export const GeneratedQuestionItemSchema = z.object({
  id: z.string(),
  question: z.string().min(5),
  expectedTopics: z.array(z.string()).min(1),
  difficulty: QuestionDifficultyEnum,
});

export const GeminiQuestionsResponseSchema = z.object({
  questions: z.array(GeneratedQuestionItemSchema).min(1),
});

// Answer evaluation schema
export const EvaluateAnswerInputSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  userAnswer: z.string().max(4000),
  domain: TechnicalDomainEnum,
  level: ExperienceLevelEnum,
  expectedTopics: z.array(z.string()),
  previousScores: z.array(z.number()).optional(),
});

export const GeminiEvaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  feedback: z.string().min(5),
  improvementTips: z.array(z.string()).default([]),
});

// Save complete interview schema
export const SaveInterviewSchema = z.object({
  domain: TechnicalDomainEnum,
  level: ExperienceLevelEnum,
  mode: InterviewModeEnum,
  questionCount: z.number(),
  questions: z.array(
    z.object({
      id: z.string(),
      orderIndex: z.number(),
      question: z.string(),
      expectedTopics: z.array(z.string()),
      difficulty: QuestionDifficultyEnum,
    })
  ),
  answers: z.array(
    z.object({
      id: z.string().optional(),
      questionId: z.string(),
      userAnswer: z.string(),
      score: z.number().min(0).max(100),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      feedback: z.string(),
      improvementTips: z.array(z.string()),
      createdAt: z.string().optional(),
    })
  ),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type StartInterviewInput = z.infer<typeof StartInterviewSchema>;
export type EvaluateAnswerInput = z.infer<typeof EvaluateAnswerInputSchema>;
export type SaveInterviewInput = z.infer<typeof SaveInterviewSchema>;
