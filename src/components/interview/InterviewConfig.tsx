import React, { useState } from 'react';
import { TechnicalDomain, ExperienceLevel, InterviewMode } from '../../types';
import { TECHNICAL_DOMAINS } from '../../constants/domains';
import {
  Sparkles,
  Zap,
  GraduationCap,
  Clock,
  Shield,
  HelpCircle,
  Check,
  Sliders,
} from 'lucide-react';

interface InterviewConfigProps {
  initialDomain?: TechnicalDomain;
  onStart: (config: {
    domain: TechnicalDomain;
    level: ExperienceLevel;
    mode: InterviewMode;
    questionCount: number;
    adaptive: boolean;
  }) => void;
  loading: boolean;
}

export const InterviewConfig: React.FC<InterviewConfigProps> = ({
  initialDomain = 'JavaScript',
  onStart,
  loading,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<TechnicalDomain>(initialDomain);
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('Intermédiaire');
  const [selectedMode, setSelectedMode] = useState<InterviewMode>('Entraînement');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [adaptive, setAdaptive] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      domain: selectedDomain,
      level: selectedLevel,
      mode: selectedMode,
      questionCount,
      adaptive,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3 border border-indigo-200 dark:border-indigo-800">
          <Sliders className="w-3.5 h-3.5" />
          <span>Configuration Personnalisée</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Configurez votre Entretien Technique
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-lg mx-auto">
          Sélectionnez les paramètres d'évaluation pour que l'IA Gemini génère une série de questions sur mesure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Domaine Technique */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
            1. Choisissez le Domaine Technique
          </label>
          <p className="text-xs text-slate-500 mb-4">
            9 spécialités informatiques courantes en entretien technique.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TECHNICAL_DOMAINS.map((domain) => {
              const isSelected = selectedDomain === domain.id;
              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {domain.name}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {domain.popularTopics.slice(0, 3).join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Niveau & Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Niveau */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
              2. Niveau d'Expérience
            </label>
            <p className="text-xs text-slate-500 mb-4">
              Ajuste la profondeur théorique et la complexité des questions.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  level: 'Débutant' as ExperienceLevel,
                  tag: 'Junior / Étudiant',
                  desc: 'Fondamentaux, syntaxe de base, notions clés et terminologie.',
                },
                {
                  level: 'Intermédiaire' as ExperienceLevel,
                  tag: '1-3 ans',
                  desc: 'Bonnes pratiques, gestion d\'état, asynchronisme, pièges fréquents.',
                },
                {
                  level: 'Avancé' as ExperienceLevel,
                  tag: 'Senior / Lead',
                  desc: 'Architecture, cas limites, optimisation, patterns avancés et compromis.',
                },
              ].map((item) => {
                const isSelected = selectedLevel === item.level;
                return (
                  <div
                    key={item.level}
                    onClick={() => setSelectedLevel(item.level)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.level}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mode d'entretien */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
              3. Type d'Entretien
            </label>
            <p className="text-xs text-slate-500 mb-4">
              Choisissez votre format d'apprentissage ou de test.
            </p>

            <div className="space-y-3">
              <div
                onClick={() => setSelectedMode('Entraînement')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMode === 'Entraînement'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    Mode Entraînement
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
                    Recommandé
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Idéal pour progresser : feedback détaillé, score, points forts et axes d'amélioration <strong>après chaque question</strong>.
                </p>
              </div>

              <div
                onClick={() => setSelectedMode('Simulation')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMode === 'Simulation'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    Mode Simulation
                  </span>
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/40 px-2 py-0.5 rounded-full">
                    Conditions réelles
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enchaînez toutes les questions d'une traite sans distraction. Découvrez votre évaluation complète à la fin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Nombre de questions & Adaptativité */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
              4. Nombre de questions
            </label>
            <p className="text-xs text-slate-500">
              5 questions par défaut (durée estimée : ~10-15 minutes).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[5, 10, 15].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  questionCount === count
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {count} questions
              </button>
            ))}
          </div>
        </div>

        {/* Adaptive difficulty checkbox */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60">
          <input
            type="checkbox"
            id="adaptiveCheck"
            checked={adaptive}
            onChange={(e) => setAdaptive(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <label htmlFor="adaptiveCheck" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">
              Activer la difficulté adaptative IA
            </span>{' '}
            — Ajuste automatiquement le niveau des questions selon vos précédents entretiens et vos points faibles identifiés.
          </label>
        </div>

        {/* Start button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-80 py-4 px-8 rounded-2xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Génération des questions Gemini...</span>
              </div>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>Commencer l'entretien</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
