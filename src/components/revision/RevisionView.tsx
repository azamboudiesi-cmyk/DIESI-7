import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Zap,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface RevisionViewProps {
  onPracticeDomain: (domain: any) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ onPracticeDomain }) => {
  const [revisionItems, setRevisionItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevision = async () => {
      try {
        const data = await api.getRevisionQuestions();
        setRevisionItems(data);
      } catch (err) {
        console.error('Failed to load revision questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevision();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-indigo-600" />
          Mode Révision & Erreurs Fréquentes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Révisez les questions où votre score était inférieur à 75/100 pour combler vos lacunes.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Chargement de vos points à réviser...</p>
        </div>
      ) : revisionItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            Aucun point faible majeur détecté !
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Félicitations, vous n'avez pas de questions avec un score faible. Continuez vos simulations
            sur des niveaux plus avancés pour continuer à progresser.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {revisionItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {item.interviewDomain}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.interviewLevel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    {item.question.question}
                  </h3>
                </div>

                <div className="px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 text-xs font-bold text-center shrink-0">
                  {item.score} / 100
                </div>
              </div>

              {/* Your previous answer */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Votre réponse enregistrée :
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{item.userAnswer}"
                </p>
              </div>

              {/* Feedback and Tips */}
              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs">
                  <div className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Feedback d'amélioration :
                  </div>
                  <p className="text-amber-950 dark:text-amber-200">{item.feedback}</p>
                </div>

                {item.improvementTips && item.improvementTips.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 text-xs">
                    <div className="font-bold text-indigo-800 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Conseil pour l'entretien :
                    </div>
                    <ul className="space-y-1 text-indigo-950 dark:text-indigo-200">
                      {item.improvementTips.map((tip: string, tIdx: number) => (
                        <li key={tIdx}>→ {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onPracticeDomain(item.interviewDomain)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  S'entraîner à nouveau sur {item.interviewDomain}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
