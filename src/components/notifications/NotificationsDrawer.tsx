'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store-context';
import { X, Bell, Heart, MessageSquare, Scale, UserCheck } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationRead,
    setActiveCharchaPostId,
    t,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (item: any) => {
    markNotificationRead(item.id);
    if (item.post_id) {
      setActiveCharchaPostId(item.post_id);
      setNotificationsOpen(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setNotificationsOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-end bg-navy/60 backdrop-blur-sm p-3 sm:p-6 animate-fade-in-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FDFBF7] dark:bg-navy border border-border-light dark:border-navy-light rounded-3xl max-w-md w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden relative animate-spring-pop"
      >
        {/* Header */}
        <div className="p-4 border-b border-border-light dark:border-navy-light flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-saffron" />
            <h2 className="text-base font-bold text-navy dark:text-white">
              {t('notifications')}
            </h2>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-navy dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  notif.is_read
                    ? 'border-slate-200 dark:border-navy-border bg-white/60 dark:bg-navy-card/50 opacity-80'
                    : 'border-saffron/40 bg-saffron-light/30 dark:bg-saffron/10 shadow-xs'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {notif.type === 'like' && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                  {notif.type === 'debate' && <MessageSquare className="w-4 h-4 text-saffron" />}
                  {notif.type === 'consensus' && <Scale className="w-4 h-4 text-viksit" />}
                  {notif.type === 'follow' && <UserCheck className="w-4 h-4 text-blue-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-navy dark:text-slate-100 leading-snug">
                    <span className="font-bold">@{notif.user_handle}</span> {notif.text}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              {t('noNotifications')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
