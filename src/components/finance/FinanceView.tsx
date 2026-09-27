import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { TreasuryStats, Transaction, PaymentMethod } from '../../types';
import { PaymentModal } from './PaymentModal';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CreditCard,
  Smartphone,
  Building2,
  PlusCircle,
  MinusCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  GraduationCap,
  Sparkles,
  Download,
} from 'lucide-react';

interface StudentAccount {
  user: {
    id: string;
    name: string;
    email: string;
    targetDomain?: string;
    targetLevel?: string;
    role?: string;
    subscription?: {
      status: string;
      monthlyFee: number;
      nextDueDate: string;
      lastPaymentDate?: string;
      totalDeposited: number;
    };
    createdAt: string;
  };
  interviewsCount: number;
  averageScore: number;
  transactions: Transaction[];
}

export const FinanceView: React.FC = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<TreasuryStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'transactions' | 'overview'>('students');

  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Expense form
  const [expenseAmount, setExpenseAmount] = useState<number>(25);
  const [expenseCategory, setExpenseCategory] = useState('Hébergement & Serveurs');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<PaymentMethod>('Virement Bancaire');
  const [expenseLoading, setExpenseLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, txsData, studentsData] = await Promise.all([
        api.getTreasuryStats(),
        api.getTransactions(),
        api.getStudentAccounts(),
      ]);
      setStats(statsData);
      setTransactions(txsData);
      setStudents(studentsData);
    } catch (err) {
      console.error('Failed to load financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount <= 0 || !expenseDescription.trim()) return;

    try {
      setExpenseLoading(true);
      await api.recordExpense({
        amount: expenseAmount,
        category: expenseCategory,
        description: expenseDescription.trim(),
        paymentMethod: expensePaymentMethod,
      });
      setIsExpenseModalOpen(false);
      setExpenseDescription('');
      await loadData();
    } catch (err) {
      console.error('Failed to record expense:', err);
    } finally {
      setExpenseLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.userName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.user.name.toLowerCase().includes(q) ||
      s.user.email.toLowerCase().includes(q) ||
      (s.user.targetDomain && s.user.targetDomain.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Gestion Financière & Trésorerie
            </span>
            <span className="text-xs text-slate-400">• Cotisations fin de mois</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comptabilité & Soldes des Comptes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Suivez les versements de chaque étudiant pour les cours, les montants déposés chaque fin de mois, ainsi que l'ensemble des entrées et sorties de comptes.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Payer cours / Déposer montant</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm active:scale-95 transition-all flex items-center gap-2"
          >
            <MinusCircle className="w-4 h-4 text-rose-500" />
            <span>Enregistrer une sortie</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-700/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
              Solde Net Trésorerie
            </span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Wallet className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight">
              {stats ? `${stats.totalBalance >= 0 ? '+' : ''}${stats.totalBalance} €` : '...'}
            </div>
            <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1">
              <span>(Entrées - Sorties globales)</span>
            </p>
          </div>
        </div>

        {/* Total Incomes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Entrées (Dépôts Étudiants)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats ? `+${stats.totalIncome} €` : '...'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cotisations mensuelles perçues
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Sorties (Frais & Fonctionnement)
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {stats ? `-${stats.totalExpense} €` : '...'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Serveurs, IA Gemini, maintenance
            </p>
          </div>
        </div>

        {/* Active Students & Expected Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Étudiants & Échéances
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats ? `${stats.activeStudentsCount} actifs` : '...'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Revenu mensuel prévu :{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {stats?.expectedMonthlyRevenue || 0} € / mois
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            👥 Comptes & Montants par Étudiant ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'transactions'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            📊 Journal des Entrées & Sorties ({transactions.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher étudiant, motif..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tab 1: Students & Balances */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Répertoire des Étudiants et Montants Déposés
                </h3>
                <p className="text-xs text-slate-500">
                  Chaque étudiant verse sa cotisation mensuelle pour continuer les cours chaque fin de mois.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                Tarif cours : 29 € / mois
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Étudiant</th>
                    <th className="py-3 px-4">Domaine d'études</th>
                    <th className="py-3 px-4">Niveau</th>
                    <th className="py-3 px-4">Statut Cotisation</th>
                    <th className="py-3 px-4">Prochaine Échéance</th>
                    <th className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">Total Déposé</th>
                    <th className="py-3 px-4">Entretiens / Score</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Aucun étudiant trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((item) => {
                      const isActive = item.user.subscription?.status === 'active';
                      const deposited = item.user.subscription?.totalDeposited || 0;

                      return (
                        <tr
                          key={item.user.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0">
                                {item.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold">{item.user.name}</div>
                                <div className="text-[11px] text-slate-400">{item.user.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              <Layers className="w-3 h-3" />
                              {item.user.targetDomain || 'Développement Web'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              <GraduationCap className="w-3 h-3" />
                              {item.user.targetLevel || 'Intermédiaire'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold ${
                                isActive
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                              />
                              {isActive ? 'Cotisation à jour' : 'Fin de mois due'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {item.user.subscription?.nextDueDate
                                  ? new Date(item.user.subscription.nextDueDate).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : '31 Octobre 2026'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                            {deposited} €
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.interviewsCount} sim.
                            </span>{' '}
                            {item.interviewsCount > 0 && (
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                ({item.averageScore}/100)
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setIsDepositModalOpen(true)}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 transition-colors"
                            >
                              + Enregistrer versement
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Journal of Transactions (Incomes & Expenses) */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Subfilter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Tous les flux ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'INCOME'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              Entrées / Cotisations (+)
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'EXPENSE'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              Sorties / Dépenses (-)
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Bénéficiaire / Donneur</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Moyen de Paiement</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Aucune transaction trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isIncome = tx.type === 'INCOME';

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            {new Date(tx.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                isIncome
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              }`}
                            >
                              {isIncome ? (
                                <ArrowDownRight className="w-3 h-3" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3" />
                              )}
                              {isIncome ? 'ENTRÉE' : 'SORTIE'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                            <div>{tx.userName}</div>
                            <div className="text-[10px] text-slate-400">{tx.userEmail}</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                            {tx.category}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                              {tx.paymentMethod === 'Carte Bancaire' && (
                                <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                              )}
                              {tx.paymentMethod === 'Mobile Money' && (
                                <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                              )}
                              {tx.paymentMethod === 'Virement Bancaire' && (
                                <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                              )}
                              {tx.paymentMethod}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                            {tx.description}
                          </td>

                          <td
                            className={`py-3.5 px-4 text-right font-extrabold text-sm ${
                              isIncome
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isIncome ? `+${tx.amount} €` : `-${tx.amount} €`}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Enregistrer une Sortie de Compte (Dépense)
                </h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Montant de la sortie (€)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Catégorie
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Hébergement & Serveurs">Hébergement & Serveurs Cloud</option>
                  <option value="API IA Gemini">Consommation API Gemini</option>
                  <option value="Rémunération Formateurs">Rémunération Formateurs / Mentors</option>
                  <option value="Logiciels & Outils">Licences & Outils</option>
                  <option value="Frais Bancaires">Frais Bancaires / Transactions</option>
                  <option value="Divers">Autre sortie</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Moyen de paiement utilisé
                </label>
                <select
                  value={expensePaymentMethod}
                  onChange={(e) => setExpensePaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Virement Bancaire">Virement Bancaire</option>
                  <option value="Carte Bancaire">Carte Bancaire</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description détaillée
                </label>
                <input
                  type="text"
                  required
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="ex: Facture hébergement base de données PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={expenseLoading}
                  className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors"
                >
                  {expenseLoading ? 'Enregistrement...' : 'Valider la sortie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Deposit Modal */}
      <PaymentModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onPaymentSuccess={loadData}
      />
    </div>
  );
};
