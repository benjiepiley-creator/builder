import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EmptyState } from "@/components/EmptyState";
import { PastScanCard } from "@/components/PastScanCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { APP_NAME, GENERAL_DISCLAIMER } from "@/constants/copy";
import { useScanStore } from "@/hooks/useScanStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const featureCards = [
  "Scam Risk Scanner",
  "Price Check",
  "Seller Red Flags",
  "Negotiation Assistant"
];

export const HomeScreen = ({ navigation }: Props) => {
  const { scans, loadScans, deleteScan, setCurrentScan } = useScanStore();

  useEffect(() => {
    void loadScans();
  }, [loadScans]);

  const recent = scans.slice(0, 3);

  return (
    <ScreenContainer>
      <View className="pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-bold uppercase tracking-[4px] text-cyan-300">{APP_NAME}</Text>
            <Text className="mt-2 text-4xl font-black text-white">Scan before you buy.</Text>
          </View>
          <Pressable onPress={() => navigation.navigate("Settings")} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2">
            <Text className="font-bold text-slate-200">Settings</Text>
          </Pressable>
        </View>

        <View className="mt-8 rounded-[36px] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <Text className="text-xl font-bold text-white">AI Purchase Risk Scanner</Text>
          <Text className="mt-3 leading-6 text-slate-300">
            Analyze screenshots, item photos, listings, seller messages, price, and location before you send money or meet.
          </Text>
          <View className="mt-6 gap-3">
            <PrimaryButton title="Analyze a Purchase" onPress={() => navigation.navigate("NewScan")} />
            <PrimaryButton title="View Past Scans" variant="secondary" onPress={() => navigation.navigate("PastScans")} />
          </View>
        </View>

        <View className="mt-6 flex-row flex-wrap gap-3">
          {featureCards.map((card) => (
            <View key={card} className="w-[47%] rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <Text className="text-base font-bold text-white">{card}</Text>
              <Text className="mt-2 text-sm leading-5 text-slate-400">Premium risk signal</Text>
            </View>
          ))}
        </View>

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-white">Recent Scans</Text>
          <Pressable onPress={() => navigation.navigate("PastScans")}>
            <Text className="font-bold text-cyan-200">See all</Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-3">
          {recent.length === 0 ? (
            <EmptyState
              title="No scans yet"
              message="Run your first purchase scan to see risk scores, red flags, fair value, and negotiation scripts here."
              actionLabel="Analyze a Purchase"
              onAction={() => navigation.navigate("NewScan")}
            />
          ) : (
            recent.map((scan) => (
              <PastScanCard
                key={scan.id}
                scan={scan}
                onPress={() => {
                  setCurrentScan(scan);
                  navigation.navigate("RiskReport", { scanId: scan.id, scan });
                }}
                onDelete={() => void deleteScan(scan.id)}
              />
            ))
          )}
        </View>

        <Text className="mt-8 text-center text-xs leading-5 text-slate-500">{GENERAL_DISCLAIMER}</Text>
      </View>
    </ScreenContainer>
  );
};
