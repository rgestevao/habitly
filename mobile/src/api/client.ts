import { CalendarResponse, HabitDetails, HomeResponse, User } from "../types/models";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  token?: string | null;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: "Unexpected error" }));
    throw new Error(payload.message ?? "Unexpected error");
  }

  return response.json() as Promise<T>;
}

export const api = {
  socialLogin(payload: {
    provider: "google" | "github";
    providerUserId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    return request<{ token: string; user: User }>("/auth/social", {
      method: "POST",
      body: payload
    });
  },
  exchangeOAuthCode(payload: {
    provider: "google" | "github";
    code: string;
    redirectUri: string;
  }) {
    return request<{ token: string; user: User }>("/auth/oauth/exchange", {
      method: "POST",
      body: payload
    });
  },
  getHome(token: string) {
    return request<HomeResponse>("/habits/home", { token });
  },
  createHabit(
    token: string,
    payload: { name: string; description?: string; icon: string; color: string; reminderEnabled: boolean }
  ) {
    return request("/habits", {
      method: "POST",
      token,
      body: payload
    });
  },
  getHabit(token: string, id: string) {
    return request<HabitDetails>(`/habits/${id}`, { token });
  },
  checkinHabit(token: string, id: string) {
    return request<HabitDetails>(`/habits/${id}/checkin`, {
      method: "POST",
      token,
      body: {}
    });
  },
  getCalendar(token: string, month: string) {
    return request<CalendarResponse>(`/habits/calendar?month=${month}`, { token });
  }
};
