"use client";

import { NotificationProvider } from "@/components/shared/Toast/NotificationProvider";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <>
    <ErrorBoundary>{children}</ErrorBoundary>
    <NotificationProvider />
  </>
);
