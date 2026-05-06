"use client";

import { useEffect } from "react";
import { UI_CONSTANTS } from "@/lib/constants/ui";
import { useNotificationStore } from "@/lib/store/notificationStore";
import type { NotificationType } from "@/lib/store/notificationStore";

const typeStyles: Record<NotificationType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-indigo-200 bg-indigo-50 text-indigo-800",
};

const dismissDuration = (type: NotificationType): number =>
  type === "error" ? UI_CONSTANTS.toastErrorMs : UI_CONSTANTS.toastSuccessMs;

export const NotificationProvider = () => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    const timers = notifications.map((item) =>
      setTimeout(
        () => removeNotification(item.id),
        item.duration ?? dismissDuration(item.type),
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-2">
      {notifications.map((item) => (
        <div
          key={item.id}
          className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm shadow-sm ${typeStyles[item.type]}`}
        >
          <span>{item.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => removeNotification(item.id)}
            className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
