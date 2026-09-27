import React, { useState } from 'react';
import {
  TechnicalDomain,
  ExperienceLevel,
  InterviewMode,
  Question,
  Answer,
  EvaluationResult,
} from '../../types';
import { api } from '../../services/api';
import {
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react';

interface InterviewRunnerProps {
  domain: TechnicalDomain;
  level: ExperienceLevel;
  mode: InterviewMode;
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
  onCancel: () => void;
}

export const InterviewRunner: React.FC<InterviewRunnerProps> = ({
  domain,
  level,
  mode,
  questions,
  onComplete,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Answer[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Validate and evaluate answer
  const handleValidateAnswer = async () => {
    if (!userAnswer.trim()) {
      setErrorMessage('Veuillez rédiger une réponse avant de valider.');
      return;
    }

    setErrorMessage(null);
    setEvaluating(true);

    try {
      const evaluation = await api.evaluateAnswer({
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        userAnswer: userAnswer.trim(),
        domain,
        level,
        expectedTopics: currentQuestion.expectedTopics,
      });

      const newAnswer: Answer = {
        id: `ans_${Date.now()}_${currentIndex}`,
        questionId: currentQuestion.id,
        userAnswer: userAnswer.trim(),
        score: evaluation.score,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        feedback: evaluation.feedback,
        improvementTips: evaluation.improvementTips,
        createdAt: new Date().toISOString(),
      };

      const updatedAnswers = [...savedAnswers, newAnswer];
      setSavedAnswers(updatedAnswers);
      setCurrentEvaluation(evaluation);

      // If in Simulation mode, move immediately to next question or complete
      if (mode === 'Simulation') {
        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserAnswer('');
          setCurrentEvaluation(null);
          setIsFavorite(false);
        } else {
          onComplete(updatedAnswers);
        }
      }
    } catch (err: any) {
      console.error('Evaluation error:', err);
      setErrorMessage(
        'Une erreur est survenue lors de l\'évaluation par Gemini. Vous pouvez réessayer ou modifier votre réponse.'
      );
    } finally {
      setEvaluating(false);
    }
  };

  // Next question in Training mode
  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setCurrentEvaluation(null);
      setIsFavorite(false);
      setErrorMessage(null);
    } else {
      onComplete(savedAnswers);
    }
  };

  // Toggle favorite on this question
  const handleToggleFavorite = async () => {
    try {
      const res = await api.toggleFavorite({
        questionId: currentQuestion.id,
        domain,
        level,
        question: currentQuestion.question,
        expectedTopics: currentQuestion.expectedTopics,
      });
      setIsFavorite(res.isFavorite);
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  // Score color helper
  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300';
    }
    if (score >= 60) {
      return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300';
    }
    return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top Header with info & progress */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {domain}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {level}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                mode === 'Simulation'
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
              }`}
            >
              Mode {mode}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Question {currentIndex + 1} / {totalQuestions}
            </span>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
            >
              Quitter
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              Q{currentIndex + 1}
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {currentQuestion.difficulty}
            </span>
          </div>

          <button
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
          >
            {isFavorite ? (
              <BookmarkCheck className="w-5 h-5 text-amber-500 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQuestion.question}
        </h2>

        {/* Expected Topics Tags */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Thèmes & notions clés attendus :
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentQuestion.expectedTopics.map((topic, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Area */}
      {!currentEvaluation && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Votre réponse :
          </label>
          <textarea
            rows={7}
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setErrorMessage(null);
            }}
            disabled={evaluating}
            placeholder="Rédigez votre réponse avec vos propres mots. Détaillez le fonctionnement, les cas limites, les alternatives ou bonnes pratiques si vous les connaissez..."
            className="w-full p-4 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>{userAnswer.length} caractères</span>
            <span>Prenez le temps d'argumenter comme lors d'un vrai entretien</span>
          </div>

          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Submit Action */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleValidateAnswer}
              disabled={evaluating || !userAnswer.trim()}
              className="py-3 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {evaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Évaluation de votre réponse par Gemini...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Valider ma réponse</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Immediate Feedback Card (Mode Entraînement) */}
      {currentEvaluation && mode === 'Entraînement' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md mb-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Évaluation Gemini
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Feedback Pédagogique
              </h3>
            </div>

            {/* Score Circle / Badge */}
            <div
              className={`px-4 py-2 rounded-2xl border text-center font-black text-2xl shadow-sm ${getScoreBadge(
                currentEvaluation.score
              )}`}
            >
              {currentEvaluation.score}
              <span className="text-xs font-bold opacity-80 block">/ 100</span>
            </div>
          </div>

          {/* Feedback summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 mb-6 leading-relaxed">
            {currentEvaluation.feedback}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
              <div className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Points forts identifiés
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                {currentEvaluation.strengths.length > 0 ? (
                  currentEvaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600">•</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <li>Aucun point fort particulier relevé.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <div className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Axes d'amélioration & Omissions
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                {currentEvaluation.weaknesses.length > 0 ? (
                  currentEvaluation.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600">•</span>
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <li>Excellente réponse sans omission notable.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Improvement Tips */}
          {currentEvaluation.improvementTips.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 mb-6">
              <div className="font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Conseils du recruteur technique
              </div>
              <ul className="space-y-1.5 text-xs text-indigo-950 dark:text-indigo-200">
                {currentEvaluation.improvementTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action button: Next question */}
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="py-3 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex < totalQuestions - 1 ? 'Question suivante' : 'Terminer et voir le bilan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
