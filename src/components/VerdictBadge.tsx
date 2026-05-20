import { Text, View } from "react-native";

import type { Verdict } from "@/schemas/aiReportSchema";
import { verdictColor, verdictLabel } from "@/utils/risk";

type Props = {
  verdict: Verdict;
};

export const VerdictBadge = ({ verdict }: Props) => (
  <View
    className="self-start rounded-full border px-4 py-2"
    style={{ borderColor: verdictColor(verdict), backgroundColor: `${verdictColor(verdict)}22` }}
  >
    <Text className="text-sm font-bold uppercase tracking-wide" style={{ color: verdictColor(verdict) }}>
      {verdictLabel(verdict)}
    </Text>
  </View>
);
