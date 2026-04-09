import dayjs from "dayjs";

export const formatMonthBounds = (month: string) => {
  const start = dayjs(`${month}-01`).startOf("month");
  const end = start.endOf("month");

  return {
    start: start.format("YYYY-MM-DD"),
    end: end.format("YYYY-MM-DD")
  };
};

export const getCurrentStreak = (dates: string[]) => {
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 0;
  let cursor = dayjs().startOf("day");

  for (const date of sorted) {
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

export const getLongestStreak = (dates: string[]) => {
  const sorted = [...new Set(dates)].sort();

  if (sorted.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = dayjs(sorted[index - 1]);
    const next = dayjs(sorted[index]);

    if (next.diff(previous, "day") === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
};
