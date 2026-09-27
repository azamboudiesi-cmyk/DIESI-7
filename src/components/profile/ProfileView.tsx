import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import { PaymentModal } from '../finance/PaymentModal';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Award,
  Trophy,
  Target,
  Edit2,
  Check,
  LogOut,
  ShieldCheck,
  Wallet,
  Layers,
  GraduationCap,
  CreditCard,
  PlusCircle,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateName, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setSaving(true);
    try {
      await updateName(nameInput.trim());
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update name:', err);
    } finally {
      setSaving(false);
    }
  };

  // Identify most practiced domain
  const mostPracticedDomain =
    stats && stats.domainStats.length > 0
      ? [...stats.domainStats].sort((a, b) => b.interviewCount - a.interviewCount)[0]?.domain
      : 'Aucun pour le moment';

  const isStudent = user?.role !== 'admin';
  const totalDeposited = user?.subscription?.totalDeposited || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-600/20 shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            {!isEditing ? (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                <button
                  onClick={() => {
                    setNameInput(user?.name || '');
                    setIsEditing(true);
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                  title="Modifier le nom"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveName} className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-xl border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  {saving ? '...' : 'Valider'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:underline"
                >
                  Annuler
                </button>
              </form>
            )}

            {saveSuccess && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Nom mis à jour avec succès
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Inscrit le {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
            </div>

            {/* Student Domain & Level Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                <Layers className="w-3.5 h-3.5" />
                Domaine : {user?.targetDomain || 'Développement Web'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                <GraduationCap className="w-3.5 h-3.5" />
                Niveau : {user?.targetLevel || 'Intermédiaire'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Rôle : {user?.role === 'admin' ? 'Administrateur' : 'Étudiant'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="sm:self-start px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Monthly Subscription & Financial Account */}
      {isStudent && (
        <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-3xl p-6 sm:p-7 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Wallet className="w-4 h-4" />
              Cotisation Cours de Fin de Mois
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Total déposé sur vos cours : <span className="text-emerald-600">{totalDeposited} €</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
              Montant mensuel : <strong>{user?.subscription?.monthlyFee || 29} € / mois</strong>. Déposez votre montant chaque fin de mois via Carte Bancaire, Mobile Money ou Virement pour continuer vos cours.
            </p>
          </div>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Payer cours / Déposer montant</span>
          </button>
        </div>
      )}

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Entretiens</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.totalInterviews ?? 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Réalisés au total</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Score Moyen</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.averageScore ?? 0}
            <span className="text-xs text-slate-400 font-normal"> /100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Toutes sessions</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Meilleur Score</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats?.bestScore ?? 0}
            <span className="text-xs text-slate-400 font-normal"> /100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Record personnel</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 uppercase font-semibold">Domaine Phare</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
            {mostPracticedDomain}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Le plus entraîné</p>
        </div>
      </div>

      {/* Account Security Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Sécurité & Confidentialité
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Vos mots de passe sont hachés de manière sécurisée (HMAC SHA-256 avec sel cryptographique).
          Les transactions financières et les clés API Gemini sont traitées strictement côté serveur, garantissant
          l'intégrité de vos données et versements.
        </p>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};
