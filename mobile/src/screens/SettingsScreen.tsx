import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme/colors";

export function SettingsScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 24
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 8
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  email: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 6
  },
  button: {
    marginTop: 24,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border
  },
  buttonText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 16
  }
});
