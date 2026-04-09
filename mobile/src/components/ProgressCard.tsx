import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function ProgressCard({ completed, total, rate }: { completed: number; total: number; rate: number }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Today's Progress</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{completed} of {total} habits done</Text>
        <Text style={styles.rate}>{rate}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(rate, 8)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  value: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 18
  },
  rate: {
    color: colors.primaryBright,
    fontWeight: "800",
    fontSize: 28
  },
  track: {
    marginTop: 12,
    height: 8,
    backgroundColor: "#101726",
    borderRadius: 999,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.primaryBright
  }
});
