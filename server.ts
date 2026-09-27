import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db, verifyPassword } from './src/server/db';
import {
  createSessionToken,
  revokeSessionToken,
  requireAuth,
  optionalAuth,
  AuthenticatedRequest,
} from './src/server/auth';
import {
  generateInterviewQuestions,
  evaluateUserAnswer,
  generatePersonalizedRecommendations,
} from './src/server/gemini';
import {
  RegisterSchema,
  LoginSchema,
  StartInterviewSchema,
  EvaluateAnswerInputSchema,
  SaveInterviewSchema,
} from './src/schemas';
import { Interview } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '2mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// ==================== AUTHENTICATION ROUTES ====================

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Données invalides',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password, targetDomain, targetLevel } = parseResult.data;
    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'Un compte avec cette adresse email existe déjà.' });
      return;
    }

    const user = db.createUser({ name, email, password, targetDomain, targetLevel });
    const token = createSessionToken(user.id);

    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, token });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Erreur lors de la création du compte.' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Données invalides',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parseResult.data;
    const user = db.getUserByEmail(email);

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      return;
    }

    const token = createSessionToken(user.id);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// Current User (Me)
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Le nom doit contenir au moins 2 caractères' });
      return;
    }

    const updated = db.updateUserProfile(req.user.id, name);
    const { passwordHash: _, ...safeUser } = updated;
    res.json({ user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la mise à jour' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    revokeSessionToken(token);
  }
  res.json({ message: 'Déconnexion réussie' });
});

// ==================== INTERVIEW ROUTES ====================

// Generate Questions with Gemini
app.post('/api/interviews/generate', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const parseResult = StartInterviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Paramètres d\'entretien invalides',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { domain, level, questionCount, adaptiveFromPrevious } = parseResult.data;

    let adaptiveContext: { recentScores: number[]; weakTopics?: string[] } | undefined;

    // If user is authenticated and requested adaptive difficulty, compute context
    if (req.user && adaptiveFromPrevious) {
      const stats = db.getDashboardStats(req.user.id);
      const recentScores = stats.scoreHistory.slice(-3).map((s) => s.score);
      const revision = db.getRevisionQuestions(req.user.id);
      const weakTopics = Array.from(new Set(revision.flatMap((r) => r.question.expectedTopics)));

      adaptiveContext = {
        recentScores,
        weakTopics,
      };
    }

    const questions = await generateInterviewQuestions({
      domain,
      level,
      questionCount,
      adaptiveContext,
    });

    res.json({
      domain,
      level,
      questions,
      isAdaptive: !!adaptiveContext,
    });
  } catch (err: any) {
    console.error('Error generating questions:', err);
    res.status(500).json({
      error: 'Impossible de générer les questions. Veuillez réessayer.',
      details: err.message,
    });
  }
});

// Evaluate User Answer with Gemini
app.post('/api/interviews/evaluate', async (req, res) => {
  try {
    const parseResult = EvaluateAnswerInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Données d\'évaluation incomplètes ou invalides',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { question, userAnswer, domain, level, expectedTopics } = parseResult.data;

    const evaluation = await evaluateUserAnswer({
      question,
      userAnswer,
      domain,
      level,
      expectedTopics,
    });

    res.json(evaluation);
  } catch (err: any) {
    console.error('Error evaluating answer:', err);
    res.status(500).json({
      error: 'Erreur lors de l\'évaluation de la réponse par Gemini.',
      details: err.message,
    });
  }
});

