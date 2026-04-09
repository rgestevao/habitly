export type SocialProvider = "google" | "github";

export type HabitRecord = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  reminder_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type HabitCheckinRecord = {
  habit_id: string;
  checkin_date: string;
};
