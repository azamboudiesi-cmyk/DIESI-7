import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { HomeView } from './components/home/HomeView';
import { InterviewConfig } from './components/interview/InterviewConfig';
import { InterviewRunner } from './components/interview/InterviewRunner';
import { ResultsView } from './components/results/ResultsView';
import { DashboardView } from './components/dashboard/DashboardView';
import { HistoryView } from './components/history/HistoryView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { ProfileView } from './components/profile/ProfileView';
import { RevisionView } from './components/revision/RevisionView';
import { DatabaseViewer } from './components/admin/DatabaseViewer';
import { FinanceView } from './components/finance/FinanceView';
import { NotFoundView } from './components/ui/NotFoundView';
import { api } from './services/api';
import {
  TechnicalDomain,
  ExperienceLevel,
  InterviewMode,
  Question,
  Answer,
  Interview,
} from './types';
import { AlertCircle, X } from 'lucide-react';

function MainApp() {
  const { user, openAuthModal } = useAuth();

  // Navigation view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [targetDomain, setTargetDomain] = useState<TechnicalDomain>('JavaScript');

  // Ongoing interview state
  const [activeInterviewParams, setActiveInterviewParams] = useState<{
    domain: TechnicalDomain;
    level: ExperienceLevel;
    mode: InterviewMode;
    questionCount: number;
  } | null>(null);

  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [currentResults, setCurrentResults] = useState<Interview | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Protected routes check
  const navigateTo = (view: string) => {
    setGlobalError(null);
    const protectedViews = ['dashboard', 'history', 'favorites', 'profile', 'revision', 'database', 'finance'];

    if (protectedViews.includes(view) && !user) {
      openAuthModal('login');
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start interview config
  const handleStartConfig = (domain?: TechnicalDomain) => {
    if (domain) setTargetDomain(domain);
    setCurrentView('config');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch interview with Gemini generation
  const handleStartInterviewSession = async (config: {
    domain: TechnicalDomain;
    level: ExperienceLevel;
    mode: InterviewMode;
    questionCount: number;
    adaptive: boolean;
  }) => {
    setGlobalError(null);
    setLoadingQuestions(true);

    try {
      const data = await api.generateQuestions({
        domain: config.domain,
        level: config.level,
        mode: config.mode,
        questionCount: config.questionCount,
        adaptiveFromPrevious: config.adaptive,
      });

      if (!data.questions || data.questions.length === 0) {
        throw new Error('Aucune question n\'a pu être générée.');
      }

      setActiveInterviewParams({
        domain: config.domain,
        level: config.level,
        mode: config.mode,
        questionCount: config.questionCount,
      });

      setActiveQuestions(data.questions);
      setCurrentView('runner');
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setGlobalError(err.message || 'Erreur lors de la génération des questions par Gemini.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Handle completed interview
  const handleInterviewCompleted = async (answers: Answer[]) => {
    if (!activeInterviewParams) return;

    try {
      if (user) {
        // Save to persistent database
        const savedInterview = await api.saveInterview({
          domain: activeInterviewParams.domain,
          level: activeInterviewParams.level,
          mode: activeInterviewParams.mode,
          questionCount: activeInterviewParams.questionCount,
          questions: activeQuestions,
          answers,
        });
        setCurrentResults(savedInterview);
      } else {
        // Guest mode fallback object
        const total = answers.reduce((acc, a) => acc + a.score, 0);
        const globalScore = answers.length > 0 ? Math.round(total / answers.length) : 0;
        const guestInterview: Interview = {
          id: `guest_${Date.now()}`,
          userId: 'guest',
          domain: activeInterviewParams.domain,
          level: activeInterviewParams.level,
          mode: activeInterviewParams.mode,
          questionCount: activeInterviewParams.questionCount,
          globalScore,
          createdAt: new Date().toISOString(),
          questions: activeQuestions,
          answers,
          summary: {
            overallStrengths: Array.from(new Set(answers.flatMap((a) => a.strengths))).slice(0, 3),
            overallWeaknesses: Array.from(new Set(answers.flatMap((a) => a.weaknesses))).slice(0, 3),
            recommendations: Array.from(new Set(answers.flatMap((a) => a.improvementTips))).slice(0, 3),
          },
        };
        setCurrentResults(guestInterview);
      }

      setCurrentView('results');
    } catch (err: any) {
      console.error('Failed to save interview:', err);
      setGlobalError('Erreur lors de la sauvegarde des résultats.');
    }
  };

  // Select historical interview to view
  const handleSelectHistoricalInterview = async (interviewId: string) => {
    try {
      const interview = await api.getInterview(interviewId);
      setCurrentResults(interview);
      setCurrentView('results');
    } catch (err: any) {
      console.error('Failed to load interview details:', err);
      setGlobalError('Impossible de charger cet entretien.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      {/* Global Error Banner */}
      {globalError && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="p-1 text-rose-500 hover:text-rose-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onStartInterview={handleStartConfig}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'config' && (
          <InterviewConfig
            initialDomain={targetDomain}
            onStart={handleStartInterviewSession}
            loading={loadingQuestions}
          />
        )}

        {currentView === 'runner' && activeInterviewParams && (
          <InterviewRunner
            domain={activeInterviewParams.domain}
            level={activeInterviewParams.level}
            mode={activeInterviewParams.mode}
            questions={activeQuestions}
            onComplete={handleInterviewCompleted}
            onCancel={() => navigateTo('home')}
          />
        )}

        {currentView === 'results' && currentResults && (
          <ResultsView
            interview={currentResults}
            onRestart={() => handleStartConfig(currentResults.domain)}
            onGoToDashboard={() => navigateTo('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onStartInterview={handleStartConfig}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onSelectInterview={handleSelectHistoricalInterview}
            onNewInterview={() => handleStartConfig()}
          />
        )}

        {currentView === 'favorites' && (
          <FavoritesView
            onPracticeDomain={(domain) => handleStartConfig(domain)}
          />
        )}

        {currentView === 'profile' && <ProfileView />}

        {currentView === 'revision' && (
          <RevisionView
            onPracticeDomain={(domain) => handleStartConfig(domain)}
          />
        )}

        {currentView === 'finance' && <FinanceView />}

        {currentView === 'database' && <DatabaseViewer />}

        {currentView === '404' && (
          <NotFoundView onGoHome={() => navigateTo('home')} />
        )}
      </main>

      <Footer onSelectDomain={handleStartConfig} />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
