export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export type HabitSummary = {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
  reminderEnabled: boolean;
  checkedToday: boolean;
  streak: number;
  totalCheckins: number;
};

export type HomeResponse = {
  summary: {
    totalHabits: number;
    completedToday: number;
    rate: number;
  };
  habits: HabitSummary[];
};

export type HabitDetails = HabitSummary & {
  longestStreak: number;
  weekly: Array<{
    day: string;
    date: string;
    checked: boolean;
    isToday: boolean;
  }>;
  history: string[];
};

export type CalendarResponse = {
  month: string;
  filters: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  days: Record<string, { count: number; habits: string[] }>;
  stats: {
    completed: number;
    missed: number;
    rate: number;
  };
};
