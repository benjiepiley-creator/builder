import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BottomNav } from "@/components/BottomNav";
import { EmptyState } from "@/components/EmptyState";
import { GlassCard } from "@/components/GlassCard";
import { HeaderBar } from "@/components/HeaderBar";
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
  const { scans, loadScans, deleteScan, setCurrentScan, isLoading, error } = useScanStore();

  useEffect(() => {
    void loadScans();
  }, [loadScans]);

  const recent = scans.slice(0, 3);

  return (
    <ScreenContainer>
      <View>
        <HeaderBar
          eyebrow={APP_NAME}
          title="Scan before you buy."
          rightLabel="Profile"
          onRightPress={() => navigation.navigate("Settings")}
        />

        <GlassCard glow="violet" className="mt-2">
          <View className="mb-5 h-16 w-16 items-center justify-center rounded-3xl border border-cyan-300/30 bg-cyan-300/15">
            <Text className="text-2xl font-black text-cyan-100">RR</Text>
          </View>
          <Text className="text-3xl font-black text-white">AI Purchase Risk Scanner</Text>
          <Text className="mt-3 leading-6 text-slate-300">
            Analyze screenshots, item photos, listings, seller messages, price, and location before you send money or meet.
          </Text>
          <View className="mt-6 gap-3">
            <PrimaryButton title="Analyze a Purchase" onPress={() => navigation.navigate("NewScan")} />
            <PrimaryButton title="View Past Scans" variant="secondary" onPress={() => navigation.navigate("PastScans")} />
          </View>
        </GlassCard>

        <View className="mt-6 flex-row flex-wrap gap-3">
          {featureCards.map((card, index) => (
            <GlassCard key={card} className="w-[47%]" glow={index % 2 === 0 ? "cyan" : "violet"}>
              <Text className="text-base font-bold text-white">{card}</Text>
              <Text className="mt-2 text-sm leading-5 text-slate-400">Included in each scan</Text>
            </GlassCard>
          ))}
        </View>

        <View className="mt-8 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-white">Recent Scans</Text>
          <Pressable onPress={() => navigation.navigate("PastScans")}>
            <Text className="font-bold text-cyan-200">See all</Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-3">
          {isLoading ? (
            <GlassCard>
              <Text className="text-lg font-bold text-white">Loading saved scans...</Text>
              <Text className="mt-2 text-slate-400">Checking your local RiskRadar history.</Text>
            </GlassCard>
          ) : error ? (
            <EmptyState title="Could not load scans" message={error} actionLabel="Try Again" onAction={() => void loadScans()} />
          ) : recent.length === 0 ? (
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
        <BottomNav active="home" />
      </View>
    </ScreenContainer>
  );
};
