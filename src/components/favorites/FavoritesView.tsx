import React, { useEffect, useState } from 'react';
import { FavoriteQuestion } from '../../types';
import { api } from '../../services/api';
import { Bookmark, Trash2, ArrowRight, Zap, Info } from 'lucide-react';

interface FavoritesViewProps {
  onPracticeDomain: (domain: any) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onPracticeDomain }) => {
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await api.getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (questionId: string) => {
    try {
      await api.toggleFavorite({ questionId });
      setFavorites((prev) => prev.filter((f) => f.questionId !== questionId && f.id !== questionId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-600 fill-current" />
          Questions Favorites
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Retrouvez les questions sauvegardées pour vos révisions ciblées.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Chargement de vos favoris...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            Aucune question en favoris pour l'instant
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Pendant vos entretiens ou dans les résultats, cliquez sur l'icône marque-page pour épingler
            les questions techniques clés à réviser plus tard.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {fav.domain}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {fav.level}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ajouté le {new Date(fav.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    {fav.question}
                  </h3>
                </div>

                <button
                  onClick={() => handleRemove(fav.questionId)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors shrink-0"
                  title="Retirer des favoris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Topics */}
              {fav.expectedTopics && fav.expectedTopics.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Notions à maîtriser :
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fav.expectedTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onPracticeDomain(fav.domain)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  S'entraîner sur ce domaine
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
