import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export function ScreenContainer({
  children,
  scrollable = false,
  contentStyle,
  loading = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  loading?: boolean;
}) {
  const body = (
    <View style={[styles.content, contentStyle]}>
      {loading ? <ActivityIndicator color={colors.primary} size="large" style={styles.loader} /> : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? <ScrollView contentContainerStyle={styles.scroll}>{body}</ScrollView> : body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scroll: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: colors.background
  },
  loader: {
    marginTop: 12,
    marginBottom: 12
  }
});
