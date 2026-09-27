import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Database, Users, FileText, Bookmark, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';

export const DatabaseViewer: React.FC = () => {
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'interviews' | 'favorites' | 'transactions' | 'notifications' | 'json'>('overview');
  const [copied, setCopied] = useState(false);

  const fetchDb = async () => {
    setLoading(true);
    try {
      const data = await api.getDatabaseContent();
      setDbData(data);
    } catch (err) {
      console.error('Failed to load DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDb();
  }, []);

  const handleCopyJson = () => {
    if (!dbData) return;
    navigator.clipboard.writeText(JSON.stringify(dbData.tables, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-800">
            <Database className="w-3.5 h-3.5" />
            <span>Explorateur de Base de Données</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Données & Tables de TechInterviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fichier physique actif : <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 font-mono text-xs">data/db.json</code> • Schéma : <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 font-mono text-xs">prisma/schema.prisma</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDb}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copié !' : 'Copier JSON'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Lecture de la base de données en direct...</p>
        </div>
      ) : !dbData ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600">Impossible d'accéder aux données.</p>
        </div>
      ) : (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Table Users</p>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {dbData.summary.totalUsers} <span className="text-xs font-normal text-slate-400">comptes</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Table Interviews</p>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {dbData.summary.totalInterviews} <span className="text-xs font-normal text-slate-400">sessions</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Table Favorites</p>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  {dbData.summary.totalFavorites} <span className="text-xs font-normal text-slate-400">questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold gap-2 overflow-x-auto pb-1">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'users', label: `Utilisateurs (${dbData.tables.users.length})` },
              { id: 'transactions', label: `Transactions & Flux (${dbData.tables.transactions?.length || 0})` },
              { id: 'notifications', label: `Notifications En Direct (${dbData.tables.notifications?.length || 0})` },
              { id: 'interviews', label: `Entretiens (${dbData.tables.interviews.length})` },
              { id: 'favorites', label: `Favoris (${dbData.tables.favorites.length})` },
              { id: 'json', label: 'JSON Brut' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  État du Moteur de Base de Données
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200">1. Stockage Local Automatique (Actif)</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Toutes les données ci-dessous sont écrites en temps réel dans <code className="text-indigo-500">data/db.json</code>. Chaque compte, question générée par Gemini et réponse y est sauvegardé.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200">2. Schéma PostgreSQL Production (Vercel / Prisma)</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Le fichier <code className="text-indigo-500">prisma/schema.prisma</code> définit les 5 modèles relationnels stricts (User, Interview, Question, Answer, FavoriteQuestion) prêts pour un déploiement cloud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Users */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Nom</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Date de Création</th>
                      <th className="p-3.5">Sécurité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dbData.tables.users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{u.id}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Haché (HMAC-SHA256)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Interviews */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              {dbData.tables.interviews.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{item.id}</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.domain}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.level}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                        Mode {item.mode}
                      </span>
                    </div>

                    <div className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-600 text-white">
                      Score : {item.globalScore} / 100
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Utilisateur ID : <code className="text-indigo-500 font-mono">{item.userId}</code> • Réalisé le {new Date(item.createdAt).toLocaleString('fr-FR')} • {item.questions?.length || 0} questions répondues
                  </p>

                  {/* Questions count / preview */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                    {item.questions?.map((q: any, qIdx: number) => {
                      const ans = item.answers?.find((a: any) => a.questionId === q.id);
                      return (
                        <div key={q.id || qIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Q{qIdx + 1} : {q.question}
                            </span>
                            {ans && (
                              <span className="font-bold text-indigo-600">
                                {ans.score}/100
                              </span>
                            )}
                          </div>
                          {ans && (
                            <p className="text-slate-500 italic line-clamp-1">
                              Réponse : "{ans.userAnswer}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Favorites */}
          {activeTab === 'favorites' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Domaine</th>
                      <th className="p-3.5">Niveau</th>
                      <th className="p-3.5">Question</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dbData.tables.favorites.map((fav: any) => (
                      <tr key={fav.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{fav.id}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{fav.domain}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{fav.level}</td>
                        <td className="p-3.5 text-slate-800 dark:text-slate-200 font-medium">{fav.question}</td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(fav.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Transactions */}
          {activeTab === 'transactions' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Utilisateur</th>
                      <th className="p-3.5">Catégorie</th>
                      <th className="p-3.5">Moyen de paiement</th>
                      <th className="p-3.5">Montant</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(dbData.tables.transactions || []).map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{tx.id}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              tx.type === 'INCOME'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                          <div>{tx.userName}</div>
                          <div className="text-[10px] text-slate-400">{tx.userEmail}</div>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{tx.category}</td>
                        <td className="p-3.5 font-medium">{tx.paymentMethod}</td>
                        <td className={`p-3.5 font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'INCOME' ? `+${tx.amount} €` : `-${tx.amount} €`}
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(tx.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Titre</th>
                      <th className="p-3.5">Message / Données</th>
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(dbData.tables.notifications || []).map((notif: any) => (
                      <tr key={notif.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{notif.id}</td>
                        <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">{notif.type}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{notif.title}</td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300 max-w-sm">{notif.message}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              notif.read ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {notif.read ? 'Lue' : 'Non lue'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: JSON Viewer */}
          {activeTab === 'json' && (
            <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 font-mono text-xs overflow-x-auto max-h-[600px] border border-slate-800">
              <pre>{JSON.stringify(dbData.tables, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};
