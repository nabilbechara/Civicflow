"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationList } from "@/components/notifications/notification-list";
import { useAuth } from "@/context/auth-context";
import { getAllRequests, getRequestById } from "@/lib/request-api";
import {
  buildEmployeeNotifications,
  getReadNotificationIds,
  markNotificationsRead,
  type AppNotification,
} from "@/lib/notifications";
import type { ServiceRequest } from "@/types";

function withTimeout<T>(promise: Promise<T>, fallback: T, timeoutMs = 2500) {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      window.setTimeout(() => resolve(fallback), timeoutMs);
    }),
  ]);
}

export default function EmployeeNotificationsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const isAdmin =
    user?.role === "municipality_admin" || user?.role === "super_admin";

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setReadIds(getReadNotificationIds(user?.id));
    });

    getAllRequests()
      .then((results) => {
        setRequests(results);

        if (!isAdmin) return;

        Promise.all(
          results.map(async (request) => {
            const detailed = await withTimeout(
              getRequestById(request.id),
              request,
            );
            return detailed || request;
          }),
        ).then(setRequests);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load notifications.",
        );
      });
  }, [isAdmin, user?.id]);

  const notifications = useMemo(
    () => buildEmployeeNotifications(requests, isAdmin),
    [isAdmin, requests],
  );

  function markRead(notificationIds: string[]) {
    markNotificationsRead(user?.id, notificationIds);
    setReadIds(getReadNotificationIds(user?.id));
  }

  function handleMarkAllRead() {
    markRead(notifications.map((notification) => notification.id));
  }

  function handleOpenNotification(notification: AppNotification) {
    markRead([notification.id]);
  }

  return (
    <DashboardShell
      roleLabel={
        isAdmin
          ? "Municipality Admin Workspace"
          : "Municipal Employee Workspace"
      }
      title="Notifications"
      subtitle={
        isAdmin
          ? "Escalations, new requests, and priority workflow updates."
          : "New assignments, incoming requests, and workflow updates."
      }
    >
      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <NotificationList
        notifications={notifications}
        readIds={readIds}
        emptyTitle="Internal notifications"
        emptyMessage="New request assignments, escalations, pending document reviews, and priority updates will appear here."
        onMarkAllRead={handleMarkAllRead}
        onOpenNotification={handleOpenNotification}
      />
    </DashboardShell>
  );
}
