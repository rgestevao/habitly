import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, habitPalette, iconOptions } from "../theme/colors";

export function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  return (
    <View style={styles.grid}>
      {iconOptions.map((option) => {
        const active = value === option.icon;

        return (
          <Pressable key={option.key} style={[styles.item, active && styles.itemActive]} onPress={() => onChange(option.icon)}>
            <Text style={styles.icon}>{option.icon}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <View style={styles.colorsRow}>
      {habitPalette.map((color) => {
        const active = value === color;

        return (
          <Pressable
            key={color}
            style={[styles.colorDot, { backgroundColor: color }, active && styles.colorDotActive]}
            onPress={() => onChange(color)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  item: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center"
  },
  itemActive: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 }
  },
  icon: {
    fontSize: 20
  },
  colorsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 4
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent"
  },
  colorDotActive: {
    borderColor: colors.text
  }
});
