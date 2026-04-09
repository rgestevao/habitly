import { db } from "../config/db";
import { HabitCheckinRecord, HabitRecord } from "../types/models";

type CreateHabitInput = {
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  reminderEnabled: boolean;
};

type UpdateHabitInput = Partial<Omit<CreateHabitInput, "userId">>;

export const habitRepository = {
  async create(input: CreateHabitInput) {
    const result = await db.query<HabitRecord>(
      `
        INSERT INTO habits (user_id, name, description, icon, color, reminder_enabled)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        input.userId,
        input.name,
        input.description ?? null,
        input.icon,
        input.color,
        input.reminderEnabled
      ]
    );

    return result.rows[0];
  },

  async update(id: string, userId: string, input: UpdateHabitInput) {
    const existing = await db.query<HabitRecord>(
      "SELECT * FROM habits WHERE id = $1 AND user_id = $2 LIMIT 1",
      [id, userId]
    );

    if (!existing.rowCount) {
      return null;
    }

    const habit = existing.rows[0];
    const result = await db.query<HabitRecord>(
      `
        UPDATE habits
        SET
          name = $3,
          description = $4,
          icon = $5,
          color = $6,
          reminder_enabled = $7,
          updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
      [
        id,
        userId,
        input.name ?? habit.name,
        input.description ?? habit.description,
        input.icon ?? habit.icon,
        input.color ?? habit.color,
        input.reminderEnabled ?? habit.reminder_enabled
      ]
    );

    return result.rows[0];
  },

  async listByUser(userId: string) {
    const result = await db.query<HabitRecord>(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at ASC",
      [userId]
    );

    return result.rows;
  },

  async findById(id: string, userId: string) {
    const result = await db.query<HabitRecord>(
      "SELECT * FROM habits WHERE id = $1 AND user_id = $2 LIMIT 1",
      [id, userId]
    );

    return result.rows[0] ?? null;
  },

  async createCheckin(habitId: string, userId: string, date: string) {
    await db.query(
      `
        INSERT INTO habit_checkins (habit_id, user_id, checkin_date)
        VALUES ($1, $2, $3)
        ON CONFLICT (habit_id, checkin_date) DO NOTHING
      `,
      [habitId, userId, date]
    );
  },

  async listCheckinsByUser(userId: string) {
    const result = await db.query<HabitCheckinRecord>(
      `
        SELECT habit_id, checkin_date::text
        FROM habit_checkins
        WHERE user_id = $1
        ORDER BY checkin_date ASC
      `,
      [userId]
    );

    return result.rows;
  },

  async listCheckinsByHabit(habitId: string, userId: string) {
    const result = await db.query<HabitCheckinRecord>(
      `
        SELECT habit_id, checkin_date::text
        FROM habit_checkins
        WHERE habit_id = $1 AND user_id = $2
        ORDER BY checkin_date ASC
      `,
      [habitId, userId]
    );

    return result.rows;
  },

  async listMonthCheckins(userId: string, start: string, end: string) {
    const result = await db.query<
      HabitCheckinRecord & { name: string; color: string; icon: string }
    >(
      `
        SELECT hc.habit_id, hc.checkin_date::text, h.name, h.color, h.icon
        FROM habit_checkins hc
        INNER JOIN habits h ON h.id = hc.habit_id
        WHERE hc.user_id = $1 AND hc.checkin_date BETWEEN $2 AND $3
        ORDER BY hc.checkin_date ASC
      `,
      [userId, start, end]
    );

    return result.rows;
  }
};