// Save Finished Interview
app.post('/api/interviews/save', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentification requise' });
      return;
    }

    const parseResult = SaveInterviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Format d\'enregistrement d\'entretien invalide',
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { domain, level, mode, questionCount, questions, answers } = parseResult.data;

    // Strict reliable arithmetic average calculation on server side
    const totalScore = answers.reduce((acc, a) => acc + a.score, 0);
    const globalScore = answers.length > 0 ? Math.round(totalScore / answers.length) : 0;

    // Synthesize overall strengths and weaknesses
    const allStrengths = Array.from(new Set(answers.flatMap((a) => a.strengths))).slice(0, 4);
    const allWeaknesses = Array.from(new Set(answers.flatMap((a) => a.weaknesses))).slice(0, 4);
    const allTips = Array.from(new Set(answers.flatMap((a) => a.improvementTips))).slice(0, 3);

    const interview: Interview = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: req.user.id,
      domain,
      level,
      mode,
      questionCount,
      globalScore,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      questions: questions.map((q) => ({
        id: q.id,
        orderIndex: q.orderIndex,
        question: q.question,
        expectedTopics: q.expectedTopics,
        difficulty: q.difficulty,
      })),
      answers: answers.map((a, idx) => ({
        id: a.id || `ans_${Date.now()}_${idx}`,
        questionId: a.questionId,
        userAnswer: a.userAnswer,
        score: a.score,
        strengths: a.strengths,
        weaknesses: a.weaknesses,
        feedback: a.feedback,
        improvementTips: a.improvementTips,
        createdAt: a.createdAt || new Date().toISOString(),
      })),
      summary: {
        overallStrengths: allStrengths,
        overallWeaknesses: allWeaknesses,
        recommendations: allTips,
      },
    };

    const saved = db.saveInterview(interview);
    res.status(201).json(saved);
  } catch (err: any) {
    console.error('Error saving interview:', err);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde de l\'entretien.' });
  }
});

// Get Specific Interview Results by ID
app.get('/api/interviews/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const interview = db.getInterviewById(id);

  if (!interview) {
    res.status(404).json({ error: 'Entretien introuvable.' });
    return;
  }

  // Check ownership if user is logged in
  if (req.user && interview.userId !== req.user.id) {
    // If not demo user, prevent unauthorized access
    if (interview.userId !== 'usr_demo_01') {
      res.status(403).json({ error: 'Accès non autorisé à cet entretien.' });
      return;
    }
  }

  res.json(interview);
});

// List History of Interviews
app.get('/api/interviews', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const { domain, level, sortBy, limit, offset } = req.query;

  const result = db.getInterviewsByUser(req.user.id, {
    domain: domain as any,
    level: level as any,
    sortBy: sortBy as any,
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  res.json(result);
});

// ==================== DASHBOARD & STATS ====================

app.get('/api/dashboard/stats', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const stats = db.getDashboardStats(req.user.id);
  res.json(stats);
});

app.get('/api/dashboard/recommendations', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  try {
    const stats = db.getDashboardStats(req.user.id);
    const revision = db.getRevisionQuestions(req.user.id);

    // Identify weak domains (< 75 avg)
    const weakDomains = stats.domainStats
      .filter((d) => d.averageScore < 75)
      .map((d) => d.domain);

    const weakTopics = Array.from(new Set(revision.flatMap((r) => r.question.expectedTopics))).slice(0, 5);
    const recentScores = stats.scoreHistory.slice(-5).map((s) => s.score);

    const recommendations = await generatePersonalizedRecommendations({
      weakDomains,
      weakTopics,
      recentScores,
    });

    res.json(recommendations);
  } catch (err: any) {
    console.error('Error generating recommendations:', err);
    res.status(500).json({ error: 'Impossible de calculer les recommandations.' });
  }
});

// ==================== FAVORITES ROUTES ====================

app.get('/api/favorites', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const favorites = db.getFavorites(req.user.id);
  res.json(favorites);
});

app.post('/api/favorites/toggle', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const { questionId, domain, level, question, expectedTopics, notes } = req.body;

  if (!questionId) {
    res.status(400).json({ error: 'questionId requis' });
    return;
  }

  const isFav = db.isQuestionFavorite(req.user.id, questionId);

  if (isFav) {
    db.removeFavorite(req.user.id, questionId);
    res.json({ isFavorite: false, message: 'Question retirée des favoris' });
  } else {
    const fav = db.addFavorite(req.user.id, {
      questionId,
      domain: domain || 'Développement Web',
      level: level || 'Intermédiaire',
      question: question || '',
      expectedTopics: expectedTopics || [],
      notes,
    });
    res.json({ isFavorite: true, favorite: fav, message: 'Question ajoutée aux favoris' });
  }
});

// Revision Questions (Questions with score < 75)
app.get('/api/revision', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const list = db.getRevisionQuestions(req.user.id);
  res.json(list);
});

// ==================== FINANCE & COMPTABILITÉ ====================

