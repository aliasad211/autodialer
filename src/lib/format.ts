import type { CallOutcome, CallStatus, LeadStatus } from "@/generated/prisma";

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "New",
  INTERESTED: "Interested",
  FOLLOW_UP: "Follow-up",
  CONVERTED: "Converted",
  NOT_INTERESTED: "Not Interested",
};

export const leadStatusStyles: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  INTERESTED: "bg-green-50 text-green-700",
  FOLLOW_UP: "bg-yellow-50 text-yellow-700",
  CONVERTED: "bg-purple-50 text-purple-700",
  NOT_INTERESTED: "bg-red-50 text-red-700",
};

export const callStatusLabels: Record<CallStatus, string> = {
  COMPLETED: "Completed",
  NO_ANSWER: "No Answer",
  BUSY: "Busy",
  FAILED: "Failed",
  REJECTED: "Rejected",
};

export const callStatusStyles: Record<CallStatus, string> = {
  COMPLETED: "bg-green-50 text-green-700",
  NO_ANSWER: "bg-gray-100 text-gray-600",
  BUSY: "bg-yellow-50 text-yellow-700",
  FAILED: "bg-red-50 text-red-700",
  REJECTED: "bg-red-50 text-red-700",
};

export const callOutcomeLabels: Record<CallOutcome, string> = {
  INTERESTED: "Interested",
  FOLLOW_UP: "Follow-up",
  CONVERTED: "Converted",
  NOT_INTERESTED: "Not Interested",
  NO_RESPONSE: "No Response",
};

export const callOutcomeStyles: Record<CallOutcome, string> = {
  INTERESTED: "bg-green-50 text-green-700",
  FOLLOW_UP: "bg-yellow-50 text-yellow-700",
  CONVERTED: "bg-purple-50 text-purple-700",
  NOT_INTERESTED: "bg-red-50 text-red-700",
  NO_RESPONSE: "bg-gray-100 text-gray-500",
};

export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function formatDateTime(date: Date | null | undefined) {
  if (!date) return "Never";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDayLabel(date: Date) {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const PAGE_SIZE = 20;

export type DateRangeKey = "7" | "30" | "month" | "lastmonth" | "year";

export function resolveDateRange(key: string | undefined) {
  const now = new Date();
  const today = startOfDay(now);

  switch (key) {
    case "7": {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { start, end: new Date(today.getTime() + 86_400_000), label: "Last 7 Days" };
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end: new Date(today.getTime() + 86_400_000), label: "This Month" };
    }
    case "lastmonth": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end, label: "Last Month" };
    }
    case "year": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end: new Date(today.getTime() + 86_400_000), label: "This Year" };
    }
    case "30":
    default: {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { start, end: new Date(today.getTime() + 86_400_000), label: "Last 30 Days" };
    }
  }
}

export function initials(name: string) {
  return name.charAt(0).toUpperCase();
}
