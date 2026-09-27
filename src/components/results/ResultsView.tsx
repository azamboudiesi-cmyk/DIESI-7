import React, { useState, useEffect } from 'react';
import { Interview } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  LayoutDashboard,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResultsViewProps {
  interview: Interview;
  onRestart: () => void;
  onGoToDashboard: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  interview,
  onRestart,
  onGoToDashboard,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Launch celebratory confetti if score is high
    if (interview.globalScore >= 75) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore in environments where canvas is not available
      }
    }
  }, [interview.globalScore]);

  const toggleFavorite = async (questionId: string, q: any) => {
    try {
      const res = await api.toggleFavorite({
        questionId,
        domain: interview.domain,
        level: interview.level,
        question: q.question,
        expectedTopics: q.expectedTopics,
      });
      setFavoriteMap((prev) => ({ ...prev, [questionId]: res.isFavorite }));
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-600 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/40';
  };

  const getScoreAppraisal = (score: number) => {
    if (score >= 85) return 'Remarquable ! Vous êtes prêt pour cette thématique.';
    if (score >= 70) return 'Bon niveau technique. Quelques détails à peaufiner.';
    if (score >= 50) return 'Bases présentes mais notions clés incomplètes.';
    return 'Entraînement supplémentaire fortement conseillé.';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner with Global Score */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 border border-indigo-200 dark:border-indigo-800">
          <Trophy className="w-3.5 h-3.5" />
          <span>Bilan Final d'Entretien</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          {interview.domain} — {interview.level}
        </h1>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(interview.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span>•</span>
          <span>Mode {interview.mode}</span>
          <span>•</span>
          <span>{interview.questions.length} questions</span>
        </div>

        {/* Global Score Dial */}
        <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl border-2 shadow-inner my-2 min-w-[200px] transition-all bg-slate-50/50 dark:bg-slate-950/50">
          <div className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            {interview.globalScore}
            <span className="text-2xl font-bold text-slate-400 ml-1">/ 100</span>
          </div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 uppercase tracking-wider">
            Score Global
          </p>
        </div>

        <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mt-4 max-w-md mx-auto">
          {getScoreAppraisal(interview.globalScore)}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={onRestart}
            className="py-3 px-6 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer un entretien
          </button>
          <button
            onClick={onGoToDashboard}
            className="py-3 px-6 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Voir mon Dashboard
          </button>
        </div>
      </div>

      {/* Global Synthesis (Strengths, Weaknesses, Tips) */}
      {interview.summary && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Analyse globale de votre performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
              <div className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Points forts majeurs
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200">
                {interview.summary.overallStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-emerald-600">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <div className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Notions à renforcer
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                {interview.summary.overallWeaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-amber-600">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60">
              <div className="font-bold text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Conseils prioritaires
              </div>
              <ul className="space-y-1.5 text-xs text-indigo-950 dark:text-indigo-200">
                {interview.summary.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-indigo-600">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Question by Question Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Détail question par question ({interview.questions.length})
        </h2>

        {interview.questions.map((question, index) => {
          const answer = interview.answers.find((a) => a.questionId === question.id);
          const isExpanded = expandedIndex === index;
          const isFav = favoriteMap[question.id];

          return (
            <div
              key={question.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Question summary row */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                    Q{index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {question.question}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>{question.difficulty}</span>
                      <span>•</span>
                      <span>{question.expectedTopics.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {answer && (
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${getScoreColor(
                        answer.score
                      )}`}
                    >
                      {answer.score} / 100
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && answer && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-6">
                  {/* Full question & Bookmark */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        {question.question}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {question.expectedTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(question.id, question)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition-colors"
                      title="Ajouter aux favoris"
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-5 h-5 text-amber-500 fill-current" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* User response */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Votre réponse :
                    </div>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {answer.userAnswer}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Feedback Gemini :
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {answer.feedback}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Points forts :
                      </div>
                      <ul className="space-y-1 text-emerald-950 dark:text-emerald-200">
                        {answer.strengths.map((s, idx) => (
                          <li key={idx}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs">
                      <div className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Axes d'amélioration :
                      </div>
                      <ul className="space-y-1 text-amber-950 dark:text-amber-200">
                        {answer.weaknesses.map((w, idx) => (
                          <li key={idx}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
