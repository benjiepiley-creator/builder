import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EmptyState } from "@/components/EmptyState";
import { PastScanCard } from "@/components/PastScanCard";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useScanStore } from "@/hooks/useScanStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PastScans">;

export const PastScansScreen = ({ navigation }: Props) => {
  const { scans, loadScans, deleteScan, setCurrentScan } = useScanStore();

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
      <View className="pt-4">
        <Text className="text-sm font-bold uppercase tracking-[4px] text-cyan-300">History</Text>
        <Text className="mt-2 text-4xl font-black text-white">Past scans</Text>
        <Text className="mt-3 leading-6 text-slate-400">Saved reports stay local now and are Supabase-ready for authenticated sync later.</Text>

        <View className="mt-8 gap-3">
          {scans.length === 0 ? (
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
      </View>
    </ScreenContainer>
  );
};
