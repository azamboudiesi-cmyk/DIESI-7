import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TECHNICAL_DOMAINS } from '../../constants/domains';
import { TechnicalDomain } from '../../types';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  TrendingUp,
  Target,
  CheckCircle2,
  Layers,
  Award,
  BookOpen,
  Zap,
} from 'lucide-react';

interface HomeViewProps {
  onStartInterview: (domain?: TechnicalDomain) => void;
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartInterview, onNavigate }) => {
  const { user, openAuthModal, loginAsDemo } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 text-center">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-cyan-500/15 to-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TechInterviews — Intelligence Artificielle & Feedback Pédagogique</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            TechInterviews
            <span className="block mt-2 text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Entraîne-toi aux entretiens techniques.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Simulez de vrais entretiens d'embauche en informatique. Génération de questions ciblées
            par <strong>Gemini</strong>, corrections objectives, analyse de vos points forts et faibles,
            et suivi précis de votre progression.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onStartInterview()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              Commencer un entretien
            </button>

            {user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Accéder à mon tableau de bord
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Créer un compte
                </button>
                <button
                  onClick={loginAsDemo}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-medium text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-100 transition-all cursor-pointer"
                >
                  Tester la démo (1-clic)
                </button>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto pt-8 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
            <div className="p-3">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">9</div>
              <div className="text-xs text-slate-500 font-medium">Domaines Techniques</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">3</div>
              <div className="text-xs text-slate-500 font-medium">Niveaux d'Expérience</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">100%</div>
              <div className="text-xs text-slate-500 font-medium">Feedback IA Objectif</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">0 - 100</div>
              <div className="text-xs text-slate-500 font-medium">Score Précis & Conseils</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Comment fonctionne TechInterviews ?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Une méthode en 4 étapes simples conçue pour booster votre confiance et vos résultats techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Choisissez votre domaine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sélectionnez parmi 9 domaines (Web, JS, Python, Java, SQL, Cyber...) et choisissez votre niveau (Débutant, Intermédiaire, Avancé).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Génération IA Adaptative
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Gemini génère des questions réalistes qui s'ajustent dynamiquement à votre historique et votre rythme.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Répondez & Évaluation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Recevez instantanément ou en fin de simulation un score (0-100), vos forces, vos faiblesses et des conseils sur mesure.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Suivez votre progression
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Analysez votre évolution au fil des entretiens sur votre tableau de bord et identifiez les notions précises à réviser.
            </p>
          </div>
        </div>
      </section>

      {/* 9 Technical Domains Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              9 Domaines Techniques Disponibles
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Cliquez sur un domaine pour configurer votre premier entretien immédiat.
            </p>
          </div>
          <button
            onClick={() => onStartInterview()}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
          >
            Personnaliser les options
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TECHNICAL_DOMAINS.map((domain) => (
            <div
              key={domain.id}
              onClick={() => onStartInterview(domain.id)}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${domain.badgeBg}`}>
                    {domain.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {domain.description}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Notions abordées :
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {domain.popularTopics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modes comparison */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Deux Modes d'Entraînement Complémentaires
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4">
              Mode Entraînement vs Mode Simulation
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Choisissez le <strong>Mode Entraînement</strong> pour apprendre pas à pas avec un feedback
              instantané après chaque question, ou le <strong>Mode Simulation</strong> pour vous tester en
              conditions réelles avec un rapport d'évaluation complet à la fin de vos 5 questions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Mode Entraînement
                </div>
                <p className="text-xs text-slate-300">
                  Prenez votre temps. Score immédiat, explications détaillées, points forts et axes d'amélioration après chaque réponse.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  Mode Simulation
                </div>
                <p className="text-xs text-slate-300">
                  Comme devant un recruteur. Enchaînez les questions avec concentration et découvrez votre score global et vos conseils finaux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Enrollment & Monthly Payment Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-indigo-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 inline-block">
                🎓 Inscription & Poursuite des Cours
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Inscrivez-vous dans votre domaine & Progressez chaque fin de mois
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                Choisissez votre domaine (Bases de données, JavaScript, Python...) et votre niveau. L'administration reçoit une notification immédiate à votre inscription, et vous pouvez régler votre cotisation chaque fin de mois en ligne (Carte Bancaire, Mobile Money, Virement).
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => openAuthModal('register')}
                className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-center"
              >
                S'inscrire comme Étudiant
              </button>
              <button
                onClick={() => onNavigate('finance')}
                className="px-5 py-3 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-all text-center"
              >
                Gérer la Trésorerie
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="text-center max-w-2xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Prêt à réussir vos entretiens d'embauche ?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Commencez dès maintenant votre premier entretien gratuit. Aucune installation requise.
        </p>
        <button
          onClick={() => onStartInterview()}
          className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          Lancer ma première simulation
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
