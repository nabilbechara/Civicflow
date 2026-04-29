"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { NotificationList } from "@/components/notifications/notification-list";
import { useAuth } from "@/context/auth-context";
import { getAllRequests } from "@/lib/request-api";
import {
  buildCitizenNotifications,
  getReadNotificationIds,
  markNotificationsRead,
  type AppNotification,
} from "@/lib/notifications";
import type { ServiceRequest } from "@/types";

export default function CitizenNotificationsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setReadIds(getReadNotificationIds(user?.id));
    });

    getAllRequests()
      .then(setRequests)
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load notifications.",
        );
      });
  }, [user?.id]);

  const notifications = useMemo(
    () => buildCitizenNotifications(requests),
    [requests],
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
      roleLabel="Citizen Portal"
      title="Notifications"
      subtitle="Status changes and document requests will appear here."
    >
      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <NotificationList
        notifications={notifications}
        readIds={readIds}
        emptyTitle="Notifications center"
        emptyMessage="Request status updates, document requests, approvals, and final status changes will appear here."
        onMarkAllRead={handleMarkAllRead}
        onOpenNotification={handleOpenNotification}
      />
    </DashboardShell>
  );
}
