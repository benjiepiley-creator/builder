import { Text, View } from "react-native";

import type { AiReport } from "@/schemas/aiReportSchema";

type Props = {
  flag: AiReport["redFlags"][number];
};

const severityStyle = {
  low: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  medium: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  high: "border-red-500/30 bg-red-500/10 text-red-200"
};

export const RedFlagCard = ({ flag }: Props) => (
  <View className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
    <View className="mb-2 flex-row items-center justify-between gap-3">
      <Text className="flex-1 text-base font-bold text-white">{flag.title}</Text>
      <Text className={`overflow-hidden rounded-full border px-2 py-1 text-xs font-bold uppercase ${severityStyle[flag.severity]}`}>
        {flag.severity}
      </Text>
    </View>
    <Text className="leading-6 text-slate-300">{flag.explanation}</Text>
  </View>
);
