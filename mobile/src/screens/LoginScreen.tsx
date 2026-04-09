import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme/colors";

function SocialButton({
  icon,
  label,
  onPress
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.socialButton} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.text} />
      <Text style={styles.socialButtonText}>{label}</Text>
    </Pressable>
  );
}

export function LoginScreen() {
  const { signIn, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
    } catch (error) {
      Alert.alert("Habitly", error instanceof Error ? error.message : "Google login failed.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signIn("github");
    } catch (error) {
      Alert.alert("Habitly", error instanceof Error ? error.message : "GitHub login failed.");
    }
  };

  return (
    <ScreenContainer>
      <LinearGradient colors={["#1B1D4B", "#0B1220"]} style={styles.hero}>
        <View style={styles.themeToggle}>
          <MaterialCommunityIcons name="theme-light-dark" size={18} color={colors.textMuted} />
        </View>

        <View style={styles.brandWrap}>
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="fire" size={38} color={colors.text} />
          </View>
          <Text style={styles.title}>Habitly</Text>
          <Text style={styles.subtitle}>Build habits that stick.</Text>
        </View>

        <View style={styles.actions}>
          <SocialButton icon="google" label="Continue with Google" onPress={handleGoogleLogin} />
          <SocialButton icon="github" label="Continue with GitHub" onPress={handleGithubLogin} />
          {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    borderRadius: 0,
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 18
  },
  themeToggle: {
    alignSelf: "flex-end",
    marginTop: 6
  },
  brandWrap: {
    alignItems: "center",
    marginTop: 120
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    marginBottom: 20
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 18,
    marginTop: 6
  },
  actions: {
    gap: 14,
    marginBottom: 56,
    paddingHorizontal: 6
  },
  socialButton: {
    height: 54,
    backgroundColor: colors.cardAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  socialButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  loader: {
    marginTop: 6
  }
});