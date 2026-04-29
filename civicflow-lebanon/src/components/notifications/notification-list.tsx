"use client";

import Link from "next/link";
import { ArrowRight, BellRing, CheckCheck, FileText } from "lucide-react";
import type { AppNotification } from "@/lib/notifications";

interface NotificationListProps {
  notifications: AppNotification[];
  readIds: Set<string>;
  emptyTitle: string;
  emptyMessage: string;
  onMarkAllRead: () => void;
  onOpenNotification: (notification: AppNotification) => void;
}

function getToneClass(tone: AppNotification["tone"]) {
  switch (tone) {
    case "success":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
    case "warning":
      return "border-amber-400/20 bg-amber-500/10 text-amber-300";
    case "urgent":
      return "border-rose-400/20 bg-rose-500/10 text-rose-300";
    default:
      return "border-blue-400/20 bg-blue-500/10 text-blue-300";
  }
}

export function NotificationList({
  notifications,
  readIds,
  emptyTitle,
  emptyMessage,
  onMarkAllRead,
  onOpenNotification,
}: NotificationListProps) {
  const unreadCount = notifications.filter(
    (notification) => !readIds.has(notification.id),
  ).length;

  if (notifications.length === 0) {
    return (
      <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-10 text-center">
        <BellRing className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 text-lg font-semibold text-white">{emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Notification center
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                : "All updates have been read"}
            </p>
          </div>

          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const isUnread = !readIds.has(notification.id);

          return (
            <Link
              key={notification.id}
              href={notification.href}
              onClick={() => onOpenNotification(notification)}
              className="theme-surface block rounded-[24px] border border-white/10 bg-slate-950/30 p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div
                    className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getToneClass(
                      notification.tone,
                    )}`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-white">
                        {notification.title}
                      </h3>
                      {isUnread ? (
                        <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-200">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {notification.message}
                    </p>
                    <div className="mt-3 text-xs text-slate-400">
                      {notification.meta}
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200">
                  View <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
