import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BottomNav } from "@/components/BottomNav";
import { EmptyState } from "@/components/EmptyState";
import { GlassCard } from "@/components/GlassCard";
import { HeaderBar } from "@/components/HeaderBar";
import { PastScanCard } from "@/components/PastScanCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useScanStore } from "@/hooks/useScanStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PastScans">;

export const PastScansScreen = ({ navigation }: Props) => {
  const { scans, loadScans, deleteScan, setCurrentScan, isLoading, error } = useScanStore();

  useEffect(() => {
    void loadScans();
  }, [loadScans]);

  const confirmDelete = (id: string) => {
    Alert.alert("Delete scan?", "This removes the local saved report.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void deleteScan(id) }
    ]);
  };

  return (
    <ScreenContainer>
      <View>
        <HeaderBar
          showBack
          onBack={() => navigation.goBack()}
          eyebrow="History"
          title="Past scans"
          rightLabel="New"
          onRightPress={() => navigation.navigate("NewScan")}
        />

        <GlassCard glow="violet">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-4xl font-black text-white">{scans.length}</Text>
              <Text className="mt-1 text-sm font-semibold text-slate-300">Saved reports</Text>
            </View>
            <View className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
              <Text className="font-bold text-cyan-100">Local-first</Text>
            </View>
          </View>
          <Text className="mt-4 leading-6 text-slate-400">
            Saved reports stay local now and are Supabase-ready for authenticated sync later.
          </Text>
        </GlassCard>

        <View className="mt-8 gap-3">
          {isLoading ? (
            <GlassCard>
              <Text className="text-lg font-bold text-white">Loading reports...</Text>
              <Text className="mt-2 text-slate-400">RiskRadar is reading local saved scans.</Text>
            </GlassCard>
          ) : error ? (
            <EmptyState title="Could not load reports" message={error} actionLabel="Try Again" onAction={() => void loadScans()} />
          ) : scans.length === 0 ? (
            <EmptyState
              title="No saved reports"
              message="Completed scans will appear here with risk score, verdict, asking price, and thumbnail."
              actionLabel="Start a Scan"
              onAction={() => navigation.navigate("NewScan")}
            />
          ) : (
            scans.map((scan) => (
              <PastScanCard
                key={scan.id}
                scan={scan}
                onPress={() => {
                  setCurrentScan(scan);
                  navigation.navigate("RiskReport", { scanId: scan.id, scan });
                }}
                onDelete={() => confirmDelete(scan.id)}
              />
            ))
          )}
        </View>
        <BottomNav active="saved" />
      </View>
    </ScreenContainer>
  );
};
