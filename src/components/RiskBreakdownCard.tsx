import { Text, View } from "react-native";

import type { AiReport } from "@/schemas/aiReportSchema";
import { riskScoreColor } from "@/utils/risk";

type Props = {
  breakdown: AiReport["riskBreakdown"];
};

const labels: Record<keyof AiReport["riskBreakdown"], string> = {
  scamRisk: "Scam Risk",
  overpayRisk: "Overpay Risk",
  hiddenDamageRisk: "Hidden Damage",
  sellerTrustRisk: "Seller Trust",
  resaleRisk: "Resale Risk",
  urgencyRisk: "Urgency Risk"
};

export const RiskBreakdownCard = ({ breakdown }: Props) => (
  <View className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
    <Text className="mb-4 text-xl font-bold text-white">Risk Breakdown</Text>
    {(Object.keys(labels) as (keyof AiReport["riskBreakdown"])[]).map((key, index, items) => {
      const value = breakdown[key];
      return (
        <View key={key} className={index === items.length - 1 ? "" : "mb-4"}>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-semibold text-slate-200">{labels[key]}</Text>
            <Text className="font-bold text-white">{value}/100</Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-slate-800">
            <View className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: riskScoreColor(value) }} />
          </View>
        </View>
      );
    })}
  </View>
);
