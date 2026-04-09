import dayjs from "dayjs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { CalendarResponse } from "../types/models";

export function CalendarGrid({ calendar }: { calendar: CalendarResponse }) {
  const monthStart = dayjs(`${calendar.month}-01`);
  const firstDay = monthStart.day();
  const daysInMonth = monthStart.daysInMonth();
  const leadingSlots = Array.from({ length: firstDay }, () => null) as Array<number | null>;
  const daySlots = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const slots = leadingSlots.concat(daySlots);

  return (
    <View style={styles.card}>
      <View style={styles.weekdays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label) => (
          <Text key={label} style={styles.weekday}>{label}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {slots.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const date = monthStart.date(day).format("YYYY-MM-DD");
          const dayInfo = calendar.days[date];
          const active = Boolean(dayInfo);

          return (
            <View key={date} style={styles.dayCell}>
              <View style={[styles.dayBubble, active ? styles.dayBubbleActive : styles.dayBubbleInactive]}>
                <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 10
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 4
  },
  weekday: {
    width: 32,
    textAlign: "center",
    color: colors.textDim,
    fontSize: 12,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  dayCell: {
    width: "12.5%",
    alignItems: "center",
    marginBottom: 10
  },
  dayBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  dayBubbleActive: {
    backgroundColor: colors.green
  },
  dayBubbleInactive: {
    backgroundColor: "#26344D"
  },
  dayText: {
    color: colors.textMuted,
    fontWeight: "700"
  },
  dayTextActive: {
    color: colors.text
  }
});
