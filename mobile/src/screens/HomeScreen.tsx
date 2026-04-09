import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EmptyState } from "../components/EmptyState";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { HabitCard } from "../components/HabitCard";
import { ProgressCard } from "../components/ProgressCard";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "../contexts/HabitsContext";
import { colors } from "../theme/colors";

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, token } = useAuth();
  const { home, loading, refreshHome, checkinHabit } = useHabits();

  useFocusEffect(
    useCallback(() => {
      if (token) {
        void refreshHome(token);
      }
    }, [refreshHome, token])
  );

  return (
    <ScreenContainer loading={loading}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Habitly</Text>
          <Text style={styles.greeting}>Good morning, {user?.name ?? "Alex"} 👋</Text>
          <Text style={styles.date}>April 3, 2026</Text>
        </View>
        <MaterialCommunityIcons name="white-balance-sunny" size={18} color={colors.textMuted} />
      </View>

      {!home || home.habits.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ProgressCard
            completed={home.summary.completedToday}
            total={home.summary.totalHabits}
            rate={home.summary.rate}
          />
          {home.habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => navigation.navigate("HabitDetails", { habitId: habit.id })}
              onAction={() => token ? void checkinHabit(token, habit.id) : undefined}
            />
          ))}
        </>
      )}

      <FloatingActionButton onPress={() => navigation.navigate("CreateHabit")} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 18
  },
  brand: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 18
  },
  greeting: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6
  },
  date: {
    color: colors.textMuted,
    fontSize: 14
  }
});
