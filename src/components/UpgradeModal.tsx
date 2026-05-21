import { Modal, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PLAN_CONFIG, useSubscriptionStore } from "@/services/subscription/subscriptionService";
import { PrimaryButton } from "@/components/PrimaryButton";

export const UpgradeModal = () => {
  const { upgradeVisible, hideUpgrade, setPlan } = useSubscriptionStore();

  return (
    <Modal visible={upgradeVisible} transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/70 p-5">
        <LinearGradient colors={["#111827", "#0F172A"]} className="rounded-[32px] border border-slate-700 p-6">
          <Text className="text-3xl font-black text-white">Upgrade RiskRadar</Text>
          <Text className="mt-3 leading-6 text-slate-300">
            Free scans are limited to 3 per month. This is a development subscription placeholder; plan selection is saved locally until RevenueCat is connected.
          </Text>

          <View className="mt-5 gap-3">
            {(["pro", "premium"] as const).map((plan) => (
              <Pressable
                key={plan}
                onPress={() => setPlan(plan)}
                className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4"
              >
                <Text className="text-xl font-bold text-white">{PLAN_CONFIG[plan].name}</Text>
                <Text className="mt-2 text-slate-300">{PLAN_CONFIG[plan].features.join(" • ")}</Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-5">
            <PrimaryButton title="Maybe Later" variant="secondary" onPress={hideUpgrade} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};
