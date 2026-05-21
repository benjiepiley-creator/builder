import { Image, Pressable, Text, View, type GestureResponderEvent } from "react-native";

import type { SavedScan } from "@/types/scan";
import { formatCurrency, formatDate } from "@/utils/format";
import { verdictColor, verdictLabel } from "@/utils/risk";

type Props = {
  scan: SavedScan;
  onPress: () => void;
  onDelete: () => void;
};

export const PastScanCard = ({ scan, onPress, onDelete }: Props) => (
  <Pressable onPress={onPress} className="rounded-[28px] border border-white/10 bg-black/45 p-4">
    <View className="flex-row gap-4">
      {scan.thumbnailUri ? (
        <Image source={{ uri: scan.thumbnailUri }} className="h-20 w-20 rounded-2xl bg-slate-800" />
      ) : (
        <View className="h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
          <Text className="text-2xl font-black text-cyan-200">{scan.report.overallRiskScore}</Text>
        </View>
      )}
      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-3">
          <Text numberOfLines={1} className="flex-1 text-lg font-bold text-white">
            {scan.itemTitle || "Untitled scan"}
          </Text>
          <Pressable
            onPress={(event: GestureResponderEvent) => {
              event.stopPropagation();
              onDelete();
            }}
            className="rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1"
          >
            <Text className="text-xs font-bold text-red-200">Delete</Text>
          </Pressable>
        </View>
        <Text className="mt-1 text-sm text-slate-400">{scan.category}</Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="font-semibold text-slate-300">{formatCurrency(scan.askingPrice)}</Text>
          <Text className="font-bold" style={{ color: verdictColor(scan.report.verdict) }}>
            {verdictLabel(scan.report.verdict)}
          </Text>
        </View>
        <Text className="mt-2 text-xs text-slate-500">{formatDate(scan.createdAt)}</Text>
      </View>
    </View>
  </Pressable>
);
