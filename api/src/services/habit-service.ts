import dayjs from "dayjs";
import { habitRepository } from "../repositories/habit-repository";
import { AppError } from "../utils/errors";
import { formatMonthBounds, getCurrentStreak, getLongestStreak } from "../utils/date";

type HabitInput = {
  name: string;
  description?: string;
  icon: string;
  color: string;
  reminderEnabled: boolean;
};

const buildWeekMap = (dates: string[]) => {
  const start = dayjs().startOf("week").add(1, "day");

  return Array.from({ length: 7 }, (_, index) => {
    const date = start.add(index, "day");
    const formatted = date.format("YYYY-MM-DD");

    return {
      day: date.format("dd").charAt(0),
      date: formatted,
      checked: dates.includes(formatted),
      isToday: formatted === dayjs().format("YYYY-MM-DD")
    };
  });
};

export const habitService = {
  async createHabit(userId: string, input: HabitInput) {
    return habitRepository.create({ ...input, userId });
  },

  async updateHabit(userId: string, habitId: string, input: Partial<HabitInput>) {
    const updated = await habitRepository.update(habitId, userId, input);

    if (!updated) {
      throw new AppError("Habit not found", 404);
    }

    return updated;
  },

  async getHome(userId: string) {
    const [habits, checkins] = await Promise.all([
      habitRepository.listByUser(userId),
      habitRepository.listCheckinsByUser(userId)
    ]);

    const today = dayjs().format("YYYY-MM-DD");

    const habitItems = habits.map((habit) => {
      const habitDates = checkins
        .filter((entry) => entry.habit_id === habit.id)
        .map((entry) => entry.checkin_date);

      return {
        id: habit.id,
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
        color: habit.color,
        reminderEnabled: habit.reminder_enabled,
        checkedToday: habitDates.includes(today),
        streak: getCurrentStreak(habitDates),
        totalCheckins: habitDates.length
      };
    });

    const completedToday = habitItems.filter((item) => item.checkedToday).length;
    const totalHabits = habitItems.length;
    const rate = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

    return {
      summary: {
        totalHabits,
        completedToday,
        rate
      },
      habits: habitItems
    };
  },

  async getHabitDetails(userId: string, habitId: string) {
    const [habit, checkins] = await Promise.all([
      habitRepository.findById(habitId, userId),
      habitRepository.listCheckinsByHabit(habitId, userId)
    ]);

    if (!habit) {
      throw new AppError("Habit not found", 404);
    }

    const dates = checkins.map((entry) => entry.checkin_date);
    const today = dayjs().format("YYYY-MM-DD");

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      color: habit.color,
      reminderEnabled: habit.reminder_enabled,
      checkedToday: dates.includes(today),
      streak: getCurrentStreak(dates),
      longestStreak: getLongestStreak(dates),
      totalCheckins: dates.length,
      weekly: buildWeekMap(dates),
      history: dates.slice().reverse()
    };
  },

  async checkin(userId: string, habitId: string, date?: string) {
    const habit = await habitRepository.findById(habitId, userId);

    if (!habit) {
      throw new AppError("Habit not found", 404);
    }

    const targetDate = date ?? dayjs().format("YYYY-MM-DD");

    await habitRepository.createCheckin(habitId, userId, targetDate);
    return this.getHabitDetails(userId, habitId);
  },

  async getCalendar(userId: string, month: string) {
    const { start, end } = formatMonthBounds(month);
    const [monthCheckins, home] = await Promise.all([
      habitRepository.listMonthCheckins(userId, start, end),
      this.getHome(userId)
    ]);

    const groupedByDate = monthCheckins.reduce<Record<string, { count: number; habits: string[] }>>(
      (accumulator, checkin) => {
        const current = accumulator[checkin.checkin_date] ?? { count: 0, habits: [] };
        current.count += 1;
        current.habits.push(checkin.name);
        accumulator[checkin.checkin_date] = current;
        return accumulator;
      },
      {}
    );

    const uniqueDays = Object.keys(groupedByDate).length;
    const daysInMonth = dayjs(`${month}-01`).daysInMonth();

    return {
      month,
      filters: home.habits.map((habit) => ({
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color
      })),
      days: groupedByDate,
      stats: {
        completed: monthCheckins.length,
        missed: Math.max(daysInMonth - uniqueDays, 0),
        rate: daysInMonth === 0 ? 0 : Math.round((uniqueDays / daysInMonth) * 100)
      }
    };
  }
};
