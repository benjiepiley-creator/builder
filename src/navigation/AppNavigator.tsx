import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";

import type { RootStackParamList } from "@/navigation/types";
import { AnalysisScreen } from "@/screens/AnalysisScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { NewScanScreen } from "@/screens/NewScanScreen";
import { ONBOARDING_KEY, OnboardingScreen } from "@/screens/OnboardingScreen";
import { PastScansScreen } from "@/screens/PastScansScreen";
import { RiskReportScreen } from "@/screens/RiskReportScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#060912",
    card: "#060912",
    border: "#202A3D",
    text: "#F8FAFC"
  }
};

export const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => setInitialRoute(value === "true" ? "Home" : "Onboarding"))
      .catch(() => setInitialRoute("Onboarding"));
  }, []);

  if (!initialRoute) {
    return (
      <View className="flex-1 items-center justify-center bg-[#060912] px-6">
        <ActivityIndicator color="#38BDF8" size="large" />
        <Text className="mt-4 text-lg font-bold text-white">Loading RiskRadar...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#060912" },
          animation: "slide_from_right"
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewScan" component={NewScanScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="RiskReport" component={RiskReportScreen} />
        <Stack.Screen name="PastScans" component={PastScansScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
