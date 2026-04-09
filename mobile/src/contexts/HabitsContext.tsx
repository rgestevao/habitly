import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import dayjs from "dayjs";
import { CalendarResponse, HabitDetails, HomeResponse } from "../types/models";

type HabitContextValue = {
  home: HomeResponse | null;
  calendar: CalendarResponse | null;
  selectedHabit: HabitDetails | null;
  loading: boolean;
  refreshHome: (token: string) => Promise<void>;
  refreshCalendar: (token: string, month?: string) => Promise<void>;
  loadHabit: (token: string, habitId: string) => Promise<void>;
  createHabit: (
    token: string,
    payload: { name: string; description?: string; icon: string; color: string; reminderEnabled: boolean }
  ) => Promise<void>;
  checkinHabit: (token: string, habitId: string) => Promise<void>;
};

type HabitRecord = {
  id: string;
  name: string;
  description?: string | null;
  icon: string;
  color: string;
  reminderEnabled: boolean;
  history: string[];
};

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

const today = dayjs().format("YYYY-MM-DD");
const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
const twoDaysAgo = dayjs().subtract(2, "day").format("YYYY-MM-DD");
const threeDaysAgo = dayjs().subtract(3, "day").format("YYYY-MM-DD");
const fiveDaysAgo = dayjs().subtract(5, "day").format("YYYY-MM-DD");

const initialHabits: HabitRecord[] = [
  {
    id: "habit-run",
    name: "Morning Run",
    description: "30 min run outside every morning",
    icon: "🏃",
    color: "#22C55E",
    reminderEnabled: true,
    history: [threeDaysAgo, twoDaysAgo, yesterday, today]
  },
  {
    id: "habit-water",
    name: "Drink Water",
    description: "8 glasses/day",
    icon: "💧",
    color: "#06B6D4",
    reminderEnabled: true,
    history: [fiveDaysAgo, threeDaysAgo, yesterday, today]
  },
  {
    id: "habit-read",
    name: "Read",
    description: "30 pages/day",
    icon: "📚",
    color: "#8B5CF6",
    reminderEnabled: false,
    history: [fiveDaysAgo, threeDaysAgo, twoDaysAgo]
  },
  {
    id: "habit-meditate",
    name: "Meditate",
    description: "10 min session",
    icon: "🧘",
    color: "#F59E0B",
    reminderEnabled: false,
    history: []
  }
];

const uniqueSortedDates = (dates: string[]) => [...new Set(dates)].sort();

const getCurrentStreak = (history: string[]) => {
  const dates = uniqueSortedDates(history).reverse();
  let streak = 0;
  let cursor = dayjs().startOf("day");

  for (const date of dates) {
    const current = dayjs(date);

    if (current.isSame(cursor, "day")) {
      streak += 1;
      cursor = cursor.subtract(1, "day");
      continue;
    }

    if (streak === 0 && current.isSame(cursor.subtract(1, "day"), "day")) {
      streak += 1;
      cursor = current.subtract(1, "day");
      continue;
    }

    break;
  }

  return streak;
};

