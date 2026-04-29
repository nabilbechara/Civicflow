"use client";

import Link from "next/link";
import { BellRing, X } from "lucide-react";
import type { AppNotification } from "@/lib/notifications";

interface CitizenNotificationPopupProps {
  notifications: AppNotification[];
  onClose: () => void;
  onOpenNotification: (notification: AppNotification) => void;
}

export function CitizenNotificationPopup({
  notifications,
  onClose,
  onOpenNotification,
}: CitizenNotificationPopupProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md animate-[notificationSlideIn_240ms_ease-out]">
      <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-5 shadow-[0_18px_50px_rgba(2,6,23,0.35)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-200">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                New request update
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                You have {notifications.length} unread request update
                {notifications.length === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Dismiss notification popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <Link
              key={notification.id}
              href={notification.href}
              onClick={() => onOpenNotification(notification)}
              className="theme-surface block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
            >
              <div className="text-sm font-semibold text-white">
                {notification.title}
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {notification.message}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/citizen/notifications"
          onClick={onClose}
          className="mt-4 inline-flex text-sm font-semibold text-blue-200"
        >
          Open notification center
        </Link>
      </div>
    </div>
  );
}
