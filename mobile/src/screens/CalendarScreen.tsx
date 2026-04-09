import dayjs from "dayjs";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarGrid } from "../components/CalendarGrid";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "../contexts/HabitsContext";
import { colors } from "../theme/colors";

export function CalendarScreen() {
  const { token } = useAuth();
  const { calendar, loading, refreshCalendar } = useHabits();
  const currentMonth = dayjs().format("YYYY-MM");

  useFocusEffect(
    useCallback(() => {
      if (token) {
        void refreshCalendar(token, currentMonth);
      }
    }, [currentMonth, refreshCalendar, token])
  );

  return (
    <ScreenContainer loading={loading}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.monthSwitcher}>
          <MaterialCommunityIcons name="chevron-left" size={18} color={colors.text} />
          <Text style={styles.monthLabel}>{dayjs(`${currentMonth}-01`).format("MMM YYYY")}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.filtersRow}>
          <View style={[styles.filterChip, styles.filterChipActive]}>
            <Text style={styles.filterChipText}>All</Text>
          </View>
          {(calendar?.filters ?? []).slice(0, 3).map((filter) => (
            <View key={filter.id} style={styles.filterChip}>
              <Text style={styles.filterChipText}>{filter.icon} {filter.name}</Text>
            </View>
          ))}
        </View>

        {calendar ? <CalendarGrid calendar={calendar} /> : null}

        <Text style={styles.statsTitle}>April Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.green }]}>{calendar?.stats.completed ?? 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.red }]}>{calendar?.stats.missed ?? 0}</Text>
            <Text style={styles.statLabel}>Missed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calendar?.stats.rate ?? 0}%</Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800"
  },
  monthSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20
  },
  monthLabel: {
    color: colors.text,
    fontWeight: "700"
  },
  filtersRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  filterChip: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  filterChipActive: {
    backgroundColor: colors.primary
  },
  filterChipText: {
    color: colors.text,
    fontWeight: "700"
  },
  statsTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 14
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16
  },
  statValue: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 14
  }
});
