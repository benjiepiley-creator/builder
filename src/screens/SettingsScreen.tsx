import { Alert, Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { APP_NAME, GENERAL_DISCLAIMER } from "@/constants/copy";
import { useScanStore } from "@/hooks/useScanStore";
import { PLAN_CONFIG, useSubscriptionStore } from "@/services/subscription/subscriptionService";
import { isSupabaseConfigured } from "@/services/supabase/client";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const SettingRow = ({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4"
  >
    <Text className="font-semibold text-white">{label}</Text>
    {value ? <Text className="text-slate-400">{value}</Text> : null}
  </Pressable>
);

export const SettingsScreen = (_props: Props) => {
  const { userPlan, showUpgrade } = useSubscriptionStore();
  const clearLocalData = useScanStore((state) => state.clearLocalData);

  const clearData = () => {
    Alert.alert("Clear local data?", "This deletes saved scans from this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => void clearLocalData()
      }
    ]);
  };

  return (
    <ScreenContainer>
      <View className="pt-4">
        <Text className="text-sm font-bold uppercase tracking-[4px] text-cyan-300">Settings</Text>
        <Text className="mt-2 text-4xl font-black text-white">{APP_NAME}</Text>
        <Text className="mt-3 leading-6 text-slate-400">Subscription, privacy, support, and backend readiness placeholders.</Text>

        <View className="mt-8 rounded-[32px] border border-cyan-300/20 bg-cyan-300/10 p-5">
          <Text className="text-xl font-black text-white">Subscription status</Text>
          <Text className="mt-2 text-slate-300">Current plan: {PLAN_CONFIG[userPlan].name}</Text>
          <Text className="mt-2 leading-6 text-slate-400">{PLAN_CONFIG[userPlan].features.join(" • ")}</Text>
          <View className="mt-5">
            <PrimaryButton title="Upgrade" onPress={showUpgrade} />
          </View>
        </View>

        <View className="mt-6 gap-3">
          <SettingRow label="Supabase" value={isSupabaseConfigured ? "Configured" : "Local-only mode"} />
          <SettingRow label="Clear local data" value="Delete scans" onPress={clearData} />
          <SettingRow label="Contact support" value="Placeholder" onPress={() => Alert.alert("Support", "Support email placeholder: support@riskradar.app")} />
          <SettingRow label="Terms" value="Placeholder" onPress={() => Alert.alert("Terms", "Terms of service placeholder for App Store readiness.")} />
          <SettingRow label="Privacy" value="Placeholder" onPress={() => Alert.alert("Privacy", GENERAL_DISCLAIMER)} />
        </View>

        <View className="mt-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <Text className="leading-6 text-yellow-100">{GENERAL_DISCLAIMER}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};
