import React from 'react';
import { Code2, Sparkles, Heart } from 'lucide-react';
import { TECHNICAL_DOMAINS } from '../../constants/domains';
import { TechnicalDomain } from '../../types';

export const Footer: React.FC<{ onSelectDomain?: (domain: TechnicalDomain) => void }> = ({ onSelectDomain }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">TechInterviews</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              La plateforme de référence pour s'entraîner aux entretiens d'embauche techniques.
              Génération de questions adaptatives par Gemini, évaluation approfondie, notation objective
              et suivi de progression personnalisé pour réussir vos recrutements tech.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Propulsé par Google Gemini Flash 3.8</span>
              <span>•</span>
              <span>Architecture Next/React & Vercel Ready</span>
            </div>
          </div>

          {/* Domaines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Domaines Clés
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              {TECHNICAL_DOMAINS.slice(0, 5).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => onSelectDomain?.(d.id)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Plus de Domaines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Spécialités
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              {TECHNICAL_DOMAINS.slice(5).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => onSelectDomain?.(d.id)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TechInterviews. Tous droits réservés.</p>
          <div className="flex items-center gap-1">
            <span>Conçu avec rigueur et passion pour les développeurs</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
