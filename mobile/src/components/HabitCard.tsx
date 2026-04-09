import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { HabitSummary } from "../types/models";

export function HabitCard({
  habit,
  onPress,
  onAction
}: {
  habit: HabitSummary;
  onPress: () => void;
  onAction?: () => void;
}) {
  return (
    <Pressable style={[styles.card, { borderLeftColor: habit.color }]} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{habit.icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{habit.name}</Text>
        <Text style={styles.subtitle}>{habit.description || "Build a better routine"}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.streak}>🔥 {habit.streak} day</Text>
          <Text style={styles.total}>⌘ {habit.totalCheckins} total</Text>
        </View>
      </View>

      <Pressable
        style={[styles.action, habit.checkedToday ? styles.checked : styles.unchecked]}
        onPress={onAction}
      >
        <MaterialCommunityIcons
          name={habit.checkedToday ? "check" : "plus"}
          size={24}
          color={colors.text}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    marginBottom: 14
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#11192D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  icon: {
    fontSize: 24
  },
  content: {
    flex: 1,
    gap: 3
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  streak: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "700"
  },
  total: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "600"
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  checked: {
    backgroundColor: colors.green
  },
  unchecked: {
    backgroundColor: colors.primary
  }
});
