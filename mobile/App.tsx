import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/contexts/AuthContext";
import { HabitsProvider } from "./src/contexts/HabitsContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </HabitsProvider>
    </AuthProvider>
  );
}
