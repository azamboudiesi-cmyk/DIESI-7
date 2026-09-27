import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { PaymentMethod } from '../../types';
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  Wallet,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { user, refreshUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Carte Bancaire');
  const [amount, setAmount] = useState<number>(user?.subscription?.monthlyFee || 29);
  const [description, setDescription] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('987');

  // Mobile money fields
  const [mobileOperator, setMobileOperator] = useState('Orange Money');
  const [phoneNumber, setPhoneNumber] = useState('+237 690 00 00 00');

  // Virement fields
  const [bankRef] = useState(`TI-${Date.now().toString().slice(-6)}`);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (amount <= 0) {
        throw new Error('Le montant doit être supérieur à zéro');
      }

      let paymentDesc = description.trim();
      if (!paymentDesc) {
        paymentDesc = `Cotisation mensuelle cours - ${user?.targetDomain || 'Informatique'} (${paymentMethod})`;
      }

      const res = await api.depositPayment(amount, paymentMethod, paymentDesc);
      await refreshUser();
      setSuccessMessage(res.message);

      setTimeout(() => {
        setSuccessMessage(null);
        onPaymentSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Échec du traitement du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/40 dark:to-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cotisation Mensuelle & Paiement des Cours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Déposez votre montant pour continuer vos cours ce mois-ci
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Paiement Validé avec Succès !
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                {successMessage}
              </p>
              <p className="text-xs text-slate-400">
                Une notification d'encaissement a été envoyée à l'administration.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Student status reminder */}
              {user && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Compte Étudiant
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {user.name} ({user.targetDomain || 'Formation Tech'})
                    </p>
                    <p className="text-xs text-slate-500">
                      Niveau {user.targetLevel || 'Intermédiaire'} • Total déposé :{' '}
                      <strong className="text-emerald-600">
                        {user.subscription?.totalDeposited || 0} €
                      </strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                    {user.subscription?.status === 'active' ? 'Accès Actif' : 'Cotisation due'}
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Montant à déposer pour les cours
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[29, 58, 87].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        amount === val
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {val} € {val === 29 ? '(1 mois)' : val === 58 ? '(2 mois)' : '(Trimestre)'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-12 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-4 top-2 text-sm font-bold text-slate-400">
                    € EUR
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Sélectionnez votre moyen de paiement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Carte Bancaire')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'Carte Bancaire'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-medium">Carte Bancaire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Mobile Money')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'Mobile Money'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs font-medium">Mobile Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Virement Bancaire')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'Virement Bancaire'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs font-medium">Virement</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method Fields */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                {paymentMethod === 'Carte Bancaire' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Numéro de carte bancaire
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Expiration (MM/AA)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'Mobile Money' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Opérateur Mobile Money
                      </label>
                      <select
                        value={mobileOperator}
                        onChange={(e) => setMobileOperator(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                      >
                        <option value="Orange Money">Orange Money</option>
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Wave">Wave</option>
                        <option value="Moov Money">Moov Money</option>
                        <option value="Airtel Money">Airtel Money</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+237 6XX XX XX XX"
                          className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'Virement Bancaire' && (
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Coordonnées de virement du compte TechInterviews :
                    </p>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
                      <div>IBAN : <strong className="text-indigo-600">FR76 3000 4000 5000 6000 7890 123</strong></div>
                      <div>BIC : <strong>BNPAFR2X</strong></div>
                      <div>Bénéficiaire : <strong>TechInterviews Academy SAS</strong></div>
                      <div>Référence obligatoire : <strong className="text-emerald-600">{bankRef}</strong></div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      En confirmant, le paiement est enregistré en attente ou validation immédiate sur votre fiche étudiant.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Transaction sécurisée cryptée TLS 256-bit</span>
                </div>
              </div>

              {/* Description / Note */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Note ou motif du paiement (optionnel)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`ex: Cotisation cours ${user?.targetDomain || 'Informatique'} - Fin de mois`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Traitement du versement en cours...'
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirmer le dépôt de {amount} €</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
