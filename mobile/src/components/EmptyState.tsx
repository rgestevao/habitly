import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>🌱</Text>
      </View>
      <Text style={styles.title}>No habits yet</Text>
      <Text style={styles.description}>Start tracking your first habit to build a better routine.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  iconWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardAlt,
    marginBottom: 22
  },
  icon: {
    fontSize: 42
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10
  },
  description: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24
  }
});
