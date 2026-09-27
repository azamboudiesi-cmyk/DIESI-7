import React from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundView: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <HelpCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">404</h1>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Cette page n'existe pas.
        </p>
        <p className="text-xs text-slate-500">
          La ressource demandée est introuvable ou a été déplacée.
        </p>
      </div>

      <button
        onClick={onGoHome}
        className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l'accueil
      </button>
    </div>
  );
};
