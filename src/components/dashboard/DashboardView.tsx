import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DashboardStats, PersonalizedRecommendation } from '../../types';
import {
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Zap,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface DashboardViewProps {
  onStartInterview: (domain?: any) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartInterview,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, recsData] = await Promise.all([
          api.getDashboardStats(),
          api.getRecommendations(),
        ]);
        setStats(statsData);
        setRecommendations(recsData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-medium">Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  if (!stats || stats.totalInterviews === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
          <Target className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bienvenue sur votre Tableau de Bord, {user?.name} !
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Vous n'avez pas encore réalisé d'entretien technique. Lancez votre première simulation
            pour débloquer vos statistiques et recommandations personnalisées.
          </p>
        </div>
        <button
          onClick={() => onStartInterview()}
          className="py-3 px-8 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          Démarrer mon 1er entretien
        </button>
      </div>
    );
  }

  // Calculate SVG coordinates for the score progression chart
  const history = stats.scoreHistory;
  const chartWidth = 600;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const points = history.map((item, idx) => {
    const x =
      history.length === 1
        ? chartWidth / 2
        : paddingX + (idx / (history.length - 1)) * (chartWidth - paddingX * 2);
    // score 0 to 100 mapped to chart height
    const y = chartHeight - paddingY - (item.score / 100) * (chartHeight - paddingY * 2);
    return { x, y, score: item.score, domain: item.domain, date: item.date };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome & Overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Tableau de Bord Personnel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivi des compétences de <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('revision')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mode Révision
          </button>
          <button
            onClick={() => onStartInterview()}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Nouvel Entretien
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Entretiens</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalInterviews}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Réalisés avec succès</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Score Moyen</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.averageScore}
            <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Sur l'ensemble des tests</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Meilleur Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.bestScore}
            <span className="text-sm font-semibold text-slate-400 ml-1">/100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Performance record</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalQuestionsAnswered}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Réponses analysées par IA</p>
        </div>
      </div>

      {/* Score Evolution Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Évolution des Scores au fil des Entretiens
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historique chronologique des notes obtenues.
            </p>
          </div>

          {stats.recentProgress !== 0 && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                stats.recentProgress > 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {stats.recentProgress > 0 ? `+${stats.recentProgress}%` : `${stats.recentProgress}%`} récemment
            </span>
          )}
        </div>

        {/* SVG Graphic */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              {/* Horizontal grid lines */}
              {[25, 50, 75, 100].map((val) => {
                const y = chartHeight - paddingY - (val / 100) * (chartHeight - paddingY * 2);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-sans"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Connecting line */}
              {points.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />
              )}

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2 group-hover:r-7 transition-all"
                  />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-700 dark:fill-slate-200"
                  >
                    {p.score}
                  </text>
                  <text
                    x={p.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400"
                  >
                    {p.domain.slice(0, 8)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Grid: Domaines & Niveaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance par Domaine */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Performance par Domaine
          </h2>
          <p className="text-xs text-slate-500 mb-4">Moyennes calculées sur vos entretiens passés.</p>

          <div className="space-y-4">
            {stats.domainStats.map((item) => (
              <div key={item.domain} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{item.domain}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-normal">
                      {item.interviewCount} test{item.interviewCount > 1 ? 's' : ''}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {item.averageScore}/100
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${item.averageScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance par Niveau */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Performance par Niveau
          </h2>
          <p className="text-xs text-slate-500 mb-4">Répartition selon la difficulté choisie.</p>

          <div className="space-y-4">
            {stats.levelStats.map((item) => (
              <div key={item.level} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{item.level}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-normal">
                      {item.interviewCount} test{item.interviewCount > 1 ? 's' : ''}
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      {item.averageScore}/100
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${item.averageScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized AI Recommendations */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recommandations Personnalisées Gemini
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Générées à partir de vos réponses, omissions et points faibles enregistrés dans votre historique.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {rec.description}
                </p>
              </div>

              <button
                onClick={() => onStartInterview(rec.domain)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 mt-auto"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