// Stats de trésorerie (Solde, Entrées, Sorties, Nombre d'étudiants actifs, etc.)
app.get('/api/finance/stats', requireAuth, (_req: AuthenticatedRequest, res) => {
  try {
    const stats = db.getTreasuryStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors du calcul financier' });
  }
});

// Liste des transactions (Entrées et Sorties de comptes)
app.get('/api/finance/transactions', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const type = req.query.type as 'INCOME' | 'EXPENSE' | undefined;
    const transactions = db.getTransactions(type);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la récupération des transactions' });
  }
});

// Liste des étudiants avec leurs montants déposés et statut de paiement
app.get('/api/finance/students', requireAuth, (_req: AuthenticatedRequest, res) => {
  try {
    const accounts = db.getStudentAccounts();
    res.json(accounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la récupération des étudiants' });
  }
});

// Payer les cours / Déposer un montant chaque fin de mois
app.post('/api/finance/deposit', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const { amount, paymentMethod, description } = req.body;
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Montant valide supérieur à zéro requis' });
    return;
  }

  if (!paymentMethod) {
    res.status(400).json({ error: 'Moyen de paiement requis (Carte Bancaire, Mobile Money, Virement Bancaire)' });
    return;
  }

  try {
    const result = db.recordPayment({
      userId: req.user.id,
      amount,
      paymentMethod,
      description,
    });
    res.status(201).json({
      message: `Paiement de ${amount} € validé avec succès ! Votre accès aux cours est prolongé.`,
      transaction: result.transaction,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        subscription: result.user.subscription,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de l\'enregistrement du paiement' });
  }
});

// Enregistrer une sortie de caisse / dépense (Admin)
app.post('/api/finance/expense', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  const { amount, category, description, paymentMethod } = req.body;
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Montant valide requis' });
    return;
  }
  if (!description) {
    res.status(400).json({ error: 'Description requise' });
    return;
  }

  try {
    const expense = db.recordExpense({
      amount,
      category: category || 'Frais de fonctionnement',
      description,
      paymentMethod: paymentMethod || 'Virement Bancaire',
    });
    res.status(201).json({
      message: 'Dépense enregistrée avec succès',
      transaction: expense,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de l\'enregistrement de la dépense' });
  }
});

// ==================== NOTIFICATIONS ====================

// Liste des notifications
app.get('/api/notifications', requireAuth, (_req: AuthenticatedRequest, res) => {
  try {
    const notifs = db.getNotifications();
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur notifications' });
  }
});

// Marquer une notification comme lue
app.post('/api/notifications/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  const success = db.markNotificationRead(req.params.id);
  res.json({ success });
});

// Marquer toutes les notifications comme lues
app.post('/api/notifications/mark-all-read', requireAuth, (_req: AuthenticatedRequest, res) => {
  db.markAllNotificationsRead();
  res.json({ success: true });
});

// Supprimer une notification
app.delete('/api/notifications/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const success = db.deleteNotification(req.params.id);
  res.json({ success });
});

// Database Inspector (returns raw data for review)
app.get('/api/admin/database', requireAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }

  try {
    const dbPath = path.resolve(process.cwd(), 'data/db.json');
    if (!fs.existsSync(dbPath)) {
      res.status(404).json({ error: 'Base de données vide' });
      return;
    }
    const raw = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    // Sanitizing password hashes for safety
    const sanitizedUsers = (raw.users || []).map((u: any) => {
      const { passwordHash, ...rest } = u;
      return { ...rest, passwordProtected: true };
    });
    res.json({
      summary: {
        totalUsers: (raw.users || []).length,
        totalInterviews: (raw.interviews || []).length,
        totalFavorites: (raw.favorites || []).length,
        totalTransactions: (raw.transactions || []).length,
        totalNotifications: (raw.notifications || []).length,
      },
      tables: {
        users: sanitizedUsers,
        interviews: raw.interviews || [],
        favorites: raw.favorites || [],
        transactions: raw.transactions || [],
        notifications: raw.notifications || [],
      },
      filePath: 'data/db.json',
      schemaModel: 'prisma/schema.prisma',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VITE & STATIC FILES ====================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TechInterviews V2 server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
