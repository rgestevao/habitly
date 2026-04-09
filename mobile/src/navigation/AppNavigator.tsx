import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useHabits } from "../contexts/HabitsContext";
import { colors } from "../theme/colors";
import { CalendarScreen } from "../screens/CalendarScreen";
import { CreateHabitScreen } from "../screens/CreateHabitScreen";
import { HabitDetailsScreen } from "../screens/HabitDetailsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { RootStackParamList, TabParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function TabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardAlt,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof TabParamList, React.ComponentProps<typeof MaterialCommunityIcons>["name"]> = {
            Home: "home-outline",
            Calendar: "calendar-blank-outline",
            Settings: "cog-outline"
          };

          return <MaterialCommunityIcons name={icons[route.name]} color={color} size={size} />;
        }
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Calendar" component={CalendarScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

function AuthenticatedNavigator() {
  const { token } = useAuth();
  const { refreshHome, refreshCalendar } = useHabits();

  useEffect(() => {
    if (!token) {
      return;
    }

    void refreshHome(token);
    void refreshCalendar(token);
  }, [refreshCalendar, refreshHome, token]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
      <Stack.Screen name="HabitDetails" component={HabitDetailsScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { token } = useAuth();

  return <NavigationContainer>{token ? <AuthenticatedNavigator /> : <LoginScreen />}</NavigationContainer>;
}
