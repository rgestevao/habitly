import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { User } from "../types/models";

type Provider = "google" | "github";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (provider: Provider) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockProfiles: Record<Provider, User> = {
  google: {
    id: "user-google-alex",
    name: "Alex",
    email: "alex.google@habitly.dev",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex"
  },
  github: {
    id: "user-github-alex",
    name: "Alex",
    email: "alex.github@habitly.dev",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=GitAlex"
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (provider: Provider) => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setUser(mockProfiles[provider]);
      setToken(`mock-token-${provider}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      signIn,
      signOut
    }),
    [loading, signIn, signOut, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}