const getLongestStreak = (history: string[]) => {
  const dates = uniqueSortedDates(history);

  if (dates.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < dates.length; index += 1) {
    if (dayjs(dates[index]).diff(dayjs(dates[index - 1]), "day") === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
};

const toSummary = (habit: HabitRecord) => ({
  id: habit.id,
  name: habit.name,
  description: habit.description,
  icon: habit.icon,
  color: habit.color,
  reminderEnabled: habit.reminderEnabled,
  checkedToday: habit.history.includes(today),
  streak: getCurrentStreak(habit.history),
  totalCheckins: uniqueSortedDates(habit.history).length
});

const buildHome = (habits: HabitRecord[]): HomeResponse => {
  const summaries = habits.map(toSummary);
  const completedToday = summaries.filter((habit) => habit.checkedToday).length;
  const totalHabits = summaries.length;

  return {
    summary: {
      totalHabits,
      completedToday,
      rate: totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100)
    },
    habits: summaries
  };
};

const buildHabitDetails = (habit: HabitRecord): HabitDetails => {
  const summary = toSummary(habit);
  const start = dayjs().startOf("week").add(1, "day");

  return {
    ...summary,
    longestStreak: getLongestStreak(habit.history),
    weekly: Array.from({ length: 7 }, (_, index) => {
      const date = start.add(index, "day").format("YYYY-MM-DD");
      return {
        day: start.add(index, "day").format("dd").charAt(0),
        date,
        checked: habit.history.includes(date),
        isToday: date === today
      };
    }),
    history: uniqueSortedDates(habit.history).reverse()
  };
};

const buildCalendar = (habits: HabitRecord[], month: string): CalendarResponse => {
  const monthPrefix = `${month}-`;
  const monthDays = habits.reduce<Record<string, { count: number; habits: string[] }>>((accumulator, habit) => {
    uniqueSortedDates(habit.history)
      .filter((date) => date.startsWith(monthPrefix))
      .forEach((date) => {
        const entry = accumulator[date] ?? { count: 0, habits: [] };
        entry.count += 1;
        entry.habits.push(habit.name);
        accumulator[date] = entry;
      });

    return accumulator;
  }, {});

  const touchedDays = Object.keys(monthDays).length;
  const completed = Object.values(monthDays).reduce((sum, day) => sum + day.count, 0);
  const daysInMonth = dayjs(`${month}-01`).daysInMonth();

  return {
    month,
    filters: habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color
    })),
    days: monthDays,
    stats: {
      completed,
      missed: Math.max(daysInMonth - touchedDays, 0),
      rate: daysInMonth === 0 ? 0 : Math.round((touchedDays / daysInMonth) * 100)
    }
  };
};

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habitRecords, setHabitRecords] = useState<HabitRecord[]>(initialHabits);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const home = useMemo(() => buildHome(habitRecords), [habitRecords]);
  const calendar = useMemo(() => buildCalendar(habitRecords, dayjs().format("YYYY-MM")), [habitRecords]);
  const selectedHabit = useMemo(() => {
    const habit = habitRecords.find((entry) => entry.id === selectedHabitId);
    return habit ? buildHabitDetails(habit) : null;
  }, [habitRecords, selectedHabitId]);

  const refreshHome = useCallback(async (_token: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCalendar = useCallback(async (_token: string, _month = dayjs().format("YYYY-MM")) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 120));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHabit = useCallback(async (_token: string, habitId: string) => {
    setLoading(true);
    try {
      setSelectedHabitId(habitId);
      await new Promise((resolve) => setTimeout(resolve, 120));
    } finally {
      setLoading(false);
    }
  }, []);

  const createHabit = useCallback(async (
    _token: string,
    payload: { name: string; description?: string; icon: string; color: string; reminderEnabled: boolean }
  ) => {
    setLoading(true);
    try {
      const newHabit: HabitRecord = {
        id: `habit-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
        color: payload.color,
        reminderEnabled: payload.reminderEnabled,
        history: []
      };

      setHabitRecords((current) => [...current, newHabit]);
      setSelectedHabitId(newHabit.id);
      await new Promise((resolve) => setTimeout(resolve, 120));
    } finally {
      setLoading(false);
    }
  }, []);

  const checkinHabit = useCallback(async (_token: string, habitId: string) => {
    setLoading(true);
    try {
      setHabitRecords((current) => current.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }

        if (habit.history.includes(today)) {
          return habit;
        }

        return {
          ...habit,
          history: [...habit.history, today]
        };
      }));
      setSelectedHabitId(habitId);
      await new Promise((resolve) => setTimeout(resolve, 120));
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      home,
      calendar,
      selectedHabit,
      loading,
      refreshHome,
      refreshCalendar,
      loadHabit,
      createHabit,
      checkinHabit
    }),
    [calendar, checkinHabit, createHabit, home, loadHabit, loading, refreshCalendar, refreshHome, selectedHabit]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }

  return context;
}