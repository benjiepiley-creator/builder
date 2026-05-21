import "react-native-gesture-handler";
import "./src/styles/global.css";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { UpgradeModal } from "@/components/UpgradeModal";
import { AppNavigator } from "@/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
      <UpgradeModal />
    </SafeAreaProvider>
  );
}
