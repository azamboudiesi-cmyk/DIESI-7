import React, { useState, useEffect } from 'react';
import { AdminNotification } from '../../types';
import { api } from '../../services/api';
import {
  Bell,
  CheckCircle2,
  Trash2,
  X,
  CreditCard,
  UserPlus,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange?: (unreadCount: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNotificationCountChange,
}) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data);
      const unread = data.filter((n) => !n.read).length;
      onNotificationCountChange?.(unread);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      const unread = notifications.filter((n) => n.id !== id && !n.read).length;
      onNotificationCountChange?.(unread);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      onNotificationCountChange?.(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const unread = notifications.filter((n) => n.id !== id && !n.read).length;
      onNotificationCountChange?.(unread);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Notifications En Direct
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500 text-white">
                      {unreadCount} nouv.
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inscriptions étudiants, choix de domaine & paiements
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          {notifications.length > 0 && (
            <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tout marquer comme lu
                </button>
              )}
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Chargement des notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Aucune notification pour le moment
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Dès qu'un étudiant s'inscrit (avec son domaine et niveau) ou effectue un dépôt, une alerte s'affichera ici instantanément.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isRegistration = notif.type === 'NEW_REGISTRATION';
                const isPayment = notif.type === 'NEW_PAYMENT';

                return (
                  <div
                    key={notif.id}
                    className={`relative p-4 rounded-xl border transition-all ${
                      !notif.read
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/80 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                            isRegistration
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                              : isPayment
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                              : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600'
                          }`}
                        >
                          {isRegistration ? (
                            <UserPlus className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                            )}
                          </div>

                          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            {notif.message}
                          </p>

                          {/* Extra Badges if student domain & level are provided */}
                          {(notif.domain || notif.level) && (
                            <div className="pt-1.5 flex flex-wrap gap-1.5">
                              {notif.domain && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                                  <Layers className="w-3 h-3" />
                                  {notif.domain}
                                </span>
                              )}
                              {notif.level && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                  <GraduationCap className="w-3 h-3" />
                                  {notif.level}
                                </span>
                              )}
                              {notif.amount && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                                  💰 +{notif.amount} €
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-1 pt-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Item actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            title="Marquer comme lu"
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          title="Supprimer"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              Les notifications vous informent immédiatement des nouveaux étudiants inscrits et de leurs dépôts mensuels.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
