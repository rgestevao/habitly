import React, { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "../contexts/HabitsContext";
import { colors } from "../theme/colors";

export function HabitDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth();
  const { selectedHabit, loading, loadHabit, checkinHabit } = useHabits();

  useFocusEffect(
    useCallback(() => {
      if (token && route.params?.habitId) {
        loadHabit(token, route.params.habitId);
      }
    }, [loadHabit, route.params?.habitId, token])
  );

  return (
    <ScreenContainer loading={loading}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{selectedHabit?.name ?? "Habit"}</Text>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.textMuted} />
        </View>

        <View style={[styles.heroIcon, { backgroundColor: selectedHabit?.color ?? colors.primary }]}>
          <Text style={styles.heroEmoji}>{selectedHabit?.icon ?? "🏃"}</Text>
        </View>

        <Text style={styles.description}>{selectedHabit?.description ?? "No description yet"}</Text>

        <Pressable
          style={[styles.checkButton, { backgroundColor: selectedHabit?.checkedToday ? colors.greenSoft : colors.green }]}
          onPress={() => token && route.params?.habitId ? checkinHabit(token, route.params.habitId) : Promise.resolve()}
        >
          <MaterialCommunityIcons name="check" size={20} color={colors.text} />
          <Text style={styles.checkText}>{selectedHabit?.checkedToday ? "Checked Today" : "Check Today"}</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValueOrange}>🔥 {selectedHabit?.streak ?? 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{selectedHabit?.totalCheckins ?? 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Mon-Fri</Text>
            <Text style={styles.statLabel}>Schedule</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekRow}>
          {selectedHabit?.weekly.map((item) => (
            <View
              key={item.date}
              style={[
                styles.weekDay,
                item.checked && styles.weekDayChecked,
                item.isToday && styles.weekDayToday
              ]}
            >
              <Text style={styles.weekText}>{item.day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <Text style={styles.historyMonth}>Apr 2026</Text>
        </View>
        <View style={styles.historyCard}>
          {(selectedHabit?.history ?? []).slice(0, 6).map((date) => (
            <View key={date} style={styles.historyItem}>
              <Text style={styles.historyDot}>●</Text>
              <Text style={styles.historyText}>{date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  heroIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,
    opacity: 0.9
  },
  heroEmoji: {
    fontSize: 50
  },
  description: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 22
  },
  checkButton: {
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 24
  },
  checkText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: "center"
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  statValueOrange: {
    color: colors.orange,
    fontSize: 20,
    fontWeight: "800"
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 6
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 14
  },
  weekRow: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },
  weekDay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#101726",
    alignItems: "center",
    justifyContent: "center"
  },
  weekDayChecked: {
    backgroundColor: colors.green
  },
  weekDayToday: {
    borderWidth: 2,
    borderColor: colors.primary
  },
  weekText: {
    color: colors.text,
    fontWeight: "700"
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  historyMonth: {
    color: colors.primary,
    fontWeight: "700"
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8
  },
  historyDot: {
    color: colors.green
  },
  historyText: {
    color: colors.textMuted,
    fontSize: 15
  }
});
