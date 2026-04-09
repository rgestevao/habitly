import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPicker, IconPicker } from "../components/IconPicker";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "../contexts/HabitsContext";
import { colors, habitPalette, iconOptions } from "../theme/colors";

export function CreateHabitScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();
  const { createHabit, loading } = useHabits();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(iconOptions[0].icon);
  const [color, setColor] = useState(habitPalette[0]);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const handleSave = async () => {
    if (!token || !name.trim()) {
      Alert.alert("Habitly", "Please fill in the habit name.");
      return;
    }

    await createHabit(token, {
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      reminderEnabled
    });

    navigation.goBack();
  };

  return (
    <ScreenContainer scrollable loading={loading}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>New Habit</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.label}>Habit Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Read 30 pages"
        placeholderTextColor={colors.textDim}
        style={styles.input}
      />

      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Why are you doing this?"
        placeholderTextColor={colors.textDim}
        multiline
        style={[styles.input, styles.textarea]}
      />

      <Text style={styles.label}>Icon</Text>
      <IconPicker value={icon} onChange={setIcon} />

      <Text style={styles.label}>Color</Text>
      <ColorPicker value={color} onChange={setColor} />

      <View style={styles.reminderCard}>
        <View>
          <Text style={styles.reminderTitle}>Daily Reminder</Text>
          <Text style={styles.reminderSubtitle}>Get notified to complete this</Text>
        </View>
        <Switch
          value={reminderEnabled}
          onValueChange={setReminderEnabled}
          thumbColor="#111"
          trackColor={{ false: "#334155", true: colors.primary }}
        />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 24
  },
  placeholder: {
    width: 26
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 18
  },
  input: {
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: "top"
  },
  reminderCard: {
    marginTop: 22,
    backgroundColor: colors.cardAlt,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  reminderTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4
  },
  reminderSubtitle: {
    color: colors.textMuted,
    fontSize: 13
  },
  saveButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 12
  },
  saveText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  }
});
